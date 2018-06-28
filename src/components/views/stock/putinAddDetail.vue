<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>入库</el-breadcrumb-item>
        <el-breadcrumb-item>查看明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="单号:">
          <p class="text" v-if="tableData.stockRecord">
            {{ tableData.stockRecord.orderNumber }}
          </p>
        </el-form-item>
        <el-form-item label="入库日期:">
          <p class="text" v-if="tableData.stockRecord">
            {{ tableData.stockRecord.time }}
          </p>
        </el-form-item>
        <el-form-item>
          <a :href="exportLink" class="btn-link">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData.stockDetailDtoList" border style="width: 100%">
        <el-table-column prop="productCode" label="商品编码">
        </el-table-column>
        <el-table-column prop="productName" label="商品名称">
        </el-table-column>
        <el-table-column prop="standard" label="商品规格">
        </el-table-column>
        <el-table-column prop="typeName" label="类型">
        </el-table-column>
        <el-table-column prop="number" label="数量">
        </el-table-column>
        <el-table-column prop="unit" label="单位">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!--<pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>-->
    <el-row class="putin-footer" v-if="tableData.stockRecord">
      <el-col :span="2" class="label">填写备注:</el-col>
      <el-col :span="10" class="text">
        {{ tableData.stockRecord.remarks }}
      </el-col>
    </el-row>
    <el-row class="putin-footer" v-if="tableData.stockRecord">
      <el-col :span="2" class="label">经办人:</el-col>
      <el-col :span="10" class="text">
        {{ tableData.stockRecord.operator }}
      </el-col>
    </el-row>
    <div class="putin-btns">
      <el-button @click="$router.go('-1')">确 定</el-button>
    </div>
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
        tableData: {},
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true
      }
    },
    computed: {
      storeId () {
        return JSON.parse(sessionStorage.getItem('store')).k
      },
      exportLink () {
        return URL.api_name + 'merchandiseapi/stock/stock/export.do?stockRecordId=' +
          this.$route.params.pid
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
        axios.get(URL.api_name + 'merchandiseapi/stock/see/stock/detail.do', {
          params: {
            stockRecordId: this.$route.params.pid
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data
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
  .text{
    line-height: 36px;
    color: #666;
  }
  .btn-link{
    display: inline-block;
    height: 36px;
    line-height: 36px;
    background-color: #13CE66;
    text-decoration: none;
    border-radius: 5px;
    padding: 0 8px;
    color: #fff;
  }
</style>
