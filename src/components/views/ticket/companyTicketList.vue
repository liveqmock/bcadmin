<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>陪同票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper" v-show="tableData.length <= 0">
      <div class="ticket-type">
        <el-row>
          <el-col>
            <el-button @click="goOnceTicket(3)">新增陪同票</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
        <el-table-column label="是否有免费陪同票">
          <template scope="scope">
            {{ scope.row.isFree ? '是' : '否' }}
          </template>
        </el-table-column>
         <el-table-column prop="description" label="规则">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        pageNum: 0,
        totalCount: 0,
        loading: true
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
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/ticket/search/company.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
//            status: '',
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data
          that.loading = false
          that.totalCount = data.data.totalCount
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
          path: '/companyTicketDetail/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/companyTicketEdit/' + id
        })
      },
      goOnceTicket (type) {
        if (type === 1) {
          this.$router.push({
            path: '/onceTicket'
          })
        } else if (type === 2) {
          this.$router.push({
            path: '/periodTicket'
          })
        } else if (type === 3) {
          this.$router.push({
            path: '/companyTicket'
          })
        } else {
          this.$router.push({
            path: '/exerciseTicket'
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .ticket-type{
    padding-bottom: 10px;
  }
</style>
