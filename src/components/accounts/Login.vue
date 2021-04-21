<template>
  <div class="login-background">
    <div class="login">
      <el-form class="login-form" :label-position="labelPosition" :model="formName" :rules="rules" size="mini">
        <!--<p class="login_title">账号登陆</p>-->
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="formName.username" @keyup.enter.native="onLogin"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formName.password" @keyup.enter.native="onLogin"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <el-input type="text" v-model="formName.verifyCode" @keyup.enter.native="onLogin"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="identifybox">
            <div @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
            <el-button type="text" @click="refreshCode">看不清，换一张</el-button>
          </div>
        </el-form-item>
        <el-form-item>
         <el-button type="text" @click="onForget" style="float: right;">忘记密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="on-login" type="primary" @click="onLogin" size="medium">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import cookie from '../../assets/js/cookie'
import SIdentify from '@/components/accounts/SIdentify'
export default {
  name: 'Login',
  components: {
    SIdentify
  },
  data () {
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
        console.log('validateVerifycode:', value)
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      formName: {
        username: '',
        password: '',
        verifyCode: ''
      },
      rules: {
        username: [{
          required: true, type: 'string', message: '请输入用户名', trigger: 'blur'
        }],
        password: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }],
        verifyCode: [
          { required: true, trigger: 'blur', validator: validateVerifycode }
        ]
      },
      labelPosition: 'right',
      identifyCodes: '1234567890',
      identifyCode: '',
      checked: false
    }
  },
  mounted: function () {
    // 清除缓存
    cookie.delCookie('token')
    cookie.delCookie('user_type')
    // 重新触发store
    // 更新store数据
    this.$store.dispatch('setInfo')
    // 验证码初始化
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    // 生成随机数
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
      // console.log(this.identifyCode)
    },
    onForget () {
      this.$alert('忘记密码，请联系客服处理', '信息', {
        confirmButtonText: '确定'
      })
    },
    onLogin () {
      if (!this.formName.username) {
        this.$message({
          type: 'error',
          message: '请输入用户名！'
        })
        return false
      }
      if (!this.formName.password) {
        this.$message({
          type: 'error',
          message: '请输入密码！'
        })
        return false
      }
      if (!this.formName.verifyCode) {
        this.$message({
          type: 'error',
          message: '请输入验证码！'
        })
        return false
      } else if (this.formName.verifyCode !== this.identifyCode) {
        this.$message({
          type: 'error',
          message: '验证码输入错误！'
        })
        return false
      }
      let obj = {
        username: this.formName.username,
        password: this.formName.password
      }
      var that = this
      this.$http.post('/login/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            // 本地存储用户信息
            // cookie.setCookie('user_type', res.data.user_type, 7)
            cookie.setCookie('token', res.data.token, 7)
            // 存储在store
            // 更新store数据
            that.$store.dispatch('setInfo')
            // 登录成功，显示提示语
            this.$message({
              type: 'success',
              message: '登陆成功！'
            })
            // 登陆成功，跳转到首页页面
            this.routerTo()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '登陆失败！' + key + ':' + error[key]
            })
          }
        })
    },
    routerTo () {
      this.$http.get('/users/1/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            // 本地存储用户信息
            cookie.setCookie('user_type', res.data.user_type, 7)
            // 存储在store
            // 更新store数据
            this.$store.dispatch('setInfo')
            if (res.data.user_type === 1) {
              this.$router.push({path: '/user'})
            } else if (res.data.user_type === 2) {
              this.$router.push({path: '/taker'})
            } else if (res.data.user_type === 3) {
              this.$router.push({path: '/agent'})
            } else if (res.data.user_type === 0) {
              this.$router.push({path: '/admin'})
            } else {
              this.$message({
                type: 'error',
                message: '登陆成功，该用户类型不存在！'
              })
            }
          }
        })
    }
  }
}
</script>

<style>
  .login-background {
    width: 100%;
    height:450px;
    /*background-color: cyan;*/
    background:url('../../assets/image/bg-wolf.png') no-repeat center top;
    background-size: cover;
  }
  .login {
    background: rgba(240,255,255,0.7);
    border-radius: 4px;
    width: 270px;
    height:410px;
    color:black;
    float: right;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .login .el-form-item__label {
    color :black;
  }

  .login .el-checkbox {
    color :black;
  }
  .on-login {
    margin-left: 30px !important;
    /*float: left;*/
    width: 200px !important;
  }
  .login-form {
    width: 250px;
    margin: 10px auto;
  }

  .identifybox{
    display: flex;
    justify-content: space-between;
    margin-top:7px;
  }
  .iconstyle{
    color:#409EFF;
  }
</style>
