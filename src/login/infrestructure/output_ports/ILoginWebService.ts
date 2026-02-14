import { Observable } from 'rxjs';
import { Login } from '../../domain/object/login';
import { LoginRequest } from '../../domain/api/loginRequest';

export abstract class ILoginWebService {
  abstract validateAccess(request: LoginRequest): Observable<Login>;
}
