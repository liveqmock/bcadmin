<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 现场管理</el-breadcrumb-item>
        <el-breadcrumb-item>过闸记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mg-b">
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入票编码" type="text" v-model="formInline.code"></el-input>
        </el-col>
        <el-col :span="4" style="margin-left: 10px;">
          <el-button type="primary" @click="search" :disabled="formInline.code === ''">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="票种类型" prop="instanceType">
        </el-table-column>
        <el-table-column label="过闸人数" prop="passCount">
        </el-table-column>
        <el-table-column label="进出类型" prop="inOrOut">
        </el-table-column>
        <el-table-column label="过闸时间" prop="recordTime" >
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
    data () {
      return {
        formInline: {
          code: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false
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
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/pass/find-by-instance-code.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            code: this.formInline.code,
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
  .btn-link{
    display: inline-block;
    text-align: center;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    text-decoration: none;
    background-color: #13CE66;
    color: #fff;
  }
  .mg-b{
    margin-bottom: 20px;
  }
</style>
