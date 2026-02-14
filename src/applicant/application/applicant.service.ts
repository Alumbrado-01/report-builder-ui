import { Injectable } from '@angular/core';
import { Applicant } from '../domain/object/applicant';
import { ApplicantWebServiceImplements } from '../infrestructure/output_adapters/applicantWebServiceImplements';
import { map, Observable } from 'rxjs';
import { IApplicantService } from '../infrestructure/input_ports/IApplicantService';
import { IApplicantWebService } from '../infrestructure/output_ports/IApplicantWebService';
import { ApplicantRequest } from '../domain/api/applicantRequest';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService implements IApplicantService {
  public applicant: Applicant | undefined;
  public applicantList: Applicant[] = [];

  public constructor(private readonly service: ApplicantWebServiceImplements) {}

  public create(request: ApplicantRequest): Observable<Applicant> {
    const serviceInstance: IApplicantWebService = this.service;
    return serviceInstance.create(request).pipe(
      map((response) => {
        this.applicant = response;
        return this.applicant;
      })
    );
  }

  public update(request: ApplicantRequest): Observable<Applicant> {
    const serviceInstance: IApplicantWebService = this.service;
    return serviceInstance.update(request).pipe(
      map((response) => {
        this.applicant = response;
        return this.applicant;
      })
    );
  }

  public findAll(): Observable<Applicant[]> {
    const serviceInstance: IApplicantWebService = this.service;
    return serviceInstance.findAll().pipe(
      map((response) => {
        this.applicantList = response;
        return this.applicantList;
      })
    );
  }

  findById(id: number): Observable<Applicant> {
    const serviceInstance: IApplicantWebService = this.service;
    return serviceInstance.findById(id).pipe(
      map((response) => {
        this.applicant = response;
        return this.applicant;
      })
    );
  }
}
