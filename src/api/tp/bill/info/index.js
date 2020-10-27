import RestModel from '@/api/restmodel'

class Model extends RestModel {
  /**
   * 初始化 授信企业 所需枚举 数据
   * **/
  dict(param = {}) {
    return this.fetchList(param, `/scb/api/billinfo/initData`)
  }

  /**
   * 授信信息 分页查询结果
   * **/
  list(param = {}) {
    return this.fetchList(param, `/scb/api/billinfo/list`)
  }

  /**
   * 详情
   * **/
  getInfo(bizCode = '') {
    return this.fetchList({}, `/scb/api/billinfo/getInfo?bizCode=${bizCode}`)
  }

  /**
   * 导出Excel
   * **/
  exportExcel({startDate='', endDate='',minAmt='',maxAmt='',isClean='', isLock='' }) {
    const url = `${process.env.VUE_APP_BASE_API}/scb/api/billinfo/exportExcel`
    const param = `startDate=${startDate}&endDate=${endDate}&minAmt=${minAmt}&maxAmt=${maxAmt ? maxAmt : ''}&isClean=${isClean}&isLock=${isLock}`
    window.open(`${url}?${param}`)
  }

  /**
   * 锁定
   * **/
  lock(bizCode = '') {
    return this.updateModel({}, `/scb/api/billinfo/lock?bizCode=${bizCode}`, '确定锁定？')
  }

  /**
   * 解除锁定
   * **/
  unLock(bizCode = '') {
    return this.updateModel({}, `/scb/api/billinfo/unLock?bizCode=${bizCode}`, '确定解除锁定？')
  }
}

const sysApp = new Model()

export default sysApp
