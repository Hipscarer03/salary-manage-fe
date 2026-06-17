<template>
  <a-table
    v-bind="$attrs"
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    class="ms-table"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
  </a-table>
</template>

<script setup>
/**
 * Thành phần bảng dữ liệu dựa trên Ant Design Table
 */
import { defineProps } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  dataSource: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: [Object, Boolean],
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.ant-table-row-selected {
  background-color: var(--ms-color-primary-light-default) !important;
}
</style>
