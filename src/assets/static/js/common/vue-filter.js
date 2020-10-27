/**
 * 格式化金额
 * @param value
 */
Vue.filter('rounding', function (value) {
    if(value!=undefined){
        if(value && value!=null){
            value = String(value);
            var left=value.split('.')[0],right=value.split('.')[1];
            right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '.00';
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            return (Number(value)<0?"-":"") + temp.join(',').split('').reverse().join('')+right;
        }else if(value===0){   //注意===在这里的使用，如果传入的value为0,if中会将其判定为boolean类型，故而要另外做===判断
            return '0.00';
        }else{
            return "";
        }
    }
    return "";
});

/**
 * 格式化时间
 * @param time 2008/08/08 08:00:00
 * @param fmt yyyy/MM/dd hh:mm:ss
 */
Vue.filter('formatDate', function (time, fmt) {
    if(time==null || time==""){return ""};
    var date = parseToDate(time);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            var str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
        }
    }
    return fmt;
});

function parseToDate(value){
    if (value == null || value == '') {
        return undefined;
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    }
    else {
        if (!isNaN(value)) {
            dt = new Date(value);
        }
        else if (value.indexOf('/Date') > -1) {
            value = value.replace(/\/Date(−?\d+)\//, '$1');
            dt = new Date();
            dt.setTime(value);
        } else if (value.indexOf('/') > -1) {
            dt = new Date(Date.parse(value.replace(/-/g, '/')));
        } else {
            // 兼容ie11(只认准yyyy/MM/格式)
            if (value.toString().indexOf("-") > 0){
                value = value.replace(new RegExp("-", "g"),"/");
            }
            dt = new Date(value);
        }
    }
    return dt;
}

/**
 * 千分符转化
 * @param n
 * @param el
 */
Vue.prototype.comdify = function (obj,str){
    var n1 = this.comdify_(obj[str]);
    Vue.set(obj,str,n1);
}
/**
 * 千分符转化
 * @param str
 * @returns {string}
 * @private
 */
Vue.prototype.comdify_ = function (str){
    if(trim(str)==""){
        return "";
    }
    if(!str) return "";
    var num = Number(trim(str+""));
    if(isNaN(num)){
        return "";
    }
    var re = /\d{1,3}(?=(\d{3})+$)/g;
    var n1 = num.toFixed(2).replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
        return s1.replace(re, "$&,") + s2;
    });
    return n1;
}

/**
 * 将千分符格式的金额数字转化成普通格式的数字
 * @param num
 * @param el
 */
Vue.prototype.delcommafy = function (obj,str){
    if(!obj[str]) return;
    var num = obj[str].toString();
    num = num.replace(/,/gi, '');
    if(isNaN(num)){
        Vue.set(obj,str,"");
    }else {
        Vue.set(obj,str,num);
    }
}

function trim(str) {
    return str.trim().replace(/[￥,%]/g, '');
}