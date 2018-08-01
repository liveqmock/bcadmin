<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>出库</el-breadcrumb-item>
        <el-breadcrumb-item>出库明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="formData">
      <el-form label-width="150px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="出库单号：">{{data.id}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="进项税率：">{{data.inputRate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="出库日期：">{{data.time}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="进货价：">{{data.buyingPrice}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="出库类型：">{{data.typeName}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="进货不含税单价：">{{data.taxRatePrice}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="仓库名称：">{{data.werehouse}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="进项税费单价：">{{data.inputRatePrice}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="经办人：">{{data.operator}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="出售单价：">{{data.price}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品条码：">{{data.productCode}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="实付单价：">{{data.paid}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品规格名称：">{{data.standard}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="出库数量：">{{data.number}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品编码：">{{data.productId}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="进项税费合计：">{{data.totalInputRatePrice}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：">{{data.productName}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单金额：">{{data.totalPrice}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="供应商编号：">{{data.supplierId}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="实付金额：">{{data.totalPaid}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="供应商名称：">{{data.supplierName}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="不含税收入：">{{data.withoutRateProfit}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="二级类型：">{{data.childName}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="销项税率：">{{data.taxRate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="一级类型：">{{data.parentName}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="销项税费合计：">{{data.totalTaxRatePrice}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="单位：">{{data.unit}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="兑换积分：">{{data.userScore}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="备注：">{{data.remark}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    name: 'GoodsDetailStock',
    created () {
      this.fetchData()
    },
    data () {
      return {
        data: {}
      }
    },
    methods: {
      fetchData () {
        axios.get(URL.api_name + 'merchandiseapi/stock/see/stockProduct/detail.do', {
          params: {
            stockDetailId: this.$route.params.gid
          }
        }).then(res => {
          if (res.data.status === 'success') {} else {
            this.$errMsg(res.data.message)
          }
        })
      }
    }
  }
</script>
