import {Road} from "../object/road";
import {User} from "../../../user/domain/object/user";

export interface RoadRequest {
  modelRequest?: Road;
  user?: User;
}
