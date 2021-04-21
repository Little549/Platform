<template>
  <div class="selectRole">
    <h2>用户注册</h2>
    <hr style="height:15px;border:none;border-top:3px solid #555555;width: 700px;margin: 15px auto">
    <h2 style="text-align: center">请选择用户角色</h2>
    <el-row type="flex" class="row-bg" justify="center">
      <el-button @click="onSeller" type="primary" size="medium">我是商家</el-button>
      <el-button @click="onBuyer" type="primary" size="medium">我是买家</el-button>
    </el-row>
    <p style="text-align: center">注意：禁止注册多个买家账号</p>
  </div>
</template>

<script>
export default {
  name: 'selectRole',
  methods: {
    onSeller () {
      this.$router.push({path: '/account/register'})
    },
    onBuyer () {
      this.$alert('未开放买家注册', '信息', {
        confirmButtonText: '确定'
      })
    }
  }
}
</script>

<style scoped>
  .selectRole {
    width: 700px;
    height: 100%;
    color: black;
    margin: 0 auto
  }
  .select-button {
    width: 500px;
    color: black;
    margin: 0 auto
  }
</style>
