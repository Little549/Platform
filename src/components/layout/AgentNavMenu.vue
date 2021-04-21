<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    @select="handleSelect"
    router>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>首页</template>
      <el-menu-item index="/agent/home" @click="onRefresh" style="padding-left: 40px;">个人中心</el-menu-item>
      <el-menu-item index="/agent/announcement" @click="onRefresh" style="padding-left: 40px;">公告通知</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>我的钱包</template>
      <!--<el-menu-item index="/agent/recharge" style="padding-left: 40px;">充值</el-menu-item>-->
      <el-menu-item index="/agent/to-cash" @click="onRefresh" style="padding-left: 40px;">提现</el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>

<script>
export default {
  name: 'AdminNavMenu',
  methods: {
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    },
    onRefresh () {
      window.location.reload()
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
