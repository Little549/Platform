// 引入vue
import Vue from 'vue'
// 全局引入vueX
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
// 全局引用cookie方法类
import cookie from '../assets/js/cookie'
// 全局注册vueX
Vue.use(Vuex)

const userInfo = {
  user_type: cookie.getCookie('user_type') || '',
  token: cookie.getCookie('token') || ''
}

const state = {
  userInfo
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
