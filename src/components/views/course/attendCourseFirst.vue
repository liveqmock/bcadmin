<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>排课订单</el-breadcrumb-item>
        <el-breadcrumb-item>首次上课学员</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--<div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="success" @click="addCoupon">新增banner</el-button>
        </el-form-item>
      </el-form>
    </div>-->
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="memberName" label="学员姓名">
        </el-table-column>
        <el-table-column prop="memberMobile" label="学员手机号">
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称">
        </el-table-column>
        <el-table-column prop="coachName" label="教练名称">
        </el-table-column>
        <el-table-column prop="salesName" label="销售名称">
        </el-table-column>
        <el-table-column prop="consultantName" label="顾问名称">
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
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        loading: true,
        currentPage: 1,
        totalCount: 0
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
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/member/loadfirstcourse.do', {
          params: {
            storeId: that.storeId,
            pageSize: 15,
            pageNum: num
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
<style lang="less">
</style>
