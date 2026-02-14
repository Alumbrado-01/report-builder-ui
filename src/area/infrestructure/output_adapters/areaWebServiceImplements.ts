import { Injectable } from '@angular/core';
import { IAreaWebService } from '../output_ports/IAreaWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import areaRest from '../../domain/api/areaRest';
import { Area } from '../../domain/object/area';
import { Observable } from 'rxjs';
import { AreaRequest } from '../../domain/api/areaRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class AreaWebServiceImplements implements IAreaWebService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      h = h.set('Authorization', `Bearer ${token}`);
    }
    return h;
  }

  create(request: AreaRequest): Observable<Area> {
    return this.http.post<Area>(areaRest.areaService.SAVE, request, {
      headers: this.headers(),
    });
  }

  update(request: AreaRequest): Observable<Area> {
    const urlBuild = areaRest.areaService.UPDATE;
    return this.http.put<Area>(urlBuild, request, { headers: this.headers() });
  }

  findAll(): Observable<Area[]> {
    const urlBuild = areaRest.areaService.FIND_ALL;
    return this.http.get<Area[]>(urlBuild, { headers: this.headers() });
  }

  findById(id: number): Observable<Area> {
    const urlBuild = `${areaRest.areaService.FIND_BY_ID}/${id}`;
    return this.http.get<Area>(urlBuild, { headers: this.headers() });
  }
}
