import { Injectable } from '@angular/core';
import { IActivityWebService } from '../output_ports/IActivityWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import profileRest from '../../domain/api/activityRest';
import { Activity } from '../../domain/object/activity';
import { Observable } from 'rxjs';
import { ActivityRequest } from '../../domain/api/activityRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class ActivityWebServiceImplements implements IActivityWebService {

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

  create(request: ActivityRequest): Observable<Activity> {
    return this.http.post<Activity>(profileRest.activityService.SAVE, request, {
        headers: this.headers(),
      });
  }

  update(request: ActivityRequest): Observable<Activity> {
    return this.http
      .put<Activity>(profileRest.activityService.UPDATE, request, {
        headers: this.headers(),
      })
  }

  findAll(): Observable<Activity[]> {
    return this.http
      .get<Activity[]>(profileRest.activityService.FIND_ALL, {
        headers: this.headers(),
      })
  }

  findById(id: number): Observable<Activity> {
    return this.http
      .get<Activity>(`${profileRest.activityService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
  }
}
