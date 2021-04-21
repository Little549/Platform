<template>
  <div class="accept-activity">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        已被接的任务订单
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
      刷单活动状态：
      <el-radio-group v-model="selectsState" size="mini">
        <el-radio-button label="所有" ></el-radio-button>
        <el-radio-button label="已接单" ></el-radio-button>
        <el-radio-button label="审核中"></el-radio-button>
        <el-radio-button label="已确认" ></el-radio-button>
        <el-radio-button label="已取消"></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      接单时间范围：
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
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="活动名称" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.activity_name }}</div>
          <div>发布时间：{{ scope.row.add_time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务信息" width="120">
        <template slot-scope="scope">
          <div>本金: {{ scope.row.single_price}}</div>
          <div>佣金：{{ scope.row.commission}}</div>
          <div>任务状态：{{ scope.row.state_type}}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单信息" width="320">
        <template slot-scope="scope">
          <div>买家：{{ scope.row.buyer}}</div>
          <div>订单号：{{ scope.row.order}}</div>
          <div>快递：{{ scope.row.Courier }}</div>
          <div>快递单号：{{ scope.row.Courier_number }}</div>
          <div>刷手实际付款：{{ scope.row.single_price - scope.row.difference }} 差价：{{ scope.row.difference }}</div>
          <div>刷手联系方式：{{ scope.row.user_phone}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="danger" @click="onConcert(scope.$index, scope.row)" :disabled="scope.row.state_type!=='审核中'">确认完成</el-button>
          </div>
          <div>
            <el-button size="mini" @click="changePrice(scope.$index, scope.row)" :disabled="scope.row.state_type!=='审核中'">修改差价</el-button>
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
    <!--修改差价弹出dialog窗-->
    <el-dialog title="修改差价" :visible.sync="dialogFormVisible" width="45%" top="25vh">
      <el-form class="dialogForm" :model="form"  ref="form" :label-width="formLabelWidth">
        <el-form-item label="刷手实际付款：">
          <el-input v-model="form.actualMoney"></el-input>
        </el-form-item>
        <el-form-item label="差价：">
          {{getDifference}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-row class="explain-content">
      <p>如有问题可直接联系刷手。</p>
      <!--<p>如果审核错误，只能去后台修改。</p>-->
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AcceptActivity',
  data () {
    return {
      selectsSort: '倒序',
      selectsState: '审核中',
      selectsDays: '',
      tableData: [{}],
      activityCount: 0,
      pageCount: 10,
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        id: '',
        actualMoney: 0.0,
        single_price: 0.0,
        difference: 0.00
      },
      dialogObj: {}
    }
  },
  mounted: function () {
    // 获取用户活动的数量，如果没有活动就不获取任务Task的数据
    this.getActivity()
    // 获取已接收活动列表
    if (this.activityCount > 0) {
      this.getAcceptedTask()
    }
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
      } else if (this.selectsState === '已接单') {
        return '&state_type=1'
      } else if (this.selectsState === '审核中') {
        return '&state_type=2'
      } else if (this.selectsState === '已确认') {
        return '&state_type=3'
      } else if (this.selectsState === '已取消') {
        return '&state_type=4'
      }
    },
    theDays: function () {
      if (this.selectsDays) {
        return '&datamin=' + this.selectsDays[0] + '&dataemax=' + this.selectsDays[1]
      } else {
        return ''
      }
    },
    // 计算差价值，保留两位小数
    getDifference: function () {
      let oldDifference = this.form.single_price - this.form.actualMoney
      let newDifference = parseFloat(oldDifference).toFixed(2)
      return newDifference
    }
  },
  watch: {
    // 活动数量大于零，就可以获取已接收活动列表。因为没有活动，获取这个数据会报错，经过判断再获取
    activityCount: function (newNum, oldNum) {
      this.getAcceptedTask()
    },
    theOrder: function (newNum, oldNum) {
      this.currentPage = 1
      this.getAcceptedTask()
    },
    theState: function (newNum, oldNum) {
      this.currentPage = 1
      this.getAcceptedTask()
    },
    theDays: function (newNum, oldNum) {
      this.currentPage = 1
      this.getAcceptedTask()
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getAcceptedTask()
    },
    // 获取用户活动数量
    getActivity () {
      var that = this
      // 获取用户活动数量
      this.$http.get('/myactivity/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.activityCount = res.data.count
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取活动数量失败！' + key + ':' + error[key]
            })
          }
        })
    },
    // 获取已被接的任务订单
    getAcceptedTask () {
      var that = this
      this.$http.get('/MyTask/?page=' + this.currentPage + this.theDays + this.theState + this.theOrder) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.pageCount = res.data.count
            this.tableData = res.data.results
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].state_type === 1) {
                this.tableData[i].state_type = '已接单'
              } else if (this.tableData[i].state_type === 2) {
                this.tableData[i].state_type = '审核中'
              } else if (this.tableData[i].state_type === 3) {
                this.tableData[i].state_type = '已确认'
              } else if (this.tableData[i].state_type === 4) {
                this.tableData[i].state_type = '已取消'
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取已接活动失败！' + key + ':' + error[key]
            })
          }
        })
    },
    // 修改差价
    changePrice (index, row) {
      // console.log(index, row)
      this.form.id = row.id
      this.form.actualMoney = row.single_price - row.difference
      this.form.single_price = row.single_price
      this.dialogFormVisible = true
    },
    dialogCancel () {
      this.dialogObj = {}
      this.dialogFormVisible = false
    },
    dialogConfirm () {
      // this.dialogObj.failure_reason = this.form.reason
      var that = this
      this.dialogObj = {
        difference: this.form.single_price - this.form.actualMoney,
        state_type: 2
      }
      this.$http.patch('/MyTask/' + this.form.id + '/', this.dialogObj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.getAcceptedTask()
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '修改差价成功！'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '修改差价失败！' + key + ':' + error[key]
            })
          }
        })
    },
    // 确认任务完成
    onConcert (index, row) {
      // console.log(index, row)
      let obj = {
        difference: row.difference,
        state_type: '3'
      }
      var that = this
      this.$http.patch('/MyTask/' + row.id + '/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.$message({
              type: 'success',
              message: '确认任务完成！'
            })
            this.getAcceptedTask()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '确认任务失败！' + key + ':' + error[key]
            })
          }
        })
    }
  }
}
</script>

<style scoped>
  .explain-content {
    margin: 20px auto;
  }
</style>
