import BaseApi from '../../base/BaseApi'

class TodoApi extends BaseApi {
  constructor() {
    super('Todos') // Resource endpoint
  }

  // Add specific todo API calls here
  getTodoStatus() {
    return this.axiosInstance.get(`${this.endpoint}/status`)
  }
}

const todoApi = new TodoApi()
export default todoApi
