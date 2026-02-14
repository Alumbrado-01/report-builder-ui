import { Injectable } from '@angular/core';
import { IMaterialWebService } from '../output_ports/IMaterialWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import materialRest from '../../domain/api/materialRest';
import { Material } from '../../domain/object/material';
import { Observable } from 'rxjs';
import { MaterialRequest } from '../../domain/api/materialRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({ providedIn: 'root' })
export class MaterialWebServiceImplements implements IMaterialWebService {

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

  create(request: MaterialRequest): Observable<Material> {
    const url = materialRest.materialService.SAVE;
    return this.http.post<Material>(url, request, { headers: this.headers() })
  }

  update(request: MaterialRequest): Observable<Material> {
    const url = materialRest.materialService.UPDATE;
    return this.http.put<Material>(url, request, { headers: this.headers() })
  }

  findAll(): Observable<Material[]> {
    const url = materialRest.materialService.FIND_ALL;
    return this.http.get<Material[]>(url, { headers: this.headers() })
  }

  findById(id: number): Observable<Material> {
    const url = `${materialRest.materialService.FIND_BY_ID}/${id}`;
    return this.http.get<Material>(url, { headers: this.headers() })
  }
}
