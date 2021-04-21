<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    @select="handleSelect"
    router>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>首页</template>
      <el-menu-item index="/admin/home" @click="onRefresh" style="padding-left: 40px;">个人中心</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group>
      <template slot="title"><i class="el-icon-caret-bottom"></i>订单确认</template>
      <el-menu-item index="/admin/admin-recharge" @click="onRefresh" style="padding-left: 40px;">充值订单</el-menu-item>
      <el-menu-item index="/admin/admin-tocash" @click="onRefresh" style="padding-left: 40px;">提现订单</el-menu-item>
    </el-menu-item-group>
    <!--<el-menu-item-group>-->
      <!--<template slot="title"><i class="el-icon-caret-bottom"></i>分组1</template>-->
      <!--<el-menu-item index="/user" style="padding-left: 40px;">切换用户界面</el-menu-item>-->
      <!--<el-menu-item index="/taker" style="padding-left: 40px;">切换刷手界面</el-menu-item>-->
    <!--</el-menu-item-group>-->
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
