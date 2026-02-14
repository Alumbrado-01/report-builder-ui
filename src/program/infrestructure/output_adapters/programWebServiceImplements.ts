import { Injectable } from '@angular/core';
import { IProgramWebService } from '../output_ports/IProgramWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import profileRest from '../../domain/api/programRest';
import { Program } from '../../domain/object/program';
import { Observable } from 'rxjs';
import { ProgramRequest } from '../../domain/api/programRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class ProgramWebServiceImplements implements IProgramWebService {

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

  create(request: ProgramRequest): Observable<Program> {
    return this.http.post<Program>(profileRest.programService.SAVE, request, {
        headers: this.headers(),
      });
  }

  update(request: ProgramRequest): Observable<Program> {
    return this.http
      .put<Program>(profileRest.programService.UPDATE, request, {
        headers: this.headers(),
      })
  }

  findAll(): Observable<Program[]> {
    return this.http
      .get<Program[]>(profileRest.programService.FIND_ALL, {
        headers: this.headers(),
      })
  }

  findById(id: number): Observable<Program> {
    return this.http
      .get<Program>(`${profileRest.programService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
  }
}
