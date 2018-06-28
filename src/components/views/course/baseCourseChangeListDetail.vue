<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>学员课节变更记录</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper" v-if="showTopHeader">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="课程名称：">
          <p v-if="tableData.length > 0">{{ tableData[0].courseName }}</p>
        </el-form-item>
        <el-form-item label="学员姓名：">
          <p v-if="tableData.length > 0">{{ tableData[0].memberName }}</p>
        </el-form-item>
        <el-form-item label="学员手机号：">
          <p v-if="tableData.length > 0">{{ tableData[0].memberMobile }}</p>
        </el-form-item>
        <el-form-item label="销售：">
          <p v-if="tableData.length > 0">{{ tableData[0].salesName }}</p>
        </el-form-item>
        <el-form-item label="顾问：">
          <p v-if="tableData.length > 0">{{ tableData[0].consultantName }}</p>
        </el-form-item>
        <el-form-item label="教练：">
          <p v-if="tableData.length > 0">{{ tableData[0].coachName }}</p>
        </el-form-item>
      </el-form>
    </div>
    <el-row type="flex" justify="space-between" v-if="$route.params.changeReason === '调课'">
      <el-col :span="11">
        <div class="table-data courseData"
             v-loading="loading"
             element-loading-text="拼命加载中">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="courseStarttime" label="调整前上课时间"></el-table-column>
            <el-table-column prop="courseEndtime" label="调整前结束时间"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="table-data courseData"
             v-loading="loading"
             element-loading-text="拼命加载中">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="updateCourseStarttime" label="调整后上课时间"></el-table-column>
            <el-table-column prop="updateCourseEndtime" label="调整后结束时间"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="showTwo">
      <el-col>
        <div class="table-data courseData"
             v-loading="loading"
             element-loading-text="拼命加载中">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="courseStarttime" label="课节开始时间"></el-table-column>
            <el-table-column prop="courseEndtime" label="课节结束时间"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="showThree">
      <el-col>
        <div class="table-data courseData"
             v-loading="loading"
             element-loading-text="拼命加载中">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="orderCode" label="订单编号"></el-table-column>
            <el-table-column label="课程名称/活动名称">
              <template scope="scope">
                {{scope.row.courseName}}
              </template>
            </el-table-column>
            <el-table-column prop="memberName" label="学员姓名"></el-table-column>
            <el-table-column prop="memberMobile" label="学员手机号"></el-table-column>
            <el-table-column prop="salesName" label="销售"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          memberMobile: '',
          memberName: '',
          createTimeBegin: '',
          createTimeEnd: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false
      }
    },
    computed: {
      showTopHeader () {
        let arr = ['调课', '排课', '退本周课', '退课', '还原课节']
        return arr.indexOf(this.$route.params.changeReason) > -1
      },
      showTwo () {
        let arr = ['排课', '退本周课', '退课', '还原课节']
        return arr.indexOf(this.$route.params.changeReason) > -1
      },
      showThree () {
        let arr = ['购课', '退款', '退款驳回', '活动']
        return arr.indexOf(this.$route.params.changeReason) > -1
      },
      createTimeBegin () {
        if (this.formInline.createTimeBegin !== '') {
          return moment(this.formInline.createTimeBegin).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      createTimeEnd () {
        if (this.formInline.createTimeEnd !== '') {
          return moment(this.formInline.createTimeEnd).format('YYYY-MM-DD')
        } else {
          return ''
        }
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.signupEnd)
        this.formInline.signupBegin = val
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.signupBegin = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.signupBegin)
        let date2 = moment(val)
        this.formInline.signupEnd = val
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.signupEnd = ''
        }
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/member/loadcoursenumdetail.do', {
          params: {
            storeId: this.storeId,
            pageSize: this.pageSize,
            pageNum: num,
            memberCourseId: this.$route.params.cid
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
        }, function (error) {
          console.log(error)
          that.loading = false
          that.$message({
            type: 'error',
            message: '查询失败',
            duration: 1000
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
