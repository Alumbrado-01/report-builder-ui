import {Mayoralty} from "../../../mayoralty/domain/object/mayoralty";

export interface Road {
  idRoad?: number;
  name?: string;
  active?: boolean;
  mayoralty?: Mayoralty;
  rvpRvs?: boolean;
}
