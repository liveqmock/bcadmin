<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 收银管理</el-breadcrumb-item>
        <el-breadcrumb-item>交接单记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="上班人:">
          <el-input v-model="formInline.name" placeholder="请输入员工姓名..."></el-input>
        </el-form-item>
        <el-form-item label="打印时间:">
          <el-date-picker
            type="datetime"
            v-model="formInline.t1"
            placeholder="开始时间...">
          </el-date-picker>
          <el-date-picker
            type="datetime"
            v-model="formInline.t2"
            placeholder="结束时间...">
          </el-date-picker>
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
        <el-table-column prop="cashierName" label="上班人">
        </el-table-column>
        <el-table-column prop="payAmount" label="支付宝总金额">
        </el-table-column>
        <el-table-column prop="wxAmount" label="微信总金额">
        </el-table-column>
        <el-table-column prop="shopAmount" label="购物卡总金额">
        </el-table-column>
        <el-table-column prop="moneyAmount" label="现金总金额">
        </el-table-column>
        <el-table-column prop="cardAmount" label="刷卡总金额">
        </el-table-column>
        <el-table-column prop="paid" label="实付金额">
        </el-table-column>
        <el-table-column prop="createTime" label="打印时间">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
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
          name: '',
          t1: '',
          t2: ''
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
    computed: {
      startTime () {
        if (this.formInline.t1 === '') {
          return ''
        } else {
          return moment(this.formInline.t1).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      endTime () {
        if (this.formInline.t2 === '') {
          return ''
        } else {
          return moment(this.formInline.t2).format('YYYY-MM-DD HH:mm:ss')
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
        console.log(num)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/print/transfer/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            cashierName: this.formInline.name,
            startTime: this.startTime,
            endTime: this.endTime,
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
          path: '/delivery/' + id
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
