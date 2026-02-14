import {Area} from "../../../area/domain/object/area";

export interface Applicant {
  idApplicant?: number;
  name?: string;
  area?: Area;
  active?: boolean;
}
