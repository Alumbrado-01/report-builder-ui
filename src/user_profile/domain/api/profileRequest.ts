interface ProfileRequestData {
  idProfile: number;
  profile: string;
  active: boolean;
}

export interface ProfileRequest {
  modelRequest?: ProfileRequestData;
}

// import { Maintenance } from '../object/user';

// export interface MaintenanceRequest {
//   modelRequest?: Maintenance;
//   userRequest?: string;
// }
