import { Observable } from 'rxjs';
import { Type } from '../../domain/object/type';
import { TypeRequest } from '../../domain/api/typeRequest';

export abstract class ITypeWebService {
  abstract create(request: TypeRequest): Observable<Type>;
  abstract update(request: TypeRequest): Observable<Type>;
  abstract findAll(): Observable<Type[]>;
  abstract findById(id: number): Observable<Type>;
}
