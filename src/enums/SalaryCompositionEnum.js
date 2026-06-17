/**
 * Enum đại diện cho Loại thành phần (composition_type)
 * Nghiệp vụ 2,4,5 => không hiên trường định mức
*/
export const CompositionType = {
  EMPLOYEE_INFO: 1,    // Thông tin nhân viên
  TIMEKEEPING: 2,      // Chấm công x 
  SALES: 3,            // Doanh số
  KPI: 4,              // KPI x
  PRODUCT: 5,          // Sản phẩm x
  EARNING: 6,          // Lương
  TAX: 7,              // Thuế TNCN
  INSURANCE: 8,         // Bảo hiểm - Công đoàn
  OTHER: 9             // Khác 
};


/**
 * Tên hiển thị tương ứng với loại thành phần
 */
export const CompositionTypeName = {
  [CompositionType.EMPLOYEE_INFO]: 'Thông tin nhân viên',
  [CompositionType.TIMEKEEPING]: 'Chấm công',
  [CompositionType.SALES]: 'Doanh số',
  [CompositionType.KPI]: 'KPI',
  [CompositionType.PRODUCT]: 'Sản phẩm',
  [CompositionType.EARNING]: 'Lương',
  [CompositionType.TAX]: 'Thuế TNCN',
  [CompositionType.INSURANCE]: 'Bảo hiểm - Công đoàn',
  [CompositionType.OTHER]: 'Khác'
};

/**
 * Enum đại diện cho Tính chất (composition_nature)
 *  Nghiệp vụ: Thu nhập (1) thì hiẹn selection option taxable: chịu thuế, miễn thuế toàn phần, miễn một phần 
 *  Nghiệp vụ: Khấu trừ (2) thì hiẹn checkbox giảm trừ khi tính thuế:is_tax_deductible
 *  Nghiệp vụ: Thu nhập (3) thì không hiện ô input định mức và cho đổi được chọn kiểu giá trị, 
 *  nếu là 1 và 2 thì ô kiểu giá trị disable và mặc dịnh là tiền tệ 
*/
export const CompositionNature = {
  EARNING: 1,    // Thu nhập
  DEDUCTION: 2,  // Khấu trừ
  OTHER: 3       // Khác
};



/**
 * Enum đại diện cho Kiểu giá trị (value_type)
 * Nghiệp vụ: 1,2 thì phần giá trí được chọn 2 option, còn 3,4,5 thì chỉ được nhập giá trị là công thức formula  
 */
export const ValueType = {
  NUMBER: 1,     // Số
  CURRENCY: 2,   // Tiền tệ
  PERCENT: 3,    // Phần trăm
  TEXT: 4,       // Chữ
  DATE: 5        // Ngày
};

/**
 * Enum đại diện cho Đơn vị công tác (aggregation_scope)
 * Nghiệp vụ: chỉ khi chọn "Tự động cộng tông các giá trị của các thành viên" 
 * tức 'is_auto_sum_employee' =1 thì mới hiện option AggregationScope
 * 
 * 1,2 thì chỉ hiện source_salary_composition_id để chọn 
 * còn 3 thì hiện thêm option về cấp: organization_level
 * 
 */
export const AggregationScope = {
  SAME_DEPT: 1,       // Trong cùng đơn vị công tác
  SUBORDINATES: 2,    // Dưới quyền
  ORG_STRUCTURE: 3    // Thuộc cơ cấu tổ chức
};

/**
 * Enum đại diện cho Hiển thị trên phiếu lương (option_show_paycheck)
 */
export const OptionShowPaycheck = {
  NO: 0,
  YES: 1,
  NON_ZERO: 2
};

/**
 * Enum đại diện cho Trạng thái (status)
 */
export const Status = {
  ACTIVE: 1,
  INACTIVE: 2
};

/**
 * Enum đại diện cho Nguồn tạo (creation_source)
 */
export const CreationSource = {
  USER: 1,
  SYSTEM: 2
};
