import { Injectable } from '@angular/core';
import { IMayoraltyWebService } from '../output_ports/IMayoraltyWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import profileRest from '../../domain/api/mayoraltyRest';
import { Mayoralty } from '../../domain/object/mayoralty';
import { Observable } from 'rxjs';
import { MayoraltyRequest } from '../../domain/api/mayoraltyRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class MayoraltyWebServiceImplements implements IMayoraltyWebService {

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

  create(request: MayoraltyRequest): Observable<Mayoralty> {
    console.log(request);
    return this.http.post<Mayoralty>(profileRest.mayoraltyService.SAVE, request, {
        headers: this.headers(),
      });
  }

  update(request: MayoraltyRequest): Observable<Mayoralty> {
    return this.http
      .put<Mayoralty>(profileRest.mayoraltyService.UPDATE, request, {
        headers: this.headers(),
      })
  }

  findAll(): Observable<Mayoralty[]> {
    return this.http
      .get<Mayoralty[]>(profileRest.mayoraltyService.FIND_ALL, {
        headers: this.headers(),
      })
  }

  findById(id: number): Observable<Mayoralty> {
    return this.http
      .get<Mayoralty>(`${profileRest.mayoraltyService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
  }
}
