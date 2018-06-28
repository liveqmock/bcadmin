<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="formData" label-width="130px">
      <el-form-item label="活动标题：">
        <el-col :span="9">
          {{ formData.title }}
        </el-col>
      </el-form-item>
      <el-form-item label="活动描述：">
        <el-col :span="9">
          {{ formData.content }}
        </el-col>
      </el-form-item>
      <el-form-item label="活动人数：">
        <el-col :span="9">
          {{ formData.countLimit }}
        </el-col>
      </el-form-item>
      <el-form-item label="活动地点：">
        <!--<el-form-item>
          <el-col :span="4">
            <el-select v-model="formData.province" placeholder="请选择"  @change="chooseCity">
                <el-option :label="item.name" :value="item.id" v-for="(item, i) in provinces" :key="i"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="formData.city" placeholder="请选择" @change="chooseArea">
                <el-option :label="item.name" v-for='(item, i) in citys' :value="item.id" :key="i"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="formData.area" placeholder="请选择">
                <el-option :label="item.name" v-for="(item, i) in areas" :value="item.id" :key="i"></el-option>
            </el-select>
          </el-col>
        </el-form-item>-->
        <el-form-item prop="address">
          <el-col :span="12">
            {{ formData.address }}
          </el-col>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动起止时间：">
        <el-col :span="12">
          <el-form-item prop="beginTime">
            {{ formData.beginTime }} 至 {{ formData.endTime }}
            </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="报名截止时间：">
        {{ formData.signupEndTime }}
      </el-form-item>
      <el-form-item label="占用冰面时间：" >
        <el-col :span="12">
          {{ formData.isOccupy === 1 ? '占用' : '不占用' }}
        </el-col>
      </el-form-item>
      <el-form-item label="活动图片：" >
        <el-col :span="12">
          <div class="img-list" v-for="(img, i) in formData.eventPictures">
            <img :src="img.pictureUrl">
          </div>
          </el-col>
      </el-form-item>
      <el-form-item label="活动图文详情：">
        <el-col :span="12">
          <div v-html="formData.imageTextIntroduction"></div>
        </el-col>
      </el-form-item>
      <el-form-item label="支付类型：">
        <el-checkbox-group v-model="signTypes" @change="checkTypes">
          <el-row>
            <el-col :span="3">
              <el-checkbox disabled label="1" name="signTypes">活动价格
                <el-input disabled type="number" v-model.number="formData.signMoney"></el-input>　元
              </el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-checkbox disabled label="2" name="signTypes">消耗积分
                <el-input disabled type="number" v-model.number="formData.signPoint"></el-input>　分
              </el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-checkbox disabled label="3" name="signTypes">抵消课程
                <el-input disabled type="number" v-model.number="formData.signCourse"></el-input>　节
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="updateActivity()">
            编辑
        </el-button>
        <el-button @click="$router.go('-1')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import URL from '@/common/js/URL.js'
