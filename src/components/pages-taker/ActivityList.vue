<template>
  <div class="activity-list">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        活动大厅
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <!--说明框-->
    <!--<el-row>-->
      <!--<el-col :span="24" class="tips">-->
        <!--<p>刷手提交刷单信息，卖家确认信息，任务完成后，刷手赚取（本金+佣金-抽成)。</p>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <!--快速查找，列表过滤-->
    <el-row style="margin-top: 5px;margin-bottom: 5px;">
      <div style="font-weight: bolder;margin-bottom: 5px">快速查找：</div>
      时间排序方式：
      <el-radio-group v-model="selectsSort" size="mini">
        <el-radio-button label="倒序" ></el-radio-button>
        <el-radio-button label="正序"></el-radio-button>
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
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="活动名称" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.title }}</div>
          <div>发布时间：{{ scope.row.add_time}}</div>
        </template>
      </el-table-column>
      <el-table-column label="活动信息" width="270">
        <template slot-scope="scope">
          <div>本金: {{ scope.row.single_price}} 佣金：{{ scope.row.commission - theCut}}</div>
          <a target="_blank" :href=scope.row.product_url>产品链接</a>
          <div>产品图片：<img :src="scope.row.image" style="width: 100%;"></div>
          <div>剩余刷单次数：{{ scope.row.numbers }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商家信息" width="150">
        <template slot-scope="scope">
          <div>店铺旺旺：{{ scope.row.store_ww}}</div>
          <div>店铺名称：{{ scope.row.store_name}}</div>
          <!--<div>活动状态：{{ scope.row.state }}</div>-->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" @click="checkActivity(scope.$index, scope.row)">查看活动详情</el-button>
          </div>
          <div>
            <el-button size="mini" type="danger" @click="acceptActivity(scope.$index, scope.row)">接受刷单活动</el-button>
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
  name: 'ActivityList',
  data () {
    return {
      selectsSort: '倒序',
      selectsDays: '',
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
    // 获取抽成值
    this.getTheCut()
    // 获取活动列表
    this.getActivity()
  },
  computed: {
    theOrder: function () {
      if (this.selectsSort === '倒序') {
        return '&ordering=-add_time'
      } else if (this.selectsSort === '正序') {
        return '&ordering=add_time'
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
      this.getActivity()
    },
    theDays: function (newNum, oldNum) {
      this.currentPage = 1
      this.getActivity()
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getActivity()
    },
    // 获取抽成值
    getTheCut () {
      this.$http.get('/GetPrice/?search=choucheng') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.theCut = res.data[0].Task_Price
          }
        })
    },
    // 获取活动列表
    getActivity () {
      var that = this
      // 获取活动列表
      this.$http.get('/allactivity/?page=' + this.currentPage + '&state=true' + this.theDays + this.theOrder) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.pageCount = res.data.count
            this.tableData = res.data.results
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取活动列表失败！' + key + ':' + error[key]
            })
          }
        })
    },
    // 查看活动详情
    checkActivity (index, row) {
      console.log(index, row)
      this.$router.push({name: 'ActivityDetails', params: {id: row.id, page: this.currentPage}})
    },
    // 接受刷单活动
    acceptActivity (index, row) {
      // console.log(index, row)
      let obj = {
        activity: row.id,
        activity_name: row.title,
        single_price: row.single_price,
        commission: row.commission,
        difference: 0,
        state_type: '1'
      }
      var that = this
      this.$http.post('/order/', obj) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 201) { // 如果成功
            this.$message({
              type: 'success',
              message: '刷单活动接受成功！'
            })
            this.getActivity()
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '失败！' + key + ':' + error[key]
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
