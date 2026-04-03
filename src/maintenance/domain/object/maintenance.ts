import {User} from "../../../user/domain/object/user";
import {Road} from "../../../road/domain/object/road";
import {Activity} from "../../../activity/domain/object/activity";
import {Mayoralty} from "../../../mayoralty/domain/object/mayoralty";
import {Zone} from "../../../zone/domain/object/zone";
import {Program} from "../../../program/domain/object/program";
import {Type} from "../../../type/domain/object/type";

export interface Maintenance {
  idMaintenance?: number;
  date?: Date;
  user?: User;
  road?: Road;
  activity?: Activity;
  mayoralty?: Mayoralty;
  zone?: Zone;
  program?: Program;
  coordinateY?: string;
  coordinateX?: string;
  streetlights?: number;
  pedestrianLighting?: number;
  luminariesInService?: number;
  type?: Type;
}
