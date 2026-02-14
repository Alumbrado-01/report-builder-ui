import { Observable } from 'rxjs';
import { Area } from '../../domain/object/area';
import { AreaRequest } from '../../domain/api/areaRequest';

export abstract class IAreaService {
  abstract create(request: AreaRequest): Observable<Area>;
  abstract update(request: AreaRequest): Observable<Area>;
  abstract findAll(): Observable<Area[]>;
  abstract findById(id: number): Observable<Area>;
}
