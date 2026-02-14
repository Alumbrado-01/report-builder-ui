import {Activity} from "../object/activity";
import {User} from "../../../user/domain/object/user";

export interface ActivityRequest {
  modelRequest?: Activity;
  user?: User;
}
