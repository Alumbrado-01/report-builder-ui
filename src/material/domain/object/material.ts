import { Unit } from '../../../unit/domain/object/unit';
import { Depot } from '../../../depot/domain/object/depot';

export interface Material {
  idMaterial?: number;
  serialNumber?: string;
  description?: string;
  unit?: Unit;
  active?: boolean;
  depotList?: Depot[];
}
