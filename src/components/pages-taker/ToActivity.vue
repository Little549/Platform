<template>
  <div class="to-activity">
    <el-row>
      <el-col :span="24">
        添加刷单信息
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <el-row class="activity-form-back">
      <el-form class="activity-form" label-width="150px" :model="formMessage" size="mini">
        <el-form-item label="活动名称:" prop="activity_name">
          {{formMessage.activity_name}}
        </el-form-item>
        <el-form-item label="本金:" prop="single_price">
          {{formMessage.single_price}}
        </el-form-item>
        <el-form-item label="佣金:" prop="commission">
          {{formMessage.commission - theCut}}
        </el-form-item>
        <el-form-item label="订单状态:" prop="state_s">
          {{formMessage.state_s}}
        </el-form-item>
        <el-form-item label="买家:" prop="buyer" style="width: 450px">
          <el-input placeholder="" v-model="formMessage.buyer"></el-input>
        </el-form-item>
        <el-form-item label="订单号:" prop="order" style="width: 450px">
          <el-input placeholder="" v-model="formMessage.order"></el-input>
        </el-form-item>
        <el-form-item label="快递:" prop="Courier" style="width: 450px">
          <el-input placeholder="" v-model="formMessage.Courier"></el-input>
        </el-form-item>
        <el-form-item label="快递单号:" prop="Courier_number" style="width: 450px">
          <el-input placeholder="" v-model="formMessage.Courier_number"></el-input>
        </el-form-item>
        <el-form-item label="实际付款:" prop="actualMoney" style="width: 450px">
          <el-input placeholder="" v-model="actualMoney"></el-input>
          <div v-if="actualMoney">差价： {{getDifference}}</div>
        </el-form-item>
        <el-form-item>
          <el-button @click="addMessage" type="primary" size="medium">添加/修改订单信息</el-button>
          <el-button @click="onCancel" type="primary" size="medium">取消</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ToActivity',
  data () {
    return {
      theCut: 0.0,
      // 刷手实际付款金额
      actualMoney: 0.00,
      formMessage: {
        // 状态码对应状态
        state_s: ''
      }
    }
  },
  mounted: function () {
    // 获取抽成值
    this.getTheCut()
    // 获取该活动详情
    this.getTheActivity()
  },
  computed: {
    // 计算差价值，保留两位小数
    getDifference: function () {
      let oldDifference = this.formMessage.single_price - this.actualMoney
      let newDifference = parseFloat(oldDifference).toFixed(2)
      return newDifference
    }
  },
  methods: {
    // 获取抽成值
    getTheCut () {
      this.$http.get('/GetPrice/?search=choucheng') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.theCut = res.data[0].Task_Price
          }
        })
    },
    // 获取该活动详情
    getTheActivity () {
      var that = this
      this.$http.get('/order/' + this.$route.params.id + '/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          console.log(res)
          if (res.status === 200) { // 如果成功
            this.formMessage = res.data
            this.actualMoney = res.data.single_price - res.data.difference
            if (this.formMessage.state_type === 1) {
              this.formMessage.state_s = '待完成'
            } else if (this.formMessage.state_type === 2) {
              this.formMessage.state_s = '审核中'
            } else if (this.formMessage.state_type === 3) {
              this.formMessage.state_s = '已确认'
            } else if (this.formMessage.state_type === 4) {
              this.formMessage.state_s = '已取消'
            }
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '出错！' + key + ':' + error[key]
            })
          }
        })
    },
    addMessage () {
      let obj = {
        buyer: this.formMessage.buyer,
        order: this.formMessage.order,
        Courier: this.formMessage.Courier,
        Courier_number: this.formMessage.Courier_number,
        difference: this.formMessage.single_price - this.actualMoney,
        state_type: 2
      }
      var that = this
      this.$http.patch('/order/' + this.$route.params.id + '/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.$message({
              showClose: true,
              type: 'success',
              message: '订单信息添加成功！'
            })
            this.$router.push({name: 'AcceptedActivity', params: {page: this.$route.params.page, state: this.$route.params.state, order: this.$route.params.order}})
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '出错！' + key + ':' + error[key]
            })
          }
        })
    },
    onCancel () {
      this.$router.push({name: 'AcceptedActivity', params: {page: this.$route.params.page, state: this.$route.params.state, order: this.$route.params.order}})
    }
  }
}
</script>

<style scoped>
  .activity-form-back {
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
    margin-top: 10px;
  }
  .activity-form{
    width: 700px;
    /*margin: 30px auto;*/
    margin-top: 30px;
  }
</style>
