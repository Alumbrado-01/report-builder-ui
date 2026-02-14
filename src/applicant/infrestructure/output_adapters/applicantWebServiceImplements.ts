import { Injectable } from '@angular/core';
import { IApplicantWebService } from '../output_ports/IApplicantWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import applicantRest from '../../domain/api/applicantRest';
import { Applicant } from '../../domain/object/applicant';
import { Observable } from 'rxjs';
import { ApplicantRequest } from '../../domain/api/applicantRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

@Injectable({
  providedIn: 'root',
})
export class ApplicantWebServiceImplements implements IApplicantWebService {

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

  create(request: ApplicantRequest): Observable<Applicant> {
    return this.http.post<Applicant>(applicantRest.applicantService.SAVE, request, {
      headers: this.headers(),
    });
  }

  update(request: ApplicantRequest): Observable<Applicant> {
    const urlBuild = applicantRest.applicantService.UPDATE;
    return this.http.put<Applicant>(urlBuild, request, { headers: this.headers() });
  }

  findAll(): Observable<Applicant[]> {
    const urlBuild = applicantRest.applicantService.FIND_ALL;
    return this.http.get<Applicant[]>(urlBuild, { headers: this.headers() });
  }

  findById(id: number): Observable<Applicant> {
    const urlBuild = `${applicantRest.applicantService.FIND_BY_ID}/${id}`;
    return this.http.get<Applicant>(urlBuild, { headers: this.headers() });
  }
}
