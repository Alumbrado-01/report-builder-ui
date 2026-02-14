import { environment } from '../../../environment/environment';

export default {
  areaService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/areaController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/areaController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/areaController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/areaController/findById`,
  },
};
