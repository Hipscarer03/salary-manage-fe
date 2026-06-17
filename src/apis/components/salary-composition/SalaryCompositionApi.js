import BaseApi from '../../base/BaseApi'
import APIConfig from '../../config/APIConfig'

function mapToFrontend(item) {
  if (!item) return null
  return {
    salaryCompositionId: item.salaryCompositionId,
    salaryCompositionName: item.salaryCompositionName,
    salaryCompositionCode: item.salaryCompositionCode,
    salaryCompositionType: item.compositionType ? parseInt(item.compositionType, 10) : null,
    salaryCompositionNature: item.compositionNature ? parseInt(item.compositionNature, 10) : 1,
    isTaxable: item.taxable === 1 ? 0 : (item.taxable === 0 ? 1 : (item.taxable === 2 ? 2 : 0)),
    quotaFormula: item.quotaFormula || '',
    allowOverQuota: item.allowToExceedQuota === 1,
    valueType: item.valueType ?? 2,
    valueOption: item.isAutoSumEmployee ?? 0,
    sumGroup: item.autoSumEmployeeType ?? 1,
    valueFormula: item.formula || '',
    description: item.description || '',
    displayOnPayslip: item.optionShowPaycheck ?? 1,
    unitId: item.organizationUnitId,
    unitIds: item.organizationUnitIds || (item.organizationUnitId ? [item.organizationUnitId] : []),
    unitName: item.organizationUnitName || '',
    isTaxDeductible: item.isTaxDeductible === 1,
    creationSource: item.creationSource ?? 1,
    status: item.status ?? 1
  }
}

function mapToBackend(item) {
  if (!item) return null
  return {
    salaryCompositionId: item.salaryCompositionId || '00000000-0000-0000-0000-000000000000',
    salaryCompositionName: item.salaryCompositionName,
    salaryCompositionCode: item.salaryCompositionCode,
    compositionType: item.salaryCompositionType ? parseInt(item.salaryCompositionType, 10) : null,
    compositionNature: item.salaryCompositionNature ? parseInt(item.salaryCompositionNature, 10) : 1,
    taxable: typeof item.isTaxable === 'number' ? item.isTaxable : (item.isTaxable === 'taxable' || item.isTaxable === true ? 0 : (item.isTaxable === 'exempt_full' || item.isTaxable === false ? 1 : 2)),
    quotaFormula: item.quotaFormula,
    allowToExceedQuota: item.allowOverQuota ? 1 : 0,
    valueType: item.valueType === 'currency' || item.valueType === 2 ? 2 : (item.valueType === 'number' || item.valueType === 1 ? 1 : (item.valueType === 'percent' || item.valueType === 3 ? 3 : (item.valueType === 'text' || item.valueType === 4 ? 4 : (item.valueType === 'date' || item.valueType === 5 ? 5 : 2)))),
    isAutoSumEmployee: item.valueOption === 'sum' || item.valueOption === 1 ? 1 : 0,
    autoSumEmployeeType: item.sumGroup === 'same_dept' || item.sumGroup === 1 ? 1 : (item.sumGroup === 'subordinates' || item.sumGroup === 2 ? 2 : (item.sumGroup === 'org_structure' || item.sumGroup === 3 ? 3 : 1)),
    formula: item.valueFormula,
    description: item.description,
    optionShowPaycheck: item.displayOnPayslip === 'yes' || item.displayOnPayslip === 1 ? 1 : (item.displayOnPayslip === 'no' || item.displayOnPayslip === 0 ? 0 : 2),
    organizationUnitId: item.unitIds && item.unitIds.length > 0 ? item.unitIds[0] : (item.unitId || null),
    organizationUnitIds: item.unitIds || (item.unitId ? [item.unitId] : []),
    organizationUnitName: item.unitName,
    isTaxDeductible: item.isTaxDeductible ? 1 : 0,
    creationSource: item.creationSource === 'Hệ thống' || item.creationSource === 2 ? 2 : 1,
    status: item.status === 'inactive' || item.status === 2 ? 2 : 1
  }
}

class SalaryCompositionApi extends BaseApi {
  constructor() {
    super(APIConfig.SALARY_COMPOSITIONS)
  }

  getDetail(id) {
    return this.getById(id).then(res => {
      if (res && res.data) {
        return {
          ...res,
          data: mapToFrontend(res.data)
        }
      }
      return res
    })
  }

  getNewCode(name) {
    return this.axiosInstance.get(`${this.endpoint}/GetNewCode`, { params: { name } })
  }

  checkDuplicateCode(code, id) {
    return this.axiosInstance.get(`${this.endpoint}/CheckDuplicateCode`, { params: { code, id } })
  }

  getAllCodes() {
    return this.axiosInstance.get(`${this.endpoint}/AllCodes`)
  }

  getSystemPaging(params) {
    return this.axiosInstance.get(`${this.endpoint}/SystemFilter`, {
      params: {
        pageSize: params.PageSize || params.pageSize,
        pageNumber: params.PageNumber || params.pageNumber,
        search: params.Search || params.search,
        category: params.Category || params.category,
        sort: params.Sort || params.sort
      }
    }).then(res => {
      if (res && res.data) {
        return {
          ...res,
          data: {
            totalRecords: res.data.totalRecords || 0,
            data: (res.data.data || []).map(mapToFrontend)
          }
        }
      }
      return res
    })
  }

  getPaging(params) {
    return this.axiosInstance.get(`${this.endpoint}/Filter`, {
      params: {
        pageSize: params.PageSize || params.pageSize,
        pageNumber: params.PageNumber || params.pageNumber,
        search: params.Search || params.search,
        sort: params.Sort || params.sort,
        status: params.Status === 1 ? 'active' : (params.Status === 2 ? 'inactive' : params.Status),
        unitIds: params.UnitIds || params.unitIds
      }
    }).then(res => {
      if (res && res.data) {
        return {
          ...res,
          data: {
            totalRecords: res.data.totalRecords || 0,
            data: (res.data.data || []).map(mapToFrontend)
          }
        }
      }
      return res
    })
  }

  create(payload) {
    const backendData = mapToBackend(payload)
    return super.create(backendData).then(res => {
      if (res && res.data) {
        return {
          ...res,
          data: mapToFrontend(res.data)
        }
      }
      return res
    })
  }

  update(id, payload) {
    const backendData = mapToBackend(payload)
    return super.update(id, backendData).then(res => {
      if (res && res.data) {
        return {
          ...res,
          data: mapToFrontend(res.data)
        }
      }
      return res
    })
  }

  updateStatus(ids, status) {
    return this.axiosInstance.patch(`${this.endpoint}/UpdateStatus`, { ids, status })
  }

  deleteMany(ids) {
    return this.axiosInstance.patch(`${this.endpoint}/DeleteMany`, { ids })
  }
}

export default new SalaryCompositionApi()
