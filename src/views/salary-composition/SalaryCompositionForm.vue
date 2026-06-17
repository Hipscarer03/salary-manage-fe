<template>
  <div class="salary-composition-form">
    <!-- Header -->
    <div class="salary-composition-form-header">
      <div class="salary-composition-form-back-btn" @click="handleExit" title="Quay lại">
        <i></i>
      </div>
      <div class="salary-composition-form-title">
        {{ isDuplicate || !editData ? 'Thêm thành phần' : 'Sửa thành phần' }}
      </div>
    </div>

    <!-- Body (Scrollable Form) -->
    <div class="salary-composition-form-body">
      <div class="salary-composition-form-section">
        <!-- Tên thành phần -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Tên thành phần <span>*</span></div>
          <div class="salary-composition-form-input-wrapper">
            <ms-input
              v-model="formData.salaryCompositionName"
              @blur="handleNameBlur"
              :error="errors.salaryCompositionName"
              maxlength="255"
              placeholder="Nhập tên thành phần"
            />
          </div>
        </div>

        <!-- Mã thành phần -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Mã thành phần <span>*</span></div>
          <div class="salary-composition-form-input-wrapper">
            <ms-input
              v-model="formData.salaryCompositionCode"
              :disabled="!!editData && !isDuplicate"
              :error="errors.salaryCompositionCode"
              class="w-300"
              maxlength="50"
              placeholder="Nhập mã viết liền"
              @blur="handleCodeBlur"
            />
          </div>
        </div>

        <!-- Đơn vị áp dụng -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Đơn vị áp dụng <span>*</span></div>
          <div class="salary-composition-form-input-wrapper">
            <div style="width: 100%; display: flex; flex-direction: column">
              <dx-drop-down-box
                v-model:value="formData.unitIds"
                value-expr="unitId"
                display-expr="unitName"
                placeholder="Chọn đơn vị áp dụng"
                :show-clear-button="true"
                :data-source="treeDataSource"
                style="max-width: 350px; background-color: #ffffff; border-radius: 8px"
                class="tree-dropdown-box"
                :class="{ 'error-border': errors.unitId }"
                field-template="field"
              >
                <!-- Hiện giá trị đã chọn -->
                <template #field="{ value }">
                  <div class="unit-tag-field">
                    <dx-text-box style="display: none" />
                    <!-- <span v-if="topSelectedUnits.length" class="unit-count-badge">
                      {{ topSelectedUnits.length }}
                    </span> -->
                    <div class="unit-tag-container">
                      <span
                        v-for="unit in topSelectedUnits.slice(-1)"
                        :key="unit.unitId"
                        class="unit-tag"
                      >
                        {{ unit.unitName }}
                        <span
                          class="unit-tag-remove"
                          @click.stop="removeUnit(unit.unitId)"
                          title="Xóa"
                          >×</span
                        >
                      </span>
                      <span v-if="!topSelectedUnits.length" class="unit-placeholder"
                        >Chọn đơn vị áp dụng</span
                      >
                    </div>
                  </div>
                </template>

                <template #content>
                  <div class="tree-dropdown-content">
                    <div class="tree-view-wrapper">
                      <dx-tree-view
                        ref="treeViewRef"
                        :data-source="treeDataSource"
                        data-structure="plain"
                        key-expr="unitId"
                        parent-id-expr="parentUnitId"
                        display-expr="unitName"
                        selection-mode="multiple"
                        show-check-boxes-mode="normal"
                        :select-nodes-recursive="true"
                        :select-by-click="true"
                        :selected-item-keys="formData.unitIds"
                        @item-selection-changed="
                          (e) => (formData.unitIds = e.component.getSelectedNodeKeys())
                        "
                      />
                    </div>
                    <div v-if="!hideUnitFooter" class="tree-dropdown-footer">
                      <label class="inactive-checkbox-label">
                        <input type="checkbox" v-model="showInactiveUnits" />
                        Hiển thị đơn vị ngừng theo dõi
                      </label>
                    </div>
                  </div>
                </template>
              </dx-drop-down-box>
              <div v-if="showUnitError" class="unit-input__error">{{ errors.unitId }}</div>
            </div>
          </div>
        </div>

        <!-- Loại thành phần -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Loại thành phần <span>*</span></div>
          <div class="salary-composition-form-input-wrapper">
            <ms-combobox
              v-model="formData.salaryCompositionType"
              :options="compositionTypeOptions"
              class="w-100"
              :error="errors.salaryCompositionType"
            />
          </div>
        </div>

        <!-- Tính chất & Chịu thuế / Giảm trừ -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Tính chất <span>*</span></div>
          <div
            class="salary-composition-form-input-wrapper flex-wrap"
            style="align-items: center; gap: 20px"
          >
            <ms-select
              v-model="formData.salaryCompositionNature"
              :options="[
                { label: 'Thu nhập', value: 1 },
                { label: 'Khấu trừ', value: 2 },
                { label: 'Khác', value: 3 },
              ]"
              class="w-300"
              :error="errors.salaryCompositionNature"
            />
            <!-- Radio Group chịu thuế: Chỉ hiện khi chọn Thu nhập (1) -->
            <div v-if="formData.salaryCompositionNature === 1" class="radio-group">
              <a-radio-group v-model:value="formData.isTaxable">
                <a-radio :value="0">Chịu thuế</a-radio>
                <a-radio :value="1">Miễn thuế toàn phần</a-radio>
                <a-radio :value="2">Miễn thuế một phần</a-radio>
              </a-radio-group>
            </div>
            <!-- Checkbox giảm trừ: Chỉ hiện khi chọn Khấu trừ (2) -->
            <div v-if="formData.salaryCompositionNature === 2" class="checkbox-group">
              <a-checkbox v-model:checked="formData.isTaxDeductible">
                Giảm trừ khi tính thuế
              </a-checkbox>
            </div>
          </div>
        </div>

        <!-- Định mức -->
        <div
          v-if="
            formData.salaryCompositionType !== CompositionType.TIMEKEEPING &&
            formData.salaryCompositionType !== CompositionType.KPI &&
            formData.salaryCompositionType !== CompositionType.PRODUCT
          "
          class="salary-composition-form-row"
        >
          <div class="salary-composition-form-label">Định mức</div>
          <div
            class="salary-composition-form-input-wrapper flex-column align-start"
            style="gap: 8px"
          >
            <textarea
              v-model="formData.quotaFormula"
              class="ant-input formula-textarea"
              placeholder="Tự động gợi ý công thức và tham số khi gõ"
              style="height: 80px; width: 100%"
            ></textarea>
            <div class="checkbox-group" style="display: flex; align-items: center; gap: 8px">
              <a-checkbox v-model:checked="formData.allowOverQuota">
                Cho phép giá trị tính vượt quá định mức
              </a-checkbox>
              <i class="icon-info-gray" title="Thông tin thêm"></i>
            </div>
          </div>
        </div>

        <!-- Kiểu giá trị -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Kiểu giá trị</div>
          <div class="salary-composition-form-input-wrapper">
            <ms-select
              v-model="formData.valueType"
              :options="[
                { label: 'Số', value: 1 },
                { label: 'Tiền tệ', value: 2 },
                { label: 'Phần trăm', value: 3 },
                { label: 'Chữ', value: 4 },
                { label: 'Ngày', value: 5 },
              ]"
              class="w-300"
            />
          </div>
        </div>

        <!-- Giá trị -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Giá trị</div>
          <div
            class="salary-composition-form-input-wrapper flex-column align-start"
            style="gap: 12px"
          >
            <a-radio-group
              v-model:value="formData.valueOption"
              class="flex-column align-start gap-12"
              style="width: 100%; display: flex; flex-direction: column"
            >
              <!-- Option 1 -->
              <div class="value-option-row" style="display: flex; flex-direction: column">
                <a-radio :value="1">Tự động cộng tổng giá trị của các nhân viên</a-radio>
                <div
                  style="margin-top: 10px; display: flex; align-items: center; gap: 8px"
                >
                  <ms-select
                    v-model="formData.sumGroup"
                    :options="[
                      { label: 'Trong cùng đơn vị công tác', value: 1 },
                      { label: 'Dưới quyền', value: 2 },
                      { label: 'Thuộc cơ cấu tổ chức', value: 3 },
                    ]"
                    class="w-300"
                    :disabled="formData.valueOption !== 1"
                  />
                  <i class="icon-info-gray" title="Thông tin thêm"></i>
                </div>
              </div>
              <!-- Option 2 -->
              <div class="value-option-row" style="display: flex; flex-direction: column">
                <a-radio :value="0">Tính theo công thức tự đặt</a-radio>
                <div
                  v-if="formData.valueOption === 0"
                  class="formula-container"
                  style="margin-top: 10px; position: relative; width: calc(100% - 24px)"
                >
                  <textarea
                    v-model="formData.valueFormula"
                    class="ant-input formula-textarea"
                    placeholder="Tự động gợi ý công thức và tham số khi gõ"
                    style="height: 120px; width: 100%; padding-right: 48px"
                  ></textarea>
                </div>
              </div>
            </a-radio-group>
          </div>
        </div>

        <!-- Mô tả -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Mô tả</div>
          <div class="salary-composition-form-input-wrapper">
            <textarea
              v-model="formData.description"
              class="ant-input formula-textarea"
              placeholder="Nhập thông tin mô tả"
              style="height: 80px"
            ></textarea>
          </div>
        </div>

        <!-- Hiển thị trên phiếu lương -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Hiển thị trên phiếu lương</div>
          <div class="salary-composition-form-input-wrapper">
            <a-radio-group v-model:value="formData.displayOnPayslip">
              <a-radio :value="1">Có</a-radio>
              <a-radio :value="0">Không</a-radio>
              <a-radio :value="2">Chỉ hiển thị nếu giá trị khác 0</a-radio>
            </a-radio-group>
          </div>
        </div>

        <!-- Nguồn tạo -->
        <div class="salary-composition-form-row">
          <div class="salary-composition-form-label">Nguồn tạo</div>
          <div class="salary-composition-form-input-wrapper">
            <ms-input :model-value="creationSourceLabel" disabled class="w-300" />
          </div>
        </div>

        <!-- Trạng thái -->
        <div v-if="editData && !isDuplicate" class="salary-composition-form-row">
          <div class="salary-composition-form-label">Trạng thái</div>
          <div class="salary-composition-form-input-wrapper">
            <ms-select
              v-model="formData.status"
              :options="[
                { label: 'Đang theo dõi', value: 1 },
                { label: 'Ngừng theo dõi', value: 2 },
              ]"
              class="w-300"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="salary-composition-form-footer">
      <ms-button type="secondary" @click="handleExit" class="btn-cancel">Hủy bỏ</ms-button>
      <ms-button type="secondary" @click="handleSaveAndAdd" class="btn-save-add"
        >Lưu và thêm</ms-button
      >
      <ms-button class="btn-save-primary" @click="handleSubmit">Lưu</ms-button>
    </div>

    <!-- Exit Confirmation Modal -->
    <div
      v-if="showExitModal"
      class="confirm-modal confirm-exit-modal"
      @click.self="showExitModal = false"
    >
      <div class="confirm-modal-content">
        <div class="confirm-modal-header">
          <div class="confirm-modal-title">Thoát và không lưu?</div>
          <span class="confirm-modal-close" @click="showExitModal = false">&times;</span>
        </div>
        <div class="confirm-modal-body-text">
          Nếu bạn thoát, các dữ liệu đang nhập liệu sẽ không được lưu lại.
        </div>
        <div class="confirm-modal-footer-custom">
          <ms-button type="secondary" @click="showExitModal = false" class="btn-stay"
            >Ở lại</ms-button
          >
          <ms-button type="primary" class="btn-exit" @click="$emit('close')"
            >Thoát, không lưu</ms-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import MsButton from '@/components/control/MsButton.vue'
