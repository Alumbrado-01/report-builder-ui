import {Zone} from "../object/zone";
import {User} from "../../../user/domain/object/user";

export interface ZoneRequest {
  modelRequest?: Zone;
  user?: User;
}
