import RestModel from '@/api/restmodel'

class Model extends RestModel {
  /**
   * 初始化 票据签发 所需枚举 数据
   * **/
  dict(param = {}) {
    return this.fetchList(param, `/scb/api/issue/initData`)
  }

  /**
   * 分页查询结果
   * **/
  list(param = {}) {
    return this.fetchList(param, `/scb/api/issue/list`)
  }

  /**
   * 详情
   * **/
  getInfo(bizCode = '') {
    return this.fetchList({}, `/scb/api/issue/getInfo?bizCode=${bizCode}`)
  }

  /**
   * 导出Excel
   * **/
  exportExcel({ bptxStatus= [], billType= [], startDate= '', endDate = '', gtAmt = '', ltAmt = '' }) {
    const url = `${process.env.VUE_APP_BASE_API}scb/api/issue/exportExcel?`
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
  invoiceList(issueBizCode = '') {
    return this.fetchList({}, `/scb/api/issue/getInvoiceListByIssueBizCode?issueBizCode=${issueBizCode}`)
  }

  /**
   * 合同信息列表
   * **/
  contractList(issueBizCode = '') {
    return this.fetchList({}, `/scb/api/issue/getContractListByIssueBizCode?issueBizCode=${issueBizCode}`)
  }

  /**
   * 其他信息列表
   * **/
  otherfileList(issueBizCode = '') {
    return this.fetchList({}, `/scb/api/issue/getOtherfileListByIssueBizCode?issueBizCode=${issueBizCode}`)
  }
}

const sysApp = new Model()

export default sysApp
