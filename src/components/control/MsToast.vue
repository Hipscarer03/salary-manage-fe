<template>
  <div class="ms-toast-container">
    <transition-group name="toast">
      <div v-for="toast in toasts" :key="toast.id" :class="['ms-toast', `ms-toast--${toast.type}`]">
        <div class="ms-toast__icon">
          <i :class="getIcon(toast.type)"></i>
        </div>
        <div class="ms-toast__content">
          <span class="ms-toast__message">{{ toast.message }}</span>
        </div>
        <div class="ms-toast__close" @click="remove(toast.id)">
          <i class="icon-x-white-small"></i>
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
</script>

<style scoped>
.ms-toast-container {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ms-toast {
  display: flex;
  align-items: center;
  min-width: 320px;
  max-width: 500px;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease;
}

.ms-toast--success {
  background-color: #0e9a62;
}

.ms-toast--error {
  background-color: #ef4444;
}

.ms-toast--warning {
  background-color: #ff9800;
}

.ms-toast--info {
  background-color: #2196f3;
}

.ms-toast__icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.ms-toast__icon i {
  background-color: #ffffff !important;
}

.ms-toast__content {
  flex: 1;
  display: flex;
  align-items: center;
}

.ms-toast__message {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  line-height: 1.4;
}

.ms-toast__close {
  margin-left: 16px;
  cursor: pointer;
  opacity: 0.8;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.ms-toast__close:hover {
  opacity: 1;
}

.ms-toast__close i {
  background-color: #ffffff !important;
}

/* Icons using masks */
.icon-toast-success {
  mask: url('/svg/others/IconCheck.svg') no-repeat center;
  width: 20px;
  height: 20px;
}

.icon-toast-error {
  mask: url('/svg/others/X.png') no-repeat center;
  width: 16px;
  height: 16px;
}

.icon-toast-warning {
  mask: url('/svg/others/Info.svg') no-repeat center;
  width: 20px;
  height: 20px;
}

.icon-toast-info {
  mask: url('/svg/others/Info.svg') no-repeat center;
  width: 20px;
  height: 20px;
}

.icon-x-white-small {
  mask: url('/svg/others/X.png') no-repeat center;
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
  transform: translateY(-40px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}

@keyframes slideDown {
  from {
    transform: translateY(-40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
