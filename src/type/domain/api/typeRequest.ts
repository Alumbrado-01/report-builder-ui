import {Type} from "../object/type";
import {User} from "../../../user/domain/object/user";

export interface TypeRequest {
  modelRequest?: Type;
  user?: User;
}
