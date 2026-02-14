import { Observable } from 'rxjs';
import { Material } from '../../domain/object/material';
import { MaterialRequest } from '../../domain/api/materialRequest';

export abstract class IMaterialWebService {
  abstract create(request: MaterialRequest): Observable<Material>;
  abstract update(request: MaterialRequest): Observable<Material>;
  abstract findAll(): Observable<Material[]>;
  abstract findById(id: number): Observable<Material>;
}
