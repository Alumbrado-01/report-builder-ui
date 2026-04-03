import { Injectable } from '@angular/core';
import { IMaintenanceWebService } from '../output_ports/IMaintenanceWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import maintenanceRest from '../../domain/api/maintenanceRest';
import { Maintenance } from '../../domain/object/maintenance';
import { Observable} from 'rxjs';
import { MaintenanceRequest } from '../../domain/api/maintenanceRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';
import {User} from "../../../user/domain/object/user";

@Injectable({
  providedIn: 'root',
})
export class MaintenanceWebServiceImplements implements IMaintenanceWebService {
  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      h = h.append('Authorization', `Bearer ${token}`);
    }
    return h;
  }

  create(request: MaintenanceRequest): Observable<Maintenance> {
    return this.http.post<Maintenance>(maintenanceRest.maintenanceService.SAVE, request, {
      headers: this.headers(),
    });
  }

  update(request: MaintenanceRequest): Observable<Maintenance> {
    return this.http.put<Maintenance>(maintenanceRest.maintenanceService.UPDATE, request, {
      headers: this.headers(),
    });
  }

  findAll(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(maintenanceRest.maintenanceService.FIND_ALL, {
      headers: this.headers(),
    });
  }

  findById(id: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${maintenanceRest.maintenanceService.FIND_BY_ID}/${id}`, {
      headers: this.headers(),
    });
  }

  findByUser(user: User): Observable<Maintenance[]> {
    return this.http.post<Maintenance[]>(maintenanceRest.maintenanceService.FIND_BY_USER, user, {
      headers: this.headers(),
    });
  }
}
