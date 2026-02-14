import { Observable } from 'rxjs';
import { Unit } from '../../domain/object/unit';
import { UnitRequest } from '../../domain/api/unitRequest';

export abstract class IUnitService {
  abstract create(request: UnitRequest): Observable<Unit>;
  abstract update(request: UnitRequest): Observable<Unit>;
  abstract findAll(): Observable<Unit[]>;
  abstract findById(id: number): Observable<Unit>;
}
