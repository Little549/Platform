import Vue from 'vue'
import Router from 'vue-router'
// import cookie from '../assets/js/cookie'
// 全局状态控制引入
import store from '../store/'
// import axios from 'axios'

// 账号登陆、注册
import Account from '@/components/accounts/Account'
import Login from '@/components/accounts/Login'
import Register from '@/components/accounts/Register'
import SelectRole from '@/components/accounts/SelectRole'

// 用户，修改密码都用UserInfo
import User from '@/components/layout/User'
import Home from '@/components/pages/Home'
import Shop from '@/components/pages/Shop'
import Recharge from '@/components/pages/Recharge'
import ToCash from '@/components/pages/ToCash'
import UserInfo from '@/components/pages/UserInfo'
import Announcement from '@/components/pages/announcement/Announcement'
import AnnouncementInfo from '@/components/pages/announcement/AnnouncementInfo'
// 物流订单
import AddLogistics from '@/components/pages/logistics/AddLogistics'
import MyLogistics from '@/components/pages/logistics/MyLogistics'
import ModifyLogistics from '@/components/pages/logistics/ModifyLogistics'
// 活动
import ReleaseActivity from '@/components/pages/activity/ReleaseActivity'
import MyActivity from '@/components/pages/activity/MyActivity'
import ModifyActivity from '@/components/pages/activity/ModifyActivity'
import CheckActivity from '@/components/pages/activity/CheckActivity'
// 活动对应的刷单任务
import AcceptedTask from '@/components/pages/task/AcceptedTask'

// 刷手,Announcement、Recharge、ToCash用user的
import Taker from '@/components/layout/Taker'
import TakerHome from '@/components/pages-taker/TakerHome'
import ActivityList from '@/components/pages-taker/ActivityList'
import ActivityDetails from '@/components/pages-taker/ActivityDetails'
import AcceptedActivity from '@/components/pages-taker/AcceptedActivity'
import ToActivity from '@/components/pages-taker/ToActivity'

// 代理,ToChsh用user的
import Agent from '@/components/layout/Agent'
import AgentHome from '@/components/pages-agent/AgentHome'