import { quillEditor } from 'vue-quill-editor'
import moment from 'moment'
export default {
  created () {
    this.getProvince()
    this.getDetail()
  },
  data () {
    var checkNumber = (rule, value, callback) => {
      let nums = /^[1-9]\d*(?!.*\.)/
      if (!nums.test(value)) {
        return callback(new Error('格式不正确，请输入纯数字'))
      } else {
        callback()
      }
    }
    return {
      yz1: true,
      yz2: true,
      yz3: true,
      isLoading: false,
      formData: {
        id: '',
        province: '',
        city: '',
        area: '',
        address: '',
        isOccupy: '1',
        signType: '',
        eventPictures: [],
        content: '',
        title: '',
        beginTime: '',
        endTime: '',
        signupEndTime: '',
        imageTextIntroduction: '',
        signMoney: 0,
        signPoint: 0,
        status: '',
        signCourse: 0
      },
      signTypes: [],
      storeId: JSON.parse(sessionStorage.getItem('store')).k,
      imgUplaodUrl: URL.api_name + 'backofficeapi/information/event/upload.do',
      provinces: [],
      citys: [],
      areas: [],
      rinkImages: [],
      nowDate: '',
      filelist: [],
      rules: {
        address: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        graphicDetails: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        countLimit: [
          { validator: checkNumber }
        ],
        beginTime: [
          { required: true, message: '开始日期不能为空' }
        ],
        endTime: [
          { required: true, message: '结束日期不能为空' }
        ],
        signMoney: [
          { validator: checkNumber }
        ],
        signPoint: [
          { validator: checkNumber }
        ],
        signCourse: [
          { validator: checkNumber }
        ],
        signupEndTime: [
          { required: true, message: '报名截止时间不能为空' }
        ]
      },
      isFirst: true,
      isFirstC: true
    }
  },
  methods: {
    getDetail () {
      var that = this
      axios.get(URL.api_name + 'backofficeapi/information/event/detail.do', {
        params: {
          id: that.$route.params.aid
        }
      }).then((res) => {
        if (res.data.status === 'success') {
          that.formData = res.data.data
          that.filelist = res.data.data.eventPictures
          for (let i = 0; i < this.filelist.length; i++) {
            that.rinkImages.push({
              name: that.filelist[i].pictureName,
              url: that.filelist[i].pictureUrl
            })
          }
          if (res.data.data.signType.length > 0) {
            that.formData.signType = res.data.data.signType
            //  let arrayType = '1, 2, 3'.split(',').length
            for (let z = 0; z < that.formData.signType.split(',').length; z++) {
              that.signTypes.push(
                  that.formData.signType.split(',')[z]
                )
            }
          }
        } else {
          that.$mesage({
            type: 'error',
            message: res.data.message
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getProvince () {
      let that = this
      axios.get(URL.api_name + '/backofficeapi/store/initialPosition.do', {
        params: {}
      }).then((res) => {
        that.provinces = res.data.data.provinces
      })
    },
    checkZore1 () {
      // let nums = /^\d+(\.\d+)?$/
      let nums = /\d{1,}\.\d{2}$/
      if (!nums.test(this.formData.signMoney)) {
        this.$message({
          message: '请输入正数，小数点后面最多2位',
          type: 'error'
        })
        this.formData.signMoney = 0
        this.yz1 = false
      }
    },
    checkZore2 () {
      let nums = /^[1-9]\d*(?!.*\.)/
      if (!nums.test(this.formData.signPoint)) {
        this.$message({
          message: '格式不正确，请输入纯数字',
          type: 'error'
        })
        this.formData.signPoint = 0
        this.yz2 = false
      }
    },
    checkZore3 () {
      let nums = /^[1-9]\d*(?!.*\.)/
      // let nums = /^[1-9]\d*|0$/
      if (!nums.test(this.formData.signCourse)) {
        this.$message({
          message: '格式不正确，请输入纯数字',
          type: 'error'
        })
        this.formData.signCourse = 0
        this.yz3 = false
      }
    },
    chooseCity (val) {
      let that = this
      axios.get(URL.api_name + '/backofficeapi/store/obtainCitiesOrAreas.do', {
        params: {
          province: val
        }
      }).then((res) => {
        that.citys = res.data.data.citys
        if (!that.isFirst) {
          that.formData.city = ''
          that.formData.area = ''
        }
        this.isFirst = false
      }, function (error) {
        console.log(error)
      })
    },
    chooseArea (val) {
      let that = this
      axios.get(URL.api_name + '/backofficeapi/store/obtainCitiesOrAreas.do', {
        params: {
          city: val
        }
      }).then((res) => {
        that.areas = res.data.data.areas
        if (!that.isFirstC) {
          that.formData.area = ''
        }
        that.isFirstC = false
      }, function (error) {
        console.log(error)
      })
    },
    upImgSuccess (response, file, fileList) {
      this.rinkImages = fileList
      console.log(this.rinkImages)
    },
    upImgremove (file, fileList) {
      this.rinkImages = fileList
    },
    uporr (err, file, fileList) {
      this.$message({
        message: err + '图片上传失败，请检查文件大小是否超过1MB',
        type: 'error'
      })
    },
    checkTypes () {
      if (this.signTypes.length <= 0) {
        this.signTypes = ['1']
        this.$message({
          message: '请至少选择一种支付类型',
          type: 'error'
        })
      } else {
        console.log(this.signTypes.length)
      }
    },
    beginTimeRules (val) {
      let date1 = moment(val)
      let date2 = moment(this.formData.endTime)
      this.formData.beginTime = val
      // console.log(date2)
      if (date2 !== 'NaN' && date1.diff(date2) > 0) {
        this.$message({
          message: '活动开始时间不能大于结束时间',
          type: 'error'
        })
        this.formData.beginTime = ''
      }
    },
    endTimeRules (val) {
      let date1 = moment(this.formData.beginTime)
      let date2 = moment(val)
      this.formData.endTime = val
      // console.log(date2)
      if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
        this.$message({
          message: '活动结束时间不能小于开始时间',
          type: 'error'
        })
        this.formData.endTime = ''
      }
    },
    signupEndTimeRules (val) {
      let date1 = moment(val)
      let date2 = moment(this.formData.beginTime)
      // console.log(date2)
      this.formData.signupEndTime = val
      if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
        this.$message({
          message: '活动截止时间不能大于开始时间',
          type: 'error'
        })
        this.formData.signupEndTime = ''
      }
    },
    updateActivity (id) {
      this.$router.push({
        path: '/activityUpdate/' + this.$route.params.aid
      })
    }
  },
  components: {
    quillEditor
  }
}
</script>
<style lang="less" scoped>
.el-col-6 .el-input{ width:40%; margin:0 5px;}
.el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .img-list{
    display: inline-block;
    img{
      display: inline-block;
      width: 100px;
    }
  }
</style>
