import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = getToken()
      // config.headers['Set-Cookie'] = 'HttpOnly;Secure;SameSite=None'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (response.status === 200 && !res.status) {
      return response
    } else {
      // if the custom code is not 20000, it is judged as an error.
      if (!res.ok) {
        Message.warning({
          dangerouslyUseHTMLString: true,
          message: res.msg.replace(/\\n/gmi, '<br style="margin: 10px 0;" />') || 'Error',
          showClose: true,
          duration: 5 * 1000
        })
        return Promise.reject(response)
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    Message.warning({
      dangerouslyUseHTMLString: true,
      message: error.message.replace(/\\n/gmi, '<br style="margin: 10px 0;" />'),
      showClose: true,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
