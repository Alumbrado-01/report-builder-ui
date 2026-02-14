import { Observable } from 'rxjs';
import { User } from '../../domain/object/user';
import { UserRequest } from '../../domain/api/userRequest';

export abstract class IUserService {
  abstract create(request: UserRequest): Observable<User>;
  abstract update(request: UserRequest): Observable<User>;
  abstract findAll(): Observable<User[]>;
  abstract findById(id: number): Observable<User>;
}
