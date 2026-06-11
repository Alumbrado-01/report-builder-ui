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
import {ActivityRequest} from "../../../domain/api/activityRequest";
import {IActivityService} from "../../input_ports/IActivityService";
import {Activity} from "../../../domain/object/activity";

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
  templateUrl: './activity-view.component.html',
  styleUrl: './activity-view.component.scss',
})
export class ActivityViewComponent implements OnInit {

  private readonly activityService = inject(IActivityService);

  activity: Activity = {};
  activityList: Activity[] = [];
  loading = false;
  @ViewChild('dt') public dt: any;

  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'activity';
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
    this.activityService.findAll().subscribe({
      next: (data) => {
        this.activityList = data;
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
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nueva Vialidad';
    this.visible = true;
  }

  showDialog(activity: Activity) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Actividad';
    this.activity = { ...activity };
    this.visible = true;
  }

    public verifyActivityExists(): boolean {
    return this.activityList.some(activity =>
      activity.name?.toLowerCase().trim() === this.activity.name?.toLowerCase().trim() &&
      activity.idActivity !== this.activity.idActivity
    );
  }

  saveRoad() {
    const roadExists = this.verifyActivityExists();
    if (roadExists){
      this.visible = false;
      Swal.fire({
        title: `La actividad "${this.activity.name}" ya existe`,
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
    if (this.activity) {
      const requestData: ActivityRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idActivity: this.activity.idActivity }
            : {}),
          name: this.activity.name,
          active: this.activity.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.activityService.create(requestData)
          : this.activityService.update(requestData);

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
