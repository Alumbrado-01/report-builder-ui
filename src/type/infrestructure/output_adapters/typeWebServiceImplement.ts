import { Injectable } from '@angular/core';
import { ITypeWebService } from '../output_ports/ITypeWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import typeRest from '../../domain/api/typeRest';
import { Type } from '../../domain/object/type';
import { Observable, map } from 'rxjs';
import { TypeRequest } from '../../domain/api/typeRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class TypeWebServiceImplements implements ITypeWebService {
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

  private readonly restToDomain = (type: Type): Type => {
    return {
      idType: type.idType,
      name: type.name,
      active: type.active,
    };
  };

  create(request: TypeRequest): Observable<Type> {
    return this.http
      .post<Type>(typeRest.typeService.SAVE, request, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }

  update(request: TypeRequest): Observable<Type> {
    return this.http
      .put<Type>(typeRest.typeService.UPDATE, request, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }

  findAll(): Observable<Type[]> {
    return this.http
      .get<Type[]>(typeRest.typeService.FIND_ALL, {
        headers: this.headers(),
      })
      .pipe(map((types) => types.map(this.restToDomain)));
  }

  findById(id: number): Observable<Type> {
    return this.http
      .get<Type>(`${typeRest.typeService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }
}
