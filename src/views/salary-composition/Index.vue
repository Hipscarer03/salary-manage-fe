<template>
  <div>
    <div class="content" :class="{ collapsed: isToggle }">
      <!-- Normal Header -->
      <div v-if="!showForm && !showSystemCatalog" class="content_header">
        <div class="content_header_title">
          <h2>Thành phần lương</h2>
        </div>
        <div class="content_header_actions">
          <!-- Action: Danh mục của hệ thống -->
          <div
            class="content_header_action content_header_action--secondary"
            @click="openSystemCatalog"
          >
            <div class="content_header_action_icon category-system-icon"></div>
            <div class="content_header_action_text">Danh mục của hệ thống</div>
          </div>

          <!-- Action: Thêm -->
          <div class="content_header_action_container content_header_action--primary">
            <div class="split-btn-container">
              <div class="split-btn-left" @click="showForm = true">
                <div class="add-new-icon"></div>
                <div class="content_header_action_text">Thêm</div>
              </div>
              <div class="split-btn-separator"></div>
              <div class="split-btn-right">
                <div class="dropdown-icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Catalog Header -->
      <div v-else-if="!showForm && showSystemCatalog" class="content_header">
        <div class="content_header_title" style="display: flex; align-items: center; gap: 8px">
          <div class="back-btn" @click="closeSystemCatalog" title="Quay lại">
            <i class="icon-back"></i>
          </div>
          <h2>Danh mục thành phần lương của hệ thống</h2>
        </div>
        <div class="content_header_actions"></div>
      </div>
      <div v-if="!showForm && !showSystemCatalog" class="salary-composition-wrapper">
        <div class="salary-composition-filter">
          <div
            class="salary-composition-filter-left"
            style="display: flex; align-items: center; gap: 8px; flex: 1"
          >
            <ms-input
              id="salary-composition-filter-searchbar-input"
              placeholder="Tìm kiếm"
              v-model="keyword"
              :showError="false"
              prefixIcon="salary-composition-filter-searchbar-icon"
              className="search-input"
            />
            <template v-if="selectedRowKeys.length > 0">
              <div class="bulk-actions-toolbar">
                <span class="bulk-selected-text">
                  Đã chọn <strong class="bulk-selected-count">{{ selectedRowKeys.length }}</strong>
                </span>
                <span class="bulk-clear-btn" @click="clearRowSelection">Bỏ chọn</span>

                <button
                  v-if="hasActiveSelected"
                  class="btn-bulk-action btn-bulk-inactive"
                  @click="handleBulkChangeStatusClick(2)"
                >
                  <svg
                    class="bulk-btn-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle cx="8" cy="8" r="6" stroke="#ff9f1a" stroke-width="1.2" />
                    <line
                      x1="5.5"
                      y1="8"
                      x2="10.5"
                      y2="8"
                      stroke="#ff9f1a"
                      stroke-width="1.2"
                      stroke-linecap="round"
                    />
                  </svg>
                  Ngừng theo dõi
                </button>

                <button
                  v-if="hasInactiveSelected"
                  class="btn-bulk-action btn-bulk-active"
                  @click="handleBulkChangeStatusClick(1)"
                >
                  <svg
                    class="bulk-btn-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle cx="8" cy="8" r="6" stroke="#0e9a62" stroke-width="1.2" />
                    <path
                      d="M5.5 8L7 9.5L10.5 6"
                      stroke="#0e9a62"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Đang theo dõi
                </button>

                <button
                  class="btn-bulk-action btn-bulk-delete"
                  @click="showBulkDeleteConfirm = true"
                >
                  <i class="icon-delete-red-small"></i>
                  Xóa
                </button>
              </div>
            </template>
            <template v-else>
              <ms-select
                v-model="statusFilter"
                :options="statusOptions"
                style="width: 180px"
                aria-placeholder="Trang thái: {{statusFilter}}"
              />

              <div style="width: 350px; flex-shrink: 0">
                <ms-combobox
                  v-model="unitFilter"
                  :options="unitFilterOptions"
                  placeholder="Tất cả đơn vị"
                  mode="multiple"
                  :max-tag-count="2"
                  allow-clear
                />
              </div>
            </template>
          </div>
          <div class="salary-composition-filter-right">
            <div class="salary-composition-filter-actions">
              <div class="filter-action-btn" title="Lọc" @click="showFilter = !showFilter">
                <div class="filter-icon-gray"></div>
              </div>
              <div class="filter-action-btn" title="Cài đặt">
                <div class="setting-icon-gray"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="content_body_wrapper">
          <div class="content_body">
            <ms-table
              :columns="columns"
              :data-source="data"
              row-key="salaryCompositionCode"
              class="salary-composition-table"
              row-class-name="row-item"
              :scroll="{ x: 1500, y: 'calc(100vh - 280px)' }"
              sticky
              :row-selection="rowSelection"
              :customRow="
                (record) => ({
                  onDblclick: () => editItem(record),
                })
              "
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'salaryCompositionType'">
                  {{ CompositionTypeName[record.salaryCompositionType] || '-' }}
                </template>
                <template v-else-if="column.key === 'salaryCompositionNature'">
                  {{ getNatureLabel(record) }}
                </template>
                <template v-else-if="column.key === 'isTaxable'">
                  {{ getTaxableStatusLabel(record) }}
                </template>
                <template v-else-if="column.key === 'isTaxDeductible'">
                  {{ getTaxDeductionLabel(record) }}
                </template>
                <template v-else-if="column.key === 'quotaFormula'">
                  {{ record.quotaFormula || '-' }}
                </template>
                <template v-else-if="column.key === 'valueType'">
                  {{ getValueTypeLabel(record) }}
                </template>
                <template v-else-if="column.key === 'valueFormula'">
                  {{ getValueLabel(record) }}
                </template>
                <template v-else-if="column.key === 'displayOnPayslip'">
                  {{ getPayslipDisplayLabel(record) }}
                </template>
                <template v-else-if="column.key === 'status'">
                  <div class="row-cell-container">
                    <div class="row-cell-content">
                      <span
                        class="status-badge"
                        :class="record.status === 1 ? 'active' : 'inactive'"
                      >
                        <span class="dot"></span>
                        {{ record.status === 1 ? 'Đang theo dõi' : 'Ngừng theo dõi' }}
                      </span>
                    </div>
                    <!-- Actions floating at the end of the row -->
                    <div class="row-actions">
                      <div
                        class="action-btn"
                        title="đổi trạng thái"
                        @click.stop="changeStatusItem(record)"
                      >
                        <i
                          :class="
                            record.status === 1 ? 'icon-status-inactive' : 'icon-status-active'
                          "
                        ></i>
                      </div>
                      <div class="action-btn" title="Sửa" @click.stop="editItem(record)">
                        <i class="icon-edit-gray"></i>
                      </div>
                      <div class="action-btn" title="Nhân bản" @click.stop="duplicateItem(record)">
                        <i class="icon-copy-gray"></i>
                      </div>
                      <div
                        class="action-btn action-btn--delete"
                        title="Xóa"
                        @click.stop="
                          () => {
                            selectedItem = record
                            showConfirm = true
                          }
                        "
                      >
                        <i class="icon-delete-red-small"></i>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </ms-table>

            <!-- Loading Overlay -->
            <div v-if="isLoading" class="loading-overlay">
              <div class="loader"></div>
            </div>
          </div>

          <transition name="slide">
            <filter-sidebar v-if="showFilter" @close="showFilter = false"></filter-sidebar>
          </transition>
        </div>

        <div class="content_pagination">
          <div class="content_pagination_right">
            <div>
              Tổng số: <span> {{ totalRecords }} </span>
            </div>
          </div>
          <div class="content_pagination_left">
            <div class="pagesize-text">Số bản ghi/trang</div>
            <div class="pagesize-button">
              <ms-select
                class="page-size"
                v-model="pageSize"
                :options="[
                  { label: '5', value: 5 },
                  { label: '15', value: 15 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                ]"
              />
            </div>
            <div class="page-number">
              {{ `${start} - ${end}` }}
            </div>
            <div class="pagination-actions">
              <div
                class="content_pagination_start"
                :class="{ disabled: pageNumber === 1 }"
                @click="pageNumber = 1"
                title="Trang đầu"
              ></div>
              <div
                class="content_pagination_prev"
                :class="{ disabled: pageNumber === 1 }"
                @click="pageNumber > 1 && pageNumber--"
                title="Trang trước"
              ></div>
              <div
                class="content_pagination_next"
                :class="{ disabled: pageNumber === totalPage }"
                @click="pageNumber < totalPage && pageNumber++"
                title="Trang sau"
              ></div>
              <div
                class="content_pagination_end"
                :class="{ disabled: pageNumber === totalPage }"
                @click="pageNumber = totalPage"
                title="Trang cuối"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Catalog Wrapper -->
      <div v-if="!showForm && showSystemCatalog" class="salary-composition-wrapper">
        <div class="salary-composition-filter">
          <div
            class="salary-composition-filter-left"
            style="display: flex; align-items: center; gap: 8px; flex: 1"
          >
            <ms-input
              id="system-component-filter-searchbar-input"
              placeholder="Tìm kiếm"
              v-model="systemKeyword"
              :showError="false"
              prefixIcon="salary-composition-filter-searchbar-icon"
              className="search-input"
            />
          </div>
          <div
            class="salary-composition-filter-right"
            style="display: flex; align-items: center; gap: 8px"
          >
            <ms-select
              v-model="systemCategoryFilter"
              :options="systemCategoryOptions"
              style="width: 200px"
            />
            <div class="salary-composition-filter-actions">
              <div class="filter-action-btn" title="Lọc">
                <div class="filter-icon-gray"></div>
              </div>
              <div class="filter-action-btn" title="Cài đặt">
                <div class="setting-icon-gray"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="content_body_wrapper">
          <div class="content_body">
            <ms-table
              :columns="systemColumns"
              :data-source="systemData"
              row-key="salaryCompositionCode"
              class="salary-composition-table"
              row-class-name="row-item"
              :scroll="{ x: 1000, y: 'calc(100vh - 280px)' }"
              sticky
              :row-selection="systemRowSelection"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'salaryCompositionType'">
                  {{ CompositionTypeName[record.salaryCompositionType] || '-' }}
                </template>
                <template v-else-if="column.key === 'valueType'">
                  {{ record.valueType }}
                </template>
                <template v-else-if="column.key === 'actionUse'">
                  <div style="display: flex; justify-content: center; align-items: center">
                    <span
                      v-if="isUsed(record)"
                      class="system-action-icon system-action-icon--used"
                      title="Đã dùng"
                    >
                      <i class="icon-minus-gray"></i>
                    </span>
                    <span
                      v-else
                      class="system-action-icon system-action-icon--add"
                      title="Sử dụng"
                      @click.stop="useSystemComponent(record)"
                    >
                      <i class="icon-plus-green"></i>
                    </span>
                  </div>
                </template>
              </template>
            </ms-table>

            <!-- Loading Overlay -->
            <div v-if="isSystemLoading" class="loading-overlay">
              <div class="loader"></div>
            </div>
          </div>
        </div>

        <div class="content_pagination">
          <div class="content_pagination_right">
            <div>
              Tổng số bản ghi: <span>{{ systemTotalRecords }}</span>
            </div>
          </div>
          <div class="content_pagination_left">
            <div class="pagesize-text">Số bản ghi/trang</div>
            <div class="pagesize-button">
              <ms-select
                class="page-size"
                v-model="systemPageSize"
                :options="[
                  { label: '5', value: 5 },
                  { label: '15', value: 15 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                ]"
              />
            </div>
            <div class="page-number">
              {{ `${systemStart} - ${systemEnd}` }}
            </div>
            <div class="pagination-actions">
              <div
                class="content_pagination_start"
                :class="{ disabled: systemPageNumber === 1 }"
                @click="systemPageNumber = 1"
                title="Trang đầu"
              ></div>
              <div
                class="content_pagination_prev"
                :class="{ disabled: systemPageNumber === 1 }"
                @click="systemPageNumber > 1 && systemPageNumber--"
                title="Trang trước"
              ></div>
              <div
                class="content_pagination_next"
                :class="{ disabled: systemPageNumber === systemTotalPage }"
                @click="systemPageNumber < systemTotalPage && systemPageNumber++"
                title="Trang sau"
              ></div>
              <div
                class="content_pagination_end"
                :class="{ disabled: systemPageNumber === systemTotalPage }"
                @click="systemPageNumber = systemTotalPage"
                title="Trang cuối"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Giao diện Thêm mới (Thay thế bảng) -->
      <salary-composition-form
        v-if="showForm"
        :key="formKey"
        @close="handleClose"
        @submit="handleSubmitForm"
        :editData="selectedItem || duplicateData"
        :isDuplicate="!!duplicateData"
        hide-unit-footer
      ></salary-composition-form>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirm" class="confirm-modal" @click.self="showConfirm = false">
      <div class="confirm-modal-content">
        <div class="confirm-modal-header-container">
          <div class="confirm-modal-title">MISA AMIS Tiền lương - Quản lý thành phần lương</div>
          <div
            class="confirm-modal-close"
            @click="
              () => {
                selectedItem = null
                showConfirm = false
              }
            "
          >
            <i class="icon-x-gray-small"></i>
          </div>
        </div>
        <div class="confirm-modal-body">
          Bạn có chắc chắn muốn xóa thành phần lương &lt;{{
            selectedItem?.salaryCompositionName
          }}&gt; không?
        </div>
        <div class="confirm-modal-actions">
          <button
            class="confirm-modal-cancel"
            @click="
              () => {
                selectedItem = null
                showConfirm = false
              }
            "
          >
            Hủy
          </button>
          <button class="confirm-modal-delete" @click="handleDelete">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Confirm Status Modal -->
    <div v-if="showStatusConfirm" class="confirm-modal" @click.self="showStatusConfirm = false">
      <div class="confirm-modal-content">
        <div class="confirm-modal-header-container">
          <div class="confirm-modal-title">MISA AMIS Tiền lương - Xác nhận thay đổi trạng thái</div>
          <div
            class="confirm-modal-close"
            @click="
              () => {
                selectedItem = null
                showStatusConfirm = false
              }
            "
          >
            <i class="icon-x-gray-small"></i>
          </div>
        </div>
        <div class="confirm-modal-body">
          Bạn có chắc chắn muốn đổi trạng thái của thành phần lương &lt;{{
            selectedItem?.salaryCompositionName
          }}&gt; sang
          <strong>{{ selectedItem?.status === 1 ? 'Ngừng theo dõi' : 'Đang theo dõi' }}</strong>
          không?
        </div>
        <div class="confirm-modal-actions">
          <button
            class="confirm-modal-cancel"
            @click="
              () => {
                selectedItem = null
                showStatusConfirm = false
              }
            "
          >
            Hủy
          </button>
          <button
            class="confirm-modal-delete"
            style="background-color: #0e9a62 !important"
            @click="handleConfirmChangeStatus"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Delete Confirm Modal -->
    <div
      v-if="showBulkDeleteConfirm"
      class="confirm-modal"
      @click.self="showBulkDeleteConfirm = false"
    >
      <div class="confirm-modal-content">
        <div class="confirm-modal-header-container">
          <div class="confirm-modal-title">MISA AMIS Tiền lương - Quản lý thành phần lương</div>
          <div class="confirm-modal-close" @click="showBulkDeleteConfirm = false">
            <i class="icon-x-gray-small"></i>
          </div>
        </div>
        <div class="confirm-modal-body">
          Bạn có chắc chắn muốn xóa những thành phần lương đã chọn không?
        </div>
        <div class="confirm-modal-actions">
          <button class="confirm-modal-cancel" @click="showBulkDeleteConfirm = false">Hủy</button>
          <button class="confirm-modal-delete" @click="handleBulkDelete">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Bulk Status Change Confirm Modal -->
    <div
      v-if="showBulkStatusConfirm"
      class="confirm-modal"
      @click.self="showBulkStatusConfirm = false"
    >
      <div class="confirm-modal-content">
        <div class="confirm-modal-header-container">
          <div class="confirm-modal-title">MISA AMIS Tiền lương - Xác nhận thay đổi trạng thái</div>
          <div class="confirm-modal-close" @click="showBulkStatusConfirm = false">
            <i class="icon-x-gray-small"></i>
          </div>
        </div>
        <div class="confirm-modal-body">
          Bạn có chắc chắn muốn đổi trạng thái của các thành phần lương đã chọn sang
          <strong>{{ bulkTargetStatus === 1 ? 'Đang theo dõi' : 'Ngừng theo dõi' }}</strong>
          không?
        </div>
        <div class="confirm-modal-actions">
          <button class="confirm-modal-cancel" @click="showBulkStatusConfirm = false">Hủy</button>
          <button
            class="confirm-modal-delete"
            style="background-color: #0e9a62 !important"
            @click="handleBulkChangeStatusConfirm"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { debounce } from 'lodash'
