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
import {ZoneRequest} from "../../../domain/api/zoneRequest";
import {IZoneService} from "../../input_ports/IZoneService";
import {Zone} from "../../../domain/object/zone";

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
  templateUrl: './zone-view.component.html',
  styleUrl: './zone-view.component.scss',
})
export class ZoneViewComponent implements OnInit {

  private readonly zoneService = inject(IZoneService);

  zone: Zone = {};
  zoneList: Zone[] = [];
  loading = false;
  @ViewChild('dt') public dt: any;

  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'zone';
  public userData: User;

  ngOnInit(): void {
    this.loadActivities();
    this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage() {
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if(jsonParsed){
      this.userData = jsonParsed.user;
    }
  }

  private loadActivities(): void {
    this.loading = true;
    this.zoneService.findAll().subscribe({
      next: (data) => {
        this.zoneList = data;
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

  createRoad() {
    this.zone={};
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nueva Zona';
    this.visible = true;
  }

  showDialog(zone: Zone) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Actividad';
    this.zone = { ...zone };
    this.visible = true;
  }

    public verifyZoneExists(): boolean {
    return this.zoneList.some(zone =>
      zone.name?.toLowerCase().trim() === this.zone.name?.toLowerCase().trim() &&
      zone.idZone !== this.zone.idZone
    );
  }

  saveRoad() {
    const roadExists = this.verifyZoneExists();
    if (roadExists){
      this.visible = false;
      Swal.fire({
        title: `La actividad "${this.zone.name}" ya existe`,
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
    if (this.zone) {
      const requestData: ZoneRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idZone: this.zone.idZone }
            : {}),
          name: this.zone.name,
          active: this.zone.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.zoneService.create(requestData)
          : this.zoneService.update(requestData);

      action.subscribe({
        next: () => {
          this.visible = false;
          this.loadActivities();
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
