import {Applicant} from "../object/applicant";
import {User} from "../../../user/domain/object/user";

export interface ApplicantRequest {
  modelRequest: Applicant;
  user: User;
}
