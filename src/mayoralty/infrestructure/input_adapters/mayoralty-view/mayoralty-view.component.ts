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
import {IMayoraltyService} from "../../input_ports/IMayoraltyService";
import {Mayoralty} from "../../../domain/object/mayoralty";
import {MayoraltyRequest} from "../../../domain/api/mayoraltyRequest";

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
  templateUrl: './mayoralty-view.component.html',
  styleUrl: './mayoralty-view.component.scss',
})
export class MayoraltyViewComponent implements OnInit {

  private readonly mayoraltyService = inject(IMayoraltyService);

  mayoralty: Mayoralty = {};
  mayoraltyList: Mayoralty[] = [];
  loading = false;
  @ViewChild('dt') public dt: any;

  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'mayoralty';
  public userData: User;

  ngOnInit(): void {
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

  createMayoralty() {
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nueva Alcaldia';
    this.mayoralty = {};
    this.visible = true;
  }

  showDialog(mayoralty: Mayoralty) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Alcaldia';
    this.mayoralty = { ...mayoralty };
    this.visible = true;
  }

    public verifyMayoraltyExists(): boolean {
    return this.mayoraltyList.some(activity =>
      activity.name?.toLowerCase().trim() === this.mayoralty.name?.toLowerCase().trim() &&
      activity.idMayoralty !== this.mayoralty.idMayoralty
    );
  }

  saveMayoralty() {
    const mayoraltyExists = this.verifyMayoraltyExists();
    if (mayoraltyExists){
      this.visible = false;
      Swal.fire({
        title: `La alcaldia "${this.mayoralty.name}" ya existe`,
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
    if (this.mayoralty) {
      const requestData: MayoraltyRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idMayoralty: this.mayoralty.idMayoralty }
            : {}),
          name: this.mayoralty.name,
          active: this.mayoralty.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.mayoraltyService.create(requestData)
          : this.mayoraltyService.update(requestData);

      action.subscribe({
        next: () => {
          this.visible = false;
          this.loadMayoralties();
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
