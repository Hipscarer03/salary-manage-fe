import BaseApi from '../../base/BaseApi'
import APIConfig from '../../config/APIConfig'

class SalaryCompositionUnitApi extends BaseApi {
  constructor() {
    super(APIConfig.SALARY_UNITS)
  }
}

export default new SalaryCompositionUnitApi()
