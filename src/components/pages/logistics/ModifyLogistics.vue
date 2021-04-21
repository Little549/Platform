<template>
  <div class="ModifyLogistics">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        修改物流订单
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <!--物流订单表单-->
    <el-row>
      <el-form class="logistics-form" label-width="100px" ref="formMessage" :model="formMessage" :rules="rules" size="mini">
        <el-form-item label="收货人:" prop="receive_name">
          <el-input type="text" placeholder="请输入修改后的收货人" v-model="formMessage.receive_name"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话:" prop="mobile">
          <el-input type="text" placeholder="请输入修改后的收货人电话" v-model="formMessage.mobile"></el-input>
        </el-form-item>
        <el-form-item label="收货地址:">
          {{this.formMessage.province}}{{this.formMessage.city}}{{this.formMessage.district}}
          <template>
            <el-cascader
              size="mini"
              :options="options"
              v-model="selectedOptions"
              @change="addressChange">
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address">
          <el-input type="text" placeholder="请输入修改后的详细地址" v-model="formMessage.address"></el-input>
        </el-form-item>
        <el-form-item label="邮编:" prop="postal_code">
          <el-input type="text" placeholder="请输入修改后的邮编" v-model="formMessage.postal_code"></el-input>
        </el-form-item>
        <el-button @click="onConfirm" class="on-confirm" type="primary" size="medium">确定修改</el-button>
        <el-button @click="onCancel" class="on-confirm" type="primary" size="medium">取消修改</el-button>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'ModifyLogistics',
  data () {
    return {
      formMessage: {},
      options: regionData,
      selectedOptions: [],
      rules: {
        receive_name: [{
          required: true, type: 'string', message: '请输入收货人姓名', trigger: 'blur'
        }],
        mobile: [{
          required: true, type: 'string', message: '请输入收货人电话', trigger: 'blur'
        }],
        province: [{
          required: true, type: 'string', message: '请输入收货地址', trigger: 'blur'
        }],
        address: [{
          required: true, type: 'string', message: '请输入详细地址', trigger: 'blur'
        }],
        postal_code: [{
          required: true, type: 'string', message: '请输入邮编', trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getLogisticsTask()
  },
  methods: {
    // 选择省市区
    addressChange (arr) {
      this.formMessage.province = CodeToText[arr[0]]
      this.formMessage.city = CodeToText[arr[1]]
      this.formMessage.district = CodeToText[arr[2]]
    },
    // 获取物流订单表单数据
    getLogisticsTask () {
      var that = this
      this.$http.get('/LogisticsTask/' + this.$route.params.id + '/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.formMessage = res.data
          } else {
            this.formMessage = 'null'
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取物流订单数据失败！' + key + ':' + error[key]
            })
          }
        })
    },
    // 确定修改
    onConfirm () {
      var that = this
      this.$http.patch('/LogisticsTask/' + this.$route.params.id + '/', this.formMessage) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            // 成功，显示提示语
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
            this.$router.push({name: 'MyLogistics', params: {page: this.$route.params.page}})
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '修改物流订单出错！' + key + ':' + error[key]
            })
          }
        })
    },
    // 取消修改
    onCancel () {
      this.$router.push({name: 'MyLogistics', params: {page: this.$route.params.page}})
    }
  }
}
</script>

<style scoped>
.logistics-form {
  width: 330px;
  margin-left: 30px;
}
</style>
