//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  zoneService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/zoneController/findAll`,
    SAVE: `${environment.baseUrl}/dap/reportBuilder/v1/zoneController/save`,
    UPDATE: `${environment.baseUrl}/dap/reportBuilder/v1/zoneController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/reportBuilder/v1/zoneController/findById`,
  },
};
