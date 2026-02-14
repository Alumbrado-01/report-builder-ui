import { Injectable } from '@angular/core';
import { Program } from '../domain/object/program';
import { ProgramWebServiceImplements } from '../infrestructure/output_adapters/programWebServiceImplements';
import { catchError, map, Observable, of } from 'rxjs';
import { IProgramService } from '../infrestructure/input_ports/IProgramService';
import { ProgramRequest } from '../domain/api/programRequest';

@Injectable({
  providedIn: 'root',
})
export class ProgramService implements IProgramService {

  public profile: Program;
  public profileList: Program[] = [];

  constructor(
    private readonly service: ProgramWebServiceImplements
  ) {}

  create(request: ProgramRequest): Observable<Program> {
    return this.service.create(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Program);
      })
    );
  }

  update(request: ProgramRequest): Observable<Program> {
    return this.service.update(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Program);
      })
    );
  }

  findAll(): Observable<Program[]> {
    return this.service.findAll().pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Program[]);
      })
    );
  }

  findById(id: number): Observable<Program> {
    return this.service.findById(id).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Program);
      })
    );
  }
}
