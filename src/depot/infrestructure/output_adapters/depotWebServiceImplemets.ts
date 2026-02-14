import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import depotRest from '../../domain/api/depotRest';
import { Depot } from '../../domain/object/depot';
import { Observable, map } from 'rxjs';
import { DepotRequest } from '../../domain/api/depotRequest';
import { IDepotWebService } from '../output_ports/IDepotWebService';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({ providedIn: 'root' })
export class DepotWebServiceImplements implements IDepotWebService {
  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return h;
  }

  create(request: DepotRequest): Observable<Depot> {
    return this.http.post<Depot>(depotRest.depotService.SAVE, request, {
      headers: this.headers(),
    });
  }

  update(request: DepotRequest): Observable<Depot> {
    return this.http.put<Depot>(depotRest.depotService.UPDATE, request, {
      headers: this.headers(),
    });
  }

  findAll(): Observable<Depot[]> {
    return this.http.get<Depot[]>(depotRest.depotService.FIND_ALL, {
      headers: this.headers(),
    });
  }

  findById(id: number): Observable<Depot> {
    return this.http.get<Depot>(`${depotRest.depotService.FIND_BY_ID}/${id}`, {
      headers: this.headers(),
    });
  }
}
