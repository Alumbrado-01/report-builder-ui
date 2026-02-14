import { Observable } from 'rxjs';
import { Profile } from '../../domain/object/profile';
import { ProfileRequest } from '../../domain/api/profileRequest';

export abstract class IProfileWebService {
  abstract create(request: ProfileRequest): Observable<Profile>;
  abstract update(request: ProfileRequest): Observable<Profile>;
  abstract findAll(): Observable<Profile[]>;
  abstract findById(id: number): Observable<Profile>;
}
