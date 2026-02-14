import { environment } from '../../../environment/environment';

export default {
  unitService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/unitController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/unitController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/unitController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/unitController/findById`,
  },
};
