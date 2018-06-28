<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应商列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="编码">
          <el-input v-model="formInline.supplierCode" placeholder="请输入供应商编码"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formInline.supplierName" placeholder="请输入供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formInline.supplierMobile" placeholder="请输入供应商联系方式"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.supplierStatus">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常供货" value="正常供货"></el-option>
            <el-option label="停供" value="停供"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="search">查询</el-button>
          <el-button type="success" @click="goAdd">新增供应商</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="supplierCode" label="供应商编码" width="100">
        </el-table-column>
        <el-table-column prop="supplierLiaison" label="供应商联系人">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称">
        </el-table-column>
        <el-table-column prop="supplierStatus" label="供应商状态">
        </el-table-column>
        <el-table-column prop="supplierMobile" label="供应商联系方式">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间">
        </el-table-column>
        <el-table-column width="140" label="操作">
          <template scope="scope">
            <el-button size="small" type="primary" @click="goEdit(scope.row.id)">修改</el-button>
            <el-button size="small" type="primary" @click="goDetail(scope.row.id)">查看</el-button>
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
          supplierCode: '',
          supplierName: '',
          supplierStatus: '',
          supplierMobile: ''
        },
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
      addVersion () {
        this.$router.push({
          path: '/versionAdd'
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
          path: '/addCoupon'
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'merchandiseapi/supplier/search.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            pageSize: 15,
            pageNum: num,
            supplierCode: this.formInline.supplierCode,
            supplierName: this.formInline.supplierName,
            supplierStatus: this.formInline.supplierStatus,
            supplierMobile: this.formInline.supplierMobile
          }
        }).then(function (res) {
          that.loading = false
          if (res.data.status === 'success') {
            let data = res.data
            that.tableData = data.data.list
            that.totalCount = data.data.total
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
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
          path: '/supplyDetail/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/supplyEdit/' + id
        })
      },
      goAdd () {
        this.$router.push({
          path: '/supplyAdd/'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .coupon-logo{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    vertical-align: bottom;
  }
</style>
