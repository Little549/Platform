<template>
  <div class="admin-recharge">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        管理员-充值订单确认
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <!--快速查找，列表过滤-->
    <el-row style="margin-top: 5px;margin-bottom: 5px;">
      <div style="font-weight: bolder;margin-bottom: 5px">快速查找：</div>
      时间排序方式：
      <el-radio-group v-model="selectsSort" size="mini">
        <el-radio-button label="倒序" ></el-radio-button>
        <el-radio-button label="正序"></el-radio-button>
      </el-radio-group>
      充值状态：
      <el-radio-group v-model="selectsState" size="mini">
        <el-radio-button label="所有" ></el-radio-button>
        <el-radio-button label="审核中"></el-radio-button>
        <el-radio-button label="审核成功" ></el-radio-button>
        <el-radio-button label="审核失败"></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      时间范围：
      <el-date-picker
        v-model="selectsDays"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini">
      </el-date-picker>
    </el-row>
    <!--充值记录列表-->
    <el-table :data="tableData" stripe style="width: 100%" size="mini">
      <el-table-column label="用户信息" width="180">
        <template slot-scope="scope">
          <div>用户名：{{scope.row.user_name}}</div>
          <div>提交时间：{{scope.row.add_time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="充值订单信息" width="400">
        <template slot-scope="scope">
          <div>支付方式：{{scope.row.method}}</div>
          <div>交易号：{{scope.row.order_number}}</div>
          <div>充值金额：{{scope.row.money}}</div>
          <div>到账金额：{{scope.row.arrival_money}}</div>
          <div>充值失败原因：{{scope.row.failure_reason}}</div>
          <div>状态：{{scope.row.state}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button @click="handleConfirm(scope.$index, scope.row)" :disabled="scope.row.state!=='审核中'" size="mini">审核通过</el-button>
          </div>
          <div>
            <el-button @click="handleCancel(scope.$index, scope.row)" type="danger" :disabled="scope.row.state!=='审核中'" size="mini">审核不通过</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :total="pageCount">
    </el-pagination>
    <!--审核不通过弹出dialog窗-->
    <el-dialog title="失败原因" :visible.sync="dialogFormVisible" width="45%" top="25vh">
      <el-form class="dialogForm" :model="form"  ref="form" :label-width="formLabelWidth">
        <el-form-item label="失败原因：">
          <el-input v-model="form.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-row class="explain-content">
      <p>充值审核说明：</p>
      <p>如果审核错误，只能去后台修改。</p>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AdminRecharge',
  data () {
    return {
      selectsSort: '倒序',
      selectsState: '审核中',
      selectsDays: '',
      tableData: [{}],
      pageCount: 10,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        id: '',
        reason: '信息错误'
      },
      dialogObj: {}
    }
  },
  mounted: function () {
    // 获取充值列表
    this.getRechargeList()
  },
  computed: {
    theOrder: function () {
      if (this.selectsSort === '倒序') {
        return '&ordering=-add_time'
      } else if (this.selectsSort === '正序') {
        return '&ordering=add_time'
      }
    },
    theState: function () {
      if (this.selectsState === '所有') {
        return ''
      } else if (this.selectsState === '审核中') {
        return '&state=1'
      } else if (this.selectsState === '审核成功') {
        return '&state=2'
      } else if (this.selectsState === '审核失败') {
        return '&state=3'
      }
    },
    theDays: function () {
      if (this.selectsDays) {
        return '&datamin=' + this.selectsDays[0] + '&dataemax=' + this.selectsDays[1]
      } else {
        return ''
      }
    }
  },
  watch: {
    theOrder: function (newNum, oldNum) {
      this.currentPage = 1
      this.getRechargeList()
    },
    theState: function (newNum, oldNum) {
      this.currentPage = 1
      this.getRechargeList()
    },
    theDays: function (newNum, oldNum) {
      this.currentPage = 1
      this.getRechargeList()
    }
  },
  methods: {
    // 审核通过
    handleConfirm (index, row) {
      if (row.method === '支付宝') {
        row.method = 1
      } else if (row.method === '微信') {
        row.method = 2
      } else {
        row.method = 3
      }
      let obj = {
        money: row.money,
        method: row.method,
        order_number: row.order_number,
        arrival_money: row.arrival_money,
        state: 2
      }
      var that = this
      this.$http.patch('/RechargeSure/' + row.id + '/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.tableData[index].state = '审核成功'
            this.getRechargeList()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '审核订单出错！' + key + ':' + error[key]
            })
          }
        })
    },
    // 审核不通过
    handleCancel (index, row) {
      this.form.id = row.id
      if (row.method === '支付宝') {
        this.dialogObj.method = 1
      } else if (row.method === '微信') {
        this.dialogObj.method = 2
      } else {
        this.dialogObj.method = 3
      }
      this.dialogObj = {
        money: row.money,
        order_number: row.order_number,
        arrival_money: row.arrival_money,
        state: 3
      }
      this.form.reason = '信息错误'
      this.dialogFormVisible = true
    },
    dialogCancel () {
      this.dialogObj = {}
      this.dialogFormVisible = false
    },
    dialogConfirm () {
      this.dialogObj.failure_reason = this.form.reason
      var that = this
      this.$http.patch('/RechargeSure/' + this.form.id + '/', this.dialogObj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            // this.tableData[index].state = '审核成功'
            this.getRechargeList()
            this.dialogFormVisible = false
            this.$message({
              type: 'info',
              message: '该充值订单审核不通过'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '审核订单出错！' + key + ':' + error[key]
            })
          }
        })
      // this.dialogFormVisible = false
    },
    getRechargeList () {
      // 获取充值列表
      var that = this
      this.$http.get('/RechargeSure/?page=' + this.currentPage + this.theState + this.theDays + this.theOrder) // 将信息发送给后端
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
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取充值列表失败！' + key + ':' + error[key]
            })
          }
        })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRechargeList()
    }
  }
}
</script>

<style scoped>
  .explain-content {
    margin: 20px auto;
  }
  .dialogForm {
    width: 80%;
  }
</style>