import MsInput from '@/components/control/MsInput.vue'
import MsSelect from '@/components/control/MsSelect.vue'
import MsCombobox from '@/components/control/MsCombobox.vue'
import DxDropDownBox from 'devextreme-vue/drop-down-box'
import DxTreeView from 'devextreme-vue/tree-view'
import DxTextBox from 'devextreme-vue/text-box'
import SalaryCompositionApi from '@/apis/components/salary-composition/SalaryCompositionApi'
import SalaryCompositionUnitApi from '@/apis/components/salary-composition/SalaryCompositionUnitApi'
import { CompositionType, CompositionTypeName } from '@/enums/SalaryCompositionEnum'

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
  editData: Object,
  isDuplicate: Boolean,
  hideUnitFooter: {
    type: Boolean,
    default: false,
  },
})

const showExitModal = ref(false)
const initialDataString = ref('')

let formData = reactive({
  salaryCompositionId: null,
  salaryCompositionType: null, //loại thành phần
  salaryCompositionCode: '',
  salaryCompositionName: '',
  unitId: null,
  unitIds: [],
  isTaxable: 0,
  description: '',
  salaryCompositionNature: 1,
  isTaxDeductible: false,
  status: 1,

  // New payroll fields
  quotaFormula: '',
  allowOverQuota: false,
  valueType: 2,
  valueOption: 0,
  sumGroup: 1,
  valueFormula: '',
  displayOnPayslip: 1,
  creationSource: 1,
})

