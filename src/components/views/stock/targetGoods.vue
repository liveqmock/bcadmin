<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
        <el-breadcrumb-item>目标商品</el-breadcrumb-item>
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
      <el-table :data="selectData"
                border style="width: 100%">
        <el-table-column label="商品条码">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.productCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品规格名称">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.standardName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="本期结存(账面数量)" prop="storeId" >
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.accountsNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="进项税率" prop="warehouse">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.inclusiveTaxRate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="进货价" prop="startTime">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.buyingPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="不含税单价" prop="endTime">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.exclusiveTaxPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="不含税总金额" prop="taskStatus">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.exclusiveTaxSumprice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上期结存" prop="endTime">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.lastBalanceAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="本期入库" prop="inputAmount">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.inputAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="本期出库" prop="outputAmount">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.outputAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="账面金额" prop="note">
          <template scope="scope">
            <span :class="{red: scope.row.lastTarget === 2, blue: scope.row.lastTarget === 1}">{{scope.row.accountPrice}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-button style="margin-right: 10px;" type="primary" :loading="confirmLoading" @click="confirm">
        {{confirmLoading ? '正在提交' : '确认'}}
      </el-button>
      <el-button @click="$router.go('-1')">返回</el-button>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    name: 'CheckAddStock',
    created () {
      this.fetchData()
    },
    data () {
      return {
        data: {},
        loading: true,
        confirmLoading: false,
        selectData: JSON.parse(sessionStorage.getItem('selectData'))
      }
    },
    methods: {
      confirm () {
        this.confirmLoading = true
        axios.post(URL.api_name + 'merchandiseapi/taskInventory/update.do', {
          inventories: this.selectData,
          taskStatus: '已启用'
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
      fetchData () {
        axios.post(URL.api_name + 'merchandiseapi/taskInventory/search.do', {
          isTarget: 1,
          taskId: this.$route.params.taskId
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
