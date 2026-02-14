import { Injectable } from '@angular/core';
import { Login } from '../domain/object/login';
import { LoginWebServiceImplements } from '../infrestructure/output_adapters/loginWebServiceImplements';
import { map, Observable } from 'rxjs';
import { ILoginService } from '../infrestructure/input_ports/ILoginService';
import { ILoginWebService } from '../infrestructure/output_ports/ILoginWebService';
import { LoginRequest } from '../domain/api/loginRequest';

@Injectable({
  providedIn: 'root',
})
export class LoginService implements ILoginService {

  public access: Login | undefined;

  public constructor(private readonly service: LoginWebServiceImplements) {}

  public validateAccess(request: LoginRequest): Observable<Login> {
    const serviceInstance: ILoginWebService = this.service;
    return serviceInstance.validateAccess(request).pipe(
      map((response) => {
        this.access = response;
        return this.access;
      })
    );
  }

}
