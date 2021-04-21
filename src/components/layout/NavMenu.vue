<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    @select="handleSelect"
    router>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>活动管理</template>
      <el-menu-item index="/user/home" @click="onRefresh" style="padding-left: 40px;">个人中心</el-menu-item>
      <el-menu-item index="/user/announcement" @click="onRefresh" style="padding-left: 40px;">公告通知</el-menu-item>
      <el-menu-item index="/user/activity" @click="onRefresh" style="padding-left: 40px;">发布活动</el-menu-item>
      <el-menu-item index="/user/my-activity" @click="onRefresh" style="padding-left: 40px;">我发布的活动</el-menu-item>
      <el-menu-item index="/user/accepted-task" @click="onRefresh" style="padding-left: 40px;">已被接的任务订单</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>物流管理</template>
      <el-menu-item index="/user/my-logistics" @click="onRefresh"  style="padding-left: 40px;">我的物流订单</el-menu-item>
      <el-menu-item index="/user/add-logistics" @click="onRefresh" style="padding-left: 40px;">添加物流订单</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>我的钱包</template>
      <el-menu-item index="/user/recharge" @click="onRefresh" style="padding-left: 40px;">充值</el-menu-item>
      <el-menu-item index="/user/to-cash" @click="onRefresh" style="padding-left: 40px;">提现</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>我的账号</template>
      <el-menu-item index="/user/shop" @click="onRefresh" style="padding-left: 40px;">店铺管理</el-menu-item>
      <el-menu-item index="/user/user-info" @click="onRefresh" style="padding-left: 40px;">修改密码</el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>

<script>
export default {
  name: 'NavMenu',
  methods: {
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    },
    onRefresh () {
      // let NewPage = '_empty' + '?time=' + new Date().getTime() / 500
      // this.$router.push(NewPage)
      // this.$router.go(-1)
      window.location.reload()
      // this.$router.push({path: '/account/blank'})
      // this.$router.push({path: '/user/activity'})
    }
  }
}
</script>

<style>
  .el-menu-item-group__title {
    font-size:18px !important;
    color: black !important;
    font-weight: bolder !important;
  }
</style>
