<template>
  <div class="add-logistics">
    <!--标题头-->
    <el-row>
      <el-col :span="24">
        添加物流订单
        <hr style="height:1px;border:none;border-top:3px solid #555555;width: 100%;margin:10px auto">
      </el-col>
    </el-row>
    <!--物流订单说明框-->
    <el-row>
      <el-col :span="24" class="logistics-message">
        <p>每个物流订单收费 {{logisticsPrice}}元</p>
      </el-col>
    </el-row>
    <!--物流订单文本框-->
    <el-row class="blank-con">
      <el-col :span="24">
        <div class="my-tips">收货地址填写，可批量下单，每行一个地址，最多100个地址</div>
        <div class="my-tips">收货地址格式：李四 15888888888 广东省 广州市 番禺区 岭南大道321号 123456</div>
        <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入收货地址"
          v-model="textarea">
        </el-input>
      </el-col>
    </el-row>
    <el-row class="blank-con">
      <!--<div>注意：Excel表格文件，第一行表头必须为如下格式</div>-->
      <el-button size="small" type="primary" @click="onUploadText">提交文本框内订单</el-button>
    </el-row>
    <!--物流订单Excel下单-->
    <el-row class="blank-con-two">
      <el-col :span="8">
        <el-upload
          ref="upload"
          action=""
          :on-change="readExcel"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :limit="1"
          :file-list="fileList">
          <el-button size="small" type="primary">导入Excel表格快速下单</el-button>
          <div slot="tip" class="my-tips">只能上传xls/xlsx文件，且不超过2MB</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row class="blank-con">
      <div>注意：Excel表格文件，第一行表头必须为如下格式</div>
      <div>收货人 收货人电话 省份 城市 区 详细地址 邮编</div>
      <el-button size="small" type="primary" @click="onUploadExcel">提交Excel内订单</el-button>
    </el-row>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'AddLogistics',
  data () {
    return {
      msg: '请先导入Excel文件',
      msgState: false,
      fileMessage: {},
      fileList: [],
      textarea: '',
      logisticsPrice: ''
    }
  },
  mounted: function () {
    this.getPrice()
  },
  methods: {
    // 获取物流订单价格
    getPrice () {
      this.$http.get('/GetPrice/?search=wuliuyongjin') // 将信息发送给后端
        .then((res) => { // axios返回的数据都在res.data里
          if (res.status === 200) { // 如果成功
            this.logisticsPrice = res.data[0].Task_Price
          } else {
            this.logisticsPrice = ''
          }
        })
    },
    // 限制上传文件的个数和定义超出限制时的行为
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    readExcel (file, fileList, name) {
      this.fileList = fileList
      // 用户上传的Excel文件格式和大小校验
      var str = file.name
      const isLt2M = file.size / 1024 / 1024 < 2
      if (str.indexOf('xlsx') === -1 || str.indexOf('xls') === -1) {
        this.$message.error('上传文件只能是 xlsx/xls 格式!')
        this.msg = '上传文件只能是 xlsx/xls 格式!'
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
        this.msg = '上传文件大小不能超过 2MB!'
        return false
      }
      // 文件校验成功后
      var that = this
      const fileReader = new FileReader()
      fileReader.onload = function (ev) {
        // that是vue对象，this是file对象
        try {
          const data = ev.target.result
          // const workbook = XLSX.read(data, {type: 'binary'})
          const workbook = XLSX.read(data, {type: fileStatus ? 'binary' : 'array'})
          for (let sheet in workbook.Sheets) {
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            that.fileMessage = sheetArray
            // console.log(this.fileMessage)
            for (var i = 0; i < that.fileMessage.length; i++) {
              if (!that.fileMessage[i].收货人 || !that.fileMessage[i].收货人电话 || !that.fileMessage[i].省份 || !that.fileMessage[i].城市 || !that.fileMessage[i].区 || !that.fileMessage[i].详细地址 || !that.fileMessage[i].邮编) {
                that.$message.error('表格表头有误或者有字段为空')
                that.msg = '表格表头有误或者有字段为空'
                that.fileMessage = {}
                return false
              }
            }
            that.msgState = true
            return true
          }
        } catch (e) {
          that.$message.error('文件类型不正确')
          return false
        }
      }
      const fileStatus = FileReader.prototype.readAsBinaryString
      fileStatus ? fileReader.readAsBinaryString(file.raw) : fileReader.readAsArrayBuffer(file.raw)
      // fileReader.readAsBinaryString(file.raw) // IE不能用！
    },
    // Excel形式提交订单
    uploadFile () {
      for (var i = 0; i < this.fileMessage.length; i++) {
        let obj = {
          receive_name: this.fileMessage[i].收货人,
          mobile: this.fileMessage[i].收货人电话,
          province: this.fileMessage[i].省份,
          city: this.fileMessage[i].城市,
          district: this.fileMessage[i].区,
          address: this.fileMessage[i].详细地址,
          postal_code: this.fileMessage[i].邮编,
          commission: this.logisticsPrice,
          state: 0
        }
        var that = this
        this.$http.post('/LogisticsTask/', obj) // 将信息发送给后端
          .then((res) => { // axios返回的数据都在res.data里
            // console.log(res)
            if (res.status === 201) { // 如果成功
            }
          })
          .catch(function (error) {
            console.log(error)
            // that.msgState = false
            // that.msg = '添加物流订单过程出错！'
            for (var key in error) {
              that.$message({
                type: 'error',
                message: '添加物流订单失败！' + key + ':' + error[key]
              })
            }
            return false
          })
      }
      return true
    },
    onUploadExcel () {
      console.log(this)
      if (this.msgState) {
        if (this.uploadFile()) {
          // this.$message({
          //   type: 'success',
          //   message: '物流订单添加成功！'
          // })
          this.$alert('物流订单添加成功！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push({path: '/user/my-logistics'})
            }
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '添加物流订单失败！' + this.msg
        })
      }
    },
    // 文本框形式提交订单
    uploadText () {
      var lineArr = this.textarea.split(/[(\r\n)\r\n]+/)
      for (var i = 0; i < lineArr.length; i++) {
        var textPiece = lineArr[i].split(' ')
        let obj = {
          receive_name: textPiece[0],
          mobile: textPiece[1],
          province: textPiece[2],
          city: textPiece[3],
          district: textPiece[4],
          address: textPiece[5],
          postal_code: textPiece[6],
          commission: this.logisticsPrice,
          state: 0
        }
        var that = this
        this.$http.post('/LogisticsTask/', obj) // 将信息发送给后端
          .then((res) => { // axios返回的数据都在res.data里
            // console.log(res)
            if (res.status === 201) { // 如果成功
            }
          })
          .catch(function (error) {
            console.log(error)
            for (var key in error) {
              that.$message({
                type: 'error',
                message: '添加物流订单失败！' + key + ':' + error[key]
              })
            }
            return false
          })
      }
      return true
    },
    onUploadText () {
      if (this.textarea !== '') {
        // 分行
        var lineArr = this.textarea.split(/[(\r\n)\r\n]+/)
        for (var i = 0; i < lineArr.length; i++) {
          // 空格分字段
          var textPiece = lineArr[i].split(' ')
          // 如果有一行字段数不为7
          if (textPiece.length !== 7) {
            this.$message({
              type: 'error',
              message: '请检查文本框收货地址格式是否有误！'
            })
            return false
          }
        }
        if (this.uploadText()) {
          this.$alert('物流订单添加成功！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push({path: '/user/my-logistics'})
            }
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '文本框不能为空！'
        })
      }
    }
  }
}
</script>

<style scoped>
  .add-logistics {
    width: 100%;
    height: 100%;
  }
  .logistics-message {
    height: 100px;
    border-radius: 5px;
    background: rgba(210, 210, 210, 0.1);
  }
  .blank-con {
    margin-top: 10px;
  }
  .blank-con-two {
    margin-top: 30px;
  }
  .my-tips {
    font-size: 14px;
  }
</style>