import SalaryCompositionForm from '@/views/salary-composition/SalaryCompositionForm.vue'
import FilterSidebar from '@/views/salary-composition/FilterSidebar.vue'
import MsTable from '@/components/control/MsTable.vue'
import MsInput from '@/components/control/MsInput.vue'
import MsSelect from '@/components/control/MsSelect.vue'
import MsCombobox from '@/components/control/MsCombobox.vue'
import MsButton from '@/components/control/MsButton.vue'
import DxDropDownBox from 'devextreme-vue/drop-down-box'
import DxTreeView from 'devextreme-vue/tree-view'
import DxTextBox from 'devextreme-vue/text-box'
import SalaryCompositionApi from '@/apis/components/salary-composition/SalaryCompositionApi'
import { CompositionType, CompositionTypeName } from '@/enums/SalaryCompositionEnum'
import SalaryCompositionUnitApi from '@/apis/components/salary-composition/SalaryCompositionUnitApi'
import toast from '@/apis/config/toast'

const showForm = ref(false)
const showConfirm = ref(false)
const showStatusConfirm = ref(false)
const showFilter = ref(false)
const isLoading = ref(false)
const formKey = ref(0)

const showSystemCatalog = ref(false)
const systemKeyword = ref('')
const systemCategoryFilter = ref('all')
const systemPageSize = ref(15)
const systemPageNumber = ref(1)
const systemTotalRecords = ref(0)
const systemData = ref([])
const isSystemLoading = ref(false)
const systemCategoryOptions = ref([{ label: 'Tất cả thành phần', value: 'all' }])

