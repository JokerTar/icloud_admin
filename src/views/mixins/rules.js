// import * as rules from '@/utils/rules'
// import { isvalidUsername } from '@/utils/validate'

export function checkPhone(rule, value, callback) {
  const reg = /^1(3|4|5|7|8)\d{9}$/
  if (!value) {
    return callback(new Error('请填写手机号码'))
  } else if (!reg.test(value)) {
    return callback(new Error('手机号码不正确'))
  } else {
    callback()
  }
}

export default {
  data() {
    // const valPhone = (rule, value, callback) => rules.checkPhone(rule, this.dialogData.tel, callback)
    const valPhone = (rule, value, callback) => {
      const reg = /^1(3|4|5|7|8)\d{9}$/
      if (!value) {
        return callback(new Error('请填写手机号码'))
      } else if (!reg.test(value)) {
        return callback(new Error('手机号码不正确'))
      } else {
        callback()
      }
    }

    const valIDCard = (rule, value, callback) => {
      const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!value) {
        return callback(new Error('请填身份证号码'))
      } else if (!reg.test(value)) {
        return callback(new Error('身份证号码格式不正确'))
      } else {
        callback()
      }
    }

    const valTel = (rule, value, callback) => {
      const reg = /^[0-9]{1}[-_0-9]{4,25}$/
      if (!value) {
        return callback()
      } else if (!reg.test(value)) {
        return callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }

    const valEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (!value) {
        return callback()
      } else if (!reg.test(value)) {
        return callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }

    const checkWx = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]{1}[-_a-zA-Z0-9]{4,19}$/
      if (!value) {
        return callback()
      } else if (!reg.test(value)) {
        return callback(new Error('微信格式不正确'))
      } else {
        callback()
      }
    }

    const isNum = (rule, value, callback) => {
      if (value === 0 || value === '0') {
        callback()
      } else if (!new RegExp('^[1-9][0-9]*([.][0-9]+)?$').test(value)) {
        callback(new Error('必须为数值'))
      } else {
        callback()
      }
    }

    const isPositiveInteger = (rule, value, callback) => {
      var reg = /^([0]|[1-9][0-9]*)$/;
      if (value === 0 || value === '0') {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('必须为正整数'))
      } else {
        callback()
      }
    }

    const isPositiveInteger1 = (rule, value, callback) => {
      var reg = /^([0]|[1-9][0-9]*)$/;
      if (value === 0 || value === '0' || value === null || value === undefined || value === "") {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    const isMoney = (rule, value, callback) => {
      console.log(value)
      if (value === 0 || value === '0') {
        callback(new Error('请输入有效金额'))
      } else if (!new RegExp('^[1-9][0-9]*([.][0-9]+)?$').test(value)) {
        callback(new Error('请输入有效金额'))
      } else {
        const money = parseFloat(value);

        if (money <= 0 || money > 999999999999999) {
          callback(new Error('请输入有效金额'))
        } else {
          callback()
        }
      }
    }

    const planMoney = (rule, value, callback) => {
      if (value === 0 || value === '0') {
        callback()
      } else if (!new RegExp('^[1-9][0-9]*([.][0-9]+)?$').test(value)) {
        callback(new Error('请输入有效金额'))
      } else {
        const money = parseFloat(value);
        if (money < 0 || money > 999999999999999) {
          callback(new Error('请输入有效金额'))
        } else {
          callback()
        }
      }
    };

    const isMoneyZero = (rule, value, callback) => {
      if (value === null || value === undefined || value === "") {
        callback();
        return;
      }

      if (value === 0 || value === '0') {
        callback()
      } else if (!new RegExp('^[1-9][0-9]*([.][0-9]+)?$').test(value)) {
        callback(new Error('请输入有效金额'))
      } else {
        const money = parseFloat(value);
        if (money <= 0 || money > 999999999999999) {
          callback(new Error('请输入有效金额'))
        } else {
          callback()
        }
      }
    };

    const listVerify = (rule, value, callback) => {
      if (value === null || value === undefined || value.length <= 0) {
        callback(new Error('文件至少上传一个'))
      } else {
        callback()
      }
    }

    const payWay = (rule, value, callback) => {
      if (value === null || value === undefined || value.length <= 0) {
        callback(new Error('至少选择一种支付方式'))
      } else {
        callback()
      }
    }

    const checkCodeSix = (rule, value, callback) => {
      if (value === null || value === undefined || value.length <= 0) {
        callback()
      } else if (value.length > 6) {
        callback(new Error('最大六位'))
      } else {
        callback()
      }
    }

    const resetPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请确确认登录密码！'))
      } else if (!this.form.loginPassword) {
        return callback(new Error('请输入登录密码！'))
      } else if (value !== this.form.loginPassword) {
        return callback(new Error('确认密码与登录密码不匹配！'))
      } else {
        callback()
      }
    }

    const requiredBank = (rule, value, callback) => {
      if (value === null || value === undefined || value === "") {
        callback(new Error('必填'))
      } else {
        callback()
      }
    }

    return {
      rules: {
        required: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        requiredBank: [
          { validator: requiredBank, trigger: 'change' }
        ]
      }
    }
  }
}
