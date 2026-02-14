import {User} from "../object/user";

interface UserRequestData {
  idUser: number;
  mail: string;
  name: string;
  password: string;
  profile: { idProfile: number };
  depot: { idDepot: number };
  area: { idArea: number };
  active: boolean;
}

export interface UserRequest {
  modelRequest?: UserRequestData;
  user?: User;
}
