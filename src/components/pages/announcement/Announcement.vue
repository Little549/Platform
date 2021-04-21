<template>
  <div class="announcement">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        公告通知
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="标题" width="500">
        <template slot-scope="scope">
          <el-button type="text" @click="onAnnouncement(scope.$index, scope.row)">{{ scope.row.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          <div>{{ scope.row.add_time}}</div>
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
  name: 'Announcement',
  data () {
    return {
      tableData: [{}],
      pageCount: 10,
      currentPage: 1
    }
  },
  mounted: function () {
    // 获取公告列表
    // if (this.$route.params.page) {
    //   this.currentPage = this.$route.params.page
    // }
    this.getAnnouncement()
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getAnnouncement()
    },
    // 获取活动列表
    getAnnouncement () {
      var that = this
      // 获取公告列表
      this.$http.get('/Announcement/?page=' + this.currentPage) // 将信息发送给后端
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
              message: '获取公告列表失败！' + key + ':' + error[key]
            })
          }
        })
    },
    // 点击公告，打开详情页
    onAnnouncement (index, row) {
      // console.log(index, row)
      const {href} = this.$router.resolve({
        name: 'AnnouncementInfo',
        params: {
          id: row.id
        }
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
