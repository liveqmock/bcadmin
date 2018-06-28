<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡券列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="卡券类型">
          <el-select v-model="formInline.category" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option :label="o.systemName" :value="o.systemCode" v-for="(o, i) in categoryList" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="formInline.name" placeholder="券名模糊匹配"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addCoupon">+ 添加卡券</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="卡券图标" width="120">
          <template scope="scope">
            <img v-if="scope.row.logo" :src="scope.row.logo" class="coupon-logo">
            <img v-else src="../../../assets/icon_tiyanke@2x.png" class="coupon-logo">
          </template>
        </el-table-column>
        <el-table-column label="卡券类型">
          <template scope="scope">
            {{ scope.row.category | formatType }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="卡券名称">
        </el-table-column>
        <el-table-column prop="usedBeginTime" label="开始时间">
        </el-table-column>
        <el-table-column prop="usedEndTime" label="结束时间">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteTicket(scope.row.id)">删除</el-button>
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
      this.getCategoryList()
    },
    data () {
      return {
        formInline: {
          category: '',
          name: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        categoryList: []
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
          path: '/addCoupon'
        })
      },
      getListData (num) {
        console.log(num)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/coupon/mark/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            name: this.formInline.name,
            category: this.formInline.category,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
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
      goDetail (id) {
        this.$router.push({
          path: '/couponDetail/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/couponEdit/' + id
        })
      },
      deleteTicket (id) {
        var that = this
        that.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/coupon/mark/delete.do', {
            params: {
              id: id
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000
              })
              that.getListData(that.currentPage)
            }
          }).catch(err => {
            that.$message({
              type: 'error',
              message: '删除失败',
              duration: 1000
            })
            console.log(err)
          })
        }).catch(() => {})
      },
      getCategoryList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'coupon_category'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.categoryList = res.data.data
          }
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
