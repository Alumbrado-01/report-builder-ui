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
import {IRoadService} from "../../input_ports/IRoadService";
import {Road} from "../../../domain/object/road";
import {RoadRequest} from "../../../domain/api/roadRequest";
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
  templateUrl: './road-view.component.html',
  styleUrl: './road-view.component.scss',
})
export class RoadViewComponent implements OnInit {

  private readonly roadService = inject(IRoadService);
  private readonly mayoraltyService = inject(IMayoraltyService);

  road: Road = {};
  roadList: Road[] = [];
  mayoraltyList: Mayoralty[] = [];
  loading = false;
  @ViewChild('dt') public dt: any;

  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'road';
  public userData: User;
  public roadOptions: { label: string; value: boolean }[] = [];

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
      if(this.userData?.profile.profile === 'Operador'){
        this.roadOptions = [
          { label: 'Red Vial Secundaria', value: false }
        ];
      } else {
        this.roadOptions = [
          { label: 'Red Vial Primaria', value: true },
          { label: 'Red Vial Secundaria', value: false }
        ];
      }
    }
  }

  private load(): void {
    this.loading = true;
    this.roadService.findAll().subscribe({
      next: (data) => {
        this.roadList = data;
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

  createRoad() {
    this.road={};
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nueva Vialidad';
    this.visible = true;
  }

  showDialog(road: Road) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Vialidad';
    this.road = { ...road };
    this.visible = true;
  }

    public verifyRoadExists(): boolean {
    return this.roadList.some(road =>
      road.name?.toLowerCase().trim() === this.road.name?.toLowerCase().trim() &&
      road.idRoad !== this.road.idRoad
    );
  }

  saveRoad() {
    const roadExists = this.verifyRoadExists();
    if (roadExists){
      this.visible = false;
      Swal.fire({
        title: `La vialidad "${this.road.name}" ya existe`,
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
    if (this.road) {
      const requestData: RoadRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idRoad: this.road.idRoad }
            : {}),
          name: this.road.name,
          mayoralty: this.road.mayoralty,
          rvpRvs: this.road.rvpRvs,
          active: this.road.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.roadService.create(requestData)
          : this.roadService.update(requestData);

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
