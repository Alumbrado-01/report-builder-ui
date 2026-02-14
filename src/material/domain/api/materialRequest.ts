import {User} from "../../../user/domain/object/user";
import {Material} from "../object/material";

export interface MaterialRequest {
  modelRequest?: Material;
  user?: User;
}
