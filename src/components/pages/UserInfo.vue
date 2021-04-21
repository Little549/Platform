<template>
  <div class="user-info">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        修改密码
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <el-row class="info-form-back">
      <el-form class="info-form" label-width="150px" :model="formMessage" :rules="rules" size="mini">
        <el-form-item label="用户名:" prop="userName">
          {{formMessage.username}}
        </el-form-item>
        <el-form-item label="用户类型:" prop="userName">
          {{formMessage.user_type}}
        </el-form-item>
        <el-form-item label="原密码:" prop="oldPassword">
           <el-input type="password" placeholder="" v-model="formMessage.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input type="password" placeholder="" v-model="formMessage.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="cnewPassword">
          <el-input type="password" placeholder="请再次输入密码" v-model="formMessage.cnewPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onChange" class="on-change" type="primary" size="medium">确定修改</el-button>
          <el-button @click="onCancel" type="primary" size="medium">取消</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    </div>
</template>

<script>
import cookie from '../../assets/js/cookie'
export default {
  name: 'UserInfo',
  data () {
    return {
      formMessage: {
        oldPassword: '',
        newPassword: '',
        cnewPassword: ''
      },
      rules: {
        oldPassword: [{
          required: true, message: '请输入原密码', trigger: 'blur'
        }],
        newPassword: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }],
        cnewPassword: [{
          required: true, message: '请再次输入密码', trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.formMessage.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  mounted: function () {
    // 获取用户信息
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$http.get('/users/1/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.formMessage = res.data
            if (res.data.user_type === 0) {
              this.formMessage.user_type = '管理员'
            } else if (res.data.user_type === 1) {
              this.formMessage.user_type = '商家'
            } else if (res.data.user_type === 2) {
              this.formMessage.user_type = '刷手'
            } else if (res.data.user_type === 3) {
              this.formMessage.user_type = '代理'
            }
          }
        })
    },
    onChange () {
      var that = this
      let obj = {
        old_password: this.formMessage.oldPassword,
        password: this.formMessage.cnewPassword
      }
      if (obj.password && obj.old_password) {
        this.$http.patch('/users/' + this.formMessage.id + '/', obj) // 将信息发送给后端
          .then((res) => { // axios返回的数据都在res.data里
            if (res.status === 200) { // 如果成功
              // 清除缓存
              cookie.delCookie('token')
              cookie.delCookie('user_type')
              // 重新触发store
              // 更新store数据
              this.$store.dispatch('setInfo')
              // 成功，显示提示语
              this.$alert('密码修改成功！请重新登陆。', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  // 跳转到登录
                  this.$router.push({path: '/account/login'})
                }
              })
            }
          })
          .catch(function (error) {
            console.log(error)
            for (var key in error) {
              that.$message({
                type: 'error',
                message: '修改密码失败！' + key + ':' + error[key]
              })
            }
          })
      } else {
        that.$message({
          type: 'error',
          message: '修改密码失败！表单不能为空'
        })
      }
    },
    onCancel () {
      if (this.formMessage.user_type === '管理员') {
        this.$router.push('/admin/home')
      } else if (this.formMessage.user_type === '商家') {
        this.$router.push('/user/home')
      } else if (this.formMessage.user_type === '刷手') {
        this.$router.push('/taker/home')
      } else if (this.formMessage.user_type === '代理') {
        this.$router.push('/agent/home')
      }
    }
  }
}
</script>

<style scoped>
  .info-form {
    width: 400px;
    /*margin: 30px auto;*/
    margin-top: 30px;
  }
</style>
