<template>
  <div class="my-logistics">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        我的物流订单
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
      物流订单状态：
      <el-radio-group v-model="selectsState" size="mini">
        <el-radio-button label="所有" ></el-radio-button>
        <el-radio-button label="等待完成" ></el-radio-button>
        <el-radio-button label="已取消"></el-radio-button>
        <el-radio-button label="已完成" ></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      物流添加时间：
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
    <!--物流订单列表-->
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="物流订单信息" width="180">
        <template slot-scope="scope">
          <div>佣金：{{ scope.row.commission }}</div>
          <div>订单状态：{{ scope.row.state }}</div>
          <div>订单时间：{{ scope.row.add_time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="物流信息" width="430">
        <template slot-scope="scope">
          <div>收货人：{{scope.row.receive_name}}</div>
          <div>收货人电话：{{ scope.row.mobile }}</div>
          <div>收货地址：{{ scope.row.full_address }}</div>
          <div>邮编：{{ scope.row.postal_code }}</div>
          <div>快递单号：{{ scope.row.Courier_number }}</div>
          <div>物流信息：{{ scope.row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button @click="handleModify(scope.$index, scope.row)" type="danger" :disabled="scope.row.state!=='等待完成'" size="mini">修改</el-button>
          </div>
          <div>
           <el-button @click="handleCancel(scope.$index, scope.row)" type="danger" :disabled="scope.row.state!=='等待完成'" size="mini">取消</el-button>
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
  name: 'MyLogistics',
  data () {
    return {
      selectsSort: '倒序',
      selectsState: '所有',
      selectsDays: '',
      tableData: [{}],
      pageCount: 10,
      currentPage: 1
    }
  },
  mounted: function () {
    // 获取物流订单列表
    // 如果详情页传回页码，设置页码
    if (this.$route.params.page) {
      this.currentPage = this.$route.params.page
    }
    this.getLogisticsList()
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
      } else if (this.selectsState === '等待完成') {
        return '&state=0'
      } else if (this.selectsState === '已取消') {
        return '&state=1'
      } else if (this.selectsState === '已完成') {
        return '&state=2'
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
      this.getLogisticsList()
    },
    theState: function (newNum, oldNum) {
      this.currentPage = 1
      this.getLogisticsList()
    },
    theDays: function (newNum, oldNum) {
      this.currentPage = 1
      this.getLogisticsList()
    }
  },
  methods: {
    // 选择物流订单页面
    handleCurrentChange (val) {
      this.currentPage = val
      this.getLogisticsList()
    },
    // 获取物流订单列表
    getLogisticsList () {
      var that = this
      this.$http.get('/LogisticsTask/?page=' + this.currentPage + this.theDays + this.theState + this.theOrder) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.tableData = res.data.results
            this.pageCount = res.data.count
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].full_address = this.tableData[i].province + this.tableData[i].city + this.tableData[i].district + this.tableData[i].address
            }
            for (var j = 0; j < this.tableData.length; j++) {
              if (this.tableData[j].state === 0) {
                this.tableData[j].state = '等待完成'
              } else if (this.tableData[j].state === 1) {
                this.tableData[j].state = '已取消'
              } else if (this.tableData[j].state === 2) {
                this.tableData[j].state = '已完成'
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
              message: '获取物流订单列表出错！' + key + ':' + error[key]
            })
          }
        })
    },
    // 修改物流订单信息
    handleModify (index, row) {
      this.$router.push({name: 'ModifyLogistics', params: {id: row.id, page: this.currentPage}})
    },
    // 取消物流订单
    handleCancel (index, row) {
      var that = this
      // console.log(row)
      let obj = {
        receive_name: row.receive_name,
        mobile: row.mobile,
        province: row.province,
        city: row.city,
        district: row.district,
        address: row.address,
        postal_code: row.postal_code,
        commission: row.commission,
        Courier_number: row.Courier_number,
        content: row.content,
        state: 1
      }
      this.$http.patch('/LogisticsTask/' + row.id + '/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.getLogisticsList()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '取消物流订单失败！' + key + ':' + error[key]
            })
          }
        })
    }
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
