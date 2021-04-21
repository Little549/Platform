<template>
  <div class="recharge">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        充值
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <!--余额和说明框-->
    <el-row>
      <el-col :span="24" class="messages">
        <p>现金余额：{{money}}元</p>
        <p>填写正确的充值转账信息，核实成功便会到账。</p>
      </el-col>
    </el-row>
    <!--二维码图片-->
    <el-row>
      <el-col :span="12"><div class="grid-content">微信转账</div><img src="../../assets/image/WeChat-QR-code.jpg"  height="400px" /></el-col>
      <el-col :span="12"><div class="grid-content">支付宝转账</div><img src="../../assets/image/Alipay-QE-code.jpg"  height="400px" /></el-col>
    </el-row>
    <!--充值信息表单-->
    <el-row class="recharge-form-back" type="flex" justify="center">
      <el-form class="recharge-form" label-width="150px" ref="formMessage" :model="formMessage" :rules="rules" size="mini">
        <el-form-item label="充值方式:">
          <el-select v-model="formMessage.payMode" placeholder="请选择充值方式:">
            <el-option label="微信充值" value="微信充值"></el-option>
            <el-option label="支付宝充值" value="支付宝充值"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值金额(元):" prop="payMoney">
          <el-input placeholder="" v-model="formMessage.payMoney"></el-input>
          <p>您充值金额：￥{{formMessage.payMoney}} （手续费：￥-{{reduceMoney}}）</p>
          <p>到账金额：￥{{arrivalMoney}}</p>
        </el-form-item>
        <el-form-item label="请填充值转账单号:" prop="payNumber">
          <el-input type="text" placeholder="" v-model="formMessage.payNumber"></el-input>
        </el-form-item>
        <el-button @click="onRecharge" class="on-recharge" type="primary" size="medium">确定充值</el-button>
      </el-form>
    </el-row>
    <el-row class="explain-content">
      <p>充值说明：</p>
      <p>充值手续费：0.6%，充值10000元以上不收取手续费。</p>
      <p>转账后人工审核充值到平台账户中。</p>
      <p>如果有问题或者想要取消，请联系管理员。</p>
    </el-row>
    <!--充值记录列表-->
    <el-table :data="tableData" stripe style="width: 100%" height="250" size="mini">
      <el-table-column label="充值记录">
        <el-table-column prop="add_time" label="提交时间" width="120"></el-table-column>
        <el-table-column prop="method" label="支付方式" width="70"></el-table-column>
        <el-table-column prop="order_number" label="交易号" width="200"></el-table-column>
        <el-table-column prop="money" label="充值金额" width="70"></el-table-column>
        <el-table-column prop="arrival_money" label="到账金额" width="70"></el-table-column>
        <el-table-column prop="failure_reason" label="失败原因" width="120"></el-table-column>
        <el-table-column prop="state" label="状态"></el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :total="pageCount">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Recharge',
  data () {
    return {
      money: '',
      formMessage: {
        payMoney: '',
        payNumber: '',
        payMode: ''
      },
      rules: {
        payMode: [{
          required: true
        }],
        payMoney: [{
          required: true, message: '请输入充值金额', trigger: 'blur'
        }],
        payNumber: [{
          required: true, message: '请输入充值转账单号', trigger: 'blur'
        }]
      },
      tableData: [{}],
      pageCount: 10,
      currentPage: 1
    }
  },
  computed: {
    arrivalMoney: function () {
      if (this.formMessage.payMoney < 10000) {
        let oldArrivalMoney = this.formMessage.payMoney * 0.994
        let newArrivalMoney = parseFloat(oldArrivalMoney).toFixed(2)
        return newArrivalMoney
      } else {
        return this.formMessage.payMoney
      }
    },
    reduceMoney: function () {
      if (this.formMessage.payMoney < 10000) {
        let oldReduceMoney = this.formMessage.payMoney * 0.006
        let newReduceMoney = parseFloat(oldReduceMoney).toFixed(2)
        return newReduceMoney
      } else {
        return 0
      }
    },
    payModeNumber: function () {
      if (this.formMessage.payMode === '支付宝充值') {
        return 1
      } else if (this.formMessage.payMode === '微信充值') {
        return 2
      } else {
        return 3
      }
    }
  },
  mounted: function () {
    // 用户信息，余额
    this.getMoney()
    // 充值列表
    this.getRechargeList()
  },
  methods: {
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 获取用户信息，余额
    getMoney () {
      this.$http.get('/users/1/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.money = res.data.balance
          } else {
            this.money = 'null'
          }
        })
    },
    // 选择充值记录页面
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRechargeList()
    },
    // 获取充值记录
    getRechargeList () {
      var that = this
      this.$http.get('/Recharge/?page=' + this.currentPage + '&ordering=-add_time') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.tableData = res.data.results
            this.pageCount = res.data.count
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].method === 1) {
                this.tableData[i].method = '支付宝'
              } else if (this.tableData[i].method === 2) {
                this.tableData[i].method = '微信'
              } else {
                this.tableData[i].method = '其他'
              }
            }
            for (var j = 0; j < this.tableData.length; j++) {
              if (this.tableData[j].state === 1) {
                this.tableData[j].state = '审核中'
              } else if (this.tableData[j].state === 2) {
                this.tableData[j].state = '审核成功'
              } else if (this.tableData[j].state === 3) {
                this.tableData[j].state = '审核失败'
              }
            }
            // console.log(this.tableData)
          } else {
            this.tableData = 'null'
          }
        })
        .catch(function (error) {
          console.log(error)
          that.$message({
            type: 'error',
            message: '充值记录数据获取出错！' + that.error
          })
        })
    },
    onRecharge () {
      let obj = {
        money: this.formMessage.payMoney,
        method: this.payModeNumber,
        order_number: this.formMessage.payNumber,
        arrival_money: this.arrivalMoney,
        state: 1
      }
      var that = this
      this.$http.post('/Recharge/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 201) { // 如果成功
            // 成功，显示提示语
            this.$alert('充值信息提交成功，核实成功便会到账！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                // 刷新页面
                window.location.reload()
              }
            })
            // 重置表单，重新获取数据
            // this.resetForm('formMessage')
            // this.getMoney()
            // this.getRechargeList()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '充值失败！' + key + ':' + error[key]
            })
          }
        })
    }
  }
}
</script>

<style scoped>
  .messages {
    height: 100px;
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
  }
  .grid-content {
    min-height: 36px;
    margin-top: 20px;
  }
  .recharge-form-back {
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
  }
  .recharge-form {
    margin-top: 30px;
  }
  .on-recharge {
    margin: 10px 170px
  }
  .explain-content {
    margin: 20px auto;
  }
</style>
