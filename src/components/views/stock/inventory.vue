<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="盘点任务编码">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="盘点任务名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="formInline.startTime" type="date" placeholder="请输入盘点开始日期"></el-date-picker>
          至
          <el-date-picker v-model="formInline.endTime" type="date" placeholder="请输入盘点结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="经办人">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="仓库">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="createTask">新建盘点任务</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="任务创建日期" prop="productDetailId">
        </el-table-column>
        <el-table-column label="盘点任务编码" prop="productName">
        </el-table-column>
        <el-table-column label="盘点任务名称" prop="standard">
        </el-table-column>
        <el-table-column label="盘点分店" prop="storage">
        </el-table-column>
        <el-table-column label="仓库" prop="storagePrice" >
        </el-table-column>
        <el-table-column label="经办人" prop="library">
        </el-table-column>
        <el-table-column label="盘点开始时间" prop="libraryPrice">
        </el-table-column>
        <el-table-column label="盘点结束时间" prop="stock">
        </el-table-column>
        <el-table-column label="状态" prop="sale">
        </el-table-column>
        <el-table-column label="完成日期" prop="note">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <div class="s-line">
              <el-button type="info" size="small" @click="goDetail(scope.row.id)">修改</el-button>
              <el-button type="info" size="small" @click="goDetail(scope.row.id)">删除</el-button>
            </div>
            <div class="s-line">
              <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看总库存</el-button>
              <el-button type="info" size="small" @click="goDetail(scope.row.id)">目标商品</el-button>
            </div>
            <div class="s-line">
              <el-button type="info" size="small" @click="goDetail(scope.row.id)">盘点</el-button>
              <el-button type="info" size="small" @click="goDetail(scope.row.id)">盘点报告</el-button>
            </div>
          </template>
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
      createTask () {
        this.$router.push({
          path: '/taskAdd'
        })
      },
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
        axios.get(URL.api_name + 'merchandiseapi/stock/product/stock/inventory.do', {
          params: {
            storeId: that.storeId,
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
          path: '/inventory/' + id
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
  .s-line{
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
  }
</style>
