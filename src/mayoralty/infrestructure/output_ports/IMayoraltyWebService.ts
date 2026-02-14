import { Observable } from 'rxjs';
import { Mayoralty } from '../../domain/object/mayoralty';
import { MayoraltyRequest } from '../../domain/api/mayoraltyRequest';

export abstract class IMayoraltyWebService {
  abstract create(request: MayoraltyRequest): Observable<Mayoralty>;
  abstract update(request: MayoraltyRequest): Observable<Mayoralty>;
  abstract findAll(): Observable<Mayoralty[]>;
  abstract findById(id: number): Observable<Mayoralty>;
}