const treeViewRef = ref(null)
const showInactiveUnits = ref(false)
const rawUnits = ref([])

const treeDataSource = computed(() => {
  if (showInactiveUnits.value) {
    return rawUnits.value
  }
  return rawUnits.value.filter((u) => u.isDeleted !== 1)
})

const getSelectedUnitNames = computed(() => {
  if (!formData.unitIds || !formData.unitIds.length) return ''
  return formData.unitIds
    .map((id) => rawUnits.value.find((u) => u.unitId === id)?.unitName)
    .filter(Boolean)
    .join(', ')
})

// Lấy danh sách đơn vị cha cấp cao nhất đã được chọn
const topSelectedUnits = computed(() => {
  if (!formData.unitIds?.length) return []
  const selectedSet = new Set(formData.unitIds)
  return rawUnits.value.filter((u) => selectedSet.has(u.unitId) && !selectedSet.has(u.parentUnitId))
})
const showUnitError = computed(() => errors.unitId !== '')

// Xóa một đơn vị và tất cả con của nó
// const removeUnit = (unitId) => {
//   const toRemove = new Set()
//   const markDescendants = (id) => {
//     toRemove.add(id)
//     rawUnits.value
//       .filter((u) => u.parentUnitId === id)
//       .forEach((child) => markDescendants(child.unitId))
//   }
//   markDescendants(unitId)
//   formData.unitIds = formData.unitIds.filter((id) => !toRemove.has(id))
// }

