//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  userService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/userController/findAll`,
    SAVE: `${environment.baseUrl}/dap/reportBuilder/v1/userController/save`,
    UPDATE: `${environment.baseUrl}/dap/reportBuilder/v1/userController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/reportBuilder/v1/userController/findById`,
  },
};
