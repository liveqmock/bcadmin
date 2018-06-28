<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 现场管理</el-breadcrumb-item>
        <el-breadcrumb-item>借还管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="条件查询">
          <el-select v-model="formInline.status">
            <el-option value="" label="请选择"></el-option>
            <el-option value="借出" label="借出"></el-option>
            <el-option value="已还" label="已还"></el-option>
            <el-option value="异常" label="异常(当天没有归还)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="formInline.starttime" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="单号">
          <el-input type="text" v-model="formInline.userName" placeholder="请输入票据编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="passId" label="票据编码">
        </el-table-column>
        <el-table-column prop="shoeSize" label="鞋码">
        </el-table-column>
        <el-table-column prop="createTime" label="借取时间">
        </el-table-column>
        <el-table-column prop="updateTime" label="归还时间">
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            {{ scope.row.status | formatBS }}
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
  import moment from 'moment'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          starttime: '',
          status: '',
          userName: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        provinces: [],
        citys: []
      }
    },
    computed: {
      chooseDate () {
        if (this.formInline.starttime === '') {
          return ''
        } else {
          return moment(this.formInline.starttime).format('YYYY-MM-DD')
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
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/takeshoe/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            starttime: this.chooseDate,
            status: this.formInline.status,
            passId: this.formInline.userName,
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
    },
    filters: {
      formatBS (val) {
        if (val === '0') {
          return '已还鞋'
        } else if (val === '1') {
          return '已借鞋'
        } else {
          return '异常'
        }
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
</style>
