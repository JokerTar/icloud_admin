import RestModel from '@/api/restmodel'

class Model extends RestModel {
  /**
   * 3.1角色-列表
   * **/
  roleList(param = {}) {
    return this.fetchList(param, `/permission/api/role/list`)
  }

  /**
   * 3.6角色-菜单树
   * **/
  menuTree(param = {}) {
    return this.fetchList(param, `/permission/api/role/menuTree`)
  }

  /**
   * 3.8角色-配置保存
   * **/
  cfgSave(param = {}) {
    return this.updateModel(param, `/permission/api/role/cfgSave`, '确定保存角色配置？')
  }

  /**
   * 3.6角色-菜单树
   * **/
  list(deptBizCode = '') {
    return this.fetchList({}, `/permission/api/role/list?deptBizCode=${deptBizCode}`)
  }

  /**
   * 3.2角色-详情
   * **/
  getRole(bizCode = '') {
    return this.fetchList({}, `/permission/api/role/get?bizCode=${bizCode}`, 'get')
  }

  /**
   * 3.3角色-添加
   * **/
  addRole(param = {}) {
    return this.updateModel(param, `/permission/api/role/add`, '确定添加角色？')
  }

  /**
   * 3.4角色-修改
   * **/
  updateRole({ param = {}, message }) {
    return this.updateModel(param, `/permission/api/role/update`, message)
  }

  /**
   * 3.5角色-删除
   * **/
  removeRole({ query = {}, message }) {
    return this.updateModel(query, `/permission/api/role/remove`, message)
  }

  /**
   * 3.7角色-人员
   * **/
  userTree(param = {}) {
    return this.fetchList(param, `/permission/api/role/userTree`)
  }

  /**
   * 1.1组织树
   * **/
  orgTree(companyBizCode = '') {
    return this.fetchList({}, `/permission/api/org/tree?companyBizCode=${companyBizCode}`, 'get')
  }

  /**
   * 1.2部门-增加
   * **/
  orgAdd(param = {}) {
    return this.updateModel(param, `/permission/api/org/add`, '确定新增部门？')
  }

  /**
   * 1.3部门-修改
   * **/
  orgUpdate(param = {}) {
    return this.updateModel(param, `/permission/api/org/update`, '确定修改部门？')
  }

  /**
   * 1.4部门-详情
   * **/
  getOrge(bizCode = '') {
    return this.fetchList({}, `/permission/api/org/get?bizCode=${bizCode}`, 'get')
  }

  /**
   * 1.5部门-删除
   * **/
  orgRemove({ param = {}, message }) {
    return this.updateModel(param, `/permission/api/org/remove`, message)
  }

  /**
   * 2.1员工-列表
   * **/
  userList(param = {}) {
    return this.fetchList(param, `/permission/api/user/list`)
  }

  /**
   * 2.2员工-添加
   * **/
  addUser(param = {}) {
    return this.updateModel(param, `/permission/api/user/add`, '确定添加员工？')
  }

  /**
   * 2.2员工-修改
   * **/
  updateUser(param = {}) {
    return this.updateModel(param, `/permission/api/user/update`, '确定修改员工？')
  }

  /**
   * 2.4员工-详情
   * **/
  getUser(bizCode = '') {
    return this.fetchList({}, `/permission/api/user/get?bizCode=${bizCode}`, 'get')
  }

  /**
   * 2.5-员工-删除
   * **/
  removeUser(param = {}) {
    return this.updateModel(param, `/permission/api/user/remove`, '确定删除员工？')
  }

  /**
   * 2.6-员工-设置状态
   * **/
  setUserStatus({ param, message }) {
    return this.updateModel(param, `/permission/api/user/status`, message)
  }

  /**
   * 2.7-员工-重设密码
   * **/
  resetpwd(param = {}) {
    return this.updateModel(param, `/permission/api/user/resetpwd`, '确定重设密码？')
  }

  /**
   * 3.9角色初始化枚举
   * **/
  roleDict() {
    return this.fetchList({}, `/permission/api/role/dict`)
  }

  /**
   * 2.8 初始化员工枚举
   * **/
  userDict() {
    return this.fetchList({}, `/permission/api/user/dict`)
  }
}

const sysApp = new Model()

export default sysApp
