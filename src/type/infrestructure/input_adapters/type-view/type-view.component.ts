import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import Swal from "sweetalert2";
import {User} from "../../../../user/domain/object/user";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";
import {ITypeService} from "../../input_ports/ITypeService";
import {Type} from "../../../domain/object/type";
import {TypeRequest} from "../../../domain/api/typeRequest";
import {IMayoraltyService} from "../../../../mayoralty/infrestructure/input_ports/IMayoraltyService";
import {Mayoralty} from "../../../../mayoralty/domain/object/mayoralty";

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
  templateUrl: './type-view.component.html',
  styleUrl: './type-view.component.scss',
})
export class TypeViewComponent implements OnInit {

  private readonly typeService = inject(ITypeService);
  private readonly mayoraltyService = inject(IMayoraltyService);

  type: Type = {};
  typeList: Type[] = [];
  mayoraltyList: Mayoralty[] = [];
  loading = false;
  @ViewChild('dt') public dt: any;

  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'type';
  public userData: User;

  ngOnInit(): void {
    this.load();
    this.loadMayoralties();
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
    this.typeService.findAll().subscribe({
      next: (data) => {
        this.typeList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando vialidades:', err);
        this.loading = false;
      },
    });
  }

  private loadMayoralties(): void {
    this.loading = true;
    this.mayoraltyService.findAll().subscribe({
      next: (data) => {
        this.mayoraltyList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando vialidades:', err);
        this.loading = false;
      },
    });
  }


  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  createType() {
    this.type= {};
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nuevo Tipo de Atención';
    this.visible = true;
  }

  showDialog(type: Type) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Vialidad';
    this.type = { ...type };
    this.visible = true;
  }

    public verifytypeExists(): boolean {
    return this.typeList.some(type =>
      type.name?.toLowerCase().trim() === this.type.name?.toLowerCase().trim() &&
      type.idRVP !== this.type.idRVP
    );
  }

  saveType() {
    const typeExists = this.verifytypeExists();
    if (typeExists){
      this.visible = false;
      Swal.fire({
        title: `La vialidad "${this.type.name}" ya existe`,
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
    if (this.type) {
      const requestData: TypeRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idRVP: this.type.idRVP }
            : {}),
          name: this.type.name,
          active: this.type.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.typeService.create(requestData)
          : this.typeService.update(requestData);

      action.subscribe({
        next: () => {
          this.visible = false;
          this.load();
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