const systemColumns = [
  {
    title: 'Mã thành phần',
    dataIndex: 'salaryCompositionCode',
    key: 'salaryCompositionCode',
    width: 220,
    ellipsis: true,
  },
  {
    title: 'Tên thành phần',
    dataIndex: 'salaryCompositionName',
    key: 'salaryCompositionName',
    width: 280,
    ellipsis: true,
  },
  {
    title: 'Loại thành phần',
    dataIndex: 'salaryCompositionType',
    key: 'salaryCompositionType',
    width: 200,
    ellipsis: true,
  },
  {
    title: 'Tính chất',
    dataIndex: 'salaryCompositionNature',
    key: 'salaryCompositionNature',
    width: 150,
  },
  { title: 'Kiểu giá trị', dataIndex: 'valueType', key: 'valueType', width: 150 },
  { title: 'Giá...', dataIndex: 'actionUse', key: 'actionUse', width: 120 },
]

const systemSelectedRowKeys = ref([])
const onSystemSelectChange = (keys) => {
  systemSelectedRowKeys.value = keys
}
const systemRowSelection = computed(() => ({
  selectedRowKeys: systemSelectedRowKeys.value,
  onChange: onSystemSelectChange,
}))

const systemStart = computed(() => (systemPageNumber.value - 1) * systemPageSize.value + 1)
const systemEnd = computed(() =>
  Math.min(systemPageNumber.value * systemPageSize.value, systemTotalRecords.value)
)
const systemTotalPage = computed(
  () => Math.ceil(systemTotalRecords.value / systemPageSize.value) || 1
)

