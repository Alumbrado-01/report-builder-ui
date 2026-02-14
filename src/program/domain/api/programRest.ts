//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  programService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/programController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/programController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/programController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/programController/findById`,
  },
};
