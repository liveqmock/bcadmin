<template>
  <div class="course-export">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>教练当日学员入场情况</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="formInline.signupBegin"
            type="date"
            :clearable="false"
            :editable='false'
            placeholder="开始日期">
          </el-date-picker>
          <div class="Zvertical">至</div>
          <el-date-picker
            v-model="formInline.signupEnd"
            type="date"
            :clearable="false"
            :editable='false'
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <a href="javascript:void(0)" class="btn-link" @click="downloadExcel(exportLink_2)">订单导出</a>
          <a href="javascript:void(0)" class="btn-link" @click="downloadExcel(exportLink_1)">教练学员日入场报表</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import moment from 'moment'
  export default {
    data () {
      return {
        formInline: {
          signupBegin: moment().format('YYYY-MM-DD'),
          signupEnd: moment().format('YYYY-MM-DD')
        }
      }
    },
    computed: {
      signupEnd () {
        if (this.formInline.signupEnd !== '') {
          return moment(this.formInline.signupEnd).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      signupBegin () {
        if (this.formInline.signupBegin !== '') {
          return moment(this.formInline.signupBegin).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      exportLink_1 () {
        return URL.api_name + 'backofficeapi/course/export/coach/class.do?' + 'endTime=' + this.signupEnd +
          '&beginTime=' + this.signupBegin + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId
      },
      exportLink_2 () {
        return URL.api_name + 'backofficeapi/course/export/sales/list.do?' + 'endTime=' + this.signupEnd +
          '&beginTime=' + this.signupBegin + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId
      }
    },
    methods: {
      downloadExcel (url) {
        window.open(url, '_blank')
      }
    }
  }
</script>
<style lang="less" scoped>
  .btn-link{
    display: inline-block;
    height: 36px;
    line-height: 36px;
    text-align: center;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    text-decoration: none;
    background-color: #13CE66;
    color: #fff;
  }
</style>
