<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>入库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="入库方式">
          <el-select v-model="formInline.type">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="商品入库" :value="1"></el-option>
            <el-option label="赠品入库" :value="8"></el-option>
            <el-option label="其他入库" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库单号">
          <el-input v-model="formInline.number"></el-input>
        </el-form-item>
        <el-form-item label="经办人">
          <el-input v-model="formInline.person"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="formInline.startTime" type="date" placeholder="开始时间"></el-date-picker>
          至
          <el-date-picker v-model="formInline.endTime" type="date" placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addCoupon">新增入库</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="编号" width="100" prop="id">
        </el-table-column>
        <el-table-column prop="orderNumber" label="入库单号">
          <template scope="scope">
            <span :class="{red: scope.row.closing}">{{scope.row.orderNumber}}</span>
          </template>
        </el-table-column>
         <el-table-column label="入库方式">
           <template scope="scope">
             {{scope.row.type | formatStockType}}
           </template>
        </el-table-column>
        <el-table-column label="仓库" prop="warehouse">
        </el-table-column>
        <el-table-column prop="time" label="入库日期">
        </el-table-column>
        <el-table-column prop="operator" label="经办人">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看明细</el-button>
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
          type: -1,
          person: '',
          number: ''
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
            endTime: this.endTimeA,
            orderNumber: this.formInline.number,
            operator: this.formInline.person
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
  .red{
    color: red;
  }
  .banner-img{
    width: 80px;
    height: 60px;
    vertical-align: bottom;
  }
</style>
