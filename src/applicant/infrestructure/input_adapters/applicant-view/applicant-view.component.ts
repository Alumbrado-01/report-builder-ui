import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Applicant } from '../../../domain/object/applicant';
import { IApplicantService } from '../../input_ports/IApplicantService';
import { ApplicantRequest } from '../../../domain/api/applicantRequest';
import Swal from "sweetalert2";
import {IAreaService} from "../../../../area/infrestructure/input_ports/IAreaService";
import {Area} from "../../../../area/domain/object/area";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";
import {User} from "../../../../user/domain/object/user";

@Component({
  selector: 'app-applicant-view',
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
    LogViewComponent
  ],
  templateUrl: './applicant-view.component.html',
  styleUrl: './applicant-view.component.scss',
})
export class ApplicantViewComponent implements OnInit {

  private readonly applicantService = inject(IApplicantService);
  private readonly areaService = inject(IAreaService);
  applicants: Applicant[] = [];
  applicant: Applicant = {};
  loading = false;
  @ViewChild('dt') public dt: any;
  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public areas: Area[] = [];
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'applicant';
  public userData: User;

  ngOnInit(): void {
    this.loadApplicants();
    this.loadAreas();
    this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage() {
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if(jsonParsed){
      this.userData = jsonParsed.user;
    }
  }

  private loadApplicants(): void {
    this.loading = true;
    this.applicantService.findAll().subscribe({
      next: (data) => {
        this.applicants = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando solicitantes:', err);
        this.loading = false;
      },
    });
  }

  private loadAreas(): void {
    this.loading = true;
    this.areaService.findAll().subscribe({
      next: (data) => {
        this.areas = data.find(area => area.active) ? data.filter(area => area.active) : data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando areas:', err);
        this.loading = false;
      },
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  createApplicant() {
    this.dialogMode = 'create';
    this.dialogTitle = 'Agregar Solicitante';
    this.applicant = {};
    this.visible = true;
  }

  showDialog(applicant: Applicant) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Solicitante';
    this.applicant = { ...applicant };
    this.visible = true;
  }

  saveApplicant() {
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
    if (this.applicant) {
      const requestData: ApplicantRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idApplicant: this.applicant.idApplicant }
            : {}),
          name: this.applicant.name,
          area: this.applicant.area,
          active: this.applicant.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.applicantService.create(requestData)
          : this.applicantService.update(requestData);

      action.subscribe({
        next: () => {
          this.visible = false;
          this.loadApplicants();
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
