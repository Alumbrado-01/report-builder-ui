import { Injectable } from '@angular/core';
import { IEntryWebService } from '../output_ports/IEntryWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entry } from '../../domain/object/entry';
import { Observable } from 'rxjs';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';
import entryRest from "../../domain/api/entryRest";
import { EntryRequest } from "../../domain/api/entryRequest";
import { ConfirmedEntry } from "../../domain/object/confirmedEntry";
import {ReportRequest} from "../../../pdfmake/domain/api/reportRequest";

@Injectable({
  providedIn: 'root',
})
export class EntryWebServiceImplements implements IEntryWebService {

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      h = h.set('Authorization', `Bearer ${token}`);
    }
    return h;
  }

  findAll(): Observable<Entry[]> {
    const urlBuild = entryRest.entryService.FIND_ALL;
    return this.http
      .get<Entry[]>(urlBuild, { headers: this.headers() })
  }

  findByDepotId(id: number): Observable<Entry[]> {
    const urlBuild = `${entryRest.entryService.FIND_BY_DEPOT_ID}/${id}`;
    return this.http
      .get<Entry[]>(urlBuild, { headers: this.headers() })
  }

  findByMaterialId(id: number): Observable<Entry[]> {
    const urlBuild = `${entryRest.entryService.FIND_BY_MATERIAL_ID}/${id}`;
    return this.http
      .get<Entry[]>(urlBuild, { headers: this.headers() })
  }

  create(request: EntryRequest): Observable<ConfirmedEntry> {
    return this.http
      .post<ConfirmedEntry>(entryRest.entryService.SAVE, request, {
        headers: this.headers(),
      })
  }

  findReport(reportRequest:ReportRequest): Observable<ConfirmedEntry[]> {
    return this.http
      .post<ConfirmedEntry[]>(entryRest.entryService.FIND_REPORT, reportRequest, {
        headers: this.headers(),
      })
  }
}
