import { Observable } from 'rxjs';
import { Zone } from '../../domain/object/zone';
import { ZoneRequest } from '../../domain/api/zoneRequest';

export abstract class IZoneService {
  abstract create(request: ZoneRequest): Observable<Zone>;
  abstract update(request: ZoneRequest): Observable<Zone>;
  abstract findAll(): Observable<Zone[]>;
  abstract findById(id: number): Observable<Zone>;

}
