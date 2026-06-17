<template>
  <a-button v-bind="$attrs" :class="buttonClass">
    <slot></slot>
  </a-button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
})

/**
 * Tính toán class CSS cho button dựa trên thuộc tính type
 */
const buttonClass = computed(() => {
  return `ms-button ms-button--${props.type}`
})
</script>

<style scoped>
.ms-button {
  border-radius: 4px;
}
</style>
