<template>
  <div class="agent">
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
            <!--菜单栏-->
            <el-col :span="6">
              <el-aside style="width: 220px">
                <agent-nav-menu></agent-nav-menu>
              </el-aside>
            </el-col >
            <!--内容-->
            <el-col :span="18">
              <router-view name='content'></router-view>
            </el-col>
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
import AgentNavMenu from '@/components/layout/AgentNavMenu'
import MyFooter from '@/components/layout/MyFooter'
import QQContact from '@/components/layout/QQContact'
export default {
  name: 'Agent',
  components: {
    MyFooter,
    AgentNavMenu,
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

</style>
