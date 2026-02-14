//enviroment.serviceApiUrl
import { environment } from '../../../environment/environment';

export default {
  profileService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/ProfileController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/ProfileController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/ProfileController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/ProfileController/findById`,
  },
};
