<template>
  <div class="sidebar" :class="{ collapsed: isToggle }" ref="sidebar">
    <div class="sidebar_menu">
      <div v-for="(menu, index) in sidebarMenus" :key="index">
        <div v-if="menu.type === 'divider'" class="sidebar-divider"></div>

        <div
          v-else
          class="sidebar_menu_item"
          :class="{ active: selectedIndex === index }"
          @click="selectMenu(index)"
        >
          <div :class="menu.icon + ' sidebar_menu_item_icon'"></div>
          <div class="sidebar_menu_item_title">{{ menu.title }}</div>

          <!-- Dropdown arrow -->
          <div v-if="menu.type === 'complex' && !isToggle" class="sidebar_menu_dropdown_icon"></div>
        </div>
      </div>
    </div>

    <!-- Nút thu gọn sidebar -->
    <div class="sidebar_toggle" @click="handleToggleSidebar" title="Thu gọn/Mở rộng">
      <div class="sidebar_toggle_icon"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const sidebarMenus = [
  { title: 'Tổng quan', icon: 'icon-home', type: 'simple' },
  { title: 'Thành phần lương', icon: 'icon-salary-compositions', type: 'simple' },
  { title: 'Mẫu bảng lương', icon: 'icon-payroll-templates', type: 'simple' },
  { title: 'Dữ liệu tính lương', icon: 'icon-payroll-data', type: 'complex' },
  { title: 'Tính lương', icon: 'icon-calculate-salary', type: 'complex' },
  { title: 'Chi trả', icon: 'icon-payout', type: 'complex' },
  { title: 'Báo cáo', icon: 'icon-reports', type: 'simple' },
]

const emit = defineEmits(['toggleSidebar'])

const isToggle = ref(false)
// currently selected menu index
const selectedIndex = ref(1)

const handleToggleSidebar = () => {
  isToggle.value = !isToggle.value
  emit('toggleSidebar', isToggle.value)
}

watch(selectedIndex, (newIndex) => {
  console.log('Selected menu index changed to:', newIndex)
})
function selectMenu(index) {
  // ignore invalid index or divider rows
  if (!sidebarMenus[index] || sidebarMenus[index].type === 'divider') return

  selectedIndex.value = index
}
</script>

<style>
@import '@/assets/css/common.css';
@import '@/assets/css/icon.css';

.active{
  background-color: #A8D9C8;
  border-radius: 8px;
}

.active .sidebar_menu_item_icon {
  background-color: rgb(14, 154, 98);
}

.active .sidebar_menu_item_title {
  color: rgb(14, 154, 98);
}
</style>
