<template>
  <div class="filter-sidebar">
    <div class="filter-header">
      <div class="filter-title">Bộ lọc</div>
      <div class="filter-close" @click="$emit('close')">✕</div>
    </div>

    <div class="filter-body">
      <!-- Search Input -->
      <div class="filter-search-wrapper">
        <i class="icon-search-gray"></i>
        <ms-input placeholder="Tìm kiếm" class="filter-search-input" />
      </div>

      <!-- Filter List -->
      <div class="filter-list">
        <!-- Item: Loại thành phần (Active) -->
        <div class="filter-item active">
          <div class="filter-item-header">
            <input type="checkbox" checked />
            <span class="filter-item-label">Loại thành phần</span>
          </div>
          <div class="filter-item-content">
            <div class="filter-select-wrapper">
              <ms-select
                class="filter-select"
                :options="[
                  { label: 'Chứa', value: 'Chứa' },
                  { label: 'Bằng', value: 'Bằng' },
                  { label: 'Bắt đầu với', value: 'Bắt đầu với' },
                ]"
              />
            </div>
            <div class="filter-input-wrapper">
              <ms-input class="filter-input" placeholder="Giá trị lọc" />
            </div>
          </div>
        </div>

        <!-- Other Items -->
        <div v-for="item in otherFilters" :key="item" class="filter-item">
          <div class="filter-item-header">
            <input type="checkbox" />
            <span class="filter-item-label">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-footer">
      <ms-button class="btn-clear-filter" @click="$emit('close')">Bỏ lọc</ms-button>
      <ms-button type="primary" class="btn-apply-filter" @click="$emit('close')">Áp dụng</ms-button>
    </div>
  </div>
</template>

<script setup>
import MsInput from '@/components/control/MsInput.vue'
import MsSelect from '@/components/control/MsSelect.vue'
import MsButton from '@/components/control/MsButton.vue'

const emit = defineEmits(['close'])

const otherFilters = [
  'Mã thành phần',
  'Tên thành phần',
  'Loại thành phần',
  'Đơn vị áp dụng',
  'Tính chất',
  'Chịu thuế',
]
</script>

<style scoped>
.filter-sidebar {
  width: 300px;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  border-left: 1px solid #e5e5e5;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.filter-header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
}

.filter-title {
  font-size: 16px;
  font-weight: 700;
  color: #212121;
}

.filter-close {
  cursor: pointer;
  color: #666;
  font-size: 18px;
}

.filter-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.filter-search-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.icon-search-gray {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  mask: url('https://amisplatform.misacdn.net/apps/recruit2/assets/images/ICON.svg')
    no-repeat -308px -48px;
  background-color: #666;
  width: 16px;
  height: 16px;
}

.filter-search-input {
  width: 100%;
  height: 36px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 0 12px 0 36px;
  font-size: 14px;
  outline: none;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-item-header input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: #2680eb;
}

.filter-item-label {
  font-size: 14px;
  color: #212121;
}

.filter-item.active {
  background-color: #f0f7ff;
  padding: 12px;
  border-radius: 8px;
  margin: 0 -12px;
}

.filter-item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 26px;
}

.filter-select {
  width: 100%;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 13px;
  outline: none;
  background-color: #fff;
}

.filter-input {
  width: 100%;
  height: 32px;
  border: 1px solid #2680eb;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  outline: none;
}

.filter-footer {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e5e5e5;
  background-color: #fff;
}

.btn-clear-filter {
  height: 36px;
  padding: 0 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
}

.btn-apply-filter {
  height: 36px;
  padding: 0 20px;
  background-color: #2680eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-apply-filter:hover {
  background-color: #1e70d1;
}
</style>
