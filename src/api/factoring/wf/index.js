import RestModel from '@/api/restmodel'

class Model extends RestModel {
  modelSaveUrl = `/wf/api/model/save`

  /**
   * 发布列表-分页
   * **/
  dict() {
    return this.fetchList({}, `/wf/api/dict`)
  }

  /**
   * 发布列表-分页
   * **/
  devPage(param = {}) {
    return this.fetchList(param, `/wf/api/dev/page`)
  }

  /**
   * 发布查看
   * **/
  devView(bizCode = '') {
    return this.fetchList({}, `/wf/api/dev/view?bizCode=${bizCode}`)
  }

  /**
   * 发布保存
   * **/
  devSave(param = {}) {
    return this.updateModel(param, `/wf/api/dev/save`, '确定保存？')
  }

  /**
   * 发布删除
   * **/
  devRemove(procDefId = '') {
    return this.updateModel({}, `/wf/api/dev/remove?procDefId=${procDefId}`, '确定删除？')
  }

  /**
   * 发布查看流程图
   * **/
  devViewPic(bizCode = '') {
    return this.fetchList({}, `/wf/api/dev/viewPic?bizCode=${bizCode}`)
  }

  /**
   * 查询流程发布列表
   * **/
  devList(param = {}) {
    return this.fetchList(param, `/wf/api/dev/list`)
  }

  /**
   * 查询流程模式列表
   * **/
  modelList(param = {}) {
    return this.fetchList(param, `/wf/api/model/list`)
  }

  /**
   * 查询流程模式
   * **/
  modelGet(id = '') {
    return this.fetchList({}, `/wf/api/model/get?id=${id}`, 'get')
  }

  /**
   * 删除流程模式
   * **/
  modelRemove(id = '') {
    return this.updateModel({}, `/wf/api/model/remove?id=${id}`, '确定删除？')
  }

  /**
   * 查询流程图列表
   * **/
  modelWfs() {
    return this.fetchList({}, `/wf/api/model/wfs`, 'get')
  }

  /**
   * 保存流程模式
   * **/
  modelSave(param = {}) {
    return this.updateModel(param, `/wf/api/model/save`, '确定保存？')
  }

  /**
   * 查询流程配置列表
   * **/
  cfgList(param = {}) {
    return this.fetchList(param, `/wf/api/cfg/list`)
  }

  /**
   * 查询流程配置
   * **/
  cfgGet(id = '') {
    return this.fetchList({}, `/wf/api/cfg/get?id=${id}`, 'get')
  }

  /**
   * 查询流程节点配置明细
   * **/
  getConfigById(id = '') {
    return this.fetchList({}, `/wf/api/cfg/getConfigById?id=${id}`, 'get')
  }

  /**
   * 查询人员列表
   * **/
  userTree(param = {}) {
    return this.fetchList(param, `/wf/api/cfg/userTree`)
  }

  /**
   * 查询角色列表
   * **/
  roles(param = {}) {
    return this.fetchList(param, `/wf/api/cfg/roles`)
  }

  /**
   * 保存流程节点配置
   * **/
  cfgSave(param = {}) {
    return this.updateModel(param, `/wf/api/cfg/save`, '确定保存？')
  }

  /**
   * 查询流程图
   * **/
  wfPic(defId = '') {
    return this.fetchList({}, `/wf/api/cfg/wfPic?defId=${defId}`, 'get')
  }

  /**
   * 获取待办
   */
  backlog(params) {
    return this.fetchList(params, `/wf/api/audit/backlog`)
  }

  /**
   * 获取已办
   */
  haveDone(params) {
    return this.fetchList(params, `/wf/api/audit/haveDone`)
  }

  /**
   * 业务单据是否存在流程实例
   */
  isExistsProcessing(params = {}) {
    return this.fetchList(params, `/wf/api/audit/isExistsProcessing`)
  }

  /**
   * 流程提交
   */
  auditSubmit(params = {}) {
    return this.updateModel(params, `/wf/api/audit/submit`)
  }

  /**
   * 查看审批中的流程图
   */
  processingPic(instId = '') {
    return this.fetchList({}, `/wf/api/audit/processingPic?instId=${instId}`)
  }

  /**
   * 获取任务信息
   */
  auditProgress(taskId = '') {
    return this.fetchList({}, `/wf/api/audit/process?taskId=${taskId}`, 'get')
  }

  /**
   * 查看流程
   */
  auditView(params = {}) {
    return this.fetchList(params, `/wf/api/audit/view`)
  }

  /**
   * 保存流程审批
   */
  auditSave(params = {}) {
    return this.updateModel(params, `/wf/api/audit/save`)
  }

  /**
   * 暂存审批信息
   */
  tsSave(params = {}) {
    return this.updateModel(params, `/wf/api/audit/tsSave`)
  }

  /**
   * 流程下一步处理人
   */
  auditNextUsers(params = {}) {
    return this.fetchList(params, `/wf/api/audit/nextUsers`)
  }

  /**
   * 过程
   */
  process(taskId) {
    return this.fetchList(null, `/wf/api/audit/process?taskId=${taskId}`, 'get')
  }

  /**
   * 4.1审批-下一步处理人BY人员bizCode
   */
  nextUserByBizCode(params = {}) {
    return this.fetchList(params, `/wf/api/audit/nextUserByBizCode`)
  }

  /**
   * 4.2审批-下一步处理人BY角色bizCode
   */
  nextUserByRoleBizCode(params = {}) {
    return this.fetchList(params, `/wf/api/audit/nextUserByRoleBizCode`)
  }

  /**
   * 4.3配置-流程处理人员
   */
  users(params = {}) {
    return this.fetchList(params, `/wf/api/cfg/users`)
  }

  /**
   * 业务单据是否存在流程实例
   */
  isProcess(params = {}) {
    return this.fetchList(params, `/wf/api/audit/isProcess`)
  }

  /**
   * 是否可以提交流程
   */
  isCanSubmitWf(bizCode , url) {
    return this.fetchList(null, url+`?bizCode=${bizCode}`)
  }
}

const sysApp = new Model()

export default sysApp
