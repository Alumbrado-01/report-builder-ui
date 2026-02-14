import { Injectable } from '@angular/core';
import { ILogWebService } from '../output_ports/ILogWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import logRest from '../../domain/api/logRest';
import { Log } from '../../domain/object/log';
import { Observable } from 'rxjs';
import { LogRequest } from '../../domain/api/logRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class LogWebServiceImplements implements ILogWebService {

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

  create(request: LogRequest): Observable<Log> {
    return this.http.post<Log>(logRest.logService.SAVE, request, {
      headers: this.headers(),
    });
  }

  update(request: LogRequest): Observable<Log> {
    const urlBuild = logRest.logService.UPDATE;
    return this.http.put<Log>(urlBuild, request, { headers: this.headers() });
  }

  findAll(): Observable<Log[]> {
    const urlBuild = logRest.logService.FIND_ALL;
    return this.http.get<Log[]>(urlBuild, { headers: this.headers() });
  }

  findById(id: number): Observable<Log> {
    const urlBuild = `${logRest.logService.FIND_BY_ID}/${id}`;
    return this.http.get<Log>(urlBuild, { headers: this.headers() });
  }

  findByTableAndEntity(table:string, entity:number): Observable<Log[]> {
    const urlBuild = `${logRest.logService.FIND_BY_TABLE_AND_ENTITY}/${table}/${entity}`;
    return this.http.get<Log[]>(urlBuild, { headers: this.headers() });
  }
}
