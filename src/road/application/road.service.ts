import { Injectable } from '@angular/core';
import { Road } from '../domain/object/road';
import { RoadWebServiceImplements } from '../infrestructure/output_adapters/roadWebServiceImplements';
import { catchError, map, Observable, of } from 'rxjs';
import { IRoadService } from '../infrestructure/input_ports/IRoadService';
import { RoadRequest } from '../domain/api/roadRequest';

@Injectable({
  providedIn: 'root',
})
export class RoadService implements IRoadService {

  public profile: Road;
  public profileList: Road[] = [];

  constructor(
    private readonly service: RoadWebServiceImplements
  ) {}

  create(request: RoadRequest): Observable<Road> {
    return this.service.create(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Road);
      })
    );
  }

  update(request: RoadRequest): Observable<Road> {
    return this.service.update(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Road);
      })
    );
  }

  findAll(): Observable<Road[]> {
    return this.service.findAll().pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Road[]);
      })
    );
  }

  findById(id: number): Observable<Road> {
    return this.service.findById(id).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Road);
      })
    );
  }

  getRoadsByType(rvpRvs: string): Observable<Road[]> {
    return this.service.getRoadsByType(rvpRvs).pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Road[]);
      })
    );
  }
}
