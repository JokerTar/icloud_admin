import request from '@/utils/request'
import moment from 'moment'
import { MessageBox, Message , Loading  } from 'element-ui'
let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
  loading=Loading.service({ text: '正在加载中......',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.7)' })
}
function endLoading() {    //使用Element loading-close 方法
  loading.close()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export function FormatDateTime(sour) {
  var rtn = {}
  for (var key in sour) {
    var dtval = sour[key] + ''
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
    var r = dtval.match(reg)
    if (r != null) {
      var tmp = new Date(dtval)
      if (!isNaN(tmp.getDay())) {
        // 'yyyy-mm-ddThh:mm:ss000Z
        // rtn[key] = (new Date(dtval)).toISOString()
        // rtn[key] = dtval.split(' ').join('T') + '.000Z'
        rtn[key] = moment(dtval).utc().format('YYYY-MM-DD HH:mm:ss').split(' ').join('T') + '.000Z'
        console.info('convert datetime', dtval, rtn[key])
        continue
      }
    }
    rtn[key] = sour[key]
  }
  // 兼容ie时间格式
  for (const key in rtn) {
    if (key === 'createDate' || key === 'updateDate' || key === 'birthday' || key === 'hiredate' || key === 'leavedate') {
      if (rtn[key] && rtn[key].indexOf('000Z') <= -1) {
        rtn[key] = moment(rtn[key]).utc().format('YYYY-MM-DD HH:mm:ss').split(' ').join('T') + '.000Z'
      }
    }
  }
  console.log('rtn', rtn)
  return rtn
}

export default class RestModel {
  constructor(url, newModel) {
    this.Modelname = url
    this.model = newModel
  }

  fetchDownLoad(query, url, method = 'get') {
    return request({
      url,
      method,
      data: query
    }).then(response => {
      return response
    })
  }

  fetchList(query, url, method = 'post') {
    return request({
      url,
      method,
      data: query
    }).then(response => {
      return response.body
    }).catch(err => {
      return err
    })
  }
  fetchListWithLoading(query, url, method = 'post') {
    showFullScreenLoading()
    return request({
      url,
      method,
      data: query
    }).then(response => {
      tryHideFullScreenLoading()
      return response.body
    })
  }
  createModel(data, url) {
    // 设置插入标志
    return request({
      url,
      method: 'post',
      data
    }).then(response => response.body)
  }
  updateModel(data, url, message) {
    return new Promise((resolve, reject) => {
      if (!message) {
        // 打开加载层
        showFullScreenLoading()
        return request({
          url,
          method: 'post',
          data
        }).then(response => {
          // 关闭加载层
          tryHideFullScreenLoading()
          if (response && response.ok) {
            Message.success({
              message: '操作成功！'
            })
            resolve(response.body)
            return response.body
          } else {
            Message.warning({
              dangerouslyUseHTMLString: true,
              message: '操作失败！',
              showClose: true,
              duration: 5 * 1000
            })
            // reject()
          }
        }).catch(() => {
          // 关闭加载层
          tryHideFullScreenLoading()
          // reject()
        })
      } else {
        return MessageBox.confirm(`${message ? message : '是否继续?'}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 打开加载层
          showFullScreenLoading()
          return request({
            url,
            method: 'post',
            data
          }).then(response => {
            // 关闭加载层
            tryHideFullScreenLoading()
            if (response && response.ok) {
              Message.success({
                message: '操作成功！'
              })
              resolve(response.body)
              return response.body
            } else {
              Message.warning({
                dangerouslyUseHTMLString: true,
                message: '操作失败！',
                showClose: true,
                duration: 5 * 1000
              })
              // reject()
            }
          }).catch(() => {
            // 关闭加载层
            tryHideFullScreenLoading()
            // Message.warning({
            //   dangerouslyUseHTMLString: true,
            //   message: '操作失败！',
            //   showClose: true,
            //   duration: 5 * 1000
            // })
            // reject()
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
          // 关闭加载层
          tryHideFullScreenLoading()
          // reject()
        })
      }
    })
  }
}