const compositionTypeOptions = computed(() => {
  return Object.entries(CompositionType).map(([key, val]) => ({
    label: CompositionTypeName[val],
    value: val,
  }))
})

const unitOptions = computed(() => {
  return rawUnits.value.map((u) => ({
    label: u.unitName,
    value: u.unitId,
  }))
})

watch(
  () => formData.unitId,
  (newId) => {
    formData.unitIds = newId ? [newId] : []
  }
)

const creationSourceLabel = computed(() => {
  return formData.creationSource === 2 ? 'Mặc định' : 'Tự thêm'
})

/**
 * Lấy dữ liệu danh mục từ API (Đơn vị, Nhóm)
 */
const fetchReferenceData = async () => {
  try {
    const unitsRes = await SalaryCompositionUnitApi.getAll()
    rawUnits.value = unitsRes.data
    // ?
    formData.unitIds = formData.unitIds.filter((id) => rawUnits.value.some((u) => u.unitId === id))
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu don vi:', error)
  }
}

onMounted(() => {
  fetchReferenceData()
})

const errors = reactive({
  salaryCompositionName: '',
  salaryCompositionCode: '',
  unitId: '',
  salaryCompositionType: '',
  salaryCompositionNature: '',
})

/**
 * Kiểm tra tính hợp lệ của dữ liệu trên form
 * @returns {Promise<boolean>} Kết quả kiểm tra
 */
