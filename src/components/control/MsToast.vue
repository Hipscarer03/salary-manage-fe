<template>
  <div class="ms-toast-container">
    <transition-group name="toast">
      <div v-for="toast in toasts" :key="toast.id" :class="['ms-toast', `ms-toast--${toast.type}`]">
        <div class="ms-toast__icon">
          <i :class="getIcon(toast.type)"></i>
        </div>
        <div class="ms-toast__content">
          <span class="ms-toast__type-label">{{ getTypeLabel(toast.type) }}!</span>
          <span class="ms-toast__message">{{ toast.message }}</span>
        </div>
        <div class="ms-toast__close" @click="remove(toast.id)">
          <i class="icon-x-gray-small"></i>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import toast from '@/apis/config/toast'
import { computed } from 'vue'

const toasts = computed(() => toast.toasts)

/**
 * Xóa thông báo khỏi danh sách theo ID
 * @param {string|number} id ID của thông báo
 */
const remove = (id) => {
  toast.remove(id)
}

/**
 * Lấy class icon tương ứng với loại thông báo
 * @param {string} type Loại thông báo
 */
const getIcon = (type) => {
  switch (type) {
    case 'success':
      return 'icon-toast-success'
    case 'error':
      return 'icon-toast-error'
    case 'warning':
      return 'icon-toast-warning'
    default:
      return 'icon-toast-info'
  }
}

/**
 * Lấy nhãn hiển thị cho loại thông báo
 * @param {string} type Loại thông báo
 */
const getTypeLabel = (type) => {
  switch (type) {
    case 'success':
      return 'Thành công'
    case 'error':
      return 'Lỗi'
    case 'warning':
      return 'Cảnh báo'
    default:
      return 'Thông tin'
  }
}
</script>

<style scoped>
.ms-toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ms-toast {
  display: flex;
  align-items: center;
  min-width: 300px;
  max-width: 450px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #ccc;
  animation: slideIn 0.3s ease;
}

.ms-toast--success {
  border-left-color: #28a745;
}

.ms-toast--error {
  border-left-color: #dc3545;
}

.ms-toast--warning {
  border-left-color: #ffc107;
}

.ms-toast--info {
  border-left-color: #17a2b8;
}

.ms-toast__icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.ms-toast__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ms-toast__type-label {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
}

.ms-toast--success .ms-toast__type-label {
  color: #28a745;
}
.ms-toast--error .ms-toast__type-label {
  color: #dc3545;
}
.ms-toast--warning .ms-toast__type-label {
  color: #ffc107;
}
.ms-toast--info .ms-toast__type-label {
  color: #17a2b8;
}

.ms-toast__message {
  font-size: 14px;
  color: #333;
}

.ms-toast__close {
  margin-left: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.ms-toast__close:hover {
  opacity: 1;
}

/* Icons using masks */
.icon-toast-success {
  mask: url('/svg/others/IconCheck.svg') no-repeat center;
  background-color: #28a745;
  width: 20px;
  height: 20px;
}

.icon-toast-error {
  mask: url('/svg/others/X.png') no-repeat center;
  background-color: #dc3545;
  width: 18px;
  height: 18px;
}

.icon-toast-warning {
  mask: url('/svg/others/Info.svg') no-repeat center;
  background-color: #ffc107;
  width: 20px;
  height: 20px;
}

.icon-toast-info {
  mask: url('/svg/others/Info.svg') no-repeat center;
  background-color: #17a2b8;
  width: 20px;
  height: 20px;
}

.icon-x-gray-small {
  mask: url('/svg/others/X.png') no-repeat center;
  background-color: #64748b;
  width: 12px;
  height: 12px;
  display: block;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
