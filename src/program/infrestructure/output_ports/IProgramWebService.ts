import { Observable } from 'rxjs';
import { Program } from '../../domain/object/program';
import { ProgramRequest } from '../../domain/api/programRequest';

export abstract class IProgramWebService {
  abstract create(request: ProgramRequest): Observable<Program>;
  abstract update(request: ProgramRequest): Observable<Program>;
  abstract findAll(): Observable<Program[]>;
  abstract findById(id: number): Observable<Program>;
}
