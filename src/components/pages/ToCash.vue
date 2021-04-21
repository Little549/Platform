<template>
  <div class="to-cash">
    <el-row>
      <el-col :span="24">
        提现
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="rest-money">
        <p>现金余额：{{money}}元</p>
        <p>温馨提示：每天只能申请提现1次。</p>
        <p>有时会出现延迟到账的情况。具体到账时间以收款银行入账时间为准。</p>
      </el-col>
    </el-row>
      <!--提现表单-->
    <el-row class="tocash-form-back">
      <el-form class="tocash-form" label-width="150px" ref="formMessage" :model="formMessage" :rules="rules" size="mini">
        <el-form-item label="提现金额(元):" prop="toMoney">
          <el-input placeholder="" v-model="formMessage.toMoney"></el-input>
        </el-form-item>
        <el-form-item label="银行卡姓名:" prop="userCardName">
          <el-input type="text" placeholder="" v-model="formMessage.userCardName"></el-input>
        </el-form-item>
        <el-form-item label="请填提现银行卡号:" prop="bankNumber">
          <el-input type="text" placeholder="" v-model="formMessage.bankNumber"></el-input>
        </el-form-item>
        <el-form-item label="手续费:" prop="cMoney">
          <p>￥-{{getToMoney}}</p>
        </el-form-item>
        <el-button @click="onToCash" class="on-to-cash" type="primary" size="medium">申请提现</el-button>
      </el-form>
    </el-row>
    <el-row class="explain-content">
      <p>提现说明：</p>
      <p>提现手续费：0.6%。</p>
      <p>如果有问题或者想要取消，请联系管理员。</p>
    </el-row>
    <!--提现记录列表-->
    <el-table :data="tableData" stripe style="width: 100%;margin-top: 10px" height="250" size="mini">
      <el-table-column label="提现记录">
        <el-table-column prop="add_time" label="提交时间" width="120"></el-table-column>
        <el-table-column prop="money" label="提现金额" width="100"></el-table-column>
        <el-table-column prop="arrival_money" label="实际金额" width="100"></el-table-column>
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
  name: 'ToCash',
  data () {
    return {
      money: '',
      formMessage: {
        toMoney: '',
        userCardName: '',
        bankNumber: ''
      },
      rules: {
        toMoney: [{
          required: true, message: '请输入提现金额', trigger: 'blur'
        }],
        userCardName: [{
          required: true, message: '请输入银行卡姓名', trigger: 'blur'
        }],
        bankNumber: [{
          required: true, message: '请输入银行卡号', trigger: 'blur'
        }]
      },
      tableData: [{}],
      pageCount: 10,
      currentPage: 1
    }
  },
  computed: {
    arrivalMoney: function () {
      let oldArrivalMoney = this.formMessage.toMoney * 0.994
      let newArrivalMoney = parseFloat(oldArrivalMoney).toFixed(2)
      return newArrivalMoney
    },
    // 计算手续费，保留两位小数
    getToMoney: function () {
      let oldToMoney = this.formMessage.toMoney * 0.006
      let newToMoney = parseFloat(oldToMoney).toFixed(2)
      return newToMoney
    }
  },
  mounted: function () {
    // 用户信息，余额
    this.getMoney()
    // 提现列表
    this.getToCashList()
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
            this.money = ''
          }
        })
    },
    // 选择提现记录页面
    handleCurrentChange (val) {
      this.currentPage = val
      this.getToCashList()
    },
    // 获取提现记录
    getToCashList () {
      var that = this
      this.$http.get('/Withdraw/?page=' + this.currentPage + '&ordering=-add_time') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.tableData = res.data.results
            this.pageCount = res.data.count
            for (var j = 0; j < this.tableData.length; j++) {
              if (this.tableData[j].state === 1) {
                this.tableData[j].state = '审核中'
              } else if (this.tableData[j].state === 2) {
                this.tableData[j].state = '审核成功'
              } else if (this.tableData[j].state === 3) {
                this.tableData[j].state = '审核失败'
              }
            }
          } else {
            this.tableData = 'null'
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '提现记录数据获取出错！' + key + ':' + error[key]
            })
          }
        })
    },
    onToCash () {
      let obj = {
        money: this.formMessage.toMoney,
        Bank_number: this.formMessage.bankNumber,
        name: this.formMessage.userCardName,
        arrival_money: this.arrivalMoney,
        state: 1
      }
      var that = this
      this.$http.post('/Withdraw/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 201) { // 如果成功
            // 成功，显示提示语
            this.$alert('提现信息提交成功，核实成功便会到账！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                // 刷新页面
                window.location.reload()
              }
            })
            // 重置表单，重新获取数据
            // this.resetForm('formMessage')
            // this.getMoney()
            // this.getToCashList()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '提现失败！' + key + ':' + error[key]
            })
          }
        })
    }
  }
}
</script>

<style scoped>
  .rest-money {
    height: 100px;
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
  }
  .tocash-form-back {
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
    margin-top: 10px;
  }
  .tocash-form {
    width: 400px;
    margin: 30px auto;
  }
  .on-to-cash {
    margin: auto 170px
  }
  .explain-content {
    margin: 20px auto;
  }
</style>
