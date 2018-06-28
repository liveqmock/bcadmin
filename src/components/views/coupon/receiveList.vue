<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>发放卡券</el-breadcrumb-item>
        <el-breadcrumb-item>领取明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <a href="javascript:void(0)" @click="downloadExcel" class="btn-link">导出到EXCEL</a>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="qrInfo" label="二维码值" width="300">
        </el-table-column>
        <el-table-column prop="category" label="卡券类型">
          <template scope="scope">
            {{ scope.row.category === 'coupon_cash' ? '现金券' : scope.row.category === 'coupon_gift' ? '礼券(单次票)' : '课程票' }}
          </template>
        </el-table-column>
        <el-table-column prop="couponName" label="卡券名称">
        </el-table-column>
        <el-table-column prop="status" label="使用状态">
          <template scope="scope">
            {{ scope.row.status | formatCoupon }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="领取时间" width="200">
        </el-table-column>
        <el-table-column prop="mobile" label="领取人">
        </el-table-column>
      </el-table>
    </div>
    <pager :current-page="currentPage"
           :total-count="totalCount"
           v-on:handleCurrentChange="getListData"></pager>
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
          category: '',
          name: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        showDialog: true
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      downloadExcel () {
        // location.href = this.exportLink
        window.open(this.exportLink, '_blank')
      },
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
        axios.get(URL.api_name + 'backofficeapi/coupon-user-rel/receive/search.do', {
          params: {
            grantId: that.$route.params.rid,
            storeId: that.storeId,
            pageSize: this.pageSize,
            pageNum: num
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
      closeDialog () {
        this.$router.go('-1')
      },
      deleteTicket (id) {
        console.log('delete')
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
      },
      exportLink () {
        return URL.api_name + 'backofficeapi/coupon-user-rel/receive/export.do?' +
          'authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId +
          '&grantId=' + this.$route.params.rid
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