const usedCodes = ref([])

const fetchUsedCodes = async () => {
  try {
    const res = await SalaryCompositionApi.getAllCodes()
    if (res && res.data) {
      usedCodes.value = res.data
    }
  } catch (error) {
    console.error('Error fetching used codes:', error)
  }
}

const isUsed = (record) => {
  return usedCodes.value.includes(record.salaryCompositionCode)
}

const fetchSystemData = async () => {
  try {
    isSystemLoading.value = true
    const params = {
      PageSize: systemPageSize.value,
      PageNumber: systemPageNumber.value,
      Search: systemKeyword.value || '',
      Category: systemCategoryFilter.value,
    }
    const response = await SalaryCompositionApi.getSystemPaging(params)
    if (response && response.data) {
      systemData.value = response.data.data || []
      systemTotalRecords.value = response.data.totalRecords || 0
    }
  } catch (error) {
    console.error('Error fetching system components:', error)
  } finally {
    isSystemLoading.value = false
  }
}

const loadSystemCategories = () => {
  systemCategoryOptions.value = [
    { label: 'Tất cả thành phần', value: 'all' },
    ...Object.entries(CompositionType).map(([key, val]) => ({
      label: CompositionTypeName[val],
      value: val,
    })),
  ]
}

const openSystemCatalog = async () => {
  showSystemCatalog.value = true
  systemKeyword.value = ''
  systemCategoryFilter.value = 'all'
  systemPageNumber.value = 1
  await fetchUsedCodes()
  await fetchSystemData()
  loadSystemCategories()
}

const closeSystemCatalog = async () => {
  showSystemCatalog.value = false
  keyword.value = ''
  pageNumber.value = 1
  await fetchData()
}

const useSystemComponent = async (record) => {
  try {
    isLoading.value = true
    const payload = {
      salaryCompositionCode: record.salaryCompositionCode,
      salaryCompositionName: record.salaryCompositionName,
      salaryCompositionType: record.salaryCompositionType,
      valueType: record.valueType || 2,
      isTaxable: record.isTaxable,
      isTaxDeductible: record.isTaxDeductible,
      displayOnPayslip: record.displayOnPayslip,
      quotaFormula: '',
      valueOption: 0,
      valueFormula: '',
      description: '',
      creationSource: 2,
      status: 1,
      unitId: '',
    }

    await SalaryCompositionApi.create(payload)
    toast.success(`Thêm thành phần lương <${record.salaryCompositionName}> thành công`)
    await fetchUsedCodes()
    await fetchSystemData()
  } catch (error) {
    console.error('Error adding system component:', error)
    toast.error('Có lỗi xảy ra khi thêm thành phần lương')
  } finally {
    isLoading.value = false
  }
}

watch([systemPageSize, systemPageNumber, systemKeyword, systemCategoryFilter], () => {
  fetchSystemData()
})

watch([systemPageSize, systemKeyword, systemCategoryFilter], () => {
  systemPageNumber.value = 1
})

const columns = [
  {
    title: 'Mã thành phần',
    dataIndex: 'salaryCompositionCode',
    key: 'salaryCompositionCode',
    width: 220,
    ellipsis: true,
  },
  {
    title: 'Tên thành phần',
    dataIndex: 'salaryCompositionName',
    key: 'salaryCompositionName',
    width: 280,
    ellipsis: true,
  },
  {
    title: 'Loại thành phần',
    dataIndex: 'salaryCompositionType',
    key: 'salaryCompositionType',
    width: 200,
    ellipsis: true,
  },
  {
    title: 'Tính chất',
    dataIndex: 'salaryCompositionNature',
    key: 'salaryCompositionNature',
    width: 120,
  },
  { title: 'Chịu thuế', dataIndex: 'isTaxable', key: 'isTaxable', width: 160 },
  {
    title: 'Giảm trừ khi tính thuế',
    dataIndex: 'isTaxDeductible',
    key: 'isTaxDeductible',
    width: 180,
  },
  { title: 'Định mức', dataIndex: 'quotaFormula', key: 'quotaFormula', width: 150, ellipsis: true },
  { title: 'Kiểu giá trị', dataIndex: 'valueType', key: 'valueType', width: 130 },
  { title: 'Giá trị', dataIndex: 'valueFormula', key: 'valueFormula', width: 220, ellipsis: true },
  { title: 'Mô tả', dataIndex: 'description', key: 'description', width: 220, ellipsis: true },
  {
    title: 'Hiển thị trên phiếu lương',
    dataIndex: 'displayOnPayslip',
    key: 'displayOnPayslip',
    width: 180,
  },
  { title: 'Nguồn tạo', dataIndex: 'creationSource', key: 'creationSource', width: 130 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 200 },
]

