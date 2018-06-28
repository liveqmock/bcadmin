<template>
  <div class="news-send">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 消息管理</el-breadcrumb-item>
        <el-breadcrumb-item><i class="el-icon-date"></i> 消息列表</el-breadcrumb-item>
        <el-breadcrumb-item>发送消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="formData" label-width="110px">
      <el-form-item label="消息类型：" prop="messageDTO">
        <el-checkbox-group v-model="formData.messageDTO">
          <el-checkbox
            v-for="(city, index) in messageDTOS"
            :key="index"
            :disabled="city.systemCode === 'systemsend'"
            :label="city.systemCode">{{ city.systemName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发送门店：" v-if="isAdmin">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{city.storeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="会员发放：">
        <el-form-item label="会员等级">
          <el-col :span="11">
          <el-select v-model="checkData.userLever" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in userLevers"
              :key="index"
              :label="item.systemName"
              :value="item.systemCode">
            </el-option>
          </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="年龄阶段">
          <el-col :span="5">
            <el-input v-model="checkData.ageBegin" placeholder="最低年龄"></el-input>
          </el-col>
          <el-col :span="1">至</el-col>
          <el-col :span="5">
            <el-input v-model="checkData.ageEnd" placeholder="最高年龄"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="绑定手机号时段">
          <el-date-picker
            v-model="checkData.registerTimeBegin"
            type="date"
            @change="regBeginTime"
            placeholder="开始日期">
          </el-date-picker>
          <span style="display: inline-block;width: 34px;text-align: center">至</span>
          <el-date-picker
            v-model="checkData.registerTimeEnd"
            type="date"
            @change="regEndTime"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="">
        <el-col>
          <el-button type='info' @click="searchs">检索</el-button>
          <p class="tipMsg">发放会员总数 {{ nums }} 人</p>
        </el-col>
      </el-form-item>
      <el-form-item label="立即发送：" prop="isPromptlySend">
        <el-radio-group v-model="formData.isPromptlySend">
          <el-radio class="radio" :label="'true'">是</el-radio>
          <el-radio class="radio" :label="'false'">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="发送时间：" v-show="formData.isPromptlySend=='false'">
        <el-date-picker
          v-model="formData.sendDate"
          type="datetime"
          @change="sendDate"
          :picker-options="pickerOptions0"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="addNews('formData')">
            {{ isLoading ? '正在发送' : '发送' }}
        </el-button>
        <el-button @click="$router.go('-1')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import URL from '@/common/js/URL.js'
import moment from 'moment'
export default {
  created () {
    this.getMessageType()
    this.getMemberLevel()
    this.getStoreArr()
  },
  data () {
    return {
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      isLoading: false,
      nums: 0,
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      formData: {
        isPromptlySend: 'true',
        messageDTO: [],
        newsId: this.$route.params.nid,
        sendDate: ''
      },
      checkData: {
        userLever: '',
        ageBegin: '',
        ageEnd: '',
        grade: '',
        registerTimeBegin: '',
        registerTimeEnd: ''
      },
      isSendAll: false,
      messageDTOS: [],
      userLevers: [],
      dtos: [],
      rules: {
        newsTitle: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        messageDTO: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        isPromptlySend: [
          { required: true, message: '请选择是否立即发送', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    isAdmin () {
      return JSON.parse(sessionStorage.getItem('userInfo')).isAdmin
    }
  },
  methods: {
    getStoreArr () {
      axios.get(URL.api_name + 'backofficeapi/employee/searchstores.do', {}).then((res) => {
        if (res.data.status === 'success') {
          this.cities = res.data.data
        }
      })
    },
    handleCheckAllChange (event) {
      let storeIds = []
      if (event.target.checked) {
        this.cities.forEach((data) => {
          storeIds.push(data.id)
        })
      }
      this.checkedCities = event.target.checked ? storeIds : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    getMessageType () {
      let that = this
      axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
        params: {
          systemCode: 'messagetype'
        }
      }).then((res) => {
        that.messageDTOS = res.data.data
        for (let m of that.messageDTOS) {
          if (m.systemCode === 'systemsend') {
            this.formData.messageDTO.push(m.systemCode)
          }
        }
      })
    },
    getMemberLevel () {
      let that = this
      axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
        params: {
          systemCode: 'memberLevel'
        }
      }).then((res) => {
        if (res.data.status === 'success') {
          that.userLevers = res.data.data
        }
      })
    },
    regBeginTime (val) {
      let date1 = moment(val)
      let date2 = moment(this.checkData.registerTimeEnd)
      this.checkData.registerTimeBegin = val
      // console.log(date2)
      if (date2 !== 'NaN' && date1.diff(date2) > 0) {
        this.$message({
          message: '开始时间不能大于结束时间',
          type: 'error'
        })
        this.checkData.registerTimeBegin = ''
      }
    },
    regEndTime (val) {
      let date1 = moment(this.checkData.registerTimeBegin)
      let date2 = moment(val)
      this.checkData.registerTimeEnd = val
      // console.log(date2)
      if (date1 !== 'NaN' && date1.diff(date2) > 0) {
        this.$message({
          message: '结束时间不能小于开始时间',
          type: 'error'
        })
        this.checkData.registerTimeEnd = ''
      }
    },
    sendDate (val) {
      this.formData.sendDate = val
    },
    searchs () {
      let that = this
      let storeIDs
      if (this.isAdmin) {
        storeIDs = this.checkedCities.toString()
      } else {
        storeIDs = JSON.parse(sessionStorage.getItem('store')).k
      }
      axios.get(URL.api_name + 'memberapi/news/member/screen.do', {
        params: {
          ageBegin: that.checkData.ageBegin,
          ageEnd: that.checkData.ageEnd,
          grade: that.checkData.userLever,
          registerTimeBegin: that.checkData.registerTimeBegin,
          registerTimeEnd: that.checkData.registerTimeEnd,
          storeIds: storeIDs
        }
      }).then(function (respose) {
        that.nums = respose.data.data
      }, function (error) {
        console.log(error)
      })
    },
    addNews (formName) {
      let that = this
      if (that.checkData.registerTimeBegin !== '') {
        that.checkData.registerTimeBegin = moment(that.checkData.registerTimeBegin).format('YYYY-MM-DD')
      }
      if (that.checkData.registerTimeEnd !== '') {
        that.checkData.registerTimeEnd = moment(that.checkData.registerTimeEnd).format('YYYY-MM-DD')
      }
      that.dtos = []
      for (let i = 0; i < that.formData.messageDTO.length; i++) {
        that.dtos.push({
          messageType: that.formData.messageDTO[i]
        })
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断发送人数是否为0
          if (that.nums <= 0) {
            this.$message({
              message: '发送目标人数为0，请重新检索发送条件',
              type: 'error'
            })
            return false
          }
          if (that.formData.isPromptlySend === 'false' && that.formData.sendDate === '') {
            that.$message({
              type: 'error',
              message: '请选择发送时间'
            })
            return
          }
          if (that.formData.sendDate !== '' && moment().diff(moment(that.formData.sendDate), 'seconds') > 0) {
            // 发送时间不能小于当前时间
            this.$message({
              type: 'error',
              message: '发送时间不能小于当前时间'
            })
            return
          }
          // 如果不是超级管理员，默认发送给当前门店
          let storeIDs = []
          if (this.isAdmin) {
            storeIDs = this.checkedCities
          } else {
            storeIDs.push(JSON.parse(sessionStorage.getItem('store')).k)
          }
          axios.post(URL.api_name + 'memberapi/news/send.do', {
            grade: that.checkData.userLever,
            ageBegin: that.checkData.ageBegin,
            ageEnd: that.checkData.ageEnd,
            isPromptlySend: that.formData.isPromptlySend,
            messageDTO: that.dtos,
            newsId: this.$route.params.nid,
            registerTimeBegin: that.checkData.registerTimeBegin,
            registerTimeEnd: that.checkData.registerTimeEnd,
            sendDate: that.formData.sendDate,
            isSendAll: this.checkAll,
            storeIds: storeIDs
          }).then(res => {
            that.isLoading = false
            if (res.data.status === 'success') {
              that.$message({
                message: res.data.message,
                type: 'success'
              })
            }
            that.$router.go('-1')
          }).catch(error => {
            that.isLoading = false
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-form-item .el-form-item{ margin-bottom:10px;}
.el-col-1{ text-align: center}
.tipMsg{ color:#999 }
.el-checkbox+.el-checkbox{
  margin-left: 0;
}
  .news-send .el-checkbox{
    margin-right: 12px;
  }
</style>
