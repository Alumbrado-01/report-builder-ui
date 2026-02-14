import { environment } from '../../../environment/environment';

export default {
  applicantService: {
    FIND_ALL: `${environment.baseUrl}/dap/warehouse/v1/applicantController/findAll`,
    SAVE: `${environment.baseUrl}/dap/warehouse/v1/applicantController/save`,
    UPDATE: `${environment.baseUrl}/dap/warehouse/v1/applicantController/update`,
    FIND_BY_ID: `${environment.baseUrl}/dap/warehouse/v1/applicantController/findById`,
  },
};
