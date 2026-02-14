import {Component, OnInit, inject, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Log } from '../../../domain/object/log';
import { ILogService } from '../../input_ports/ILogService';
import Swal from "sweetalert2";

@Component({
  selector: 'app-log-view',
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
  ],
  templateUrl: './log-view.component.html',
  styleUrl: './log-view.component.scss',
})
export class LogViewComponent implements OnInit {

  private readonly logService = inject(ILogService);
  public loading = false;
  public logs: Log[] = [];
  @ViewChild('dt')
  public dt: any;
  public visible: boolean = false;
  public dialogTitle: string = 'Historial de Cambios';
  public display = true;

  @Input()
  public table: string;
  @Input()
  public entity: number;
  @Output()
  public onClose: EventEmitter<any> = new EventEmitter();


  ngOnInit(): void {
    this.loadLogs(this.table, this.entity);
  }

  private loadLogs(table: string, entity: number): void {
    this.loading = true;
    this.logService.findByTableAndEntity(table,entity).subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: (err) => {
        Swal.fire('Error cargando logs', err.message, 'error');
        this.loading = false;
      },
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  public closeDialog() {
    this.onClose.emit();
  }

}
