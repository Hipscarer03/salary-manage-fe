import axios from 'axios'
import APIConfig from '../config/APIConfig'

class BaseApi {
  constructor(endpoint) {
    this.axiosInstance = axios.create({
      baseURL: APIConfig.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.endpoint = endpoint
  }

  /**
   * Lấy tất cả bản ghi từ server
   */
  getAll() {
    return this.axiosInstance.get(this.endpoint)
  }

  /**
   * Lấy một bản ghi theo ID
   * @param {string|number} id ID của bản ghi
   */
  getById(id) {
    return this.axiosInstance.get(`${this.endpoint}/${id}`)
  }

  /**
   * Tạo mới một bản ghi
   * @param {Object} data Dữ liệu cần tạo
   */
  create(data) {
    return this.axiosInstance.post(this.endpoint, data)
  }

  /**
   * Cập nhật thông tin bản ghi hiện có
   * @param {string|number} id ID bản ghi cần cập nhật
   * @param {Object} data Dữ liệu mới
   */
  update(id, data) {
    return this.axiosInstance.put(`${this.endpoint}/${id}`, data)
  }

  /**
   * Xóa một bản ghi theo ID
   * @param {string|number} id ID bản ghi cần xóa
   */
  delete(id) {
    return this.axiosInstance.delete(`${this.endpoint}/${id}`)
  }

  /**
   * Lấy dữ liệu có phân trang, tìm kiếm và sắp xếp
   * @param {Object} params Tham số lọc và phân trang
   */
  getPaging(params) {
    return this.axiosInstance.get(`${this.endpoint}/Filter`, { params })
  }
}

export default BaseApi
