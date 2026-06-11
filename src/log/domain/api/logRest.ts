import { environment } from '../../../environment/environment';
export default {
  logService: {
    FIND_ALL: `${environment.baseUrl}/dap/reportBuilder/v1/logController/findAll`,
    SAVE: `${environment.baseUrl}/dap/reportBuilder/v1/logController/save`,
    UPDATE: `${environment.baseUrl}/dap/reportBuilder/v1/logController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/reportBuilder/v1/logController/findById`,
    FIND_BY_TABLE_AND_ENTITY: `${environment.baseUrl}/dap/reportBuilder/v1/logController/findByTableAndEntity`,
  },
};
