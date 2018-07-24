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
        <el-form-item label="盘点任务编码"></el-form-item>
        <el-form-item label="盘点任务名称"></el-form-item>
        <el-form-item label="盘点任务区间"></el-form-item>
        <el-form-item label="盘点分店"></el-form-item>
        <el-form-item label="盘点仓库"></el-form-item>
        <el-form-item label="经办人"></el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="任务创建日期" prop="createTime">
        </el-table-column>
        <el-table-column label="盘点任务编码" prop="taskCode">
        </el-table-column>
        <el-table-column label="盘点任务名称" prop="taskName">
        </el-table-column>
        <el-table-column label="盘点分店" prop="storeId">
        </el-table-column>
        <el-table-column label="仓库" prop="storeId" >
        </el-table-column>
        <el-table-column label="经办人" prop="warehouse">
        </el-table-column>
        <el-table-column label="盘点开始时间" prop="startTime">
        </el-table-column>
        <el-table-column label="盘点结束时间" prop="endTime">
        </el-table-column>
        <el-table-column label="状态" prop="taskStatus">
        </el-table-column>
        <el-table-column label="完成日期" prop="note">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    name: 'CheckAddStock',
    data () {
      return {}
    },
    methods: {
      fetchData () {
        axios.post(URL.api_name + 'merchandiseapi/taskInventory/search.do', {
          taskId: this.$route.params.taskId
        }).then(res => {
          if (res.data.status === 'success') {}
        })
      }
    }
  }
</script>
