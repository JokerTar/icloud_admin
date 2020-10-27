import RestModel from '@/api/restmodel'

class Model extends RestModel {
  /**
   * 初始化 票据背书 所需枚举 数据
   * **/
  dict(param = {}) {
    return this.fetchList(param, `/scb/api/endorse/initData`)
  }

  /**
   * 分页查询结果
   * **/
  list(param = {}) {
    return this.fetchList(param, `/scb/api/endorse/list`)
  }

  /**
   * 详情
   * **/
  getInfo(bizCode = '') {
    return this.fetchList({}, `/scb/api/endorse/getInfo?bizCode=${bizCode}`)
  }

  /**
   * 导出Excel
   * **/
  exportExcel({ bptxStatus= [], billType= [], startDate= '', endDate = '', gtAmt = '', ltAmt = '' }) {
    const url = `${process.env.VUE_APP_BASE_API}scb/api/endorse/exportExcel?`
    let param = ''
    let bptxStatusP = ''
    let billTypeP = ''
    param = `startDate=${startDate}&endDate=${endDate}&gtAmt=${gtAmt}&ltAmt=${ltAmt}`
    bptxStatus.forEach(item => {
      bptxStatusP = `${bptxStatusP}&bptxStatus=${item}`
    })
    billType.forEach(item => {
      billTypeP = `${billTypeP}&billType=${item}`
    })
    console.log(`${url}${param}${bptxStatusP}${billTypeP}`)
    window.open(`${url}${param}${bptxStatusP}${billTypeP}`)
  }

  /**
   * 发票信息列表
   * **/
  invoiceList(endorseBizCode = '') {
    return this.fetchList({}, `/scb/api/endorse/getInvoiceListByEndorseBizCode?endorseBizCode=${endorseBizCode}`)
  }

  /**
   * 合同信息列表
   * **/
  contractList(endorseBizCode = '') {
    return this.fetchList({}, `/scb/api/endorse/getContractListByEndorseBizCode?endorseBizCode=${endorseBizCode}`)
  }

  /**
   * 其他信息列表
   * **/
  otherfileList(endorseBizCode = '') {
    return this.fetchList({}, `/scb/api/endorse/getOtherfileListByEndorseBizCode?endorseBizCode=${endorseBizCode}`)
  }
}

const sysApp = new Model()

export default sysApp
