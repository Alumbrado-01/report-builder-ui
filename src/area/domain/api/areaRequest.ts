import {User} from "../../../user/domain/object/user";

interface AreaRequestData {
  idArea?: number;
  name: string;
  active: boolean;
}

export interface AreaRequest {
  modelRequest: AreaRequestData;
  user: User;
}
