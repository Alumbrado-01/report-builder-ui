import { Injectable } from '@angular/core';
import { ILoginWebService } from '../output_ports/ILoginWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../../domain/object/login';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../domain/api/loginRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';
import loginRest from "../../domain/api/loginRest";

@Injectable({
  providedIn: 'root',
})
export class LoginWebServiceImplements implements ILoginWebService {

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      h = h.set('Authorization', `Bearer ${token}`);
    }
    return h;
  }

  validateAccess(request: LoginRequest): Observable<Login> {
    return this.http.post<Login>(loginRest.loginService.VALIDATE_ACCESS, request, {
      headers: this.headers(),
    });
  }
}
