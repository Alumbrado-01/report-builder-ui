import {Depot} from "../../../depot/domain/object/depot";
import {Area} from "../../../area/domain/object/area";

export interface ReportRequest {
  startDate?: Date;
  endDate?: Date;
  depot?: Depot
  area?: Area;
}
