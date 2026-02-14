import { Injectable } from '@angular/core';
import { IUserWebService } from '../output_ports/IUserWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import userRest from '../../domain/api/userRest';
import { User } from '../../domain/object/user';
import { Observable, map } from 'rxjs';
import { UserRequest } from '../../domain/api/userRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';
import { Depot } from '../../../depot/domain/object/depot';
import { Area } from '../../../area/domain/object/area';
import { Profile } from '../../../user_profile/domain/object/profile';

@Injectable({
  providedIn: 'root',
})
export class UserWebServiceImplements implements IUserWebService {
  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      h = h.append('Authorization', `Bearer ${token}`);
    }
    return h;
  }

  create(request: UserRequest): Observable<User> {
    return this.http.post<User>(userRest.userService.SAVE, request, {
      headers: this.headers(),
    });
  }

  update(request: UserRequest): Observable<User> {
    return this.http.put<User>(userRest.userService.UPDATE, request, {
      headers: this.headers(),
    });
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(userRest.userService.FIND_ALL, {
      headers: this.headers(),
    });
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${userRest.userService.FIND_BY_ID}/${id}`, {
      headers: this.headers(),
    });
  }
}
