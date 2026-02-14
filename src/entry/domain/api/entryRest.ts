import { environment } from '../../../environment/environment';

export default {
  entryService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/materialDepotController/findAll`,
    FIND_BY_DEPOT_ID: `${environment.baseUrl}/dap/warehouse/v1/materialDepotController/findByDepot`,
    FIND_BY_MATERIAL_ID: `${environment.baseUrl}/dap/warehouse/v1/materialDepotController/findByMaterial`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/materialManagementController/save`,
    FIND_REPORT: `${environment.baseUrl}/dap/warehouse/v1/materialManagementController/findReport`,
  },
};
