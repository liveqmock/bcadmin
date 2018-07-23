<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="类型">
          <el-select v-model="formInline.typeId">
            <el-option v-for="(t, i) in types" :key="i" :label="t.name" :value="t.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="formInline.productCode" type="text" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="formInline.productName" type="text" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品规格名称">
          <el-input v-model="formInline.productStandardsName" type="text" placeholder="请输入商品规格名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <a :href="exportLink" class="btn-link">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="productCode" label="商品条码">
        </el-table-column>
        <el-table-column prop="productStandardsName" label="商品规格名称">
        </el-table-column>
        <el-table-column prop="standard" label="商品编码">
        </el-table-column>
         <el-table-column prop="productName" label="商品名称">
        </el-table-column>
        <el-table-column prop="warehouse" label="仓库"></el-table-column>
        <el-table-column prop="childName" label="二级类型"></el-table-column>
        <el-table-column prop="parentName" label="一级类型"></el-table-column>
        <el-table-column prop="unit" label="单位">
        </el-table-column>
        <el-table-column prop="" label="数量"></el-table-column>
        <el-table-column prop="inputRate" label="进项税率"></el-table-column>
        <el-table-column prop="buyingPrice" label="进货价">
        </el-table-column>
        <el-table-column prop="totalBuyingPrice" label="进货总价"></el-table-column>
        <el-table-column prop="sellingPrice" label="销售价">
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
  export default {
    created () {
      this.getListData(this.currentPage)
      this.getTypes()
    },
    data () {
      return {
        formInline: {
          typeId: '',
          productCode: '',
          productStandardsName: '',
          productName: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        loading: true,
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        types: []
      }
    },
    computed: {
      exportLink () {
        return URL.api_name + 'merchandiseapi/stock/product/stock/export.do?' +
          'productCode=' + this.formInline.productCode + '&typeId=' + this.formInline.typeId +
          '&storeId=' + this.storeId
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      // 获取商品类型
      getTypes () {
        let that = this
        axios.get(URL.api_name + 'merchandiseapi/product/type/search.do', {
          params: {
            pageNum: 1,
            pageSize: 1000,
            storeId: this.storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.types = res.data.data.list
          }
        })
      },
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
        axios.get(URL.api_name + 'merchandiseapi/stock/product/stock/list.do', {
          params: {
            storeId: that.storeId,
            pageSize: 15,
            pageNum: num,
            productCode: this.formInline.productCode,
            typeId: this.formInline.typeId
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
          path: '/banner/' + id
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
  .stock-img{
    display: inline-block;
    margin-right: 10px;
    float: left;
    width: 40px;
    height: 40px;
    vertical-align: bottom;
  }
  .stock-name{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 20px;
  }
  .user-cell{
    padding: 8px 0;
    overflow: hidden;
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
