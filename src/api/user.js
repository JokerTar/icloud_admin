import request from '@/utils/request'
import CryptoJS from 'crypto-js'

export function login(params) {
  const encrypt = () => {
    const word = params.passWord
    const key = (params.vCodeToken).slice(0, 16)
    // key 为动态拼装---》用户输入的验证码+验证码返回的token 截取16位 ==》进行全部小写转换

    var userKey = CryptoJS.enc.Utf8.parse(key.toLowerCase())
    var srcs = CryptoJS.enc.Utf8.parse(word.toLowerCase())

    console.log(userKey)
    console.log(srcs)

    var encrypted = CryptoJS.AES.encrypt(srcs, userKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  }

  const data = {
    userName: params.userName,
    passWord: encrypt(),
    vCode: params.vCode,
    vCodeToken: params.vCodeToken
  }

  return request({
    url: '/admin/login/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/user/info',
    method: 'post',
    data: {}
  })
}

export function getToken() {
  return request({
    url: '/admin/login/user/refresh/token',
    method: 'post',
    data: {}
  })
}

// export function logout() {
//   return request({
//     url: '/admin/user/logout',
//     method: 'post'
//   })
// }
