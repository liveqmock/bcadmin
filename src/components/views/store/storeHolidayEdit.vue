<template>
  <div class="store-list">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i>门店维护</el-breadcrumb-item>
            <el-breadcrumb-item>节假日设定</el-breadcrumb-item>
            <el-breadcrumb-item>修改</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-form ref="formData" :model="formData" label-width="110px">
      <el-form-item label="节假日名称">
        <el-col :span="9">
          <el-input v-model="formData.holidayName"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="起止时间：">
        <el-col :span="4">
          <el-date-picker type="date" placeholder="选择日期" @change="beginTimeRules" v-model="formData.startHolidayDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="4">
          <el-date-picker type="date" placeholder="选择日期" @change="endTimeRules" v-model="formData.endHolidayDate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-col :span="12">
          <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="updateHoliday">
            {{ isLoading ? '正在保存' : '保存' }}
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
        this.getDetail()
      },
      data () {
        return {
          // storeId: this.$route.params.shid,
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          formData: {
            holidayName: '',
            startHolidayDate: '',
            endHolidayDate: '',
            remark: ''
          },
          isLoading: false
        }
      },
      methods: {
        beginTimeRules (val) {
          let date1 = moment(val)
          let date2 = moment(this.formData.endHolidayDate)
          this.formData.startHolidayDate = val
          // console.log(date2)
          if (date2 !== 'NaN' && date1.diff(date2) > 0) {
            this.$message({
              message: '开始时间不能大于结束时间',
              type: 'error'
            })
            this.formData.startHolidayDate = ''
          }
        },
        endTimeRules (val) {
          let date1 = moment(this.formData.startHolidayDate)
          let date2 = moment(val)
          this.formData.endHolidayDate = val
          // console.log(date2)
          if (date1 !== 'NaN' && date1.diff(date2) > 0) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'error'
            })
            this.formData.endHolidayDate = ''
          }
        },
        getDetail () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/store/storeHoliday/find.do', {
            params: {
              id: that.$route.params.shid
              // storeId: 35
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
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
        updateHoliday () {
          var that = this
          that.isLoading = true
          axios.post(URL.api_name + 'backofficeapi/store/storeHoliday/update.do', that.formData).then((res) => {
            that.isLoading = false
            if (res.data.status === 'success') {
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              that.$router.go('-1')
            }
          }).catch((error) => {
            that.isLoading = false
            console.log(error)
          })
        }
      }
    }
</script>
<style lang="less" scoped>
.el-col-1{ text-align: center;}
</style>
