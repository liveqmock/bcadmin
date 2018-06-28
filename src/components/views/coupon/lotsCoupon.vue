<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量制卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="formInline.name" placeholder="券名模糊匹配"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="lotsCouponCreate">批量制卡</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="batchNumber" label="卡券批次">
        </el-table-column>
        <el-table-column prop="couponName" label="卡券名称">
        </el-table-column>
        <el-table-column label="卡券类型">
          <template scope="scope">
            {{ scope.row.category | formatType }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="卡券数量">
        </el-table-column>
        <el-table-column prop="unused" label="未使用">
        </el-table-column>
        <el-table-column prop="used" label="已使用/已核销">
        </el-table-column>
        <el-table-column prop="expired" label="已过期">
        </el-table-column>
        <el-table-column prop="createByName" label="制卡人">
        </el-table-column>
        <el-table-column prop="createTime" label="制卡时间">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.couponId, scope.row.batchNumber)">卡明细</el-button>
            <el-button type="primary" size="small" @click="couponDateSet(scope.row.batchNumber, scope.row.couponName)">卡券有效期设定</el-button>
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
  import axios from 'axios'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          category: '',
          name: ''
        },
        k: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true
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
      getListData (num) {
        console.log(this.k)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/coupon-user-rel/batch-manage/search.do', {
          params: {
            couponName: that.formInline.name,
            pageSize: this.pageSize,
            pageNum: num,
            name: this.formInline.name,
            // category: this.formInline.category,
            storeId: that.k
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
      },
      lotsCouponCreate () {
        this.$router.push({
          path: '/lotsCouponCreate'
        })
      },
      couponDateSet (batch, name) {
        this.$router.push({
          path: '/couponDateSet/' + batch + '/' + name
        })
      },
      goOnceTicket () {
        this.$router.push({
          path: '/onceTicket'
        })
      },
      goDetail (id, batch) {
        this.$router.push({
          path: '/lotsCouponDetail/' + id + '/' + batch
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .ticket-type{
    padding-bottom: 10px;
  }
</style>
