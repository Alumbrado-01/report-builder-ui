import {Component, inject, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DepotService } from '../../../../depot/application/depot.service';
import { Depot } from '../../../../depot/domain/object/depot';
import { Area } from '../../../../area/domain/object/area';
import { AreaService } from '../../../../area/application/area.service';
import { User } from '../../../../user/domain/object/user';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { Table } from 'primeng/table';
import {UserService} from "../../../../user/application/user.service";
import {ReportRequest} from "../../../domain/api/reportRequest";
import {ConfirmedEntry} from "../../../../entry/domain/object/confirmedEntry";
import {EntryService} from "../../../../entry/application/entry.service";
import Swal from "sweetalert2";
import writtenNumber from "written-number";
import {PdfService} from "../../../../entry/application/pdf.service";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";
import {NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {ApplicantService} from "../../../../applicant/application/applicant.service";

@Component({
  selector: 'app-pdfmake-view',
  standalone: true,
  imports: [FormsModule, DropdownModule, TableModule, CalendarModule, LogViewComponent, NgIf, InputTextModule],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.scss',
})
export class ReportViewComponent implements OnInit {

  private readonly applicantService = inject(ApplicantService);
  depots: Depot[] = [];
  areas: Area[] = [];
  users: User[] = [];
  reportRequest: ReportRequest = {};
  movements: ConfirmedEntry[] = [];
  @ViewChild('dt', { static: false }) dt?: Table;
  public loading: boolean = false;
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'management';
  public userData: User;

  constructor(
    private readonly depotService: DepotService,
    private readonly areaService: AreaService,
    private readonly userService: UserService,
    private readonly entryService: EntryService,
    public pdfService: PdfService
  ) {}

  ngOnInit(): void {

    this.getUserBySession();

    this.areaService.findAll().subscribe({
      next: (areas: Area[]) => {
        this.areas = areas.find(a => a.active) ? areas.filter(a => a.active) : areas;
      },
      error: (err) => {
        console.error('Error cargando areas:', err);
      },
    });

    this.userService.findAll().subscribe({
      next: (users: User[]) => {
        this.users = users.find(u => u.active) ? users.filter(u => u.active) : users;
      },
      error: (err) => {
        console.error('Error cargando users:', err);
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
          this.depots = data.depotList ? data.depotList : [];
          if(this.depots && this.depots.length > 0){
            this.depots = this.depots.filter(d => d.active);
          }
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
      if(this.reportRequest.depot == null && this.userData.profile.profile === 'Almacenista'){
        Swal.fire(
          'Error',
          'Selecciona un almacén para generar el reporte',
          'error'
        )
        return;
      }
      this.loading = true;
      this.entryService.findReport(this.reportRequest).subscribe({
        next: (report: ConfirmedEntry[]) => {
          this.movements = report;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando users:', err);
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
        'FOLIO',
        'FECHA',
        'ALMACEN',
        'DESPACHADOR',
        'RECIBE',
        'TIPO',
        'DOCUMENTO_SOLICITA',
        'MATERIAL',
        'CANTIDAD',
        'UNIDAD',
        'ESTATUS',
      ];

      const dataReport = data.flatMap((m) =>
        m.materialList.map((mat: any) => ({
          FOLIO: m.folio,
          FECHA: m.date,
          ALMACEN: m.depot?.name ?? '',
          DESPACHADOR: m.userDispatcher?.name ?? '',
          RECIBE: m.userReceiver?.name ?? '',
          TIPO: m.io ? 'Entrada' : 'Salida',
          DOCUMENTO_SOLICITA: m.applicantDocument ?? '',
          MATERIAL: mat.material?.description ?? '',
          CANTIDAD: mat.quantity ?? '',
          UNIDAD: mat.material?.unit?.name ?? '',
          ESTATUS: mat.status?.status ?? '',
        }))
      );

      const ws = XLSX.utils.json_to_sheet(dataReport, { header: headers });

      const colWidths = headers.map((h) => ({
        wch: Math.max(
          h.length,
          ...dataReport.map((r) => String(r[h] ?? '').length)
        ) + 2,
      }));
      (ws as any)['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte Almacenes');

      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const fileName =
        'Reporte_Almacenes_DAP_' + new Date().toLocaleDateString() + '.xlsx';
      saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName);
    } else {
      Swal.fire('Error', 'No es posible generar un reporte sin registros', 'error');
    }
  }


public getPDF(confirmedEntry: ConfirmedEntry){
    if(confirmedEntry && confirmedEntry.io){
        this.generatePDFEntry(confirmedEntry);
    } else if(!confirmedEntry.io){
        this.generatePDFOutput(confirmedEntry);
    } else {
        Swal.fire('Error', 'No es posible generar el PDF', 'error');
    }
}

  async generatePDFEntry(confirmedEntry: ConfirmedEntry): Promise<void> {
    const datos = [
      { text: confirmedEntry.depot.name, x: 162, y: 142 },
      { text: confirmedEntry.depot.key, x: 710, y: 111 },
      { text: this.getCurrentDay(), x: 660, y: 152 },
      { text: this.getCurrentMonth(), x: 700, y: 152 },
      { text: this.getCurrentYear(), x: 735, y: 152 },
      { text: confirmedEntry.folio, x: 654, y: 184 },
      { text: confirmedEntry.userReceiver.area.name, x: 70, y: 182 },
      { text: confirmedEntry.userDispatcher.name, x: 610, y: 485, size: 7 },
      { text: confirmedEntry.userReceiver.name, x: 95, y: 485, size: 7 },
    ];

    let startY = 236;
    for (let i = 0; i < confirmedEntry.materialList.length; i++) {
      datos.push({
        text: confirmedEntry.materialList[i].material.description,
        x: 264,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: confirmedEntry.materialList[i].material.unit.name,
        x: 487,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: String(confirmedEntry.materialList[i].status.status),
        x: 523,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: String(confirmedEntry.materialList[i].quantity),
        x: 582,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: writtenNumber(confirmedEntry.materialList[i].quantity, { lang: 'es' }),
        x: 610,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
    }
    const pdfBytes = await this.pdfService.fillPdfFromTemplate('assets/formatoEntrada.pdf', datos);
    this.pdfService.openPdfInBrowser(pdfBytes);
  }

  async generatePDFOutput(confirmedEntry: ConfirmedEntry): Promise<void> {
    const datos = [
      { text: confirmedEntry.depot.name, x: 155, y: 142 },
      { text: confirmedEntry.depot.key, x: 670, y: 142 },
      { text: confirmedEntry.applicantDocument? confirmedEntry.applicantDocument: "" , x: 588, y: 177, size: 9 },
      { text: this.getCurrentDay(), x: 545, y: 110 },
      { text: this.getCurrentMonth(), x: 582, y: 110 },
      { text: this.getCurrentYear(), x: 618, y: 110 },
      { text: confirmedEntry.folio, x: 664, y: 100, size: 10 },
      { text: confirmedEntry.userReceiver.area.name, x: 70, y: 177 },
      { text: confirmedEntry.userDispatcher.name, x: 460, y: 524, size: 6 },
      { text: confirmedEntry.userReceiver.name, x: 600, y: 524, size: 6 },
      { text: confirmedEntry.serviceBoos? confirmedEntry.serviceBoos: "", x: 75, y: 524, size: 6 },
      { text: confirmedEntry.jud? confirmedEntry.jud: "", x: 255, y: 524, size: 6 },
    ];

    let startY = 264;
    for (let i = 0; i < confirmedEntry.materialList.length; i++) {
      datos.push({
        text: confirmedEntry.materialList[i].material.description,
        x: 480,
        y: startY + (i * 13) - 2.5,
        size: 7
      });
      datos.push({
        text: String(confirmedEntry.materialList[i].quantity),
        x: 435,
        y: startY + (i * 13) - 2.5,
        size: 7
      });
      datos.push({
        text: confirmedEntry.materialList[i].material.unit.name,
        x: 325,
        y: startY + (i * 13) - 2.5,
        size: 7
      });
      datos.push({
        text: String(confirmedEntry.materialList[i].status.status),
        x: 362,
        y: startY + (i * 13) - 2.5,
        size: 7
      });
      datos.push({
        text: String(confirmedEntry.materialList[i].quantity),
        x: 282,
        y: startY + (i * 13) - 2.5,
        size: 7
      });
    }
    const pdfBytes = await this.pdfService.fillPdfFromTemplate('assets/formatoSalida.pdf', datos);
    this.pdfService.openPdfInBrowser(pdfBytes);
  }

  getCurrentDay(): string {
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit' }).format(new Date());
  }

  getCurrentMonth(): string {
    return new Intl.DateTimeFormat('es-ES', { month: '2-digit' }).format(new Date());
  }

  getCurrentYear(): string {
    const today = new Date();
    return today.getFullYear().toString();
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
