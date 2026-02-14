import { Injectable } from '@angular/core';
import { User } from '../domain/object/user';
import { UserWebServiceImplements } from '../infrestructure/output_adapters/userWebServiceImplement';
import { catchError, map, Observable, of } from 'rxjs';
import { IUserService } from '../infrestructure/input_ports/IUserService';
import { UserRequest } from '../domain/api/userRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService implements IUserService {
  public user!: User;
  public userList: User[] = [];

  constructor(
    private readonly service: UserWebServiceImplements)
  {}

  create(request: UserRequest): Observable<User> {
    return this.service.create(request).pipe(
      map((response) => (this.user = response)),
      catchError((e) => {
        console.error(e);
        return of({} as User);
      })
    );
  }

  update(request: UserRequest): Observable<User> {
    return this.service.update(request).pipe(
      map((response) => (this.user = response)),
      catchError((e) => {
        console.error(e);
        return of({} as User);
      })
    );
  }

  findAll(): Observable<User[]> {
    return this.service.findAll().pipe(
      map((response) => (this.userList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as User[]);
      })
    );
  }

  findById(id: number): Observable<User> {
    return this.service.findById(id).pipe(
      map((response) => (this.user = response)),
      catchError((e) => {
        console.error(e);
        return of({} as User);
      })
    );
  }
}
