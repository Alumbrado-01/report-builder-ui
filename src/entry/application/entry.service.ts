import { Injectable } from '@angular/core';
import { Entry } from '../domain/object/entry';
import { EntryWebServiceImplements } from '../infrestructure/output_adapters/entryWebServiceImplements';
import {catchError, map, Observable, of} from 'rxjs';
import { IEntryService } from '../infrestructure/input_ports/IEntryService';
import { IEntryWebService } from '../infrestructure/output_ports/IEntryWebService';
import {EntryRequest} from "../domain/api/entryRequest";
import {ConfirmedEntry} from "../domain/object/confirmedEntry";
import {ReportRequest} from "../../pdfmake/domain/api/reportRequest";

@Injectable({
  providedIn: 'root',
})
export class EntryService implements IEntryService {

  public entryList: Entry[] = [];
  public confirmedEntry: ConfirmedEntry;
  public confirmedEntryList: ConfirmedEntry[];

  public constructor(
    private readonly service: EntryWebServiceImplements
  ) {}


  public findAll(): Observable<Entry[]> {
    const serviceInstance: IEntryWebService = this.service;
    return serviceInstance.findAll().pipe(
      map((response) => {
        this.entryList = response;
        return this.entryList;
      })
    );
  }

  findByDepotId(id: number): Observable<Entry[]> {
    const serviceInstance: IEntryWebService = this.service;
    return serviceInstance.findByDepotId(id).pipe(
      map((response) => {
        this.entryList = response;
        return this.entryList;
      })
    );
  }

  create(request: EntryRequest): Observable<ConfirmedEntry> {
    return this.service.create(request).pipe(
      map((response) => (this.confirmedEntry = response)),
      catchError((e) => {
        console.error(e);
        return of({} as ConfirmedEntry);
      })
    );
  }

  findReport(request: ReportRequest): Observable<ConfirmedEntry[]> {
    return this.service.findReport(request).pipe(
      map((response) => (this.confirmedEntryList = response)),
      catchError((e) => {
        console.error(e);
        return [];
      })
    );
  }

  findByMaterialId(id: number): Observable<Entry[]> {
    const serviceInstance: IEntryWebService = this.service;
    return serviceInstance.findByMaterialId(id).pipe(
      map((response) => {
        this.entryList = response;
        return this.entryList;
      })
    );
  }
}