const validate = async () => {
  let isValid = true
  errors.salaryCompositionName = ''
  errors.salaryCompositionCode = ''
  errors.unitId = ''
  errors.salaryCompositionType = ''
  errors.salaryCompositionNature = ''

  console.log('Validating form data:', errors)

  if (!formData.salaryCompositionName) {
    errors.salaryCompositionName = 'Tên thành phần không được để trống'
    isValid = false
  } else if (formData.salaryCompositionName.length > 255) {
    errors.salaryCompositionName = 'Tên thành phần không quá 255 ký tự'
    isValid = false
  }

  if (!formData.salaryCompositionCode) {
    errors.salaryCompositionCode = 'Mã thành phần không được để trống'
    isValid = false
  } else if (formData.salaryCompositionCode.length > 255) {
    errors.salaryCompositionCode = 'Mã thành phần không quá 255 ký tự'
    isValid = false
  } else {
    // Kiểm tra trùng mã từ API
    const isDuplicateCode = await checkCodeDuplicate()
    if (isDuplicateCode) {
      errors.salaryCompositionCode = 'Mã thành phần đã tồn tại'
      isValid = false
    }
  }

  if (!formData.unitIds || formData.unitIds.length === 0) {
    errors.unitId = 'Đơn vị áp dụng không được để trống'
    isValid = false
  }

  if (!formData.salaryCompositionType) {
    errors.salaryCompositionType = 'Loại thành phần không được để trống'
    isValid = false
  }

  if (!formData.salaryCompositionNature) {
    errors.salaryCompositionNature = 'Tính chất không được để trống'
    isValid = false
  }

  return isValid
}

watch(
  () => formData.unitIds,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      errors.unitId = '' // Xóa thông báo lỗi ngay lập tức
    }
  },
  { deep: true }
)

/**
 * Xử lý sự kiện blur ô tên món để tự động sinh mã món
 */
const handleNameBlur = async () => {
  if (
    formData.salaryCompositionName &&
    formData.salaryCompositionName !== lastFetchedName.value &&
    !props.editData
  ) {
    try {
      const res = await SalaryCompositionApi.getNewCode(formData.salaryCompositionName)
      if (res && res.data) {
        formData.salaryCompositionCode = res.data
        lastFetchedName.value = formData.salaryCompositionName
      }
    } catch (e) {
      console.error('Lỗi khi lấy mã mới:', e)
    }
  }
}

const lastFetchedName = ref('')

/**
 * Kiểm tra mã món ăn có bị trùng hay không
 * @returns {Promise<boolean>} Trả về true nếu mã bị trùng
 */
const checkCodeDuplicate = async () => {
  if (!formData.salaryCompositionCode) return false
  try {
    const idToCheck = props.isDuplicate ? null : formData.salaryCompositionId
    const res = await SalaryCompositionApi.checkDuplicateCode(
      formData.salaryCompositionCode,
      idToCheck
    )
    return res && res.data === true
  } catch (e) {
    console.error('Lỗi khi kiểm tra trùng mã:', e)
    return false
  }
}

/**
 * Xử lý sự kiện blur ô mã món để kiểm tra trùng lặp ngay lập tức
 */
const handleCodeBlur = async () => {
  const isDuplicateCode = await checkCodeDuplicate()
  if (isDuplicateCode) {
    errors.salaryCompositionCode = 'Mã thành phần đã tồn tại'
  } else {
    errors.salaryCompositionCode = ''
  }
}

/**
 * Kiểm tra xem dữ liệu trên form đã bị thay đổi so với ban đầu chưa để hiện modal cảnh báo người dùng
 * @return {boolean} true nếu dữ liệu đã bị thay đổi, false nếu không
 */
