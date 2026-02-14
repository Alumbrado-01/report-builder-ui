import { Injectable } from '@angular/core';
import { Zone } from '../domain/object/zone';
import { ZoneWebServiceImplements } from '../infrestructure/output_adapters/zoneWebServiceImplements';
import { catchError, map, Observable, of } from 'rxjs';
import { IZoneService } from '../infrestructure/input_ports/IZoneService';
import { ZoneRequest } from '../domain/api/zoneRequest';

@Injectable({
  providedIn: 'root',
})
export class ZoneService implements IZoneService {

  public profile: Zone;
  public profileList: Zone[] = [];

  constructor(
    private readonly service: ZoneWebServiceImplements
  ) {}

  create(request: ZoneRequest): Observable<Zone> {
    return this.service.create(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Zone);
      })
    );
  }

  update(request: ZoneRequest): Observable<Zone> {
    return this.service.update(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Zone);
      })
    );
  }

  findAll(): Observable<Zone[]> {
    return this.service.findAll().pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Zone[]);
      })
    );
  }

  findById(id: number): Observable<Zone> {
    return this.service.findById(id).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Zone);
      })
    );
  }
}
