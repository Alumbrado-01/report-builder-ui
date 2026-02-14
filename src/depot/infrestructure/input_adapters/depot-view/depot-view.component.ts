import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { IDepotService } from '../../input_ports/IDepotService';
import { Depot } from '../../../domain/object/depot';
import { DepotRequest } from '../../../domain/api/depotRequest';
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


interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-depot-view',
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
  templateUrl: './depot-view.component.html',
  styleUrls: ['./depot-view.component.scss'],
})
export class DepotViewComponent implements OnInit {
  private readonly svc = inject(IDepotService);

  search(event: AutoCompleteCompleteEvent) {
    this.searchQuery = event.query.toLowerCase().trim();
    this.filterDepots();
  }

  // Propiedades para la tabla y búsqueda
  depots: Depot[] = [];
  filteredDepots: Depot[] = [];
  suggestions: Depot[] = [];
  searchQuery: string = '';
  loading = false;
  @ViewChild('dt') public dt: any;

  // Propiedades para el diálogo
  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'depot';
  public userData: User;

  // Propiedad para edición/creación
  editingDepot: Depot = {
    idDepot: 0,
    name: '',
    location: '',
    key: '',
    active: true,
  };

  ngOnInit(): void {
    this.getUserFromLocalStorage();
    this.load();
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
        this.depots = data;
        this.filteredDepots = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando depósitos:', err);
        this.loading = false;
      },
    });
  }

  filterDepots() {
    this.filteredDepots = this.searchQuery
      ? this.depots.filter(
          (depot) =>
            depot.name.toLowerCase().includes(this.searchQuery) ||
            depot.location.toLowerCase().includes(this.searchQuery)
        )
      : [];

    this.suggestions = this.filteredDepots;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Funciones de diálogo y edición/creación
  createDepot() {
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nuevo Almacén';
    this.editingDepot = {
      idDepot: 0,
      name: '',
      location: '',
      key: '',
      active: true,
    };
    this.visible = true;
  }

  showDialog(depot: Depot) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Almacén';
    this.editingDepot = { ...depot };
    this.visible = true;
  }


  public verifyDepotExists(): boolean {
    if(this.depots) {
      return this.depots.some(depot =>
        depot.key?.toLowerCase().trim() === this.editingDepot.key?.toLowerCase().trim() &&
        depot.idDepot !== this.editingDepot.idDepot
      );
    }
    return false;
  }

  saveDepot() {
    const depotExists = this.verifyDepotExists();
    if (depotExists) {
      this.visible = false;
      Swal.fire({
        title: `El almacén "${this.editingDepot.key}" ya existe`,
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
    if (this.editingDepot) {
      const requestData: DepotRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idDepot: this.editingDepot.idDepot }
            : {}),
          name: this.editingDepot.name,
          location: this.editingDepot.location,
          key: this.editingDepot.key,
          active: this.editingDepot.active,
        },
        user: this.userData
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
            } depósito:`,
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
