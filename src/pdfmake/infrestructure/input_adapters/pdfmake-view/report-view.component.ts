import {Component, inject, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { User } from '../../../../user/domain/object/user';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { Table } from 'primeng/table';
import {UserService} from "../../../../user/application/user.service";
import {ReportRequest} from "../../../domain/api/reportRequest";
import {ConfirmedEntry} from "../../../../entry/domain/object/confirmedEntry";
import Swal from "sweetalert2";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";
import {NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {ApplicantService} from "../../../../applicant/application/applicant.service";
import {ZoneService} from "../../../../zone/application/zone.service";
import {RoadService} from "../../../../road/application/road.service";
import {ProgramService} from "../../../../program/application/program.service";
import {ActivityService} from "../../../../activity/application/activity.service";
import {Zone} from "../../../../zone/domain/object/zone";
import {Road} from "../../../../road/domain/object/road";
import {Program} from "../../../../program/domain/object/program";
import {Activity} from "../../../../activity/domain/object/activity";
import {MayoraltyService} from "../../../../mayoralty/application/mayoralty.service";
import {Mayoralty} from "../../../../mayoralty/domain/object/mayoralty";
import {Maintenance} from "../../../../maintenance/domain/object/maintenance";
import {MaintenanceService} from "../../../../maintenance/application/maintenance.service";

@Component({
  selector: 'app-pdfmake-view',
  standalone: true,
  imports: [FormsModule, DropdownModule, TableModule, CalendarModule, LogViewComponent, NgIf, InputTextModule],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.scss',
})
export class ReportViewComponent implements OnInit {

  private readonly applicantService = inject(ApplicantService);
  programs: Program[] = [];
  zones: Zone[] = [];
  roads: Road[] = [];
  activities: Activity[] = [];
  mayoraltyList: Mayoralty[] = [];
  reportRequest: ReportRequest = {};
  movements: Maintenance[] = [];
  @ViewChild('dt', { static: false }) dt?: Table;
  public loading: boolean = false;
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'management';
  public userData: User;

  constructor(
    private readonly zoneService: ZoneService,
    private readonly roadService: RoadService,
    private readonly userService: UserService,
    private readonly programService: ProgramService,
    private readonly activityService: ActivityService,
    private readonly mayoraltyService: MayoraltyService,
    private readonly maintenanceService: MaintenanceService
  ) {}

  ngOnInit(): void {

    this.getUserBySession();

    this.zoneService.findAll().subscribe({
      next: (zones: Zone[]) => {
        this.zones = zones.find(a => a.active) ? zones.filter(a => a.active) : zones;
      },
      error: (err) => {
        console.error('Error cargando zonas:', err);
      },
    });

    this.roadService.findAll().subscribe({
      next: (roads: Road[]) => {
        this.roads = roads.find(u => u.active) ? roads.filter(u => u.active) : roads;
      },
      error: (err) => {
        console.error('Error cargando vialidades:', err);
      },
    });

    this.programService.findAll().subscribe({
      next: (programs: Program[]) => {
        this.programs = programs.find(u => u.active) ? programs.filter(u => u.active) : programs;
      },
      error: (err) => {
        console.error('Error cargando programas:', err);
      },
    });

    this.activityService.findAll().subscribe({
      next: (activities: Activity[]) => {
        this.activities = activities.find(u => u.active) ? activities.filter(u => u.active) : activities;
      },
      error: (err) => {
        console.error('Error cargando actividades:', err);
      },
    });

    this.mayoraltyService.findAll().subscribe({
      next: (mayoraltyList: Mayoralty[]) => {
        this.mayoraltyList = mayoraltyList.find(u => u.active) ? mayoraltyList.filter(u => u.active) : mayoraltyList;
      },
      error: (err) => {
        console.error('Error cargando alcaldias:', err);
      },
    });

  }

  private getUserBySession(): void {
    this.loading = true;
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    this.userService.findById(jsonParsed.user.idUser).subscribe({
      next: (data) => {
        if(data) {
          this.userData = data;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando solicitantes', err);
        this.loading = false;
      },
    });
  }

  public getReport() {
    if(this.reportRequest.startDate != null && this.reportRequest.endDate != null){
      this.loading = true;
      this.maintenanceService.findReport(this.reportRequest).subscribe({
        next: (report: ConfirmedEntry[]) => {
          this.movements = report;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando registros:', err);
          this.loading = false;
        },
      });
    } else {
      Swal.fire('Error', 'Por favor selecciona una fecha de inicio y fin', 'error');
    }
  }

  exportExcel() {
    if (this.movements && this.movements.length > 0) {
      const data = (this.dt?.filteredValue ??
        this.dt?.value ??
        this.movements ??
        []) as any[];

      if (!data.length) {
        Swal.fire('Error', 'No hay datos para exportar', 'error');
        return;
      }

      const headers = [
        'FECHA',
        'VIALIDAD',
        'ACTIVIDAD_REALIZADA',
        'COORDENADA_X',
        'COORDENADA_Y',
        'ALCALDÍA',
        'LUMINARIOS_VIALES',
        'LUMINARIOS_PEATONALES',
        'LUMINARIOS_EN_SERVICIO',
        'ZONA_O_CUADRANTE',
        'TIPO',
        'PROGRAMA'
      ];

      const dataReport = data.map((m) => ({
          FECHA: m.date,
          VIALIDAD: m.road?.name ?? '',
          ACTIVIDAD_REALIZADA: m.activity?.name ?? '',
          COORDENADA_X: m.coordinateX ?? '',
          COORDENADA_Y: m.coordinateY ?? '',
          ALCALDIA: m.mayoralty.name ?? '',
          LUMINARIOS_VIALES: m.streetlights ?? '',
          LUMINARIOS_PEATONALES: m.pedestrianLighting ?? '',
          LUMINARIOS_EN_SERVICIO: m.luminariesInService ?? '',
          ZONA_O_CUADRANTE: m.zone?.name ?? '',
          TIPO: m.type?.name ?? '',
          PROGRAMA: m.program?.name ?? '',
        }));

      const ws = XLSX.utils.json_to_sheet(dataReport, { header: headers });

      const colWidths = headers.map((h) => ({
        wch: Math.max(
          h.length,
          ...dataReport.map((r) => String(r[h] ?? '').length)
        ) + 2,
      }));
      (ws as any)['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte Mantenimiento');

      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const fileName =
        'Reporte_Mantenimiento_DAP_' + new Date().toLocaleDateString() + '.xlsx';
      saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName);
    } else {
      Swal.fire('Error', 'No es posible generar un reporte sin registros', 'error');
    }
  }


  public viewLogs(id: number): void {
    this.entity = id;
    this.showLogs = true;
  }

  handleClose(event: any) {
    this.showLogs = false;
  }

  public applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}
