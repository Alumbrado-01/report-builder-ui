import {User} from "../../../user/domain/object/user";

export interface Log {
  idLog?: number;
  date?: Date;
  operation?: string;
  table?: string;
  entity?: number;
  user?: User
}
