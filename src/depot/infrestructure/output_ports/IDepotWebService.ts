import { Observable } from 'rxjs';
import { Depot } from '../../domain/object/depot';
import { DepotRequest } from '../../domain/api/depotRequest';

export abstract class IDepotWebService {
  abstract create(request: DepotRequest): Observable<Depot>;
  abstract update(request: DepotRequest): Observable<Depot>;
  abstract findAll(): Observable<Depot[]>;
  abstract findById(id: number): Observable<Depot>;
}
