<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
        <el-breadcrumb-item>其他缴费明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
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
        <el-table-column prop="orderDate" label="订单日期">
        </el-table-column>
        <el-table-column prop="code" label="订单编码">
        </el-table-column>
        <el-table-column prop="quantity" label="数量">
        </el-table-column>
        <el-table-column prop="price" label="应收金额">
        </el-table-column>
        <el-table-column prop="paid" label="实收金额">
        </el-table-column>
        <el-table-column prop="itemDefName" label="缴费类目">
        </el-table-column>
        <el-table-column prop="cashierName" label="收银员">
        </el-table-column>
        <el-table-column prop="effect" label="折扣金额">
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
        </el-table-column>
      </el-table>
    </div>
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
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD')
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false
      }
    },
    computed: {
      exportLink () {
        return URL.api_name + 'backofficeapi/report/payment_details_export.do?' + 'endDate=' + this.endDate +
          '&startDate=' + this.startDate + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
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
        axios.get(URL.api_name + 'backofficeapi/report/payment_details_load.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            endDate: this.endDate,
            startDate: this.startDate,
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