const isDirty = computed(() => {
  if (!initialDataString.value) return false
  const currentDataString = JSON.stringify(formData)
  return initialDataString.value !== currentDataString
})

/**
 * Xử lý sự kiện khi nhấn nút Hủy/Thoát
 */
const handleExit = () => {
  if (isDirty.value) {
    showExitModal.value = true
  } else {
    emit('close')
  }
}

/**
 * Xử lý gửi form lên component cha
 */
const handleSubmit = async () => {
  if (await validate()) {
    emit('submit', { ...formData })
    console.log('Form data to submit:', formData)
  }
}

/**
 * Xử lý Lưu và Thêm mới (tiếp tục nhập liệu sau khi lưu)
 */
const handleSaveAndAdd = async () => {
  if (await validate()) {
    emit('submit', { ...formData, isSaveAndAdd: true })
  }
}

/**
 * Làm mới toàn bộ dữ liệu trên form về trạng thái mặc định
 */
const clearForm = () => {
  formData.salaryCompositionId = null
  formData.salaryCompositionType = 1
  formData.salaryCompositionCode = ''
  formData.salaryCompositionName = ''
  formData.unitId = null
  formData.unitIds = []
  formData.isTaxable = 0
  formData.description = ''

  formData.isTaxDeductible = false
  formData.status = 1
  formData.quotaFormula = ''
  formData.allowOverQuota = false
  formData.valueType = 2
  formData.valueOption = 0
  formData.sumGroup = 1
  formData.valueFormula = ''
  formData.displayOnPayslip = 1
  formData.creationSource = 1
}

watch(
  () => props.editData,
  (val) => {
    if (val) {
      formData.salaryCompositionId = props.isDuplicate
        ? null
        : val.salaryCompositionId || val.SalaryCompositionId || null
      formData.salaryCompositionType =
        val.salaryCompositionType ?? val.SalaryCompositionType ?? null
      formData.salaryCompositionCode = val.salaryCompositionCode || val.SalaryCompositionCode || ''
      formData.salaryCompositionName = val.salaryCompositionName || val.SalaryCompositionName || ''
      formData.salaryCompositionNature =
        val.salaryCompositionNature ?? val.SalaryCompositionNature ?? 1
      formData.unitId = val.unitId || val.UnitId || null
      formData.unitIds =
        val.unitIds || val.UnitIds || (val.unitId || val.UnitId ? [val.unitId || val.UnitId] : [])

      // Map legacy values to int
      if (val.isTaxable === 'taxable') formData.isTaxable = 0
      else if (val.isTaxable === 'exempt_full') formData.isTaxable = 1
      else if (val.isTaxable === 'exempt_partial') formData.isTaxable = 2
      else formData.isTaxable = val.isTaxable ?? 0

      formData.description = val.description || val.Description || ''
      formData.isTaxDeductible = val.isTaxDeductible ?? val.IsTaxDeductible ?? false

      if (val.status === 'active') formData.status = 1
      else if (val.status === 'inactive') formData.status = 2
      else formData.status = val.status ?? 1

      formData.quotaFormula = val.quotaFormula ?? ''
      formData.allowOverQuota = val.allowOverQuota ?? false

      if (val.valueType === 'number') formData.valueType = 1
      else if (val.valueType === 'currency') formData.valueType = 2
      else if (val.valueType === 'percent') formData.valueType = 3
      else if (val.valueType === 'text') formData.valueType = 4
      else if (val.valueType === 'date') formData.valueType = 5
      else formData.valueType = val.valueType ?? 2

      if (val.valueOption === 'sum') formData.valueOption = 1
      else if (val.valueOption === 'formula') formData.valueOption = 0
      else formData.valueOption = val.valueOption ?? 0

      if (val.sumGroup === 'same_dept') formData.sumGroup = 1
      else if (val.sumGroup === 'subordinates') formData.sumGroup = 2
      else if (val.sumGroup === 'org_structure') formData.sumGroup = 3
      else formData.sumGroup = val.sumGroup ?? 1

      formData.valueFormula = val.valueFormula ?? ''

      if (val.displayOnPayslip === 'yes') formData.displayOnPayslip = 1
      else if (val.displayOnPayslip === 'no') formData.displayOnPayslip = 0
      else if (val.displayOnPayslip === 'non_zero') formData.displayOnPayslip = 2
      else formData.displayOnPayslip = val.displayOnPayslip ?? 1

      if (val.creationSource === 'Tự thêm') formData.creationSource = 1
      else if (val.creationSource === 'Hệ thống' || val.creationSource === 'Mặc định') formData.creationSource = 2
      else formData.creationSource = val.creationSource ?? 1
    } else {
      clearForm()
    }

    // Snapshot state
    setTimeout(() => {
      initialDataString.value = JSON.stringify(formData)
    }, 500)
  },
  { immediate: true }
)

