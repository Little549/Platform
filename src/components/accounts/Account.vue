<template>
  <div class="account">
    <!--顶部-->
    <my-header></my-header>
    <!--中间-->
    <div class="main-background">
      <el-row type="flex" class="main-content">
        <!--左边联系方式-->
        <div class="main-sides"><q-q-contact></q-q-contact></div>
        <!--主要内容-->
        <el-main class="my-main">
          <el-row type="flex" justify="center">
            <div class="account-center">
              <router-view name='content'></router-view>
            </div>
          </el-row>
        </el-main>
        <div class="main-sides"></div>
      </el-row>
      <!--底部-->
      <my-footer></my-footer>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/layout/MyHeader'
import MyFooter from '@/components/layout/MyFooter'
import QQContact from '@/components/layout/QQContact'
export default {
  name: 'Account',
  components: {
    MyFooter,
    MyHeader,
    QQContact
  }
}
</script>

<style scoped>
  .main-background{
    background: rgb(246, 246, 246);
    min-width: 1200px;
  }
  .main-content {
    margin: 0 auto;
    width: 1200px;
  }
  .my-main {
    border:1px solid white;
    background-color: white;
    border-radius: 3px;
    width: 1000px;
    height: 100%;
  }
  .main-sides {
    width: 90px;
    height: 100%;
  }
  .account-center {
    width: 1000px;
    /*min-height: 470px;*/
    height: 100%;
  }

</style>
