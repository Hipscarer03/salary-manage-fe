<script setup>
import { ref, watch, computed } from 'vue'

const rows = ref(1)
const columns = ref(1)
const bg = ref([])

watch([rows, columns], () => {
  bg.value = []
  for (let i = 0; i < rows.value * columns.value; i++) {
    bg.value.push('white')
  }
})
</script>

<template>
  <div>
    Nhập số hàng
    <input v-model.number="rows" />
    <button @click="rows++">Tăng hàng</button>
    <button @click="rows--" :disabled="rows < 2">Giảm hàng</button>
    Nhập số cột
    <input v-model.number="columns" />
    <button @click="columns++">Tăng cột</button>
    <button @click="columns--" :disabled="columns < 2">Giảm cột</button>
    <h3>Đã tạo bảng {{ rows }} x {{ columns }} ô</h3>

    <div class="grid">
      <div v-for="row in rows" :key="row" :style="{ display: 'flex', gap: '3px', color: 'black' }">
        <!-- <div>i: {{ item }}</div> -->
        <div
          v-for="col in columns"
          :key="col"
          class="cell"
          :style="{ backgroundColor: bg[columns * (row - 1) + (col - 1)] }"
          :id="columns * (row - 1) + col -1"
        >
          <input type="text" v-model="bg[columns * (row - 1) + (col - 1)]" class="bg" />
          <!-- {{ row }}, {{ col }} -->
        </div>
      </div>
    </div>
    <!-- <h3>{{ bg }}</h3> -->
  </div>
</template>

<style scoped>
.cell {
  width: 50px;
  height: 50px;
  background-color: rgb(247, 247, 247);
  border: 1px, solid rgb(14, 200, 91);
  margin-bottom: 3px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  width: 35px;
  height: 35px;
  outline: none;
  border: none;
  background: transparent;
}
</style>
