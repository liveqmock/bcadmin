<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量制卡</el-breadcrumb-item>
        <el-breadcrumb-item>卡明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper block" style="padding-bottom:20px;">
      <a type="info" class="falseBtn el-button el-button--info" @click="checkOut">导出明细</a>
      <el-button type="primary" @click="$router.go('-1')">返回列表</el-button>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="num" label="卡券序号" width="120">
        </el-table-column>
        <el-table-column label="卡券类型">
          <template scope="scope">
            {{ scope.row.category | formatType }}
          </template>
        </el-table-column>
        <el-table-column prop="couponName" label="卡券名称">
        </el-table-column>
        <el-table-column prop="qrInfo" label="二维码值">
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            {{ scope.row.status | formatCoupon }}
          </template>
        </el-table-column>
         <el-table-column label="有效期">
           <template scope="scope">
             {{ scope.row.useBeginTime }}至{{ scope.row.useEndTime }}
           </template>
        </el-table-column>
        <el-table-column prop="createByName" label="制卡人">
        </el-table-column>
        <el-table-column prop="createTime" label="制卡时间">
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
          category: '',
          name: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        urls: '',
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
        this.currentPage = num
        var that = this
        // 读取列表
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/coupon-user-rel/batch-receive/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            markId: this.$route.params.lid,
            batchNumber: this.$route.params.batch
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
        // 生成导出链接
        that.urls = URL.api_name + 'backofficeapi/coupon-user-rel/batch-receive/export.do?markId=' + that.$route.params.lid
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
      checkOut () {
        let that = this
        this.urls = URL.api_name + 'backofficeapi/coupon-user-rel/batch-receive/export.do?markId=' + this.$route.params.lid + '&batchNumber=' + this.$route.params.batch
        window.open(this.urls, '_blank')
        console.log(that.urls)
        // this.$router.push({
        //   path: that.urls
        // })
      },
      getCategoryList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'coupon_category'
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
  .coupon-logo{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    vertical-align: bottom;
  }
  .falseBtn{ text-decoration: none}
</style>
