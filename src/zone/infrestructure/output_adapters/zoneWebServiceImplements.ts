import { Injectable } from '@angular/core';
import { IZoneWebService } from '../output_ports/IZoneWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import profileRest from '../../domain/api/zoneRest';
import { Zone } from '../../domain/object/zone';
import { Observable } from 'rxjs';
import { ZoneRequest } from '../../domain/api/zoneRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';
import {RoadByZoneRequest} from "../../../road/domain/api/roadByZoneRequest";

@Injectable({
  providedIn: 'root',
})
export class ZoneWebServiceImplements implements IZoneWebService {

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      header = header.append('Authorization', `Bearer ${token}`);
    }
    return header;
  }

  create(request: ZoneRequest): Observable<Zone> {
    return this.http.post<Zone>(profileRest.zoneService.SAVE, request, {
        headers: this.headers(),
      });
  }

  update(request: ZoneRequest): Observable<Zone> {
    return this.http
      .put<Zone>(profileRest.zoneService.UPDATE, request, {
        headers: this.headers(),
      })
  }

  findAll(): Observable<Zone[]> {
    return this.http
      .get<Zone[]>(profileRest.zoneService.FIND_ALL, {
        headers: this.headers(),
      })
  }

  findById(id: number): Observable<Zone> {
    return this.http
      .get<Zone>(`${profileRest.zoneService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
  }

}
