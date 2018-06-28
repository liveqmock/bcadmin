<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>门店管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="roleAdd">添加门店</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="storeName" label="门店名称" width="150px">
        </el-table-column>
        <el-table-column prop="orgName" label="所属机构">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="info" size="small" @click="roleEdit(scope.row.id)">编辑</el-button>
            <el-button type="info" size="small" @click="roleDetial(scope.row.id)">查看</el-button>
            <!-- <el-button type="primary" size="small" @click="perfectInfo(scope.row.id)">完善资料</el-button>
            <el-button type="primary" size="small" @click="perfectInfo1(scope.row.id)">时间定义</el-button>
            <el-button type="primary" size="small" @click="perfectInfo2(scope.row.id)">节假日设定</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
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
    },
    data () {
      return {
        formInline: {
          storeName: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      roleAdd () {
        this.$router.push({
          path: '/storeAdd'
        })
      },
      getListData (num) {
        var that = this
        this.currentPage = num
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/store/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            storeName: this.formInline.storeName
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
      roleEdit (id) {
        this.$router.push({
          path: '/store/edit/' + id
        })
      },
      roleDetial (id) {
        this.$router.push({
          path: '/store/detial/' + id
        })
      },
      perfectInfo (id) {
        this.$router.push({
          path: '/storeMsg/' + id
        })
      },
      perfectInfo1 (id) {
        this.$router.push({
          path: '/storeopentime/' + id
        })
      },
      perfectInfo2 (id) {
        this.$router.push({
          path: '/storeholiday/' + id
        })
      },
      deleteRole (id) {
        var that = this
        that.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/coupon/mark/delete.do', {
            params: {
              id: id
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000
              })
              that.getListData(that.currentPage)
            }
          }).catch(err => {
            that.$message({
              type: 'error',
              message: '删除失败',
              duration: 1000
            })
            console.log(err)
          })
        }).catch(() => {})
      }
    },
    computed: {
      options () {
        return JSON.parse(sessionStorage.getItem('data')).options
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
