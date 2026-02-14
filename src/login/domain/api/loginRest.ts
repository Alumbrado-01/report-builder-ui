import { environment } from '../../../environment/environment';

export default {
  loginService: {
    VALIDATE_ACCESS: `${environment.baseUrl}/dap/reportBuilder/v1/accessController/auth`,
  },
};
