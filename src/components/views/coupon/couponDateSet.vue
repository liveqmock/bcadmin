<template>
  <div class="create=coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量制卡</el-breadcrumb-item>
        <el-breadcrumb-item>卡券有效期设定</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data" >
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="卡券批次:">
          {{ coupons.batchNumber }}
        </el-form-item>
        <el-form-item label="卡券名称:">
          {{ coupons.couponName }}
        </el-form-item>
        <el-form-item label="卡券序号:" required>
          <el-col :span="4">
            <el-form-item prop="beginNum">
            <el-input v-model.number="formData.beginNum" placeholder="开始序号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="tc">
            ——
          </el-col>
          <el-col :span="4">
            <el-form-item prop="endNum">
            <el-input v-model.number="formData.endNum" placeholder="结束序号"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间:" required>
          <el-col :span="5">
            <el-form-item prop="useBeginTime">
            <el-date-picker
              v-model="formData.useBeginTime"
              type="datetime"
              :editable='false'
              @change="beginTimeRules">
            </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间:" required>
          <el-col :span="5">
            <el-form-item prop="useEndTime">
            <el-date-picker
              v-model="formData.useEndTime"
              type="datetime"
              :editable='false'
              @change="endTimeRules">
            </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :loading="loading"
                     @click="couponCreate('formData')">{{ loading ? '正在保存' : '保存' }}</el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
          <!-- <el-button @click="testBtn('formData')">测试按钮</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  import moment from 'moment'
  export default {
    created () {
      this.getCoupons()
    },
    data () {
      return {
        formData: {
          beginNum: '',
          couponId: '',
          endNum: '',
          useBeginTime: '',
          useEndTime: '',
          batchNumber: ''
        },
        k: JSON.parse(sessionStorage.getItem('store')).k,
        rules: {
          couponId: [
            { required: true, message: '请选择卡券' }
          ],
          beginNum: [
            { required: true, message: '序号不能为空' }
          ],
          endNum: [
            { required: true, message: '序号不能为空' }
          ],
          useBeginTime: [
            { required: true, message: '时间不能为空' }
          ],
          useEndTime: [
            { required: true, message: '时间不能为空' }
          ]
        },
        coupons: {},
        loading: false,
        minNum: '',
        maxNum: ''
      }
    },
    methods: {
      getCoupons () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/coupon-user-rel/batch-list/search.do', {
          params: {
            storeId: that.k,
            batchNumber: this.$route.params.batch,
            couponName: this.$route.params.name
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.coupons = res.data.data[0]
            that.formData.beginNum = res.data.data[0].beginNum
            that.formData.couponId = res.data.data[0].couponId
            that.formData.endNum = res.data.data[0].endNum
            that.formData.useBeginTime = res.data.data[0].useBeginTime
            that.formData.useEndTime = res.data.data[0].useEndTime
            that.formData.batchNumber = res.data.data[0].batchNumber
            // 初始卡券序号
            that.minNum = res.data.data[0].beginNum
            that.maxNum = res.data.data[0].maxNum
          }
        })
      },
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formData.useEndTime)
        this.formData.useBeginTime = val
        if (date2 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formData.useBeginTime = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formData.useBeginTime)
        let date2 = moment(val)
        this.formData.useEndTime = val
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formData.useEndTime = ''
        }
      },
      couponCreate (formName) {
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.loading = true
            axios.post(URL.api_name + 'backofficeapi/coupon-user-rel/batch/updateBeginEndTime.do', that.formData).then((res) => {
              that.loading = false
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '提交成功'
                })
                that.$router.push({
                  path: '/lotsCoupon'
                })
              } else {
                that.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            }).catch((err) => {
              console.log(err)
              that.loading = false
              that.$message({
                type: 'error',
                message: '提交失败'
              })
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .tc{
    text-align: center;
    color: #ccc;
  }
</style>
