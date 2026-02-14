import { Observable } from 'rxjs';
import { User } from '../../domain/object/user';
import { UserRequest } from '../../domain/api/userRequest';

export interface IUserWebService {
  create(request: UserRequest): Observable<User>;
  update(request: UserRequest): Observable<User>;
  findAll(): Observable<User[]>;
  findById(id: number): Observable<User>;
}