const data = ref([])
const selectedRowKeys = ref([])
const onSelectChange = (keys) => {
  selectedRowKeys.value = keys
}
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: onSelectChange,
}))

const selectedItem = ref(null)
const showBulkDeleteConfirm = ref(false)
const showBulkStatusConfirm = ref(false)
const bulkTargetStatus = ref('')

const selectedRows = computed(() => {
  return data.value.filter((item) => selectedRowKeys.value.includes(item.salaryCompositionCode))
})

const hasActiveSelected = computed(() => {
  return selectedRows.value.some((r) => r.status === 1)
})

const hasInactiveSelected = computed(() => {
  return selectedRows.value.some((r) => r.status === 2)
})

const getSelectedIdsString = () => {
  return selectedRows.value
    .map((r) => r.salaryCompositionId)
    .filter(Boolean)
    .join(',')
}

const clearRowSelection = () => {
  selectedRowKeys.value = []
}

const handleBulkChangeStatusClick = (status) => {
  bulkTargetStatus.value = status
  showBulkStatusConfirm.value = true
}

const handleBulkChangeStatusConfirm = async () => {
  showBulkStatusConfirm.value = false
  await handleBulkChangeStatus(bulkTargetStatus.value)
}

const totalRecords = ref(0)
const keyword = ref('')
const pageSize = ref(15)
const pageNumber = ref(1)
const sort = ref(null)

const statusFilter = ref('all')
const unitFilter = ref([])

const unitFilterOptions = computed(() => {
  return rawUnits.value.map((u) => ({
    label: u.unitName,
    value: u.unitId,
  }))
})

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang theo dõi', value: 1 },
  { label: 'Ngừng theo dõi', value: 2 },
]

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
  if (!unitFilter.value || !unitFilter.value.length) return ''
  return unitFilter.value
    .map((id) => rawUnits.value.find((u) => u.unitId === id)?.unitName)
    .filter(Boolean)
    .join(', ')
})

// Lấy danh sách đơn vị cha cấp cao nhất đã được chọn
const topSelectedUnits = computed(() => {
  if (!unitFilter.value?.length) return []
  const selectedSet = new Set(unitFilter.value)
  return rawUnits.value.filter((u) => selectedSet.has(u.unitId) && !selectedSet.has(u.parentUnitId))
})

// Xóa một đơn vị và tất cả con cháu của nó
const removeUnit = (unitId) => {
  const toRemove = new Set()
  const markDescendants = (id) => {
    toRemove.add(id)
    rawUnits.value
      .filter((u) => u.parentUnitId === id)
      .forEach((child) => markDescendants(child.unitId))
  }
  markDescendants(unitId)
  unitFilter.value = unitFilter.value.filter((id) => !toRemove.has(id))
}

const getNatureLabel = (record) => {
  if (record.salaryCompositionNature === 1 || record.salaryCompositionNature === '1')
    return 'Thu nhập'
  if (record.salaryCompositionNature === 2 || record.salaryCompositionNature === '2')
    return 'Khấu trừ'
  if (record.salaryCompositionNature === 3 || record.salaryCompositionNature === '3') return 'Khác'
  return record.salaryCompositionNature || ''
}

const getTaxableStatusLabel = (record) => {
  if (record.isTaxable === 0) return 'Chịu thuế'
  if (record.isTaxable === 1) return 'Miễn thuế toàn phần'
  if (record.isTaxable === 2) return 'Miễn thuế một phần'
  if (
    record.salaryCompositionNature === 2 ||
    record.salaryCompositionNature === '2' ||
    record.salaryCompositionNature === 3 ||
    record.salaryCompositionNature === '3'
  ) {
    return '-'
  }
  return '-'
}

const getTaxDeductionLabel = (record) => {
  if (record.isTaxDeductible === true || record.isTaxDeductible === 1) {
    return 'Có'
  }
  if (record.isTaxDeductible === false || record.isTaxDeductible === 0) {
    return 'Không'
  }
  return '-'
}

// const getQuotaLabel = (record) => {
//   if (record.quotaFormula) {
//     if (/^\d+$/.test(record.quotaFormula)) {
//       return formatMoney(Number(record.quotaFormula))
//     }
//     return record.quotaFormula
//   }
//   return '-'
// }

const formatMoney = (value) => {
  return value
}

const getValueTypeLabel = (record) => {
  if (record.valueType === 2) return 'Tiền tệ'
  if (record.valueType === 1) return 'Số'
  if (record.valueType === 3) return 'Phần trăm'
  if (record.valueType === 4) return 'Chữ'
  if (record.valueType === 5) return 'Ngày'
  return '-'
}

const getValueLabel = (record) => {
  if (record.valueFormula) return record.valueFormula
  if (record.valueOption === 1) return 'Cộng tổng'
  return '-'
}

const getPayslipDisplayLabel = (record) => {
  if (record.displayOnPayslip === 1) return 'Có'
  if (record.displayOnPayslip === 0) return 'Không'
  if (record.displayOnPayslip === 2) return 'Chỉ hiển thị nếu giá trị khác 0'
  return '-'
}

/**
 * Lấy danh sách thành phần lương từ API hỗ trợ phân trang, tìm kiếm và sắp xếp
 */
