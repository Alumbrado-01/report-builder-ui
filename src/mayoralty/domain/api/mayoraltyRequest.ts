import {Mayoralty} from "../object/mayoralty";
import {User} from "../../../user/domain/object/user";

export interface MayoraltyRequest {
  modelRequest: Mayoralty;
  user: User;
}
