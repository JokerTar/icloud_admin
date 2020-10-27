import RestModel from '@/api/restmodel'

class Model extends RestModel {
  /**
   * 字典
   * **/
  initList() {
    return this.fetchList({}, `/dataPermission/api/dimension/initList`)
  }

  /**
   * 5.0.当前公司的所有架构节点
   * **/
  nodesTree(param = {}) {
    return this.fetchList(param, `/dataPermission/api/node/nodesTree`)
  }

  /**
   * 5.1.当前公司在当前节点的待选人员和已选人员
   * **/
  users(param = {}) {
    return this.fetchList(param, `/dataPermission/api/node/users`)
  }

  /**
   * 5.2.当前公司在当前节点的跨架构节点信息
   * **/
  nodes(param = {}) {
    return this.fetchList(param, `/dataPermission/api/node/nodes`)
  }

  /**
   * 5.3.架构节点增加
   * **/
  nodeAdd(param = {}) {
    return this.updateModel(param, `/dataPermission/api/node/add`, '确定增加？')
  }

  /**
   * 5.4.架构节点修改
   * **/
  nodeUpdate(param = {}) {
    return this.updateModel(param, `/dataPermission/api/node/update`, '确定修改？')
  }

  /**
   * 5.5.架构节点删除
   * **/
  nodeRemove(param = {}) {
    return this.updateModel(param, `/dataPermission/api/node/remove`, '确定删除？')
  }

  /**
   * 5.6.管理维度列表
   * **/
  list(param = {}) {
    return this.fetchList(param, `/dataPermission/api/dimension/list`)
  }

  /**
   * 5.7.管理维度增加
   * **/
  dimensionAdd(param = {}) {
    return this.updateModel(param, `/dataPermission/api/dimension/add`, '确定增加？')
  }

  /**
   * 5.8.管理维度修改
   * **/
  dimensionUpdate(param = {}) {
    return this.updateModel(param, `/dataPermission/api/dimension/update`, '确定修改？')
  }

  /**
   * 5.9.管理维度删除
   * **/
  dimensionRemove(param = {}) {
    return this.updateModel(param, `/dataPermission/api/dimension/remove`, '确定删除？')
  }

  /**
   * 5.10.管理维度启用禁用
   * **/
  dimensionSetStatus(param = {}, message) {
    return this.updateModel(param, `/dataPermission/api/dimension/setStatus`, `确定${message}？`)
  }

  /**
   * 5.11.数据权限sql拼接
   * **/
  dpsql(param = {}) {
    return this.updateModel(param, `/dataPermission/api/dpsql`, '确定拼接数据权限sql？')
  }

  /**
   * 5.12.架构节点查询
   * **/
  nodeGet(param = {}) {
    return this.fetchList(param, `/dataPermission/api/node/get`)
  }
}

const sysApp = new Model()

export default sysApp
