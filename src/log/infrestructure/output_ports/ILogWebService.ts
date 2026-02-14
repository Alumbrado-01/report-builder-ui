import { Observable } from 'rxjs';
import { Log } from '../../domain/object/log';
import { LogRequest } from '../../domain/api/logRequest';

export abstract class ILogWebService {
  abstract create(request: LogRequest): Observable<Log>;
  abstract update(request: LogRequest): Observable<Log>;
  abstract findAll(): Observable<Log[]>;
  abstract findById(id: number): Observable<Log>;
  abstract findByTableAndEntity(table: string, entity: number): Observable<Log[]>;
}
