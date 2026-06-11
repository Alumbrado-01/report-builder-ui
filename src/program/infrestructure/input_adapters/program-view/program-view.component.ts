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
import {IMayoraltyService} from "../../../../mayoralty/infrestructure/input_ports/IMayoraltyService";
import {Mayoralty} from "../../../../mayoralty/domain/object/mayoralty";
import {IProgramService} from "../../input_ports/IProgramService";
import {Program} from "../../../domain/object/program";
import {ProgramRequest} from "../../../domain/api/programRequest";

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
  templateUrl: './program-view.component.html',
  styleUrl: './program-view.component.scss',
})
export class ProgramViewComponent implements OnInit {

  private readonly programService = inject(IProgramService);
  private readonly mayoraltyService = inject(IMayoraltyService);

  program: Program = {};
  programList: Program[] = [];
  mayoraltyList: Mayoralty[] = [];
  loading = false;
  @ViewChild('dt') public dt: any;

  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'program';
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
    this.programService.findAll().subscribe({
      next: (data) => {
        this.programList = data;
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

  createProgram() {
    this.program = {};
    this.dialogMode = 'create';
    this.dialogTitle = 'Crear Nuevo Programa';
    this.visible = true;
  }

  showDialog(program: Program) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Programa';
    this.program = { ...program };
    this.visible = true;
  }

    public verifyprogramExists(): boolean {
    return this.programList.some(program =>
      program.name?.toLowerCase().trim() === this.program.name?.toLowerCase().trim() &&
      program.idProgram !== this.program.idProgram
    );
  }

  saveProgram() {
    const programExists = this.verifyprogramExists();
    if (programExists){
      this.visible = false;
      Swal.fire({
        title: `El programa "${this.program.name}" ya existe`,
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
    if (this.program) {
      const requestData: ProgramRequest = {
        modelRequest: {
          ...(this.dialogMode === 'edit'
            ? { idProgram: this.program.idProgram }
            : {}),
          name: this.program.name,
          active: this.program.active,
        },
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.programService.create(requestData)
          : this.programService.update(requestData);

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
