<template>
  <div class="ms-input" :class="[className]">
    <label v-if="label" class="ms-input__label">{{ label }}</label>
    <div class="ms-input__container" :class="{ 'error-border': error }">
      <a-input
        v-bind="$attrs"
        :placeholder="placeholder"
        :value="displayValue"
        @input="handleInput"
        :bordered="false"
      >
        <!-- <a-input
        v-bind="$attrs"
        :placeholder="placeholder" 
        :value="displayValue"
        @change="handleInput"
        :bordered="false"
      > -->
        <template v-if="prefixIcon" #prefix>
          <div :class="prefixIcon"></div>
        </template>
      </a-input>
    </div>
    <div v-if="showError && error" class="ms-input__error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  showError: {
    type: Boolean,
    default: true,
  },
  prefixIcon: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
  isNumber: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

/**
 * Định dạng số thành chuỗi có dấu chấm phân cách hàng nghìn
 * @param {number|string} val Giá trị cần định dạng
 */
const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return ''
  const str = val.toString().replace(/\D/g, '')
  if (!str) return ''
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Giá trị hiển thị thực tế trên ô nhập liệu (đã được định dạng nếu là số)
 */
const displayValue = computed(() => {
  if (props.isNumber) {
    return formatNumber(props.modelValue)
  }
  return props.modelValue
})

/**
 * Xử lý khi người dùng nhập liệu vào ô input
 * @param {Event} event Sự kiện nhập liệu
 */
const handleInput = (event) => {
  let value = event.target.value
  if (props.isNumber) {
    // Chỉ giữ lại các chữ số
    const rawValue = value.replace(/\D/g, '')
    // Emit giá trị số nguyên hoặc null nếu trống
    const numericValue = rawValue ? parseInt(rawValue) : null
    emit('update:modelValue', numericValue)

    // Ép buộc input hiển thị lại giá trị đã định dạng để đồng bộ ngay lập tức
    event.target.value = formatNumber(numericValue)
  } else {
    emit('update:modelValue', value)
  }
}
// const handleInput = (event) => {
// let rawValue = event?.target ? event.target.value : event;

//   // Trường hợp khi đang gõ IME mà bị undefined, ta lấy giá trị hiện tại của props thay thế
//   // hoặc gán bằng chuỗi rỗng để không bị sập logic phía sau
//   if (rawValue === undefined || rawValue === null) {
//     rawValue = '';
//   }

//   if (props.isNumber) {
//     const digits = rawValue.toString().replace(/\D/g, '')
//     const numericValue = digits ? parseInt(digits) : ''
//     emit('update:modelValue', numericValue)
//   } else {
//     // Ép emit giá trị liên tục kể cả khi đang gõ dở
//     emit('update:modelValue', rawValue)
//   }
// }
</script>

<style scoped>
.ms-input-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ms-input {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.ms-input__label {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
}

.ms-input__container {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  height: 36px;
  background-color: #fff;
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

.ms-input__error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  height: 20px;
  line-height: 20px;
}

:deep(.ant-input),
:deep(.ant-input-affix-wrapper) {
  border: none !important;
  box-shadow: none !important;
  padding: 0 8px !important;
  height: 100% !important;
  background: transparent !important;
}

:deep(.ant-input-prefix) {
  margin-right: 8px !important;
}
</style>
