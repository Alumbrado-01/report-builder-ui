import {Zone} from "../../../zone/domain/object/zone";
import {Mayoralty} from "../../../mayoralty/domain/object/mayoralty";

export interface Road {
  idRoad?: number;
  name?: string;
  active?: boolean;
  zone?: Zone;
  mayoralty?: Mayoralty;
  rvpRvs?: boolean;
}
