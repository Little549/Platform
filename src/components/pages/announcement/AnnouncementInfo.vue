<template>
  <div>
    <el-row>
      <el-col :span="24">
        {{announcementMessage.title}}
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24">
        {{announcementMessage.content }}
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      {{announcementMessage.add_time}}
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'CheckAnnouncement',
  data () {
    return {
      announcementMessage: {}
    }
  },
  mounted: function () {
    // 获取该公告详情
    this.getAnnouncementInfo()
  },
  methods: {
    // 获取该公告详情
    getAnnouncementInfo () {
      var that = this
      this.$http.get('/Announcement/' + this.$route.params.id + '/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          console.log(res)
          if (res.status === 200) { // 如果成功
            this.announcementMessage = res.data
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取公告数据出错！' + key + ':' + error[key]
            })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
