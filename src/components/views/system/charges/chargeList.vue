<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>佣金管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="success" @click="addCharge">+ 添加公式</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <!-- <el-table-column prop="ID" label="排序" width="180">
        </el-table-column> -->
        <el-table-column prop="formularname" label="公式名称">
        </el-table-column>
        <el-table-column prop="relationNum" label="关联人数" width="180">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="primary" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        option: ''
      }
    },
    methods: {
      search () {
        console.log('submit')
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getListData(this.currentPage)
      },
      addCharge () {
        this.$router.push({
          path: '/ChargeAdd'
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/employee/formular/search.do', {
          params: {
            storeId: that.storeId,
            pageSize: this.pageSize,
            pageNum: this.currentPage
          }
        }).then(res => {
          let data = res.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/chargeUpdate/' + id
        })
      },
      del (id) {
        let that = this
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/employee/formular/delete.do', {
            params: {
              id: id,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000
              })
              that.getListData(that.currentPage)
            } else {
              that.$message({
                type: 'error',
                message: res.data.message,
                duration: 2000
              })
            }
          }).catch(err => {
            that.$message({
              type: 'error',
              message: '删除失败：' + err.data.message,
              duration: 1000
            })
            console.log(err)
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="less">
</style>
