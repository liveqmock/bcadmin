<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡券列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="卡券类型">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="现金券" value="shanghai"></el-option>
            <el-option label="礼券(单次票)" value="beijing"></el-option>
            <el-option label="课程票" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="formInline.user" placeholder="券名模糊匹配"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addCoupon">+ 添加卡券</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button type="text" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
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
    <div class="footer-bar">
      <el-button type="info" size="small">导出EXCEL</el-button>
    </div>
  </div>
</template>
<script>
    import axios from 'axios'
    export default {
      created () {
        this.getListData()
      },
      data () {
        return {
          formInline: {
            user: '',
            region: ''
          },
          tableData: [],
          currentPage: 1,
          pageSize: 10,
          pageNum: 0,
          totalCount: 0,
          loading: true
        }
      },
      methods: {
        search () {
          console.log('submit')
        },
        handleCurrentChange (val) {
          this.currentPage = val
          this.getListData()
        },
        addCoupon () {
          this.$router.push({
            path: '/addCoupon'
          })
        },
        getListData (searchParams) {
          var that = this
          that.loading = true
          axios.get('static/table.json', {
            params: {
              pageSize: this.pageSize,
              pageNum: this.currentPage
            }
          }).then(function (respose) {
            let data = respose.data
            setTimeout(function () {
              that.tableData = data.data
              that.loading = false
              that.totalCount = data.totalCount
            }, 1000)
          }, function (error) {
            console.log(error)
          })
        },
        goDetail (id) {
          this.$router.push({
            path: '/couponDetail/' + id
          })
        },
        goEdit (id) {
          this.$router.push({
            path: '/couponEdit/' + id
          })
        }
      }
    }
</script>
<style lang="less" scoped>
</style>
