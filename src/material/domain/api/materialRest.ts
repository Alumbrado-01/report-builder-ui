import { environment } from '../../../environment/environment';

export default {
  materialService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/materialController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/materialController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/materialController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/materialController/findById`,
  },
};
