import { Injectable } from '@angular/core';
import { IRoadWebService } from '../output_ports/IRoadWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import profileRest from '../../domain/api/roadRest';
import { Road } from '../../domain/object/road';
import { Observable } from 'rxjs';
import { RoadRequest } from '../../domain/api/roadRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class RoadWebServiceImplements implements IRoadWebService {

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

  create(request: RoadRequest): Observable<Road> {
    return this.http.post<Road>(profileRest.roadService.SAVE, request, {
        headers: this.headers(),
      });
  }

  update(request: RoadRequest): Observable<Road> {
    return this.http
      .put<Road>(profileRest.roadService.UPDATE, request, {
        headers: this.headers(),
      })
  }

  findAll(): Observable<Road[]> {
    return this.http
      .get<Road[]>(profileRest.roadService.FIND_ALL, {
        headers: this.headers(),
      })
  }

  findById(id: number): Observable<Road> {
    return this.http
      .get<Road>(`${profileRest.roadService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
  }
}
