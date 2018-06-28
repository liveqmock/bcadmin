<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员课程明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input type="text" v-model="formInline.mobile" placeholder="请输入会员手机号..."></el-input>
        </el-form-item>

        <el-form-item>
          <el-date-picker type="date"
                          placeholder="开始日期"
                          @change="getStartDate"
                          :clearable="false"
                          v-model="formInline.startDate">
          </el-date-picker>
          至
          <el-date-picker type="date"
                          placeholder="结束日期"
                          @change="getEndDate"
                          :clearable="false"
                          v-model="formInline.endDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <a href="javascript:void(0)" class="btn-link" @click="downloadExcel">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="memberName" label="姓名">
        </el-table-column>
        <el-table-column prop="memberMobile" label="手机号">
        </el-table-column>
        <el-table-column prop="createTimeBegin" label="时间起">
        </el-table-column>
        <el-table-column prop="createTimeEnd" label="时间止">
        </el-table-column>
        <el-table-column prop="relationCoach" label="教练">
        </el-table-column>
        <el-table-column prop="consultantName" label="顾问">
        </el-table-column>
        <el-table-column prop="salesName" label="销售">
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称">
        </el-table-column>
        <el-table-column prop="startTime" label="上课时间起">
        </el-table-column>
        <el-table-column prop="endTime" label="上课时间止">
        </el-table-column>
        <el-table-column label="入场状态">
          <template scope="scope">
            {{ scope.row.isstart === 0 ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="danger" @click="restore(scope.row)">还原</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
    <!-- 还原 -->
    <restore-course :restoreDialog="showDialog"
                    :value="memberDetailId"
                    @closeDialog="closeDialog"></restore-course>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import moment from 'moment'
  import RestoreCourse from '@/components/views/common/restoreCourse'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          mobile: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false,
        showDialog: false,
        memberDetailId: ''
      }
    },
    computed: {
      exportLink () {
        return URL.api_name + 'backofficeapi/course/export/member/course/detail.do?' + 'endTime=' + this.endDate +
          '&beginTime=' + this.startDate + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId +
          '&mobile=' + this.formInline.mobile
      },
      startDate () {
        if (this.formInline.startDate !== '') {
          return this.formInline.startDate
        } else {
          return ''
        }
      },
      endDate () {
        if (this.formInline.endDate !== '') {
          return this.formInline.endDate
        } else {
          return ''
        }
      }
    },
    components: {
      Pager,
      RestoreCourse
    },
    methods: {
      closeDialog (payload) {
        this.showDialog = false
        if (payload && payload.refresh) {
          this.getListData(this.currentPage)
        }
      },
      restore (item) {
        this.showDialog = true
        this.memberDetailId = item.courseMemberDetailId
      },
      downloadExcel () {
        // location.href = this.exportLink
        window.open(this.exportLink, '_blank')
      },
      getStartDate (val) {
        this.formInline.startDate = val
      },
      getEndDate (val) {
        this.formInline.endDate = val
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      getListData (num) {
        console.log(num)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/export/query/member/course/detail.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            endTime: this.endDate,
            beginTime: this.startDate,
            mobile: this.formInline.mobile,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.totalCount = data.data.total
          that.loading = false
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
