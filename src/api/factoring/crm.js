import RestModel from '@/api/restmodel'

class Model extends RestModel {
  /**
   * 3注册地址-查询所有省
   * **/
  provinceList() {
    return this.fetchList({}, `/data/province/list`)
  }

  /**
   * 3注册地址-查询市、区
   * **/
  areaList(pid) {
    if (!pid) return
    return this.fetchList({}, `/data/area/list?pid=${pid}`)
  }

  /**
   * 4企业行业分类-大分类
   * **/
  linkageList(param = {}) {
    return this.fetchList(param, `/data/linkage/list`)
  }

  /**
   * 4企业行业分类-子分类
   * **/
  linkageChild(pid) {
    if (pid === 0 || pid) {
      return this.fetchList({}, `/data/linkage/getChild?pid=${pid}`)
    }
  }
}

const sysApp = new Model()

export default sysApp
