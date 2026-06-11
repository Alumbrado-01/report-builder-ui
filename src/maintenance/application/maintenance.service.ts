import { Injectable } from '@angular/core';
import { Maintenance } from '../domain/object/maintenance';
import { catchError, map, Observable, of } from 'rxjs';
import { IMaintenanceService } from '../infrestructure/input_ports/IMaintenanceService';
import { MaintenanceRequest } from '../domain/api/maintenanceRequest';
import {MaintenanceWebServiceImplements} from "../infrestructure/output_adapters/maintenanceWebServiceImplement";
import {User} from "../../user/domain/object/user";
import {ReportRequest} from "../../pdfmake/domain/api/reportRequest";

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService implements IMaintenanceService {

  public maintenance: Maintenance;
  public maintenanceList: Maintenance[] = [];

  constructor(
    private readonly service: MaintenanceWebServiceImplements)
  {}

  create(request: MaintenanceRequest): Observable<Maintenance> {
    return this.service.create(request).pipe(
      map((response) => (this.maintenance = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Maintenance);
      })
    );
  }

  update(request: MaintenanceRequest): Observable<Maintenance> {
    return this.service.update(request).pipe(
      map((response) => (this.maintenance = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Maintenance);
      })
    );
  }

  findAll(): Observable<Maintenance[]> {
    return this.service.findAll().pipe(
      map((response) => (this.maintenanceList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Maintenance[]);
      })
    );
  }

  findById(id: number): Observable<Maintenance> {
    return this.service.findById(id).pipe(
      map((response) => (this.maintenance = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Maintenance);
      })
    );
  }

  findByUser(user: User): Observable<Maintenance[]> {
    return this.service.findByUser(user).pipe(
      map((response) => (this.maintenanceList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Maintenance[]);
      })
    );
  }

  findReport(reportRequest:ReportRequest): Observable<Maintenance[]> {
    return this.service.findReport(reportRequest).pipe(
      map((response) => (this.maintenanceList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Maintenance[]);
      })
    );
  }
}
