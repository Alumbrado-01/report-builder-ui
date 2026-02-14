//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  activityService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/activityController/findAll`,
    SAVE: `${environment.baseUrl}/dap/reportBuilder/v1/activityController/save`,
    UPDATE: `${environment.baseUrl}/dap/reportBuilder/v1/activityController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/reportBuilder/v1/activityController/findById`,
  },
};