// Monitor changes for dirty check
watch(
  formData,
  () => {
    if (!initialDataString.value) {
      initialDataString.value = JSON.stringify(formData)
    }
  },
  { deep: true }
)

watch(
  () => formData.salaryCompositionName,
  (val) => {
    if (val) errors.salaryCompositionName = ''
  }
)
watch(
  () => formData.salaryCompositionCode,
  (val) => {
    if (val) errors.salaryCompositionCode = ''
  }
)
watch(
  () => formData.unitId,
  (val) => {
    if (val) errors.unitId = ''
  }
)
watch(
  () => formData.unitIds,
  (newVal) => {
    if (treeViewRef.value) {
      const instance = treeViewRef.value.instance
      if (instance) {
        if (!newVal || newVal.length === 0) {
          instance.unselectAll()
        } else {
          instance.option('selectedItemKeys', newVal)
        }
      }
    }
  },
  { deep: true }
)
watch(
  () => formData.salaryCompositionType,
  (val) => {
    if (val) errors.salaryCompositionType = ''
    if (
      val === CompositionType.TIMEKEEPING ||
      val === CompositionType.KPI ||
      val === CompositionType.PRODUCT
    ) {
      formData.quotaFormula = ''
      formData.allowOverQuota = false
    }
  }
)
watch(
  () => formData.salaryCompositionNature,
  (val) => {
    if (val) errors.salaryCompositionNature = ''
    if (val === 1) {
      formData.isTaxDeductible = false
      formData.isTaxable = 0
    } else if (val === 2) {
      formData.isTaxable = 0
      formData.isTaxDeductible = false
    } else {
      formData.isTaxable = 0
      formData.isTaxDeductible = false
    }
  }
)
</script>

<style scoped>
@import '@/assets/css/page/salary-composition-form.css';

.salary-composition-form {
  background-color: #f4f5f8;
}

.salary-composition-form-tabs {
  display: none !important; /* Hide tabs completely */
}

.salary-composition-form-body {
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 112px);
}

.salary-composition-form-section {
  display: flex;
  flex-direction: column;
  gap: 0px;
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
}

.salary-composition-form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-height: 36px;
  margin-bottom: 16px;
}

.salary-composition-form-row:last-child {
  margin-bottom: 0;
}

.flex-column {
  flex-direction: column;
}

.align-start {
  align-items: flex-start !important;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-12 {
  gap: 12px;
}

.w-300 {
  width: 300px !important;
  max-width: 300px;
}

.w-100 {
  width: 100% !important;
}

.salary-composition-form-label {
  width: 180px;
  font-size: 14px;
  font-weight: 500;
  color: #212121;
  padding-top: 8px;
}

.salary-composition-form-label span {
  color: #ef4444;
  margin-left: 2px;
}

.salary-composition-form-input-wrapper {
  width: 838px;
  display: flex;
  align-items: center;
}

.salary-composition-form-input-wrapper-flex {
  display: flex;
}

.formula-textarea {
  width: 838px !important;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  resize: vertical;
  border: 1px solid #dcdfe6;
  outline: none;
  transition: all 0.2s;
  line-height: 1.5;
}

.formula-textarea:focus {
  border-color: #2680eb;
  box-shadow: 0 0 0 2px rgba(38, 128, 235, 0.1);
}

.formula-container {
  position: relative;
}

.icon-info-gray {
  mask: url('/svg/others/Info.svg') no-repeat center;
  background-color: #717680;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  cursor: help;
  margin-left: 4px;
  vertical-align: middle;
}

.radio-group {
  display: flex;
  align-items: center;
}

:deep(.ant-radio-group) {
  display: flex;
  gap: 16px;
}

:deep(.ant-radio-wrapper) {
  font-size: 14px;
}

/* ===== Radio & Checkbox → màu xanh lá theme ===== */
:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #0e9a62 !important;
  background-color: #0e9a62 !important;
}

