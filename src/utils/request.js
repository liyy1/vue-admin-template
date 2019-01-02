import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { removeToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000, // 请求超时时间
  withCredentials: true // 跨域请求携带sessionId
})

// request拦截器
// service.interceptors.request.use(
//   // config => {
//   //   if (store.getters.token) {
//   //     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//   //   }
//   //   return config
//   // },
//   error => {
//     // Do something with request error
//     console.log(error) // for debug
//     Promise.reject(error)
//   }
// )

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 1) {
      Message.error(res.message)
      return Promise.reject('error')
    } else if (res.code === 2) {
      MessageBox.confirm(
        '你已被登出，可以取消继续留在该页面，或者重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        removeToken()
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    } else if (res.code === 3) {
      Message.error('您没有权限访问该页面！')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
