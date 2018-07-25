<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
        <el-breadcrumb-item>查看总库存</el-breadcrumb-item>
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
        </el-form-item>
        <el-form-item label="盘点仓库："></el-form-item>
        <el-form-item label="经办人：">
          {{data.personLiable}}
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="data.inventories"
                ref="checkAddStockTable"
                @selection-change="handleSelectionChange"
                border style="width: 100%">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column label="商品条码">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品规格名称">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="standardName">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="storeId">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="本期结存(账面数量)" prop="storeId" >
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="进项税率" prop="warehouse">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="进货价" prop="startTime">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="不含税单价" prop="endTime">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="不含税总价" prop="taskStatus">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="账面金额" prop="note">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note">
          <template scope="scope">
            <span :class="{red: scope.row.beforeTarget === 2, blue: scope.row.beforeTarget === 1}">{{scope.row.productName}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-button style="margin-right: 10px;" type="primary" @click="saveToTarget">保存到目标商品</el-button>
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
        selectData: []
      }
    },
    methods: {
      saveToTarget () {
        sessionStorage.setItem('selectData', JSON.stringify(this.selectData))
        this.$router.push({
          path: '/targetGoods/' + this.$route.params.taskId
        })
      },
      handleSelectionChange (val) {
        this.selectData = val
      },
      fetchData () {
        axios.post(URL.api_name + 'merchandiseapi/taskInventory/search.do', {
          taskId: this.$route.params.taskId
        }).then(res => {
          this.loading = false
          if (res.data.status === 'success') {
            this.data = res.data.data
            // 如果isTarget字段为1，则选中
            for (let obj of res.data.data.inventories) {
              if (obj.isTarget === 1) {
                this.selectData.push(obj)
              }
            }
          } else {
            this.$errMsg(res.data.message)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .red{
    color: red;
  }
  .blue{
    color: blue;
  }
</style>
