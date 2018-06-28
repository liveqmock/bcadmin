<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>单次票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <div class="ticket-type">
        <el-row>
          <el-col>
            <el-button @click="goOnceTicket(1)">新增单次票</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <!--<el-table-column prop="dayType" label="票种类型" width="100">-->
        <!--</el-table-column>-->
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
        <el-table-column label="是否常规票">
          <template scope="scope">
            {{ scope.row.isDefault ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="hours" label="时长">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
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
        axios.get(URL.api_name + 'backofficeapi/ticket/search/once.do', {
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
          path: '/onceTicketDetail/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/onceTicketEdit/' + id
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
