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
                show-summary
                border style="width: 100%">
        <el-table-column label="商品条码" prop="productCode">
        </el-table-column>
        <el-table-column label="商品规格名称" prop="productName">
        </el-table-column>
        <el-table-column label="商品名称" prop="standardName">
        </el-table-column>
        <el-table-column label="商品规格" prop="storeId">
        </el-table-column>
        <el-table-column label="单位" prop="storeId">
        </el-table-column>
        <el-table-column label="进项税率" prop="warehouse">
        </el-table-column>
        <el-table-column label="进货价" prop="startTime">
        </el-table-column>
        <el-table-column label="不含税单价" prop="endTime">
        </el-table-column>
        <el-table-column label="上期结存" prop="taskStatus">
        </el-table-column>
        <el-table-column label="本期入库" prop="note">
        </el-table-column>
        <el-table-column label="本期出库" prop="note">
        </el-table-column>
        <el-table-column label="账面数量" prop="note">
        </el-table-column>
        <el-table-column label="账面金额" prop="note">
        </el-table-column>
        <el-table-column label="不含税总金额" prop="note">
        </el-table-column>
        <el-table-column label="实盘数量" prop="note">
        </el-table-column>
        <el-table-column label="盘盈数量" prop="note">
        </el-table-column>
        <el-table-column label="盘盈金额" prop="note">
        </el-table-column>
        <el-table-column label="盘亏数量" prop="note">
        </el-table-column>
        <el-table-column label="盘亏金额" prop="note">
        </el-table-column>
        <el-table-column label="差异原因" prop="note">
        </el-table-column>
      </el-table>
    </div>
    <el-row style="margin-top: 10px;">
      <el-col style="width: 80px;">备注：</el-col>
      <el-col :span="8">
        <el-input type="textarea" :rows="3"></el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-button style="margin-right: 10px;" type="primary" @click="saveToTarget">完成盘点</el-button>
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
      saveToTarget () {},
      handleSelectionChange (val) {
        this.selectData = val
        console.log(val)
      },
      fetchData () {
        axios.post(URL.api_name + 'merchandiseapi/taskInventory/search.do', {
          taskId: this.$route.query.taskId
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