:deep(.ant-radio:hover .ant-radio-inner) {
  border-color: #0e9a62 !important;
}

:deep(.ant-radio-checked::after) {
  border-color: #0e9a62 !important;
}

:deep(.ant-radio-wrapper:hover .ant-radio-inner) {
  border-color: #0e9a62 !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #0e9a62 !important;
  border-color: #0e9a62 !important;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
:deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #0e9a62 !important;
}

:deep(.ant-checkbox-checked::after) {
  border-color: #0e9a62 !important;
}

.btn-cancel {
  height: 36px;
  padding: 0 24px;
  border: 1px solid #dcdfe6 !important;
  border-radius: 8px !important;
  background-color: #fff !important;
  color: #595959 !important;
  font-weight: 500;
}
.btn-cancel:hover {
  border-color: #b0b0b0 !important;
  background-color: #f5f5f5 !important;
}

.btn-save-add {
  height: 36px;
  padding: 0 24px;
  border: 1px solid #0e9a62 !important;
  border-radius: 8px !important;
  background-color: #fff !important;
  color: #0e9a62 !important;
  font-weight: 500;
}
.btn-save-add:hover {
  background-color: #f0fdf4 !important;
}

.btn-save-primary {
  height: 36px;
  padding: 0 24px;
  border: none !important;
  border-radius: 8px !important;
  background-color: #0e9a62 !important;
  color: #fff !important;
  font-weight: 500;
}
.btn-save-primary:hover {
  background-color: #0b7f51 !important;
}

/* Exit Confirmation Modal Styles */
.confirm-exit-modal .confirm-modal-content {
  width: 444px;
  border-radius: 8px;
  padding: 24px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.confirm-exit-modal .confirm-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.confirm-exit-modal .confirm-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.confirm-modal-close {
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  color: #999;
  padding: 0 4px;
  border-radius: 4px;
  transition: all 0.15s;
}

.confirm-modal-close:hover {
  color: #333;
  background-color: #f0f0f0;
}

.confirm-modal-body-text {
  font-size: 14px;
  color: #595959;
  margin-bottom: 24px;
  line-height: 1.6;
}

.confirm-modal-footer-custom {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-stay {
  height: 36px;
  padding: 0 20px;
  border: 1px solid #dcdfe6 !important;
  border-radius: 8px !important;
  background-color: #fff !important;
  color: #333 !important;
  font-weight: 500;
}
.btn-stay:hover {
  border-color: #b0b0b0 !important;
  background-color: #f5f5f5 !important;
}

.btn-exit {
  height: 36px;
  padding: 0 20px;
  border: none !important;
  border-radius: 8px !important;
  background-color: #0e9a62 !important;
  color: #fff !important;
  font-weight: 500;
}
.btn-exit:hover {
  background-color: #0b7f51 !important;
}
</style>

<style>
/* Global styles for DevExtreme dropdown popup in form */

textarea {
  border: 1px solid #dce6df;
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.2s;
  overflow: hidden;
}

.ms-input__container:hover {
  border-color: #c0c4cc;
}

.ms-input__container:focus-within {
  border-color: #0e9a62;
  box-shadow: 0 0 0 2px rgba(38, 128, 235, 0.1);
}

.ms-input__container.error-border {
  border-color: #ef4444 !important;
}

.unit-input__error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  height: 20px;
  line-height: 20px;
}
</style>
