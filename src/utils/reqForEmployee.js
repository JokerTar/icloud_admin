import axios from "axios";
// import { MessageBox, Message } from 'element-ui'
import { Notification } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

axios.defaults.withCredentials = true;
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
});

// request interceptor 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers["Authorization"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

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
    const res = response.data;
    if ((response.status === 200 || response.status === 500) && !res.status) {
      return response;
    } else {
      // if the custom code is not 20000, it is judged as an error.
      if (!res.ok) {
        // Notification({
        //   message: res.msg || "Error",
        //   type: "error",
        //   duration: 2 * 1000
        // });
        return Promise.reject(response);
      }
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    Notification({
      dangerouslyUseHTMLString: true,
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
