<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课类类型</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="success" @click="addType">添加课类</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="课程名称">
        </el-table-column>
        <el-table-column prop="minnum" label="下限人数" width="160">
        </el-table-column>
        <el-table-column prop="maxnum" label="上限人数" width="160">
        </el-table-column>
        <!-- <el-table-column prop="newsDetail" label="操作人">
        </el-table-column> -->
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button type="info" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!-- <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager> -->
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    created () {
      this.getListData()
    },
    data () {
      return {
        formInline: {
          status: '',
          usice: '',
          signupBegin: '',
          signupEnd: '',
          title: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        loading: false
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.signupEnd)
        this.formInline.signupBegin = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.signupBegin = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.signupBegin)
        let date2 = moment(val)
        this.formInline.signupEnd = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.signupEnd = ''
        }
      },
      getListData (num) {
        // this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/type/list.do', {
          params: {
            storeId: that.storeId
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data
          that.loading = false
          // that.totalCount = data.data.total
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
      del (id) {
        let that = this
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/course/type/delete.do', {
            params: {
              id: id
            }
          }).then(function (response) {
            that.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000
            })
            that.getListData()
          }, function (error) {
            that.$message({
              type: 'error',
              message: '删除失败',
              duration: 1000
            })
            console.log(error)
          })
        }).catch(() => {})
      },
      addType () {
        this.$router.push({
          path: '/courseTypeAdd'
        })
      }
    }
  }
</script>
<style lang="less">
</style>
