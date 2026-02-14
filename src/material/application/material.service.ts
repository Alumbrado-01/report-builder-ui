import { Injectable } from '@angular/core';
import { Material } from '../domain/object/material';
import { MaterialWebServiceImplements } from '../infrestructure/output_adapters/materialWebServiceImplement';
import { Observable, of, map, catchError } from 'rxjs';
import { IMaterialService } from '../infrestructure/input_ports/IMaterialService';
import { MaterialRequest } from '../domain/api/materialRequest';

@Injectable({ providedIn: 'root' })
export class MaterialService extends IMaterialService {

  public material!: Material;
  public materialList: Material[] = [];

  constructor(private readonly service: MaterialWebServiceImplements) {
    super();
  }

  create(request: MaterialRequest): Observable<Material> {
    return this.service.create(request).pipe(
      map((response) => {
        this.material = response;
        return this.material;
      }),
      catchError((e) => {
        console.error('create() error', e);
        return of({} as Material);
      })
    );
  }

  update(request: MaterialRequest): Observable<Material> {
    return this.service.update(request).pipe(
      map((response) => {
        this.material = response;
        return this.material;
      }),
      catchError((e) => {
        console.error('update() error', e);
        return of({} as Material);
      })
    );
  }

  findAll(): Observable<Material[]> {
    return this.service.findAll().pipe(
      map((response) => {
        this.materialList = response;
        return this.materialList;
      }),
      catchError((e) => {
        console.error('findAll() error', e);
        return of([] as Material[]);
      })
    );
  }

  findById(id: number): Observable<Material> {
    return this.service.findById(id).pipe(
      map((response) => {
        this.material = response;
        return this.material;
      }),
      catchError((e) => {
        console.error('findById() error', e);
        return of({} as Material);
      })
    );
  }
}