// 管理员admin
import Admin from '@/components/layout/Admin'
import AdminHome from '@/components/pages-admin/AdminHome'
import AdminRecharge from '@/components/pages-admin/AdminRecharge'
import AdminToCash from '@/components/pages-admin/AdminToCash'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/user/home'
    }, {
      path: '/account',
      component: Account,
      redirect: '/account/login',
      children: [
        {
          // 当 /login 匹配成功，
          // Login 会被渲染在 Account 的 <router-view> 中
          path: 'login',
          name: 'Login',
          components: {
            content: Login
          },
          meta: {
            title: '登陆',
            need_token: false,
            keepAlive: false // false为不缓存
          }
        }, {
          path: 'selectrole',
          name: 'SelectRole',
          components: {
            content: SelectRole
          },
          meta: {
            title: '选择角色',
            need_token: false,
            keepAlive: false
          }
        }, {
          path: 'register',
          name: 'Register',
          components: {
            content: Register
          },
          meta: {
            title: '卖家注册',
            need_token: false,
            keepAlive: false
          }
        }, {
          path: 'announcement-info/:id',
          name: 'AnnouncementInfo',
          components: {
            content: AnnouncementInfo
          },
          meta: {
            title: '公告通知详情',
            need_token: true,
            keepAlive: false,
            user_type: 4
          }
        }
      ]
    }, {
      path: '/admin',
      component: Admin,
      redirect: '/admin/home',
      children: [
        {
          path: 'home',
          name: 'AdminHome',
          components: {
            content: AdminHome
          },
          meta: {
            title: '管理员首页',
            need_token: true,
            keepAlive: false,
            user_type: 0
          }
        }, {
          path: 'userinfo',
          name: 'adUserInfo',
          components: {
            content: UserInfo
          },
          meta: {
            title: '修改密码',
            need_token: true,
            keepAlive: false,
            user_type: 0
          }
        }, {
          path: 'admin-recharge',
          name: 'AdminRecharge',
          components: {
            content: AdminRecharge
          },
          meta: {
            title: '管理员-充值',
            need_token: true,
            keepAlive: false,
            user_type: 0
          }
        }, {
          path: 'admin-tocash',
          name: 'AdminToCash',
          components: {
            content: AdminToCash
          },
          meta: {
            title: '管理员-提现',
            need_token: true,
            keepAlive: false,
            user_type: 0
          }
        }
      ]
    }, {
      path: '/user',
      component: User,
      redirect: '/user/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          components: {
            content: Home
          },
          meta: {
            title: '用户首页',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'announcement',
          name: 'Announcement',
          components: {
            content: Announcement
          },
          meta: {
            title: '公告通知',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'user-info',
          name: 'UserInfo',
          components: {
            content: UserInfo
          },
          meta: {
            title: '修改密码',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'recharge',
          name: 'Recharge',
          components: {
            content: Recharge
          },
          meta: {
            title: '充值',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'to-cash',
          name: 'ToCash',
          components: {
            content: ToCash
          },
          meta: {
            title: '提现',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'shop',
          name: 'Shop',
          components: {
            content: Shop
          },
          meta: {
            title: '店铺',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'add-logistics',
          name: 'AddLogistics',
          components: {
            content: AddLogistics
          },
          meta: {
            title: '添加物流订单',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'my-logistics',
          name: 'MyLogistics',
          components: {
            content: MyLogistics
          },
          meta: {
            title: '我的物流订单',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'modify-logistics/:page/:id',
          name: 'ModifyLogistics',
          components: {
            content: ModifyLogistics
          },
          props: true,
          meta: {
            title: '修改物流订单',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'activity',
          name: 'ReleaseActivity',
          components: {
            content: ReleaseActivity
          },
          meta: {
            title: '发布活动',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'my-activity',
          name: 'MyActivity',
          components: {
            content: MyActivity
          },
          meta: {
            title: '我的活动',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'modify-activity/:page/:id',
          name: 'ModifyActivity',
          components: {
            content: ModifyActivity
          },
          props: true,
          meta: {
            title: '编辑活动',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'check-activity/:page/:id',
          name: 'CheckActivity',
          components: {
            content: CheckActivity
          },
          props: true,
          meta: {
            title: '查看活动详情',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }, {
          path: 'accepted-task',
          name: 'AcceptedTask',
          components: {
            content: AcceptedTask
          },
          meta: {
            title: '已被接的任务订单',
            need_token: true,
            keepAlive: false,
            user_type: 1
          }
        }
      ]
    }, {
      path: '/taker',
      component: Taker,
      redirect: '/taker/home',
      children: [
        {
          path: 'home',
          name: 'TakerHome',
          components: {
            content: TakerHome
          },
          meta: {
            title: '刷手首页',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'announcement',
          name: 'TakerAnnouncement',
          components: {
            content: Announcement
          },
          meta: {
            title: '公告通知',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'user-info',
          name: 'TakerUserInfo',
          components: {
            content: UserInfo
          },
          meta: {
            title: '修改密码',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'recharge',
          name: 'TakerRecharge',
          components: {
            content: Recharge
          },
          meta: {
            title: '充值',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'to-cash',
          name: 'TakerToCash',
          components: {
            content: ToCash
          },
          meta: {
            title: '提现',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'activity-list',
          name: 'ActivityList',
          components: {
            content: ActivityList
          },
          meta: {
            title: '活动大厅',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'activity-details/:page/:id',
          name: 'ActivityDetails',
          components: {
            content: ActivityDetails
          },
          meta: {
            title: '活动详情',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'accepted-activity',
          name: 'AcceptedActivity',
          components: {
            content: AcceptedActivity
          },
          meta: {
            title: '我的刷单活动',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }, {
          path: 'to-activity/:page/:id/:order/:state',
          name: 'ToActivity',
          components: {
            content: ToActivity
          },
          meta: {
            title: '添加订单信息',
            need_token: true,
            keepAlive: false,
            user_type: 2
          }
        }]
    }, {
      path: '/agent',
      component: Agent,
      redirect: '/agent/home',
      children: [
        {
          path: 'home',
          name: 'AgentHome',
          components: {
            content: AgentHome
          },
          meta: {
            title: '代理首页',
            need_token: true,
            keepAlive: false,
            user_type: 3
          }
        }, {
          path: 'announcement',
          name: 'AgentAnnouncement',
          components: {
            content: Announcement
          },
          meta: {
            title: '公告通知',
            need_token: true,
            keepAlive: false,
            user_type: 3
          }
        }, {
          path: 'user-info',
          name: 'AgentUserInfo',
          components: {
            content: UserInfo
          },
          meta: {
            title: '修改密码',
            need_token: true,
            keepAlive: false,
            user_type: 3
          }
        }, {
          path: 'to-cash',
          name: 'AgentToCash',
          components: {
            content: ToCash
          },
          meta: {
            title: '提现',
            need_token: true,
            keepAlive: false,
            user_type: 3
          }
        }]
    }
  ]
})
// 用户类型拦截 user_type值
// 路由跳转拦截
router.beforeEach((to, from, next) => {
  const token = store.state.userInfo.token
  const userType = store.state.userInfo.user_type
  // console.log(store.state.userInfo.token)
  // console.log(userType)
  // 设置标题
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = '平台'
  }
  if (!token) {
    // 没登录可以进的页面
    if (to.meta.need_token) {
      next({
        path: '/account/login'
      })
    } else {
      next()
    }
  } else {
    // 登陆后
    if (userType === '0') {
      if (to.meta.user_type === 0 || to.meta.user_type === 4) {
        next()
      } else {
        next({
          path: '/admin/home'
        })
      }
    } else if (userType === '1') {
      if (to.meta.user_type === 1 || to.meta.user_type === 4) {
        next()
      } else {
        next({
          path: '/user'
        })
      }
    } else if (userType === '2') {
      if (to.meta.user_type === 2 || to.meta.user_type === 4) {
        next()
      } else {
        next({
          path: '/taker'
        })
      }
    } else if (userType === '3') {
      if (to.meta.user_type === 3 || to.meta.user_type === 4) {
        next()
      } else {
        next({
          path: '/agent'
        })
      }
    } else {
      next()
    }
  }
})

export default router
