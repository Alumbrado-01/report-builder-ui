import {Maintenance} from "../object/maintenance";
import {User} from "../../../user/domain/object/user";

export interface MaintenanceRequest {
  modelRequest?: Maintenance;
  user?: User;
}
