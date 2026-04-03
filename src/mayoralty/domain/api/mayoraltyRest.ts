//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  mayoraltyService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/mayoraltyController/findAll`,
    SAVE: `${environment.baseUrl}dap/reportBuilder/v1/mayoraltyController/save`,
    UPDATE: `${environment.baseUrl}dap/reportBuilder/v1/mayoraltyController/update`,
    FIND_BY_ID: `${environment.baseUrl}dap/reportBuilder/v1/mayoraltyController/findById`,
  },
};
