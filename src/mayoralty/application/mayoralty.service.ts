import { Injectable } from '@angular/core';
import { Mayoralty } from '../domain/object/mayoralty';
import { MayoraltyWebServiceImplements } from '../infrestructure/output_adapters/mayoraltyWebServiceImplements';
import { catchError, map, Observable, of } from 'rxjs';
import { IMayoraltyService } from '../infrestructure/input_ports/IMayoraltyService';
import { MayoraltyRequest } from '../domain/api/mayoraltyRequest';

@Injectable({
  providedIn: 'root',
})
export class MayoraltyService implements IMayoraltyService {

  public profile: Mayoralty;
  public profileList: Mayoralty[] = [];

  constructor(
    private readonly service: MayoraltyWebServiceImplements
  ) {}

  create(request: MayoraltyRequest): Observable<Mayoralty> {
    return this.service.create(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Mayoralty);
      })
    );
  }

  update(request: MayoraltyRequest): Observable<Mayoralty> {
    return this.service.update(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Mayoralty);
      })
    );
  }

  findAll(): Observable<Mayoralty[]> {
    return this.service.findAll().pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Mayoralty[]);
      })
    );
  }

  findById(id: number): Observable<Mayoralty> {
    return this.service.findById(id).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Mayoralty);
      })
    );
  }
}
