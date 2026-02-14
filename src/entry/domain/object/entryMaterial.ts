import {Material} from "../../../material/domain/object/material";
import {Status} from "../../../status/domain/object/status";
import {Entry} from "./entry";

export interface EntryMaterial {
  idMaterialManagementMaterial?: number;
  materialManagement?: Entry;
  material?: Material;
  quantity?: number;
  status?: Status;
}
