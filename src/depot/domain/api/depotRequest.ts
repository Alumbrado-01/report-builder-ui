import {User} from "../../../user/domain/object/user";

interface DepotRequestData {
  idDepot?: number;
  name: string;
  location: string;
  key: string;
  active: boolean;
}

export interface DepotRequest {
  modelRequest: DepotRequestData;
  user: User;
}
