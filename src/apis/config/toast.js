import { reactive } from 'vue'

const state = reactive({
  toasts: [],
})

const toast = {
  /**
   * Thêm một thông báo mới vào danh sách
   * @param {Object} options Cấu hình thông báo { type: 'success' | 'error' | 'info', message: string, duration: number }
   */
  add(options) {
    const id = Date.now()
    const { type = 'success', message = '', duration = 3000 } = options

    state.toasts.push({ id, type, message })

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }
  },

  /**
   * Hiển thị thông báo thành công
   * @param {string} message Nội dung thông báo
   * @param {number} duration Thời gian hiển thị (ms)
   */
  success(message, duration) {
    this.add({ type: 'success', message, duration })
  },

  /**
   * Hiển thị thông báo lỗi
   * @param {string} message Nội dung thông báo
   * @param {number} duration Thời gian hiển thị (ms)
   */
  error(message, duration) {
    this.add({ type: 'error', message, duration })
  },

  /**
   * Hiển thị thông báo thông tin
   * @param {string} message Nội dung thông báo
   * @param {number} duration Thời gian hiển thị (ms)
   */
  info(message, duration) {
    this.add({ type: 'info', message, duration })
  },

  /**
   * Hiển thị thông báo cảnh báo
   * @param {string} message Nội dung thông báo
   * @param {number} duration Thời gian hiển thị (ms)
   */
  warning(message, duration) {
    this.add({ type: 'warning', message, duration })
  },

  /**
   * Xóa thông báo khỏi danh sách theo ID
   * @param {string|number} id ID thông báo cần xóa
   */
  remove(id) {
    const index = state.toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      state.toasts.splice(index, 1)
    }
  },

  get toasts() {
    return state.toasts
  },
}

export default toast
