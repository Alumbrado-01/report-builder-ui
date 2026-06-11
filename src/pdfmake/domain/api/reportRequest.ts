import {User} from "../../../user/domain/object/user";
import {Road} from "../../../road/domain/object/road";
import {Activity} from "../../../activity/domain/object/activity";
import {Mayoralty} from "../../../mayoralty/domain/object/mayoralty";
import {Type} from "../../../type/domain/object/type";
import {Program} from "../../../program/domain/object/program";
import {Zone} from "../../../zone/domain/object/zone";

export interface ReportRequest {
  user?: User;
  startDate?: Date;
  endDate?: Date;
  road?: Road;
  activity?: Activity;
  mayoralty?: Mayoralty;
  zone?: Zone;
  program?: Program;
  type?: Type;
}
