import { environment } from '../../../environment/environment';

export default {
  statusService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/StatusController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/StatusController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/StatusController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/StatusController/findById`,
  },
};
