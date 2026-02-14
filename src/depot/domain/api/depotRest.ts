//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  depotService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/depotController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/depotController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/depotController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/depotController/findById`,
  },
};
