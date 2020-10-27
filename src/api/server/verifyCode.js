import RestModel from '@/api/restmodel'

class Model extends RestModel {
  fetchCode(query) {
    return this.fetchList(query, '/admin/login/user/verify/code')
  }
}

const sysApp = new Model()

export default sysApp