const fetchData = async () => {
  try {
    isLoading.value = true
    const params = {
      PageSize: pageSize.value,
      PageNumber: pageNumber.value,
      Search: keyword.value.trim() || '',
      Sort: sort.value,
      Status: statusFilter.value,
      UnitIds: unitFilter.value && unitFilter.value.length ? unitFilter.value.join(',') : 'all',
    }
    const response = await SalaryCompositionApi.getPaging(params)
    if (response && response.data) {
      data.value = response.data.data || []
      totalRecords.value = response.data.totalRecords || 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const loadUnits = async () => {
  try {
    const res = await SalaryCompositionUnitApi.getAll()
    if (res && res.data) {
      rawUnits.value = res.data
    }
  } catch (error) {
    console.error('Error loading units:', error)
  }
}

onMounted(() => {
  fetchData()
  loadUnits()
})

const start = computed(() => (pageNumber.value - 1) * pageSize.value + 1)
const end = computed(() => Math.min(pageNumber.value * pageSize.value, totalRecords.value))
const totalPage = computed(() => Math.ceil(totalRecords.value / pageSize.value) || 1)

// watch sử dung debound khi search
watch(
  [pageSize, keyword, statusFilter, unitFilter],
  debounce(() => {
    if (pageNumber.value !== 1) {
      pageNumber.value = 1
    } else {
      fetchData()
    }
  }, 500)
)

watch([pageNumber, sort], () => {
  fetchData()
})

watch([pageSize, keyword, statusFilter, unitFilter], () => {
  pageNumber.value = 1
})

defineProps({
  isToggle: Boolean,
})

/**
 * Xử lý khi nhấn Lưu trên form (Thêm mới hoặc Cập nhật)
 * @param {Object} value Dữ liệu từ form
 */
const handleSubmitForm = async (value) => {
  try {
    const payload = { ...value }
    const isSaveAndAdd = payload.isSaveAndAdd
    delete payload.isSaveAndAdd

    const id = selectedItem.value?.salaryCompositionId
    if (id) {
      await SalaryCompositionApi.update(id, payload)
      toast.success(`Cập nhật thành phần lương <${payload.salaryCompositionName}> thành công`)
    } else {
      await SalaryCompositionApi.create(payload)
      toast.success(`Thêm thành phần lương <${payload.salaryCompositionName}> thành công`)
    }

    if (isSaveAndAdd) {
      selectedItem.value = null
      duplicateData.value = null
      formKey.value++
    } else {
      showForm.value = false
      selectedItem.value = null
      duplicateData.value = null
    }
    fetchData()
  } catch (error) {
    console.error('Lỗi khi lưu thành phần lương:', error)
    toast.error('Có lỗi xảy ra khi lưu thành phần lương')
  }
}

/**
 * Xử lý xóa thành phần lương sau khi xác nhận
 */
const handleDelete = async () => {
  try {
    await SalaryCompositionApi.delete(selectedItem.value.salaryCompositionId)
    toast.success(`Xóa thành phần lương <${selectedItem.value.salaryCompositionName}> thành công`)
    showConfirm.value = false
    selectedItem.value = null
    fetchData()
  } catch (error) {
    console.error('Lỗi khi xóa thành phần lương:', error)
    toast.error('Có lỗi xảy ra khi xóa thành phần lương')
  }
}

/**
 * Xử lý thay đổi trạng thái (theo dõi/ngừng theo dõi) của thành phần lương
 * @param {Object} item Thành phần lương cần thay đổi trạng thái
 */
const changeStatusItem = (item) => {
  selectedItem.value = item
  showStatusConfirm.value = true
}

const handleConfirmChangeStatus = async () => {
  if (!selectedItem.value) return
  try {
    const item = selectedItem.value
    const statusInt = item.status === 1 ? 2 : 1
    await SalaryCompositionApi.updateStatus(item.salaryCompositionId, statusInt)
    toast.success(
      `Thành phần lương <${item.salaryCompositionName}> đã được chuyển sang trạng thái ${
        statusInt === 1 ? 'Đang theo dõi' : 'Ngừng theo dõi'
      }`
    )
    showStatusConfirm.value = false
    selectedItem.value = null
    fetchData()
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái thành phần lương:', error)
    toast.error('Có lỗi xảy ra khi thay đổi trạng thái thành phần lương')
  }
}

/**
 * Mở form chỉnh sửa thành phần lương
 * @param {Object} item Thông tin thành phần lương cần sửa
 */
const editItem = async (item) => {
  try {
    const res = await SalaryCompositionApi.getDetail(item.salaryCompositionId)
    if (res && res.data) {
      selectedItem.value = res.data
      showForm.value = true
    }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết thành phần lương:', error)
  }
}

/**
 * Mở form nhân bản thành phần lương
 * @param {Object} item Thành phần lương gốc muốn nhân bản
 */
const duplicateItem = async (item) => {
  try {
    const copy = { ...item }
    // Lấy mã thành phần mới dựa trên tên thành phần
    const res = await SalaryCompositionApi.getNewCode(item.salaryCompositionName)
    if (res && res.data) {
      copy.salaryCompositionCode = res.data
    }

    // Xóa ID để hệ thống nhận diện đây là bản ghi mới
    delete copy.salaryCompositionId

    selectedItem.value = null
    duplicateData.value = copy
    showForm.value = true
  } catch (error) {
    console.error('Lỗi khi nhân bản thành phần lương:', error)
  }
}

const duplicateData = ref(null)

/**
 * Xử lý đóng form và xóa dữ liệu tạm
 */
const handleClose = () => {
  showForm.value = false
  selectedItem.value = null
  duplicateData.value = null
}

/**
 * Xử lý thay đổi trạng thái hàng loạt
 */
const handleBulkChangeStatus = async (status) => {
  try {
    const ids = getSelectedIdsString()
    if (!ids) {
      toast.warning('Chưa chọn bản ghi nào')
      return
    }
    isLoading.value = true
    const statusInt = status
    await SalaryCompositionApi.updateStatus(ids, statusInt)
    toast.success('Cập nhật trạng thái hàng loạt thành công')
    clearRowSelection()
    await fetchData()
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái hàng loạt:', error)
    toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
  } finally {
    isLoading.value = false
  }
}

/**
 * Xử lý xóa hàng loạt
 */
const handleBulkDelete = async () => {
  try {
    const ids = getSelectedIdsString()
    if (!ids) {
      toast.warning('Chưa chọn bản ghi nào')
      return
    }
    isLoading.value = true
    await SalaryCompositionApi.deleteMany(ids)
    toast.success('Xóa các bản ghi đã chọn thành công')
    showBulkDeleteConfirm.value = false
    clearRowSelection()
    await fetchData()
  } catch (error) {
    console.error('Lỗi khi xóa hàng loạt:', error)
    toast.error('Có lỗi xảy ra khi xóa các bản ghi')
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
@import '@/assets/css/page/salary-composition.css';
@import '@/assets/css/components/table.css';

/* Dropdown tree select styles */

.dx-popup-content {
  padding: 0 !important;
}

.dx-dropdowneditor-icon::before {
  mask-image: url('/Icon.svg') !important;
  -webkit-mask-image: url('/Icon.svg') !important;
  mask-repeat: no-repeat !important;
  -webkit-mask-repeat: no-repeat !important;
  mask-position: -104px -7px !important;
  -webkit-mask-position: -104px -7px !important;
  background-color: gray !important;
  content: '' !important;
  width: 16px !important;
  height: 16px !important;
}

.dx-dropdowneditor-icon {
}
.tree-dropdown-content {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  background-color: #ffffff;
  width: 350px;
}

.tree-view-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
  max-height: 300px;
}

/* Custom checkboxes inside DevExtreme TreeView to look exactly like Ant Design checkboxes */
.tree-dropdown-content .dx-checkbox-icon {
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  background-color: #ffffff !important;
  width: 16px !important;
  height: 16px !important;
  transition: all 0.3s !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.tree-dropdown-content .dx-checkbox:hover .dx-checkbox-icon,
.tree-dropdown-content .dx-state-hover .dx-checkbox-icon {
  border-color: #0e9a62 !important;
}

.tree-dropdown-content .dx-checkbox-checked .dx-checkbox-icon {
  background-color: #0e9a62 !important;
  border-color: #0e9a62 !important;
  color: #ffffff !important;
}

/* Make checkmark inside tree smaller and remove animation */
.tree-dropdown-content .dx-checkbox-icon::before {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

.tree-dropdown-content .dx-checkbox-checked .dx-checkbox-icon::before {
  font-size: 10px !important;
}

.dx-checkbox-checked .dx-checkbox-icon::before {
  top: 0 !important;
  margin-top: 50% !important;
  margin-left: -50% !important;
  width: 16px !important;
  height: 16px !important;
}

.tree-dropdown-content .dx-checkbox-indeterminate .dx-checkbox-icon {
  background-color: #ffffff !important;
  border-color: #d9d9d9 !important;
}

.tree-dropdown-content .dx-checkbox-indeterminate .dx-checkbox-icon::before {
  display: none !important;
  content: '' !important;
}

.tree-dropdown-footer {
  padding: 10px 12px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
}

.inactive-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
}

.inactive-checkbox-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #0e9a62;
}

.tree-dropdown-box .dx-texteditor-input {
  cursor: pointer !important;
}

/* Green border when dropdown is opened / focused */
.tree-dropdown-box.dx-state-focused .dx-texteditor-container,
.tree-dropdown-box.dx-dropdowneditor-active .dx-texteditor-container {
  border-color: #0e9a62 !important;
  box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.15) !important;
}

/* css confirm modal */
/* Overlay */

.salary-composition-filter-left {
  width: 240px;
  height: 32px;
}
.content_header_action_setting {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.header-setting-icon {
  width: 16px;
  height: 16px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: url('./svg/others/Threedots.png');
  background-repeat: no-repeat;
  background-position: center;
}

.confirm-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal box */
.confirm-modal-content {
  width: 444px;
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeInScale 0.2s ease;
}

.confirm-modal-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.confirm-modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.confirm-modal-close {
  cursor: pointer;
  padding: 4px;
}

.icon-x-gray-small {
  mask: url('/svg/others/X.png') no-repeat center;
  background-color: #64748b;
  width: 14px;
  height: 14px;
  display: block;
}

.confirm-modal-body {
  font-size: 14px;
  color: #334155;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* Actions */
.confirm-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Buttons */
.confirm-modal-cancel,
.confirm-modal-delete {
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  border: 1px solid transparent;
}

.confirm-modal-cancel {
  background: white;
  border-color: #e2e8f0;
  color: #1e293b;
}

.confirm-modal-cancel:hover {
  color: #2680eb;
  background: white;
}

.confirm-modal-delete {
  background: #ff4d4f;
  color: #fff;
}

.confirm-modal-delete:hover {
  background: #dc2626;
}

/* Animation */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Table Actions Hover */
.text-right {
  text-align: right;
}
.text-center {
  text-align: center;
}
.row-cell-container {
  position: relative; /* Added to anchor absolute row-actions */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-cell-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.row-actions {
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  position: absolute;
  right: 12px;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 100;
}

.row-item:hover .row-actions {
  opacity: 1;
  pointer-events: auto;
}

.row-item:hover .row-cell-content {
  opacity: 0;
}

:deep(.row-item:hover) {
  background-color: var(--ms-color-primary-light-default) !important;
}

.action-btn {
  width: 28px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover,
.action-btn--delete:hover {
  background-color: #e9eaeb !important;
  border-color: #dcdfe6 !important;
}

.icon-status-active {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'><circle cx='8' cy='8' r='6' stroke='%230e9a62' stroke-width='1.2'/><path d='M5.5 8L7 9.5L10.5 6' stroke='%230e9a62' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/></svg>") !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: contain !important;
}

.icon-status-inactive {
  display: inline-block;
  width: 20px;
  height: 20px;
  mask: url('/Icon.svg') no-repeat -313px -312px;
  background-color: #f90 !important;
}

.icon-edit-gray {
  display: inline-block;
  mask: url('/svg/table/IconPencil.svg') no-repeat center;
  -webkit-mask: url('/svg/table/IconPencil.svg') no-repeat center;
  mask-size: contain;
  -webkit-mask-size: contain;
  background-color: #666;
  width: 16px;
  height: 16px;
}

.icon-copy-gray {
  display: inline-block;
  mask: url('/svg/table/IconBoxMultiple.svg') no-repeat center;
  -webkit-mask: url('/svg/table/IconBoxMultiple.svg') no-repeat center;
  mask-size: contain;
  -webkit-mask-size: contain;
  background-color: #666;
  width: 16px;
  height: 16px;
}

.icon-delete-red-small {
  display: inline-block;
  mask: url('/svg/table/IconTrash.svg') no-repeat center;
  -webkit-mask: url('/svg/table/IconTrash.svg') no-repeat center;
  mask-size: contain;
  -webkit-mask-size: contain;
  background-color: #ef4444;
  width: 16px;
  height: 16px;
}

/* Remove old selector */

.check-icon-v {
  width: 16px;
  height: 16px;
  margin: 0 auto;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232680eb'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.copy-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/%3E%3C/svg%3E");
}

.import-excel-icon {
  width: 16px;
  height: 16px;
  background-image: url('./svg/others/ImportIcon.svg');
  background-repeat: no-repeat;
  background-size: contain;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Pagination Icons Custom */
.pagination-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 12px;
}

/* Styling for System Salary Components Catalog */
.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #f1f5f9;
}

.icon-back {
  mask: url('/svg/others/Back.svg') no-repeat center;
  -webkit-mask: url('/svg/others/Back.svg') no-repeat center;
  background-color: #64748b;
  width: 16px;
  height: 16px;
  display: block;
}

.back-btn:hover .icon-back {
  background-color: #1e293b;
}

.system-action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.system-action-icon--add {
  cursor: pointer;
}

.system-action-icon--add:hover {
  background-color: #f0fdf4;
  border: 1px solid #86efac;
}

.system-action-icon--used {
  cursor: not-allowed;
}

.icon-plus-green {
  mask: url('/svg/others/IconPlus.svg') no-repeat center;
  -webkit-mask: url('/svg/others/IconPlus.svg') no-repeat center;
  background-color: #0e9a62;
  width: 14px;
  height: 14px;
  display: block;
}

.icon-minus-gray {
  width: 12px;
  height: 2px;
  background-color: #94a3b8;
  display: block;
}

/* ===== Tag field (custom input area) ===== */
.unit-tag-field {
  display: flex;
  align-items: center;
  min-height: 32px;
  cursor: pointer;
  padding: 0 8px;
  width: 100%;
  box-sizing: border-box;
  gap: 6px;
}

/* Badge số lượng đã chọn */
.unit-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background-color: #e2e8f0;
  color: #334155;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 0 5px;
  flex-shrink: 0;
  margin-right: 2px;
}

/* Nút xóa tất cả bên phải */
.unit-clear-all {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #9ca3af;
  padding: 2px 4px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: all 0.15s;
  margin-left: auto;
}

.unit-clear-all:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.unit-tag-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 4px;
  align-items: center;
  flex: 1;
  min-height: 36px;
  padding: 2px 0;
}

.unit-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background-color: #edfcf4;
  color: #0e9a62;
  border: 1px solid #b7f0d5;
  border-radius: 4px;
  padding: 1px 6px 1px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

.unit-tag-remove {
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  color: #0e9a62;
  opacity: 0.7;
  padding: 0 2px;
  border-radius: 2px;
  transition: all 0.15s;
}

.unit-tag-remove:hover {
  opacity: 1;
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.unit-placeholder {
  color: #bbb;
  font-size: 13px;
  padding-left: 4px;
}

/* ===== Dropdown border focus ===== */
.tree-dropdown-box.dx-state-focused .dx-texteditor-container,
.tree-dropdown-box.dx-dropdowneditor-active .dx-texteditor-container {
  border-color: #0e9a62 !important;
  box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.15) !important;
}

.tree-dropdown-box.error-border .dx-texteditor-container {
  border-color: #ef4444 !important;
}

/* Hide default input so our tag field shows */
.tree-dropdown-box .dx-texteditor-input {
  display: none !important;
}

.tree-dropdown-box .dx-texteditor-container {
  cursor: pointer;
  min-height: 36px;
  display: flex;
  align-items: center;
  border-radius: 8px !important;
}

/* Đảm bảo field-template mở rộng đầy đủ */
.tree-dropdown-box .dx-dropdowneditor-field-template-wrapper {
  width: 100%;
  min-height: 36px;
  display: flex;
  align-items: center;
}

/* Cho phép .dx-texteditor-input-container hiển thị nội dung */
.tree-dropdown-box .dx-texteditor-input-container {
  display: flex !important;
  flex: 1;
  min-height: 36px;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

/* Custom styling for DevExtreme dropdown button */
.tree-dropdown-box .dx-dropdowneditor-button {
  background-color: transparent !important;
  border: none !important;
  width: 32px !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.tree-dropdown-box .dx-dropdowneditor-icon {
  width: 16px !important;
  height: 16px !important;
  mask: url('/Icon.svg') no-repeat -140px -2px;
  background-color: #70707e;
}

.tree-dropdown-box .dx-dropdowneditor-icon::before {
  content: '' !important;
  display: none !important;
}

/* tree */

.tree-dropdown-box.error-border .dx-texteditor-container {
  border-color: #ef4444 !important;
}

.dx-treeview-toggle-item-visibility::before {
  content: '';
  mask: url('/Icon.svg') no-repeat -140px -2px;
  background-color: #70707e;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transform: all ease-in-out 1s;
}

.dx-treeview-toggle-item-visibility.dx-treeview-toggle-item-visibility-opened::before {
  content: '';
  mask: url('/Icon.svg') no-repeat -103px -2px;
}

.dx-treeview-item-without-checkbox.dx-state-focused > .dx-treeview-item {
  color: #0e9a62;
  background-color: #edfcf4;
}

/* Bulk Action Toolbar Styles */
.bulk-actions-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.bulk-selected-text {
  font-size: 13px;
  color: #1e293b;
}

.bulk-selected-count {
  font-weight: 700;
  margin-left: 2px;
}

.bulk-clear-btn {
  font-size: 13px;
  color: #0e9a62;
  cursor: pointer;
  font-weight: 500;
  margin-right: 8px;
}

.bulk-clear-btn:hover {
  text-decoration: underline;
}

.btn-bulk-action {
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

.bulk-btn-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-bulk-inactive {
  border: 1px solid #ff9f1a;
  color: #ff9f1a;
}
.btn-bulk-inactive:hover {
  background-color: #fffaf0;
}

.btn-bulk-active {
  border: 1px solid #0e9a62;
  color: #0e9a62;
}
.btn-bulk-active:hover {
  background-color: #f0fdf4;
}

.btn-bulk-delete {
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}
.btn-bulk-delete:hover {
  background-color: #fff5f5;
}

.ant-table-measure-row {
  visibility: hidden !important;
  height: 0 !important;
  line-height: 0 !important;
}

.ant-table-measure-row td {
  padding: 0 !important;
  border: none !important;
  height: 0 !important;
  line-height: 0 !important;
}

/* .ant-table-body {
  margin-top: -36px;
} */
</style>
