//enviroment.serviceApiUrl
import {environment} from "../../../environment/environment";

export default {
  maintenanceService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/maintenanceController/findAll`,
    SAVE: `${environment.baseUrl}/dap/reportBuilder/v1/maintenanceController/save`,
    UPDATE: `${environment.baseUrl}/dap/reportBuilder/v1/maintenanceController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/reportBuilder/v1/maintenanceController/findById`,
  },
};
