import { Depot } from '../../../depot/domain/object/depot';
import { Profile } from '../../../user_profile/domain/object/profile';
import { Area } from '../../../area/domain/object/area';
import {Zone} from "../../../zone/domain/object/zone";

export interface User {
  idUser: number;
  mail: string;
  name: string;
  password: string;
  profile: Profile | null;
  area: Area | null;
  depotList?: Depot[];
  active: boolean;
  zoneList?: Zone[];
}
