<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 扫描器管理</el-breadcrumb-item>
        <el-breadcrumb-item>过闸次数限定</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="名称:">
          <el-select v-model="formInline.code">
            <el-option label="" value="全部"></el-option>
            <el-option label="单次票" value="单次票实例"></el-option>
            <el-option label="陪同票" value="陪同票实例"></el-option>
            <el-option label="练习票" value="练习票实例"></el-option>
            <el-option label="礼券" value="礼券实例"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="所属门店:">
          <el-select v-model="formInline.storeId">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(s, i) in storeArrList" :key="i" :label="s.storeName" :value="s.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button type="info" @click="search">查询</el-button>
          <el-button type="success" @click="addVersion">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="名称">
          <template scope="scope">
            {{ scope.row.name.split('实例')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="次数" prop="times" width="80">
        </el-table-column>
        <el-table-column label="描述" prop="description">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column width="88" label="操作">
          <template scope="scope">
            <el-button size="small" type="info" @click="editTicket(scope.row.id)">编辑</el-button>
            <!--<el-button size="small" type="info" @click="detailTicket(scope.row.id)">查看</el-button>-->
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
      this.getListData(this.currentPage)
      // this.getStoreArr()
    },
    data () {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        formInline: {
          code: '',
          storeId: JSON.parse(sessionStorage.getItem('store')).k
        },
        storeArrList: []
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      addVersion () {
        this.$router.push({
          path: '/countLimitAdd'
        })
      },
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
        axios.post(URL.api_name + 'backofficeapi/pass/limit/search.do', {
          name: this.formInline.code,
          storeId: this.formInline.storeId
        }).then(function (res) {
          that.loading = false
          if (res.data.status === 'success') {
            let data = res.data
            that.tableData = data.data
            that.totalCount = data.data.total
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
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
      goEdit (id) {
        this.$router.push({
          path: '/couponEdit/' + id
        })
      },
      getStoreArr () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/store/search.do', {
          params: {
            pageNum: 1,
            pageSize: 1000
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.storeArrList = res.data.data.list
          }
        })
      },
      editTicket (id) {
        this.$router.push({
          path: '/countLimitEdit/' + id
        })
      },
      detailTicket (id) {
        this.$router.push({
          path: '/scanner/' + id
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
</style>
