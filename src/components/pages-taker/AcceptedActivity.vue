<template>
  <div class="accept-activity">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        我的刷单活动
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <!--说明框-->
    <!--<el-row>-->
      <!--<el-col :span="24" class="tips">-->
        <!--<p>刷手提交刷单信息，卖家确认信息，任务完成后，刷手赚取（本金+佣金-5），平台抽成5元。</p>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <el-row style="margin-top: 5px;margin-bottom: 5px;">
      时间排序方式：
      <el-radio-group v-model="selects1" size="mini">
        <el-radio-button label="倒序" ></el-radio-button>
        <el-radio-button label="正序"></el-radio-button>
      </el-radio-group>
      刷单活动状态：
      <el-radio-group v-model="selects2" size="mini">
        <el-radio-button label="所有" ></el-radio-button>
        <el-radio-button label="待完成" ></el-radio-button>
        <el-radio-button label="审核中"></el-radio-button>
        <el-radio-button label="已确认" ></el-radio-button>
        <el-radio-button label="已取消"></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="活动名称" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.activity_name }}</div>
          <div>发布时间：{{ scope.row.add_time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="刷单活动信息" width="110">
        <template slot-scope="scope">
          <div>本金: {{ scope.row.single_price}}</div>
          <div>佣金：{{ scope.row.commission - theCut}}</div>
          <div>刷单活动状态：{{ scope.row.state_type}}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单信息" width="280">
        <template slot-scope="scope">
          <div>买家：{{ scope.row.buyer}}</div>
          <div>订单号：{{ scope.row.order}}</div>
          <div>快递：{{ scope.row.Courier }}</div>
          <div>快递单号：{{ scope.row.Courier_number }}</div>
          <div>实际付款：{{ scope.row.single_price - scope.row.difference }} 差价：{{ scope.row.difference }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" @click="toActivity(scope.$index, scope.row)" :disabled="scope.row.state_type!=='待完成' && scope.row.state_type!=='审核中'">添加/修改信息</el-button>
          </div>
          <div>
            <el-button size="mini" type="danger" @click="cancelActivity(scope.$index, scope.row)" :disabled="scope.row.state_type!=='待完成' && scope.row.state_type!=='审核中'">取消活动</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'AcceptActivity',
  data () {
    return {
      selects1: '倒序',
      selects2: '所有',
      theCut: 0.0,
      tableData: [{}],
      pageCount: 50,
      currentPage: 1
    }
  },
  mounted: function () {
    // 如果详情页传回页码，设置页码
    if (this.$route.params.page) {
      this.currentPage = this.$route.params.page
    }
    if (this.$route.params.state) {
      this.selects2 = this.$route.params.state
    }
    if (this.$route.params.order) {
      this.selects1 = this.$route.params.order
    }
    // 获取抽成值
    this.getTheCut()
    // 获取已接收活动列表
    this.getAcceptedActivity()
  },
  computed: {
    theOrder: function () {
      if (this.selects1 === '倒序') {
        return '&ordering=-add_time'
      } else if (this.selects1 === '正序') {
        return '&ordering=add_time'
      }
    },
    theState: function () {
      if (this.selects2 === '所有') {
        return ''
      } else if (this.selects2 === '待完成') {
        return '&state_type=1'
      } else if (this.selects2 === '审核中') {
        return '&state_type=2'
      } else if (this.selects2 === '已确认') {
        return '&state_type=3'
      } else if (this.selects2 === '已取消') {
        return '&state_type=4'
      }
    }
  },
  watch: {
    theOrder: function (newNum, oldNum) {
      this.currentPage = 1
      this.getAcceptedActivity()
    },
    theState: function (newNum, oldNum) {
      this.currentPage = 1
      this.getAcceptedActivity()
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getAcceptedActivity()
    },
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
    // 获取已接收活动列表
    getAcceptedActivity () {
      var that = this
      this.$http.get('/order/?page=' + this.currentPage + this.theState + this.theOrder) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.pageCount = res.data.count
            this.tableData = res.data.results
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].state_type === 1) {
                this.tableData[i].state_type = '待完成'
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
    // 添加、修改订单信息
    toActivity (index, row) {
      // console.log(index, row)
      // 将用户选择的页码、排序方式、状态传到详情页
      this.$router.push({name: 'ToActivity', params: {id: row.id, page: this.currentPage, order: this.selects1, state: this.selects2}})
    },
    // 取消刷单活动
    cancelActivity (index, row) {
      // console.log(index, row)
      let obj = {
        state_type: '4'
      }
      var that = this
      this.$http.patch('/order/' + row.id + '/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.getAcceptedActivity()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '取消活动失败！' + key + ':' + error[key]
            })
          }
        })
    }
  }
}
</script>

<style scoped>
  .tips {
    height: 100px;
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
    margin-bottom: 20px;
  }
</style>
