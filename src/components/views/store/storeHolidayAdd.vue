<template>
  <div class="store-list">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i>门店维护</el-breadcrumb-item>
            <el-breadcrumb-item>节假日设定</el-breadcrumb-item>
            <el-breadcrumb-item>添加</el-breadcrumb-item>
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
          <el-date-picker
          type="date"
          placeholder="选择日期"
          :editable="false"
          @change="beginTimeRules"
          v-model="formData.startHolidayDate"
          style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="4">
          <el-date-picker type="date"
          placeholder="选择日期"
          :editable='false'
          @change="endTimeRules"
          v-model="formData.endHolidayDate"
          style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="备注：">
        <el-col :span="12">
          <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="addHoliday">
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
      },
      data () {
        return {
          formData: {
            // storeId: this.$route.params.adid,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            dictCode: '',
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
          if (date1 !== 'NaN' && date1.diff(date2) > 0) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'error'
            })
            this.formData.endHolidayDate = ''
          }
        },
        addHoliday () {
          if (this.formData.startHolidayDate !== '') {
            this.formData.startHolidayDate = moment(this.formData.startHolidayDate).format('YYYY-MM-DD')
          }
          if (this.formData.endHolidayDate !== '') {
            this.formData.endHolidayDate = moment(this.formData.endHolidayDate).format('YYYY-MM-DD')
          }
          var that = this
          that.isLoading = true
          axios.post(URL.api_name + 'backofficeapi/store/storeHoliday/create.do', that.formData).then((res) => {
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
