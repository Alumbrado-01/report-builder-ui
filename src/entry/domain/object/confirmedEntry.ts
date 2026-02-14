import {User} from "../../../user/domain/object/user";
import {Depot} from "../../../depot/domain/object/depot";
import {EntryMaterial} from "./entryMaterial";
import {Applicant} from "../../../applicant/domain/object/applicant";

export interface ConfirmedEntry {
  idMaterialManagement?: number;
  folio?: string;
  userDispatcher?: User;
  date?: Date;
  comment?: string;
  userReceiver?: Applicant;
  depot?: Depot;
  io?: boolean;
  materialList?: EntryMaterial[];
  applicantDocument?: string;
  serviceBoos?: string;
  jud?: string;
}
