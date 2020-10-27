// import parseTime, formatTime and set to filter
import moment from 'moment'

export { parseTime, formatTime } from '@/utils'
import store from '@/store'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 * 金额格式化
 */
export function toThousandFilter(num) {
  const minusReg = /^(-[0-9])/
  let isMinus = false

  // return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  if (typeof (num) === 'undefined' || num === null || num === '' || num === undefined) {
    return '0.00'
  } else {
    var data = ''
    if (minusReg.test(num)) {
      isMinus = true
      data = Math.abs(Number(num)).toFixed(2).split('.')
    } else {
      data = Number(num).toFixed(2).split('.')
    }
    var data2 = data[0].split('').reverse().join('')
    var newData = ''
    // 如果金额过1000加上千分位符号
    if (parseInt((data2.length - 1) / 3) > 0) {
      var count = 0
      do {
        newData = newData + data2.slice(count * 3, count * 3 + 3) + ','
        count = count + 1
      } while (parseInt((data2.length - 1) / 3) >= count)
    } else {
      // 直接抛出（带上小数点后俩位）
      return Number(num).toFixed(2)
    }

    if (isMinus) {
      return '-' + newData.split('').reverse().join('').slice(1) + '.' + data[1]
    } else {
      return newData.split('').reverse().join('').slice(1) + '.' + data[1]
    }
  }
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 字典过滤器
 * 合同字典
 * 授信字典
 * **/
export function filterDict(generation) {
  if (!generation) return ''
  const l = generation.split('-')

  if (l[0] === 'undefined') return ''

  const val = l[0]
  const type = l[1]

  // const contractDict = store.getters.contractDict || {}
  // const creditDict = store.getters.creditDict || {}

  const dict = store.getters.dict || {}

  const arr = dict[type]

  if (!arr) return val

  let temp = {}

  arr.forEach(item => {
    if (item.CODE == val || item.code == val || item.dictValue == val) {
      temp = item
    }
  })

  if (temp.dictLabel) {
    return temp.dictLabel
  } else if (temp.FLAG) {
    return temp.FLAG
  } else if (temp.flag) {
    return temp.flag
  } else if (temp.mark) {
    return temp.mark
  } else if (temp.MARK) {
    return temp.MARK
  } else {
    return val
  }
}

/**
 * 时间格式转化
 * **/
export function formatDate(date, type = 'YYYY-MM-DD') {
  if (date) {
    return moment(date).format(type)
  } else {
    return date
  }
}

/**
 * 时间格式转化
 * **/
export function formatDateCst(date, type = 'YYYY-MM-DD') {
  if (date) {
    return moment(date).utc().zone(+6).format(type)
  } else {
    return date
  }
}

export function filterCredDictForCredit(val, type, dict) {
  console.log("***************1")
  console.log(val);
  console.log(type);
  console.log(dict);
  console.log("***************2")
  if (!val || !type) return ''

  let val1 = val.split("-");
  val = val1[0];
  if (val === null || val === undefined || val === 'undefined' || val.length < 1) {
    return "";
  }

  let pertoty1 = val1[1];
  const arr = type[pertoty1];
  //const arr = dict[type]
  if (!arr) return val
  let temp = {}
  arr.forEach(item => {
    if (item.CODE == val || item.code == val || item.dictValue == val) {
      temp = item
    }
  })

  if (temp === null || temp === undefined || temp.length < 1) {
    return "";
  }

  if (temp.dictLabel) {
    return temp.dictLabel
  } else if (temp.FLAG) {
    return temp.FLAG
  } else if (temp.flag) {
    return temp.flag
  } else if (temp.mark) {
    return temp.mark
  } else if (temp.MARK) {
    return temp.MARK
  } else {
    return val
  }
}

/**
 * 通用字典过滤器
 * **/
export function filterCredDict(val, type, dict) {
  if ((!val && val != '0') || !type || !dict) return ''
  const arr = dict[type]
  if (!arr) return val
  let temp = {}
  arr.forEach(item => {
    if (item.CODE == val || item.code == val || item.dictValue == val) {
      temp = item
    }
  })
  if (temp.dictLabel) {
    return temp.dictLabel
  } else if (temp.FLAG) {
    return temp.FLAG
  } else if (temp.flag) {
    return temp.flag
  } else if (temp.mark) {
    return temp.mark
  } else if (temp.MARK) {
    return temp.MARK
  } else {
    return val
  }
}

export function formatterEmpty(v, type = '0') {
  if (!v) return type
  return v
}

/**
 * 区间处理
 * **/
export function formatNo(val) {
  if (!val) return val
  return (Array(10).join("0") + val).slice(-10);
}
