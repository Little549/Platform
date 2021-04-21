// 引入vue
// import Vue from 'vue'
import axios from 'axios'

// 全局状态控制引入
import store from '../store/'
import cookie from '../assets/js/cookie'
// import * as types from '../store/mutation-types'
// import router from '../router'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://119.23.72.247:8005/'
// console.log(store.state.userInfo.token)
// console.log(store.state.userInfo.user_type)

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.userInfo.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `JWT ${store.state.userInfo.token}`
    }
    // 时间戳，由于IE浏览器会自动缓存get获取的数据，通过发送一个时间戳可以使每次get是不一样的
    // if (config.method === 'post') {
    //   config.data = {
    //     ...config.data,
    //     t: Date.parse(new Date()) / 1000
    //   }
    // } else
    // 时间戳
    if (config.method === 'get') {
      config.params = {
        t: Date.parse(new Date()) / 1000,
        ...config.params
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  undefined,
  error => {
    let res = error.response
    switch (res.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        cookie.delCookie('token')
        cookie.delCookie('user_type')
        store.state.userInfo.token = ''
        store.state.userInfo.user_type = ''
        // router.replace({
        //   path: '/account/login'
        // })
        console.log('未登录 或者token过期')
        // alert('未登录 或者token过期')
        break
      case 403:
        console.log('您没有该操作权限')
        alert('您没有该操作权限')
        break
      case 500:
        console.log('服务器错误')
        alert('服务器错误')
        break
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  })
