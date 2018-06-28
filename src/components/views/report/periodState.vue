<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
        <el-breadcrumb-item>时间包状态</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="手机号:">
          <el-input type="text" v-model="formInline.mobile" placeholder="请输入会员手机号..."></el-input>
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
        <el-table-column prop="name" label="时段票名称">
        </el-table-column>
        <el-table-column prop="status" label="票实例状态">
        </el-table-column>
        <el-table-column prop="memberMobile" label="会员手机号">
        </el-table-column>
        <el-table-column prop="memberName" label="会员姓名">
        </el-table-column>
        <el-table-column prop="validity" label="有效时长">
        </el-table-column>
        <el-table-column prop="buyTime" label="购买时间" width="120">
        </el-table-column>
        <el-table-column prop="endDate" label="失效日期" width="100">
        </el-table-column>
        <el-table-column prop="firstUseDate" label="首次使用日期">
        </el-table-column>
        <el-table-column prop="leftMinute" label="剩余时长">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button type="primary"
                       size="small"
                       v-show="scope.row.firstUseDate"
                       @click="seeEnterRecord(scope.row.id)">过闸记录</el-button>
          </template>
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
  import moment from 'moment'
  import axios from 'axios'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          mobile: ''
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
        return URL.api_name + 'backofficeapi/report/period_export.do?' + 'endDate=' + this.endDate +
          '&startDate=' + this.startDate + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId +
          '&mobile=' + this.formInline.mobile
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
      seeEnterRecord (id) {
        this.$router.push({
          path: '/periodEnterRecord/' + id
        })
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
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/report/period.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
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
