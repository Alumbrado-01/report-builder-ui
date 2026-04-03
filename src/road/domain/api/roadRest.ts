//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  roadService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/roadController/findAll`,
    SAVE: `${environment.baseUrl}/dap/reportBuilder/v1/roadController/save`,
    UPDATE: `${environment.baseUrl}/dap/reportBuilder/v1/roadController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/reportBuilder/v1/roadController/findById`,
    FIND_BY_ZONE_AND_TYPE: `${environment.baseUrl}/dap/reportBuilder/v1/roadController/findActiveByZoneAndType`,
  },
};
