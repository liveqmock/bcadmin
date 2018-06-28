<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
        <el-breadcrumb-item>销量导出</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="统计单位：">
          <el-select v-model="formInline.dateMasion">
            <el-option label="年" value="年"></el-option>
            <el-option label="月" value="月"></el-option>
            <el-option label="日" value="日"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="formInline.type">
            <el-option label="大类" value="大类"></el-option>
            <el-option label="小类" value="小类"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker type="datetime" v-model="formInline.startDate" @change="getStartDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker type="datetime" v-model="formInline.endDate" @change="getEndDate"></el-date-picker>
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
        <el-table-column prop="date" label="时间">
        </el-table-column>
        <el-table-column prop="quantity" label="数量">
        </el-table-column>
        <el-table-column prop="type" label="类型">
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
  // import moment from 'moment'
  export default {
    created () {
      this.getDuty()
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          startDate: '',
          endDate: '',
          type: '大类',
          dateMasion: '年'
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false,
        employDuty: []
      }
    },
    computed: {
      exportLink () {
        return URL.api_name + 'backofficeapi/report/sale-quantity-stat-export.do?' + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId +
          '&dateMasion=' + this.formInline.dateMasion +
          '&endDate=' + this.formInline.endDate +
          '&startDate=' + this.formInline.startDate +
          '&type=' + this.formInline.type
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      getDuty () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'employee_position'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.employDuty = res.data.data
          }
        })
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
        axios.get(URL.api_name + 'backofficeapi/report/sale-quantity-stat.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            dateMasion: this.formInline.dateMasion,
            startDate: this.formInline.startDate,
            endDate: this.formInline.endDate,
            type: this.formInline.type,
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
