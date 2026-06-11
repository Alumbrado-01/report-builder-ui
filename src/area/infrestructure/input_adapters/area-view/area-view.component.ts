import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Area } from '../../../domain/object/area';
import { IAreaService } from '../../input_ports/IAreaService';
import { AreaRequest } from '../../../domain/api/areaRequest';
import Swal from "sweetalert2";
import {User} from "../../../../user/domain/object/user";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";

@Component({
  selector: 'app-mayoralty-view',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    LogViewComponent,
  ],
  templateUrl: './area-view.component.html',
  styleUrl: './area-view.component.scss',
})
export class AreaViewComponent implements OnInit {
  private readonly svc = inject(IAreaService);

  areas: Area[] = [];
  filteredAreas: Area[] = [];
  loading = false;
  @ViewChild('dt') public dt: any;

  // Propiedades para el diálogo
  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'area';
  public userData: User;

  // Propiedad para edición/creación
  editingArea: Area = {
    idArea: 0,
    name: '',
    active: true,
  };

  ngOnInit(): void {
    this.load();
    this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage() {
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if(jsonParsed){
      this.userData = jsonParsed.user;
    }
  }

  private load(): void {
    this.loading = true;
    this.svc.findAll().subscribe({
      next: (data) => {
        this.areas = data;
        this.filteredAreas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando áreas:', err);
        this.loading = false;
      },
    });
  }


  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Funciones de diálogo y edición/creación
  createArea() {
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nuevo Área';
    this.editingArea = {
      idArea: 0,
      name: '',
      active: true,
    };
    this.visible = true;
  }

  showDialog(area: Area) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Área';
    this.editingArea = { ...area };
    this.visible = true;
  }

    public verifyAreaExists(): boolean {
    return this.areas.some(area =>
      area.name?.toLowerCase().trim() === this.editingArea.name?.toLowerCase().trim() &&
      area.idArea !== this.editingArea.idArea
    );
  }
  saveArea() {
    const areaExists = this.verifyAreaExists();
    if (areaExists){
      this.visible = false;
      Swal.fire({
        title: `El área "${this.editingArea.name}" ya existe`,
        icon: "warning",
        draggable: true
      });
      return;
    }
    if (this.dialogMode === 'create') {
       Swal.fire({
         title: "Registro agregado",
         icon: "success",
         draggable: true
       });
     } else {
       Swal.fire({
         title: "Registro actualizado",
         icon: "success",
         draggable: true
       });
     }
    if (this.editingArea) {
      const requestData: AreaRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idArea: this.editingArea.idArea }
            : {}),
          name: this.editingArea.name,
          active: this.editingArea.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.svc.create(requestData)
          : this.svc.update(requestData);

      action.subscribe({
        next: () => {
          this.visible = false;
          this.load(); // Recargar la lista
        },
        error: (err) => {
          console.error(
            `Error ${
              this.dialogMode === 'create' ? 'creando' : 'actualizando'
            } área:`,
            err
          );
        },
      });
    }
  }

  public viewLogs(id: number): void {
    this.entity = id;
    this.showLogs = true;
  }

  handleClose(event: any) {
    this.showLogs = false;
  }
}
