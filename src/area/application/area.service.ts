import { Injectable } from '@angular/core';
import { Area } from '../domain/object/area';
import { AreaWebServiceImplements } from '../infrestructure/output_adapters/areaWebServiceImplements';
import { catchError, map, Observable } from 'rxjs';
import { IAreaService } from '../infrestructure/input_ports/IAreaService';
import { IAreaWebService } from '../infrestructure/output_ports/IAreaWebService';
import { AreaRequest } from '../domain/api/areaRequest';

@Injectable({
  providedIn: 'root',
})
export class AreaService implements IAreaService {
  public area: Area | undefined;
  public areaList: Area[] = [];

  public constructor(private readonly service: AreaWebServiceImplements) {}

  public create(request: AreaRequest): Observable<Area> {
    const serviceInstance: IAreaWebService = this.service;
    return serviceInstance.create(request).pipe(
      map((response) => {
        this.area = response;
        return this.area;
      })
    );
    catchError((e) => {
      return [];
    });
  }

  public update(request: AreaRequest): Observable<Area> {
    const serviceInstance: IAreaWebService = this.service;
    return serviceInstance.update(request).pipe(
      map((response) => {
        this.area = response;
        return this.area;
      })
    );
    catchError((e) => {
      return [];
    });
  }

  public findAll(): Observable<Area[]> {
    const serviceInstance: IAreaWebService = this.service;
    return serviceInstance.findAll().pipe(
      map((response) => {
        this.areaList = response;
        return this.areaList;
      })
    );
    catchError((e) => {
      return [];
    });
  }

  findById(id: number): Observable<Area> {
    const serviceInstance: IAreaWebService = this.service;
    return serviceInstance.findById(id).pipe(
      map((response) => {
        this.area = response;
        return this.area;
      })
    );
    catchError((e) => {
      return [];
    });
  }
}
