import {Depot} from "../../../depot/domain/object/depot";
import {Material} from "../../../material/domain/object/material";
import {Status} from "../../../status/domain/object/status";

export interface Entry {
  idMaterialDepot?: number;
  depot?: Depot;
  material?: Material;
  stock?: number;
  status?: Status;
}
