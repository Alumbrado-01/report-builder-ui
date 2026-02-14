import { environment } from '../../../environment/environment';
export default {
  logService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/logController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/logController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/logController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/logController/findById`,
    FIND_BY_TABLE_AND_ENTITY: `${environment.baseUrl}/dap/warehouse/v1/logController/findByTableAndEntity`,
  },
};
