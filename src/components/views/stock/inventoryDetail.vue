<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
        <el-breadcrumb-item>明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <a :href="exportLink" class="btn-link">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="编号" width="100">
          <template scope="scope">
            {{ (scope.$index + 1) + (currentPage - 1) * 15 }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="单号">
        </el-table-column>
         <el-table-column label="类型">
           <template scope="scope">
             {{ scope.row.type | formatStockType }}
           </template>
        </el-table-column>
        <el-table-column prop="" label="仓库">
          <template scope="scope">
            默认仓库
          </template>
        </el-table-column>
        <el-table-column prop="time" label="入库日期">
        </el-table-column>
        <el-table-column prop="operator" label="经办人">
        </el-table-column>
      </el-table>
    </div>
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
          startTime: '',
          endTime: '',
          type: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        loading: true,
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0
      }
    },
    computed: {
      exportLink () {
        return URL.api_name + 'merchandiseapi/stock/stock/export.do?stockRecordId=' +
          this.$route.params.pid
      },
      startTimeA () {
        if (this.formInline.startTime === '') {
          return ''
        } else {
          return moment(this.formInline.startTime).format('YYYY-MM-DD')
        }
      },
      endTimeA () {
        if (this.formInline.endTime === '') {
          return ''
        } else {
          return moment(this.formInline.endTime).format('YYYY-MM-DD')
        }
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      addCoupon () {
        this.$router.push({
          path: '/putinAdd'
        })
      },
      getListData (num) {
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'merchandiseapi/stock/search.do', {
          params: {
            storeId: that.storeId,
            type: this.formInline.type,
            pageSize: 15,
            pageNum: num,
            startTime: this.startTimeA,
            endTime: this.endTimeA
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
      },
      goDetail (id) {
        this.$router.push({
          path: '/putinAdd/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/bannerEdit/' + id
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
