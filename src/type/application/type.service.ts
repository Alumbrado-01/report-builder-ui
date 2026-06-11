import { Injectable } from '@angular/core';
import { Type } from '../domain/object/type';
import { TypeWebServiceImplements } from '../infrestructure/output_adapters/typeWebServiceImplements';
import { catchError, map, Observable, of } from 'rxjs';
import { ITypeService } from '../infrestructure/input_ports/ITypeService';
import { TypeRequest } from '../domain/api/typeRequest';

@Injectable({
  providedIn: 'root',
})
export class TypeService implements ITypeService {

  public profile: Type;
  public profileList: Type[] = [];

  constructor(
    private readonly service: TypeWebServiceImplements
  ) {}

  create(request: TypeRequest): Observable<Type> {
    return this.service.create(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Type);
      })
    );
  }

  update(request: TypeRequest): Observable<Type> {
    return this.service.update(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Type);
      })
    );
  }

  findAll(): Observable<Type[]> {
    return this.service.findAll().pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Type[]);
      })
    );
  }

  findById(id: number): Observable<Type> {
    return this.service.findById(id).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Type);
      })
    );
  }

}
