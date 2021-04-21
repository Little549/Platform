<template>
  <div class="admin-to-cash">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        管理员-提现订单确认
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
    <!--提现记录列表-->
    <el-table :data="tableData" stripe style="width: 100%" size="mini">
      <el-table-column label="用户信息" width="180">
        <template slot-scope="scope">
          <div>用户名：{{scope.row.user_name}}</div>
          <div>提交时间：{{scope.row.add_time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="提现订单信息" width="400">
        <template slot-scope="scope">
          <div>银行卡号：{{scope.row.Bank_number}}</div>
          <div>银行卡姓名：{{scope.row.name}}</div>
          <div>提现金额：{{scope.row.money}}</div>
          <div>到账金额：{{scope.row.arrival_money}}</div>
          <div>提现失败原因：{{scope.row.failure_reason}}</div>
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
    <el-dialog title="失败原因" :visible.sync="dialogFormVisible" width="45%">
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
      <p>提现审核说明：</p>
      <p>如果审核错误，只能去后台修改。</p>
    </el-row>
  </div>
</template>

<script>
// import qs from 'qs'
export default {
  name: 'AdminToCash',
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
    // 获取提现列表
    this.getToCashList()
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
      this.getToCashList()
    },
    theState: function (newNum, oldNum) {
      this.currentPage = 1
      this.getToCashList()
    },
    theDays: function (newNum, oldNum) {
      this.currentPage = 1
      this.getToCashList()
    }
  },
  methods: {
    // 审核通过
    handleConfirm (index, row) {
      let obj = {
        money: row.money,
        Bank_number: row.Bank_number,
        name: row.name,
        arrival_money: row.arrival_money,
        state: 2
      }
      var that = this
      this.$http.patch('/WithdrawSure/' + row.id + '/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            // console.log(res)
            this.tableData[index].state = '审核成功'
            this.getToCashList()
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
      this.dialogObj = {
        money: row.money,
        Bank_number: row.Bank_number,
        name: row.name,
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
      this.$http.patch('/WithdrawSure/' + this.form.id + '/', this.dialogObj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            // this.tableData[index].state = '审核成功'
            this.getToCashList()
            this.dialogFormVisible = false
            this.$message({
              type: 'info',
              message: '该提现订单审核不通过'
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
    getToCashList () {
      // 获取提现列表
      var that = this
      this.$http.get('/WithdrawSure/?page=' + this.currentPage + this.theState + this.theDays + this.theOrder) // 将信息发送给后端
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
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取提现列表失败！' + key + ':' + error[key]
            })
          }
        })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getToCashList()
    }
  }
}
</script>

<style scoped>
  .explain-content {
    margin: 20px auto;
  }
</style>
