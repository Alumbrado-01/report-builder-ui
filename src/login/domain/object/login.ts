import {User} from "../../../user/domain/object/user";

export interface Login {
  token?: string;
  user?: User;
}
