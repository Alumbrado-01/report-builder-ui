import { Injectable } from '@angular/core';
import { Depot } from '../domain/object/depot';
import { DepotWebServiceImplements } from '../infrestructure/output_adapters/depotWebServiceImplemets';
import { Observable, of, map, catchError } from 'rxjs';
import { IDepotService } from '../infrestructure/input_ports/IDepotService';
import { DepotRequest } from '../domain/api/depotRequest';

@Injectable({ providedIn: 'root' })
export class DepotService extends IDepotService {
  public depot!: Depot;
  public depotList: Depot[] = [];

  constructor(private readonly service: DepotWebServiceImplements) {
    super();
  }

  create(request: DepotRequest): Observable<Depot> {
    return this.service.create(request).pipe(
      map((response) => (this.depot = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Depot);
      })
    );
  }

  update(request: DepotRequest): Observable<Depot> {
    return this.service.update(request).pipe(
      map((response) => (this.depot = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Depot);
      })
    );
  }

  findAll(): Observable<Depot[]> {
    return this.service.findAll().pipe(
      map((response) => (this.depotList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Depot[]);
      })
    );
  }

  findById(id: number): Observable<Depot> {
    return this.service.findById(id).pipe(
      map((response) => (this.depot = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Depot);
      })
    );
  }
}
