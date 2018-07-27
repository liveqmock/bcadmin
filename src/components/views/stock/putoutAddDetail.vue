<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>出库</el-breadcrumb-item>
        <el-breadcrumb-item>查看明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="出库单号:">
          <p class="text" v-if="tableData.stockRecord">
            {{ tableData.stockRecord.orderNumber }}
          </p>
        </el-form-item>
        <el-form-item label="出库仓库:">
          <p class="text" v-if="tableData.stockRecord">
            {{ tableData.stockRecord.orderNumber }}
          </p>
        </el-form-item>
        <el-form-item label="出库方式:">
          <p class="text" v-if="tableData.stockRecord">
            {{ tableData.stockRecord.type | formatStockType }}
          </p>
        </el-form-item>
        <el-form-item label="负责人:">
          <p class="text" v-if="tableData.stockRecord">
            {{ tableData.stockRecord.operator }}
          </p>
        </el-form-item>
        <el-form-item label="出库日期:">
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
        <el-table-column prop="id" label="商品编号">
        </el-table-column>
        <el-table-column prop="productCode" label="商品编码">
        </el-table-column>
        <el-table-column prop="standard" label="商品规格名称">
        </el-table-column>
        <el-table-column prop="productName" label="商品名称">
        </el-table-column>
        <el-table-column prop="childName" label="二级类型">
        </el-table-column>
        <el-table-column prop="parentName" label="一级类型">
        </el-table-column>
        <el-table-column prop="unit" label="单位">
        </el-table-column>
        <el-table-column prop="number" label="数量">
        </el-table-column>
        <el-table-column prop="expirationDate" label="过期日期">
        </el-table-column>

        <el-table-column prop="werehouse" label="仓库">
        </el-table-column>
        <el-table-column prop="buyingPrice" label="进货价">
        </el-table-column>
        <el-table-column prop="inputRate" label="进项税率">
        </el-table-column>
        <el-table-column prop="totalBuyingPrice" label="进价小计">
        </el-table-column>
        <el-table-column prop="ratePrice" label="税费单价">
        </el-table-column>
        <el-table-column prop="totalRatePrice" label="税费总价">
        </el-table-column>
        <el-table-column prop="withoutRatePrice" label="不含税单价">
        </el-table-column>
        <el-table-column prop="totalWithoutRatePrice" label="不含税总价">
        </el-table-column>
        <el-table-column prop="supplierId" label="供应商编号">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!--<pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>-->
    <el-row class="putin-footer" v-if="tableData.stockRecord">
      <el-col class="text">
        备注：{{ tableData.stockRecord.remarks }}
      </el-col>
    </el-row>
    <el-row class="putin-footer" v-if="tableData.stockRecord">
      <el-col style="width: 300px; white-space: nowrap; overflow: hidden;text-overflow: ellipsis" class="text">
        附件：{{ tableData.stockRecord.fileName ? tableData.stockRecord.fileName : '无' }}
      </el-col>
      <el-col :span="2" class="label">
        <el-button v-show="tableData.stockRecord.fileName" size="small" type="primary" @click="download(tableData.stockRecord.fileUrl)">下载附件</el-button>
      </el-col>
    </el-row>
    <div class="putin-btns">
      <el-button @click="$router.go('-1')">返 回</el-button>
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
