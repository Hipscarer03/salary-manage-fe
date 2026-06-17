<template>
  <div class="ms-select" :class="$attrs.class" :style="$attrs.style">
    <label v-if="label" class="ms-select__label">{{ label }}</label>
    <a-select
      v-bind="$attrs"
      :options="options"
      :value="modelValue"
      @change="updateValue"
      class="ms-select__input"
      :class="{ 'error-border': error }"
      :show-arrow="true"
    >
      <slot></slot>
      <template #suffixIcon>
        <div class="icon-dropdown"></div>
      </template>
    </a-select>
    <div v-if="error" class="ms-select__error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number, Array],
    default: undefined,
  },
  options: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

/**
 * Cập nhật giá trị khi người dùng thay đổi lựa chọn
 * @param {any} value Giá trị được chọn
 */
const updateValue = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.ms-select {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.ms-select__input:hover {
  /* height: 36px; */
  /* border: 1px solid #0e9a62; */
  /* border-radius: 8px; */
}

.ms-select__label {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
}

.ms-select__error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  height: 20px;
  line-height: 20px;
}

:deep(.ant-select-selector) {
  border-radius: 8px !important;
  border-color: rgb(219, 219, 219)  !important;
  height: 32px !important;
  display: flex;
  align-items: center;
}

:deep(.ant-select:hover .ant-select-selector) {
  border-color: #0e9a62 !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #0e9a62 !important;
  box-shadow: 0 0 0 2px rgba(14, 154, 98, 0.15) !important;
}

.w-200 {
  width: 200px !important;
}

.ms-select__input.error-border :deep(.ant-select-selector) {
  border-color: #ef4444 !important;
}

.icon-dropdown {
  width: 12px;
  height: 12px;
  background-image: url(./svg/others/ArrowDown.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
