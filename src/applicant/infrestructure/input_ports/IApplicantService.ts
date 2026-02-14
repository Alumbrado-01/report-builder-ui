import { Observable } from 'rxjs';
import { Applicant } from '../../domain/object/applicant';
import { ApplicantRequest } from '../../domain/api/applicantRequest';

export abstract class IApplicantService {
  abstract create(request: ApplicantRequest): Observable<Applicant>;
  abstract update(request: ApplicantRequest): Observable<Applicant>;
  abstract findAll(): Observable<Applicant[]>;
  abstract findById(id: number): Observable<Applicant>;
}
