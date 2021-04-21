<template>
  <div class="modify-activity">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        编辑活动
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <!--发布活动表单分三段-->
    <el-row class="modifyActivity-form-back">
      <el-form class="modifyActivity-form-one" label-width="150px" :model="formMessage" :rules="rules" size="mini">
        <el-form-item label="产品链接:" prop="product_url">
          <a target="_blank" :href=formMessage.product_url>活动产品链接</a>
        </el-form-item>
        <el-form-item label="产品图片:" prop="image" style="width: 500px">
          <img :src="formMessage.image" style="width: 100%;">
        </el-form-item>
        <el-form-item label="店铺旺旺:" prop="store_ww">
          <el-select v-model="formMessage.store_id" @change="selectStore" placeholder="请选择" style="width: 100px">
            <el-option v-for="item in shopData" :key="item.id" :label="item.store_ww" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称:" prop="store_name">
          {{formMessage.store_name}}
        </el-form-item>
        <el-form-item label="本金:" prop="single_price">
          {{formMessage.single_price}}
        </el-form-item>
        <el-form-item label="佣金:" prop="commission">
          {{formMessage.commission}}
        </el-form-item>
        <el-form-item label="剩余刷单次数:" prop="numbers">
          <div style="width: 150px">{{formMessage.numbers}}</div>
        </el-form-item>
        <el-form-item label="是否咨询客服:" prop="is_consulting_service">
          <template>
            <el-radio v-model="formMessage.is_consulting_service" label="是">是</el-radio>
            <el-radio v-model="formMessage.is_consulting_service" label="否">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="活动SKU选项:" prop="activity_sku">
          <el-input placeholder="选填" v-model="formMessage.activity_sku" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="网店订单留言:" prop="order_message">
          <el-input placeholder="选填" v-model="formMessage.order_message"></el-input>
        </el-form-item>
        <el-form-item label="补充说明:" prop="added_message">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="此说明不做为操作相关的投诉依据"
            v-model="formMessage.added_message">
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="modifyActivity-form-back">
      活动详情
      <el-form class="modifyActivity-form-two" label-width="150px" :model="formMessage" :rules="rules" size="mini">
        <el-form-item label="活动标题:" prop="title">
          <el-input placeholder="活动标题将显示在接手方列表中" v-model="formMessage.title"></el-input>
        </el-form-item>
        <el-form-item label="客户端类型:" prop="client_type">
          <template>
            <el-radio v-model="formMessage.client_type" label="不限">不限</el-radio>
            <el-radio v-model="formMessage.client_type" label="电脑端">电脑端</el-radio>
            <el-radio v-model="formMessage.client_type" label="手机端">手机端</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="活动平台:" prop="activity_platform">
          <template>
            <el-radio v-model="formMessage.activity_platform" label="淘宝-taobao.com">淘宝-taobao.com</el-radio>
            <el-radio v-model="formMessage.activity_platform" label="天猫-tmall.com">天猫-tmall.com</el-radio>
            <el-radio v-model="formMessage.activity_platform" label="阿里巴巴-1688.com">阿里巴巴-1688.com</el-radio>
            <el-radio v-model="formMessage.activity_platform" label="京东-jd.com">京东-jd.com</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="活动入口:" prop="activity_entrance">
          <template>
            <el-radio v-model="formMessage.activity_entrance" label="关键词">关键词</el-radio>
            <el-radio v-model="formMessage.activity_entrance" label="卡首屏口令">卡首屏口令</el-radio>
            <el-radio v-model="formMessage.activity_entrance" label="直通车">直通车</el-radio>
            <el-radio v-model="formMessage.activity_entrance" label="淘口令">淘口令</el-radio>
            <el-radio v-model="formMessage.activity_entrance" label="扫描二维码">扫描二维码</el-radio>
            <el-radio v-model="formMessage.activity_entrance" label="已买到宝贝">已买到宝贝</el-radio>
            <el-radio v-model="formMessage.activity_entrance" label="其他">其他</el-radio>
          </template>
          <template v-if="formMessage.activity_entrance === '关键词'">
            <el-input placeholder="填写进店关键词。注意：关键词无法找到将被下架，发前请先查在前10页展示。" v-model="formMessage.activity_keyword"></el-input>
          </template>
          <template v-if="formMessage.activity_entrance === '卡首屏口令'">
            <el-input placeholder="填写进店关键词。注意：关键词无法找到将被下架，发前请先查在前10页展示。" v-model="formMessage.activity_keyword"></el-input>
          </template>
          <template v-if="formMessage.activity_entrance === '直通车'">
            <el-input placeholder="填写进店关键词。注意：关键词无法找到将被下架，发前请先查在前10页展示。" v-model="formMessage.activity_keyword"></el-input>
          </template>
          <template v-if="formMessage.activity_entrance === '淘口令'">
            <el-input placeholder="淘口令" v-model="formMessage.taokouling"></el-input>
          </template>
          <template v-if="formMessage.activity_entrance === '扫描二维码'">
            <p><img :src="formMessage.entrance_qrcode" style="width: 100%;"></p>
            <el-upload
              ref="uploadQR"
              action=""
              :auto-upload="false"
              :on-success="successUpload"
              :on-change="changeUploadQR"
              :on-preview="previewUpload"
              :on-exceed="exceedUpload"
              :http-request="handleFile"
              :multiple="false"
              :limit="1"
              :file-list="entrance_qrcode_path"
              list-type="picture"
              accept="image/jpeg, image/png">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </el-upload>
          </template>
          <template v-if="formMessage.activity_entrance === '其他'">
            <el-input placeholder="其他入口地址。填写活动地址网址" v-model="formMessage.entrance_qita_adress"></el-input>
            <el-input placeholder="其他入口说明。填写查找说明，如任务宝贝在天天特价，3C数码类目第1页" v-model="formMessage.entrance_qita_instructions"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="搜索排序:" prop="search_rank">
          <template>
            <el-radio v-model="formMessage.search_rank" label="综合">综合</el-radio>
            <el-radio v-model="formMessage.search_rank" label="人气">人气</el-radio>
            <el-radio v-model="formMessage.search_rank" label="销量">销量</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="价格区间:" prop="price_highest">
          <el-input placeholder="最低" v-model="formMessage.price_minimum" style="width: 70px"></el-input>~
          <el-input placeholder="最高" v-model="formMessage.price_highest" style="width: 70px"></el-input>元
        </el-form-item>
        <el-form-item label="发货地:" prop="delivery_place">
          <el-input placeholder="选填" v-model="formMessage.delivery_place" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="款式:" prop="style" style="width: 500px">
          <template>
            <el-radio v-model="formMessage.style" label="进店款">进店款</el-radio>
            <el-radio v-model="formMessage.style" label="店内款">店内款</el-radio>
          </template>
          <template v-if="formMessage.style === '店内款'">
            <img :src="formMessage.style_image" style="width: 100%;">
            <el-upload
              ref="uploadQR"
              action=""
              :auto-upload="false"
              :on-success="successUpload"
              :on-change="changeUploadStyle"
              :on-preview="previewUpload"
              :on-exceed="exceedUpload"
              :http-request="handleFile"
              :multiple="false"
              :limit="1"
              :file-list="style_path"
              list-type="picture"
              accept="image/jpeg, image/png">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </el-upload>
          </template>
        </el-form-item>
        <el-form-item label="活动前:" prop="before_activity">
          <template>
            <el-radio v-model="formMessage.before_activity" label="先浏览了解产品">先浏览了解产品</el-radio>
            <el-radio v-model="formMessage.before_activity" label="先加入购物车">先加入购物车</el-radio>
            <el-radio v-model="formMessage.before_activity" label="先加入收藏夹">先加入收藏夹</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="下单付款时间:" prop="order_payment_time">
          <template>
            <el-radio v-model="formMessage.order_payment_time" label="可马上下单">可马上下单</el-radio>
            <el-radio v-model="formMessage.order_payment_time" label="1小时后（当天）">1小时后（当天）</el-radio>
            <el-radio v-model="formMessage.order_payment_time" label="第2天">第2天</el-radio>
            <el-radio v-model="formMessage.order_payment_time" label="第3天">第3天</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="允许付款方式:" prop="allow_pays">
          <template>
            <el-checkbox-group v-model="formMessage.allow_pays">
              <el-checkbox label="信用卡"></el-checkbox>
              <el-checkbox label="花呗"></el-checkbox>
              <el-checkbox label="集分宝"></el-checkbox>
              <el-checkbox label="淘金币"></el-checkbox>
              <el-checkbox label="天猫积分"></el-checkbox>
            </el-checkbox-group>
          </template>
          （店铺不支持不要勾选，手续费商家自负）
        </el-form-item>
        <el-form-item label="产品自评:" prop="evaluation">
          <template>
            <el-radio v-model="formMessage.evaluation" label="不评">不评</el-radio>
            <el-radio v-model="formMessage.evaluation" label="自由发挥">自由发挥</el-radio>
            <el-radio v-model="formMessage.evaluation" label="自评">自评</el-radio>
            <el-radio v-model="formMessage.evaluation" label="关键词造句">关键词造句</el-radio>
            <el-radio v-model="formMessage.evaluation" label="5星评价，无需评语">5星评价，无需评语</el-radio>
          </template>
          <template v-if="formMessage.evaluation === '自评'">
            <el-input placeholder="请填写评语" v-model="formMessage.evaluation_evaluation"></el-input>
          </template>
          <template v-if="formMessage.evaluation === '关键词造句'">
            <el-input placeholder="关键词" v-model="formMessage.evaluation_keyword1" style="width: 300px"></el-input>
            <el-input placeholder="关键词" v-model="formMessage.evaluation_keyword2" style="width: 300px"></el-input>
            <el-input placeholder="关键词" v-model="formMessage.evaluation_keyword3" style="width: 300px"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="是否实拍:" prop="is_photo" style="width: 500px">
          <template>
            <el-radio v-model="formMessage.is_photo" label="不展示实拍">不展示实拍</el-radio>
            <el-radio v-model="formMessage.is_photo" label="展示产品实拍">展示产品实拍</el-radio>
          </template>
          <template v-if="formMessage.is_photo === '展示产品实拍'">
            <img v-if="formMessage.is_photo_1" :src="formMessage.is_photo_1" style="width: 100%;">
            <img v-if="formMessage.is_photo_2" :src="formMessage.is_photo_2" style="width: 100%;">
            <img v-if="formMessage.is_photo_3" :src="formMessage.is_photo_3" style="width: 100%;">
            <img v-if="formMessage.is_photo_4" :src="formMessage.is_photo_4" style="width: 100%;">
            <img v-if="formMessage.is_photo_5" :src="formMessage.is_photo_5" style="width: 100%;">
            <el-upload
              ref="uploadPhoto"
              action=""
              :auto-upload="false"
              :on-success="successUpload"
              :on-change="changeUploadPhoto"
              :on-preview="previewUpload"
              :on-exceed="exceedUploadPhoto"
              :http-request="handleFile"
              :multiple="false"
              :limit="5"
              :file-list="photo_path"
              list-type="picture"
              accept="image/jpeg, image/png">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB。最多上传五张图片。</div>
            </el-upload>
          </template>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="modifyActivity-form-back">
      买家限制
      <el-form class="modifyActivity-form-two" label-width="150px" :model="formMessage" :rules="rules" size="mini">
        <el-form-item label="买家性别:" prop="message_type">
          <template>
            <el-radio v-model="formMessage.message_type" label="不限">不限</el-radio>
            <el-radio v-model="formMessage.message_type" label="男">男</el-radio>
            <el-radio v-model="formMessage.message_type" label="女">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="活动间隔:" prop="activity_interval">
          <template>
            <el-select v-model="formMessage.activity_interval_select" placeholder="请选择" style="width: 100px">
              <el-option
                v-for="item in activity_interval_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            任务，
            <el-input placeholder="" v-model="formMessage.activity_interval_day" style="width: 50px"></el-input>
            天内不能重复参与。最长90天
          </template>
        </el-form-item>
        <el-form-item>
          <el-button @click="editActivity" type="primary" size="medium">确定修改活动</el-button>
          <el-button @click="onCancel" type="primary" size="medium">取消</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ModifyActivity',
  data () {
    return {
      formMessage: {
        product_url: '',
        store_id: '',
        store_ww: '',
        store_name: '',
        single_price: 0.0,
        commission: 0.0,
        numbers: 1,
        is_consulting_service: '否',
        activity_sku: '',
        order_message: '',
        added_message: '',
        // 活动详情
        title: '',
        image: '',
        client_type: '不限',
        activity_platform: '',
        activity_entrance: '',
        activity_keyword: '',
        entrance_qrcode: '',
        taokouling: '',
        entrance_qita_adress: '',
        entrance_qita_instructions: '',
        search_rank: '综合',
        price_highest: '',
        price_minimum: '',
        delivery_place: '',
        style: '进店款',
        before_activity: '先浏览了解产品',
        order_payment_time: '可马上下单',
        allow_pays: [],
        evaluation: '自由发挥',
        evaluation_evaluation: '',
        evaluation_keyword1: '',
        evaluation_keyword2: '',
        evaluation_keyword3: '',
        is_photo: '不展示实拍',
        message_type: '不限',
        activity_interval_select: '所有店铺',
        activity_interval_day: '15',
        state: false
      },
      rules: {
        product_url: [{
          required: true, message: '请输入产品链接', trigger: 'blur'
        }],
        store_ww: [{
          required: true, message: '店铺旺旺不能为空', trigger: 'blur'
        }],
        store_name: [{
          required: true, message: '店铺名称不能为空', trigger: 'blur'
        }],
        title: [{
          required: true, message: '活动标题不能为空', trigger: 'blur'
        }],
        image: [{
          required: true, message: '', trigger: 'blur'
        }],
        client_type: [{
          required: true, message: '', trigger: 'blur'
        }],
        activity_platform: [{
          required: true, message: '请选择活动平台', trigger: 'blur'
        }],
        activity_entrance: [{
          required: true, message: '请选择活动入口', trigger: 'blur'
        }],
        activity_keyword: [{
          required: true, message: '进店关键字不能为空', trigger: 'blur'
        }],
        search_rank: [{
          required: true, message: '请选择搜索排序', trigger: 'blur'
        }],
        style: [{
          required: true, message: '请选择款式', trigger: 'blur'
        }],
        before_activity: [{
          required: true, message: '请选择活动前', trigger: 'blur'
        }],
        order_payment_time: [{
          required: true, message: '请选择下单付款时间', trigger: 'blur'
        }],
        message_type: [{
          required: true, message: '请选择买号性别', trigger: 'blur'
        }],
        activity_interval: [{
          required: true, message: '活动间隔不能为空', trigger: 'blur'
        }]
      },
      activity_interval_options: [{
        value: '所有店铺',
        label: '所有店铺'
      }, {
        value: '同一店铺',
        label: '同一店铺'
      }, {
        value: '同一链接',
        label: '同一链接'
      }],
      old_price_highest: '',
      old_price_minimum: '',
      shopData: [{}],
      id: '',
      // 活动图片
      // image: '',
      // image_path_get: [],
      // image_path: [],
      // 店内款图片
      style_path: [],
      // 入口二维码图片
      entrance_qrcode_path: [],
      // 实拍五张图
      photo_path: []
    }
  },
  mounted: function () {
    // 获取店铺列表
    this.getShopList()
    // 获取该活动数据
    this.getActivityData()
  },
  computed: {
    // 活动间隔字段
    activity_interval: function () {
      return this.formMessage.activity_interval_select + ',' + this.formMessage.activity_interval_day
    },
    // 付款方式
    allow_pay: function () {
      let pay = ''
      for (var i = 0; i < this.formMessage.allow_pays.length; i++) {
        if (i !== this.formMessage.allow_pays.length - 1) {
          pay = pay + this.formMessage.allow_pays[i] + ','
        } else {
          pay = pay + this.formMessage.allow_pays[i]
        }
      }
      return pay
    },
    evaluation_keyword: function () {
      return this.formMessage.evaluation_keyword1 + ',' + this.formMessage.evaluation_keyword2 + ',' + this.formMessage.evaluation_keyword3
    },
    // 买家性别
    message_type_num: function () {
      if (this.formMessage.message_type === '不限') {
        return 1
      } else if (this.formMessage.message_type === '男') {
        return 2
      } else if (this.formMessage.message_type === '女') {
        return 3
      }
    },
    // 是否咨询客服
    is_consulting_service_bull: function () {
      if (this.formMessage.is_consulting_service === '否') {
        return false
      } else if (this.formMessage.is_consulting_service === '是') {
        return true
      }
    },
    // 是否实拍
    is_photo_bull: function () {
      if (this.formMessage.is_photo === '不展示实拍') {
        return false
      } else if (this.formMessage.is_photo === '展示产品实拍') {
        return true
      }
    }
  },
  methods: {
    // 限制上传文件的个数和定义超出限制时的行为
    exceedUpload (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    exceedUploadPhoto (files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleFile () { },
    previewUpload (file) {
      console.log(file)
    },
    successUpload (response, file, filelist) {
      console.log(response)
    },
    // 用户上传时的图片格式和大小校验
    // 入口二维码图片
    changeUploadQR (file, fileList, name) {
      this.entrance_qrcode_path = fileList
      const isIMAGE = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 实拍五张图片
    changeUploadPhoto (file, fileList, name) {
      this.photo_path = fileList
      const isIMAGE = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 店内款图片
    changeUploadStyle (file, fileList, name) {
      this.style_path = fileList
      const isIMAGE = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 获取店铺列表
    getShopList () {
      var that = this
      this.$http.get('/store/?state=true') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          // console.log(res)
          if (res.status === 200) { // 如果成功
            this.shopData = res.data.results
          } else {
            this.shopData = 'null'
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取店铺数据出错！' + key + ':' + error[key]
            })
          }
        })
    },
    // 选择店铺旺旺，获取店铺名称
    selectStore (key) {
      var that = this
      this.$http.get('/store/' + key + '/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.formMessage.store_ww = res.data.store_ww
            this.formMessage.store_name = res.data.store_name
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取店铺旺旺和店铺名称出错！' + key + ':' + error[key]
            })
          }
        })
    },
    // 取消操作
    onCancel () {
      this.$router.push({name: 'MyActivity', params: {page: this.$route.params.page}})
    },
    // 最后确定修改活动
    editActivity () {
      // 创建 FormData 对象
      // let paramData = new FormData(form)
      let paramData = new FormData()
      if (this.formMessage.price_highest !== this.old_price_highest) {
        paramData.append('price_highest', this.formMessage.price_highest)
      }
      if (this.formMessage.price_minimum !== this.old_price_minimum) {
        paramData.append('price_minimum', this.formMessage.price_minimum)
      }
      paramData.append('product_url', this.formMessage.product_url)
      paramData.append('store_ww', this.formMessage.store_ww)
      paramData.append('store_name', this.formMessage.store_name)
      // paramData.append('single_price', this.formMessage.single_price)
      // paramData.append('commission', this.formMessage.commission)
      // paramData.append('numbers', this.formMessage.numbers)
      paramData.append('is_consulting_service', this.is_consulting_service_bull)
      paramData.append('activity_sku', this.formMessage.activity_sku)
      paramData.append('order_message', this.formMessage.order_message)
      paramData.append('added_message', this.formMessage.added_message)
      paramData.append('title', this.formMessage.title)
      paramData.append('client_type', this.formMessage.client_type)
      // paramData.append('image', this.image_path[0] ? this.image_path[0].raw : '')
      paramData.append('activity_platform', this.formMessage.activity_platform)
      paramData.append('activity_entrance', this.formMessage.activity_entrance)
      paramData.append('entrance_qrcode', this.entrance_qrcode_path[0] ? this.entrance_qrcode_path[0].raw : '')
      paramData.append('taokouling', this.formMessage.taokouling)
      paramData.append('entrance_qita_adress', this.formMessage.entrance_qita_adress)
      paramData.append('entrance_qita_instructions', this.formMessage.entrance_qita_instructions)
      paramData.append('activity_keyword', this.formMessage.activity_keyword)
      paramData.append('search_rank', this.formMessage.search_rank)
      // paramData.append('price_highest', this.formMessage.price_highest)
      // paramData.append('price_minimum', this.formMessage.price_minimum)
      paramData.append('delivery_place', this.formMessage.delivery_place)
      paramData.append('style', this.formMessage.style)
      paramData.append('style_image', this.style_path[0] ? this.style_path[0].raw : '')
      paramData.append('before_activity', this.formMessage.before_activity)
      paramData.append('order_payment_time', this.formMessage.order_payment_time)
      paramData.append('allow_pay', this.allow_pay)
      paramData.append('evaluation', this.formMessage.evaluation)
      paramData.append('evaluation_evaluation', this.formMessage.evaluation_evaluation)
      paramData.append('evaluation_keyword', this.evaluation_keyword)
      paramData.append('is_photo', this.is_photo_bull)
      paramData.append('is_photo_1', this.photo_path[0] ? this.photo_path[0].raw : '')
      paramData.append('is_photo_2', this.photo_path[1] ? this.photo_path[1].raw : '')
      paramData.append('is_photo_3', this.photo_path[2] ? this.photo_path[2].raw : '')
      paramData.append('is_photo_4', this.photo_path[3] ? this.photo_path[3].raw : '')
      paramData.append('is_photo_5', this.photo_path[4] ? this.photo_path[4].raw : '')
      paramData.append('message_type', this.message_type_num)
      paramData.append('activity_interval', this.activity_interval)
      paramData.append('state', this.formMessage.state)
      // 配置请求头中 Content-Type 为'multipart/form-data'
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      var that = this
      this.$http.patch('/myactivity/' + this.$route.params.id + '/', paramData, config) // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            // 登录成功，显示提示语
            this.$message({
              type: 'success',
              message: '成功！'
            })
            this.$router.push({name: 'CheckActivity', params: {id: this.$route.params.id, page: this.$route.params.page}})
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '修改活动失败！' + key + ':' + error[key]
            })
          }
        })
    },
    // 获取活动表单数据
    getActivityData () {
      var that = this
      this.$http.get('/myactivity/' + this.$route.params.id + '/') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            let getdatas = res.data
            if (getdatas.is_consulting_service) {
              getdatas.is_consulting_service = '是'
            } else {
              getdatas.is_consulting_service = '否'
            }
            if (getdatas.is_photo) {
              getdatas.is_photo = '展示产品实拍'
            } else {
              getdatas.is_photo = '不展示实拍'
            }
            if (getdatas.message_type === 1) {
              getdatas.message_type = '不限'
            } else if (getdatas.message_type === 2) {
              getdatas.message_type = '男'
            } else if (getdatas.message_type === 3) {
              getdatas.message_type = '女'
            }
            getdatas.allow_pays = getdatas.allow_pay.split(',')
            let activityIntervalData = getdatas.activity_interval.split(',')
            getdatas.activity_interval_select = activityIntervalData[0]
            getdatas.activity_interval_day = activityIntervalData[1]
            getdatas.store_id = getdatas.store_ww
            this.old_price_highest = getdatas.price_highest
            this.old_price_minimum = getdatas.price_minimum
            this.formMessage = getdatas
            // console.log(this.formMessage)
          }
        })
        .catch(function (error) {
          console.log(error)
          for (var key in error) {
            that.$message({
              type: 'error',
              message: '获取活动数据失败！' + key + ':' + error[key]
            })
          }
        })
    }
  }
}
</script>

<style scoped>
  .modifyActivity-form-back {
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
    margin-top: 10px;
  }
  .modifyActivity-form-one {
    width: 400px;
    /*margin: 30px auto;*/
    margin-top: 30px;
  }
  .modifyActivity-form-two {
    width: 600px;
    /*margin: 30px auto;*/
    margin-top: 10px;
  }
</style>
