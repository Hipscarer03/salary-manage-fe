<template>
  <div class="ms-combobox">
    <label v-if="label" class="ms-combobox__label">{{ label }}</label>
    <div class="ms-combobox__container" :class="{ 'error-border': error }">
      <a-select
        v-bind="$attrs"
        :options="options"
        :value="modelValue"
        @change="updateValue"
        class="ms-combobox__select"
        :bordered="false"
      >
        <template v-for="slotName in Object.keys($slots)" :key="slotName" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps"></slot>
        </template>
      </a-select>
      <!-- <div class="ms-combobox__divider"></div>
      <div class="ms-combobox__add-btn" @click="$emit('add')">
        <div class="icon-plus-gray"></div>
      </div> -->
    </div>
    <div class="ms-combobox__error" v-if="error">{{ error }}</div>
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

const emit = defineEmits(['update:modelValue', 'change', 'add'])

/**
 * Cập nhật giá trị khi người dùng thay đổi lựa chọn trong combobox
 * @param {any} value Giá trị được chọn
 */
const updateValue = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.ms-combobox {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.ms-combobox__label {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
}

.ms-combobox__container {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  min-height: 32px;
  background-color: #fff;
  transition: border-color 0.2s;
}

.ms-combobox__container:hover {
  border-color: #c0c4cc;
}

.ms-combobox__container:focus-within {
  border-color: #0E9A62;
}

.ms-combobox__container.error-border {
  border-color: #ef4444 !important;
}

.ms-combobox__error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  height: 20px;
  line-height: 20px;
}

.ms-combobox__select {
  flex: 1;
  min-width: 0;
}

.icon-plus-gray {
  mask: url('/svg/others/IconPlus.svg') no-repeat center;
  -webkit-mask: url('/svg/others/IconPlus.svg') no-repeat center;
  mask-size: contain;
  -webkit-mask-size: contain;
  background-color: #717680;
  width: 16px;
  height: 16px;
  display: block;
}

/* Remove default Ant Design Select border */
:deep(.ant-select-selector) {
  border: none !important;
  box-shadow: none !important;
  min-height: 30px !important;
  display: flex;
  align-items: center;
  background: transparent !important;
}

:deep(.ant-select-selection-placeholder),
:deep(.ant-select-selection-item) {
  line-height: 30px !important;
}

.ms-combobox__divider {
  width: 1px;
  height: 20px;
  background-color: #e5e5e5;
  flex-shrink: 0;
}

.ms-combobox__add-btn {
  width: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: #666;
  border-left: none;
}

.ms-combobox__add-btn:hover {
  background-color: #f5f7fa;
  color: #0E9A62;;
}
</style>
