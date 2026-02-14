import {Program} from "../object/program";
import {User} from "../../../user/domain/object/user";

export interface ProgramRequest {
  modelRequest?: Program;
  user?: User;
}
