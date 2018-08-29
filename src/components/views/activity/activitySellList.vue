<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>售卖情况</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="品类名称">
          <el-input v-model="formInline.eventName" placeholder="输入品类名称"></el-input>
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
        <el-table-column prop="categoryName" label="品类名称"></el-table-column>
        <el-table-column prop="categoryNumber" label="品类总量">
        </el-table-column>
        <el-table-column prop="soldNumber" label="售出数量">
        </el-table-column>
        <el-table-column prop="offsetAmount" label="已核销">
        </el-table-column>
        <el-table-column prop="notOffsetAmount" label="未核销">
        </el-table-column>
        <el-table-column label="剩余数量">
          <template scope="scope">
            {{scope.row.categoryNumber - scope.row.soldNumber}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!--<pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>-->
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  export default {
    created () {
      this.getListData()
    },
    data () {
      return {
        formInline: {
          eventName: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        searchTypes: [{
          value: '1',
          label: '未上架'
        }, {
          value: '2',
          label: '已上架'
        }, {
          value: '3',
          label: '已下架'
        }],
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
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      getListData () {
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/information/event/category/loadAll.do', {
          params: {
            eventId: that.$route.params.aid,
            eventName: this.formInline.eventName
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data
          that.loading = false
        }, function (error) {
          console.log(error)
          that.loading = false
          that.$message({
            type: 'error',
            message: '查询失败',
            duration: 1000
          })
        })
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
.el-button--small{ margin:5px 0;}
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
</style>
