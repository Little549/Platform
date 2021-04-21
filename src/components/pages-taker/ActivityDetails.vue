<template>
  <div class="activity-details">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        活动详情
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <el-row class="activity-form-back">
      <el-form class="activity-form-one" label-width="150px" :model="formMessage" size="mini">
        <el-form-item label="产品链接:" prop="product_url" style="width: 500px">
          <a target="_blank" :href=formMessage.product_url>活动产品链接</a>
        </el-form-item>
        <el-form-item label="产品图片:" prop="image" style="width: 500px">
          <img :src="formMessage.image" style="width: 100%;">
        </el-form-item>
        <el-form-item label="店铺旺旺:" prop="store_ww">
          {{formMessage.store_ww}}
        </el-form-item>
        <el-form-item label="店铺名称:" prop="store_name">
          {{formMessage.store_name}}
        </el-form-item>
        <el-form-item label="本金:" prop="single_price">
          {{formMessage.single_price}}
        </el-form-item>
        <el-form-item label="佣金:" prop="commission">
          {{formMessage.commission - theCut}}
        </el-form-item>
        <el-form-item label="剩余刷单次数:" prop="numbers">
          {{formMessage.numbers}}
        </el-form-item>
        <el-form-item label="是否咨询客服:" prop="is_consulting_service">
          {{formMessage.is_consulting_service}}
        </el-form-item>
        <el-form-item label="活动SKU选项:" prop="activity_sku">
          {{formMessage.activity_sku}}
        </el-form-item>
        <el-form-item label="网店订单留言:" prop="order_message">
          {{formMessage.order_message}}
        </el-form-item>
        <el-form-item label="补充说明:" prop="added_message">
          {{formMessage.added_message}}
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="activity-form-back">
      活动详情
      <el-form class="activity-form-two" label-width="150px" :model="formMessage" size="mini">
        <el-form-item label="活动标题:" prop="title">
          {{formMessage.title}}
        </el-form-item>
        <el-form-item label="客户端类型:" prop="client_type">
          {{formMessage.client_type}}
        </el-form-item>
        <el-form-item label="活动平台:" prop="activity_platform">
          {{formMessage.activity_platform}}
        </el-form-item>
        <el-form-item label="活动入口:" prop="activity_entrance" style="width: 500px">
          <p>{{formMessage.activity_entrance}}</p>
          <template v-if="formMessage.activity_entrance === '关键词'">
            <p>{{formMessage.activity_keyword}}</p>
          </template>
          <template v-if="formMessage.activity_entrance === '卡首屏口令'">
            <p>{{formMessage.activity_keyword}}</p>
          </template>
          <template v-if="formMessage.activity_entrance === '直通车'">
            <p>{{formMessage.activity_keyword}}</p>
          </template>
          <template v-if="formMessage.activity_entrance === '淘口令'">
            <p>{{formMessage.taokouling}}</p>
          </template>
          <template v-if="formMessage.activity_entrance === '扫描二维码'">
            <p><img :src="formMessage.entrance_qrcode" style="width: 100%;"></p>
          </template>
          <template v-if="formMessage.activity_entrance === '其他'">
            <p>{{formMessage.entrance_qita_instructions}}</p>
            <p>{{formMessage.entrance_qita_adress}}</p>
          </template>
        </el-form-item>
        <el-form-item label="搜索排序:" prop="search_rank">
          {{formMessage.search_rank}}
        </el-form-item>
        <el-form-item label="价格区间:" prop="price_highest">
          {{formMessage.price_minimum}}~{{formMessage.price_highest}}
        </el-form-item>
        <el-form-item label="发货地:" prop="delivery_place">
          {{formMessage.delivery_place}}
        </el-form-item>
        <el-form-item label="款式:" prop="style" style="width: 500px">
          {{formMessage.style}}
          <template v-if="formMessage.style === '店内款'">
            <img :src="formMessage.style_image" style="width: 100%;">
          </template>
        </el-form-item>
        <el-form-item label="活动前:" prop="before_activity">
          {{formMessage.before_activity}}
        </el-form-item>
        <el-form-item label="下单付款时间:" prop="order_payment_time">
          {{formMessage.order_payment_time}}
        </el-form-item>
        <el-form-item label="允许付款方式:" prop="allow_pay">
          {{formMessage.allow_pay}}
        </el-form-item>
        <el-form-item label="产品自评:" prop="evaluation">
          {{formMessage.evaluation}}
          <template v-if="formMessage.evaluation === '自评'">
            <p>{{formMessage.evaluation_evaluation}}</p>
          </template>
          <template v-if="formMessage.evaluation === '关键词造句'">
            <p>{{formMessage.evaluation_keyword}}</p>
          </template>
        </el-form-item>
        <el-form-item label="是否实拍:" prop="is_photo" style="width: 500px">
          {{formMessage.is_photo}}
          <template v-if="formMessage.is_photo === '是'">
            <img  v-if="formMessage.is_photo_1" :src="formMessage.is_photo_1" style="width: 100%;">
            <img  v-if="formMessage.is_photo_2" :src="formMessage.is_photo_2" style="width: 100%;">
            <img  v-if="formMessage.is_photo_3" :src="formMessage.is_photo_3" style="width: 100%;">
            <img  v-if="formMessage.is_photo_4" :src="formMessage.is_photo_4" style="width: 100%;">
            <img  v-if="formMessage.is_photo_5" :src="formMessage.is_photo_5" style="width: 100%;">
          </template>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="activity-form-back">
      买家限制
      <el-form class="activity-form-two" label-width="150px" :model="formMessage" size="mini">
        <el-form-item label="买家性别:" prop="message_type">
          {{formMessage.message_type}}
        </el-form-item>
        <el-form-item label="活动间隔:" prop="activity_interval">
          {{activity_interval_data}}
        </el-form-item>
        <el-form-item>
          <el-button @click="acceptActivity" type="primary" size="medium">接受刷单活动</el-button>
          <el-button @click="onCancel" type="primary" size="medium">返回</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ActivityDetails',
  data () {
    return {
      theCut: 0.0,
      formMessage: {
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
    activity_interval_data: function () {
      if (this.formMessage.activity_interval) {
        let activityIntervalArr = this.formMessage.activity_interval.split(',')
        return activityIntervalArr[0] + '任务，' + activityIntervalArr[1] + '天内不能重复参与。'
      }
    }
  },
  methods: {
    // 获取抽成值
    getTheCut () {
      this.$http.get('/GetPrice/?search=choucheng') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.theCut = res.data[0].Task_Price
          }
        })
    },
    // 获取该活动详情
    getTheActivity () {
      var that = this
      this.$http.get('/allactivity/' + this.$route.params.id + '/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.formMessage = res.data
            if (this.formMessage.is_consulting_service) {
              this.formMessage.is_consulting_service = '是'
            } else {
              this.formMessage.is_consulting_service = '否'
            }
            if (this.formMessage.is_photo) {
              this.formMessage.is_photo = '是'
            } else {
              this.formMessage.is_photo = '否'
            }
            if (this.formMessage.message_type === 1) {
              this.formMessage.message_type = '不限'
            } else if (this.formMessage.message_type === 2) {
              this.formMessage.message_type = '男'
            } else if (this.formMessage.message_type === 3) {
              this.formMessage.message_type = '女'
            }
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取活动数据出错！' + key + ':' + error[key]
            })
          }
        })
    },
    // 接受刷单活动
    acceptActivity () {
      // console.log(index, row)
      let obj = {
        activity: this.$route.params.id,
        activity_name: this.formMessage.title,
        single_price: this.formMessage.single_price,
        commission: this.formMessage.commission,
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
            this.getTheActivity()
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
      this.$router.push({name: 'ActivityList', params: {page: this.$route.params.page}})
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
  .activity-form-one {
    width: 700px;
    /*margin: 30px auto;*/
    margin-top: 30px;
  }
  .activity-form-two {
    width: 700px;
    /*margin: 30px auto;*/
    margin-top: 10px;
  }
</style>
