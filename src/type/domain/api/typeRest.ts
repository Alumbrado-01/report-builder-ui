//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  typeService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/typeController/findAll`,
    SAVE: `${environment.baseUrl}/dap/reportBuilder/v1/typeController/save`,
    UPDATE: `${environment.baseUrl}/dap/reportBuilder/v1/typeController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/reportBuilder/v1/typeController/findById`
  },
};
