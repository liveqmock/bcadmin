<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
        <el-breadcrumb-item>盘点</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="盘点任务编码：">
          {{data.taskCode}}
        </el-form-item>
        <el-form-item label="盘点任务名称：">
          {{data.taskName}}
        </el-form-item>
        <el-form-item label="盘点任务区间：">
          {{data.startTime}} 至 {{data.endTime}}
        </el-form-item>
        <el-form-item label="盘点分店：">
          {{data.storeName}}
        </el-form-item>
        <el-form-item label="盘点仓库：">
          {{data.warehouse}}
        </el-form-item>
        <el-form-item label="经办人：">
          {{data.personLiable}}
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="data.inventories"
                show-summary
                border style="width: 100%">
        <el-table-column label="商品条码" prop="productCode">
        </el-table-column>
        <el-table-column label="商品规格名称" prop="standard">
        </el-table-column>
        <el-table-column label="商品名称" prop="productName">
        </el-table-column>
        <!--<el-table-column label="商品规格" prop="standard">-->
        <!--</el-table-column>-->
        <el-table-column label="单位" prop="unit">
        </el-table-column>
        <el-table-column label="进项税率" prop="inclusiveTaxRate">
        </el-table-column>
        <el-table-column label="进货价" prop="buyingPrice">
        </el-table-column>
        <el-table-column label="不含税单价" prop="exclusiveTaxPrice">
        </el-table-column>
        <el-table-column label="上期结存" prop="lastBalanceAmount">
        </el-table-column>
        <el-table-column label="本期入库" prop="inputAmount">
        </el-table-column>
        <el-table-column label="本期出库" prop="outputAmount">
        </el-table-column>
        <el-table-column label="账面数量" prop="accountsNumber">
        </el-table-column>
        <el-table-column label="账面金额" prop="accountPrice">
        </el-table-column>
        <el-table-column label="不含税总金额" prop="exclusiveTaxSumprice">
        </el-table-column>
        <el-table-column label="实盘数量" prop="realNumber">
          <template scope="scope">
            <el-input :min="0" v-model.number="scope.row.realNumber" @change="textChange"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="实盘金额" prop="realPrice">
        </el-table-column>
        <el-table-column label="盘盈数量" prop="amountProfit">
        </el-table-column>
        <el-table-column label="盘盈金额" prop="amountPrice">
        </el-table-column>
        <el-table-column label="盘亏数量" prop="deficitNumber">
        </el-table-column>
        <el-table-column label="盘亏金额" prop="deficitPrice">
        </el-table-column>
        <el-table-column label="差异原因">
          <template scope="scope">
            <el-input type="text" v-model="scope.row.reason"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row style="margin-top: 10px;">
      <el-col style="width: 80px;">备注：</el-col>
      <el-col :span="8">
        <el-input type="textarea" :rows="3" v-model="remark"></el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-button style="margin-right: 10px;" type="primary" :loading="confirmLoading" @click="saveToTarget">
        {{confirmLoading ? '正在提交' : '完成盘点'}}
      </el-button>
      <el-button @click="$router.go('-1')">返回</el-button>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  const _ = require('lodash')
  export default {
    name: 'CheckAddStock',
    created () {
      this.fetchData()
      this.deBounceCal = _.debounce(this.calNumber, 500)
    },
    data () {
      return {
        data: {},
        loading: true,
        confirmLoading: false,
        selectData: [],
        remark: ''
      }
    },
    methods: {
      textChange () {
        this.deBounceCal()
      },
      calNumber () {
        // var sum = 0
        // var a = document.querySelectorAll('.el-table__footer-wrapper .is-leaf')[14]
        // var c = a.getElementsByTagName('div')

        for (let obj of this.data.inventories) {
          // if (obj.realNumber && typeof obj.realNumber === 'number') {
          //   sum += obj.realNumber
          // }
          // 计算盘盈盘亏金额与数量
          obj.realPrice = obj.realNumber * obj.buyingPrice
          if (obj.realNumber > obj.accountsNumber) {
            // 盘盈
            obj.amountProfit = obj.realNumber - obj.accountsNumber
            obj.deficitNumber = 0
            obj.deficitPrice = 0
            obj.amountPrice = obj.buyingPrice * obj.amountProfit
          } else {
            // 盘亏
            obj.deficitNumber = obj.accountsNumber - obj.realNumber
            obj.amountProfit = 0
            obj.amountPrice = 0
            obj.deficitPrice = obj.buyingPrice * obj.deficitNumber
          }
        }
        // 实盘数量合计
        // c[0].innerText = sum
      },
      saveToTarget () {
        this.confirmLoading = true
        axios.post(URL.api_name + 'merchandiseapi/taskInventory/update.do', {
          inventories: this.data.inventories,
          taskStatus: '已完成',
          inventoryRemarks: this.remark
        }).then(res => {
          if (res.data.status === 'success') {
            this.$succssMsg(res.data.message)
            this.$router.push({
              path: '/inventory'
            })
          } else {
            this.confirmLoading = false
            this.$errMsg(res.data.message)
          }
        }).catch(err => {
          console.log(err)
          this.confirmLoading = false
        })
      },
      handleSelectionChange (val) {
        this.selectData = val
        console.log(val)
      },
      fetchData () {
        axios.post(URL.api_name + 'merchandiseapi/taskInventory/search.do', {
          taskId: this.$route.query.taskId,
          isTarget: 1
        }).then(res => {
          this.loading = false
          if (res.data.status === 'success') {
            this.data = res.data.data
          } else {
            this.$errMsg(res.data.message)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
