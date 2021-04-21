// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill' // 兼容IE9以上
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 全局加载resource拦截器
import './axios/'
import Axios from 'axios'

import 'iview/dist/styles/iview.css'
import VCharts from 'v-charts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

if (Number.parseInt === undefined) { Number.parseInt = window.parseInt }
if (Number.parseFloat === undefined) { Number.parseFloat = window.parseFloat }

// 检测浏览器版本
function IEVersion () {
  var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    console.log(fIEVersion)
    if (fIEVersion === 7) {
      return 7
    } else if (fIEVersion === 8) {
      return 8
    } else if (fIEVersion === 9) {
      return 9
    } else if (fIEVersion === 10) {
      return 10
    } else {
      return 6 // IE版本<=7
    }
  } else if (isEdge) {
    return 'edge' // edge
  } else if (isIE11) {
    return 11 // IE11
  } else {
    return 15 // 不是ie浏览器
  }
}
var ie = IEVersion()
// console.log(ie)
if (ie <= 8) {
  alert('浏览器版本过低，请升级浏览器，或者使用极速模式')
}

Vue.prototype.$http = Axios

Vue.use(VCharts)
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
