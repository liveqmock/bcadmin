<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
        <el-breadcrumb-item>退款记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-radio-group v-model="searchType">
            <el-radio-button label="date">日期</el-radio-button>
            <el-radio-button label="month">月份</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="searchType === 'date'">
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
        <el-form-item v-show="searchType === 'month'">
          <el-date-picker
            v-model="formInline.month"
            type="month"
            @change="getMonth"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <a href="javascript:void(0)" @click="downloadExcel" class="btn-link">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="orderCode" label="订单号" width="100">
        </el-table-column>
        <el-table-column prop="paid" label="实付金额" width="100">
        </el-table-column>
        <el-table-column prop="refund" label="退款金额">
        </el-table-column>
        <el-table-column prop="status" label="退款状态">
        </el-table-column>
        <el-table-column prop="reason" label="退款原因">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="updateTime" label="同意时间">
        </el-table-column>
        <el-table-column prop="endorser" label="审批人">
        </el-table-column>
      </el-table>
    </div>
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import moment from 'moment'
  import axios from 'axios'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        month_1: '',
        month_2: '',
        searchType: 'date',
        formInline: {
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          month: ''
        },
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false,
        res: {},
        tableData: []
      }
    },
    computed: {
      exportLink () {
        // 判断查询条件
        let tStart = ''
        let tEnd = ''
        if (this.searchType === 'date') {
          // 按日期查询
          tStart = this.startDate
          tEnd = this.endDate
        } else if (this.searchType === 'month') {
          // 按月份查询
          tStart = this.month_1
          tEnd = this.month_2
        }
        return URL.api_name + 'backofficeapi/report/find-refund-export.do?' + 'endDate=' + tEnd +
          '&startDate=' + tStart + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId
      },
      startDate () {
        if (this.formInline.startDate !== '') {
          return moment(this.formInline.startDate + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      endDate () {
        if (this.formInline.endDate !== '') {
          return moment(this.formInline.endDate + ' 23:59:59').format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      downloadExcel () {
        // location.href = this.exportLink
        window.open(this.exportLink, '_blank')
      },
      getMonth (val) {
        var year = ''
        var month = ''
        var day = ''
        this.formInline.month = val
        if (this.formInline.month !== '') {
          this.month_1 = this.formInline.month + '-01 00:00:00'
          year = this.formInline.month.split('-')[0]
          month = this.formInline.month.split('-')[1]
          day = new Date(year, month, 0).getDate()
          this.month_2 = this.formInline.month + '-' + (day > 10 ? day : 0 + '' + day) + ' 23:59:59'
        }
      },
      getStartDate (val) {
        this.formInline.startDate = val
      },
      getEndDate (val) {
        this.formInline.endDate = val
      },
      search () {
        this.tableData = []
        this.getListData(this.currentPage)
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        var tStart = ''
        var tEnd = ''
        // 判断查询条件
        if (this.searchType === 'date') {
          // 按日期查询
          tStart = this.startDate
          tEnd = this.endDate
        } else if (this.searchType === 'month') {
          tStart = this.month_1
          tEnd = this.month_2
        }
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/report/find-refund.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            endDate: tEnd,
            startDate: tStart,
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
