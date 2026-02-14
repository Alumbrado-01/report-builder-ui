import { Injectable } from '@angular/core';
import { Unit } from '../domain/object/unit';
import { UnitWebServiceImplements } from '../infrestructure/output_adapters/unitWebServiceImplement';
import { catchError, map, Observable, of } from 'rxjs';
import { IUnitService } from '../infrestructure/input_ports/IUnitService';
import { UnitRequest } from '../domain/api/unitRequest';

@Injectable({
  providedIn: 'root',
})
export class unitService implements IUnitService {
  public unit!: Unit;
  public unitList: Unit[] = [];

  constructor(private readonly service: UnitWebServiceImplements) {
    // super();
  }

  create(request: UnitRequest): Observable<Unit> {
    return this.service.create(request).pipe(
      map((response) => (this.unit = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Unit);
      })
    );
  }

  update(request: UnitRequest): Observable<Unit> {
    return this.service.update(request).pipe(
      map((response) => (this.unit = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Unit);
      })
    );
  }

  findAll(): Observable<Unit[]> {
    return this.service.findAll().pipe(
      map((response) => (this.unitList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Unit[]);
      })
    );
  }

  findById(id: number): Observable<Unit> {
    return this.service.findById(id).pipe(
      map((response) => (this.unit = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Unit);
      })
    );
  }
}
