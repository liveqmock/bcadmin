<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>券核销</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="券码">
          <el-input v-model="formInline.couponSn" placeholder="券码模糊匹配"></el-input>
        </el-form-item>
        <el-form-item label="核销状态">
          <el-select v-model="formInline.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="未核销" value="1"></el-option>
            <el-option label="已核销" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="couponSn" label="券码">
        </el-table-column>
        <el-table-column prop="couponName" label="卡券名称">
        </el-table-column>
        <el-table-column prop="category" label="卡券类型">
        </el-table-column>
        <el-table-column prop="status" label="卡券状态">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.couponId)">查看</el-button>
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
      this.getCategoryList()
    },
    data () {
      return {
        formInline: {
          couponSn: '',
          status: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        categoryList: []
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      addCoupon () {
        this.$router.push({
          path: '/addCoupon'
        })
      },
      getListData (num) {
        console.log(num)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'memberapi/coupon-user-rel/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            couponSn: this.formInline.couponSn,
            status: this.formInline.status
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
      goDetail (id) {
        this.$router.push({
          path: '/couponDetail/' + id
        })
      },
      deleteTicket (id) {
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
      },
      getCategoryList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'memberLevel'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.categoryList = res.data.data
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
