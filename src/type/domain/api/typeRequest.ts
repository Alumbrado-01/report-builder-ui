import {User} from "../../../user/domain/object/user";
import {Type} from "../object/type";

export interface TypeRequest {
  modelRequest?: Type;
  user?: User;
}
