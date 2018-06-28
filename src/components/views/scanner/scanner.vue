<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 扫描器管理</el-breadcrumb-item>
        <el-breadcrumb-item>扫描器列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="扫描器编码:">
          <el-input v-model="formInline.code" type="text" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="扫描器名称:">
          <el-input v-model="formInline.name" type="text" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="formInline.inOrOut">
            <el-option label="全部" value=""></el-option>
            <el-option label="进" value="进"></el-option>
            <el-option label="出" value="出"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店:">
          <el-select v-model="formInline.storeId">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(s, i) in storeArrList" :key="i" :label="s.storeName" :value="s.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="search">查询</el-button>
          <el-button type="success" @click="addVersion">添加扫描器</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="code" label="编码">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column label="类型" prop="inOrOut" width="80">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template scope="scope">
            <el-button size="small" type="info" @click="editTicket(scope.row.id)">编辑</el-button>
            <el-button size="small" type="info" @click="detailTicket(scope.row.id)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteTicket(scope.row.id)">删除</el-button>
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
      this.getStoreArr()
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
          inOrOut: '',
          name: '',
          storeId: ''
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
          path: '/scannerAdd'
        })
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
        this.currentPage = num
        var that = this
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/gatescanner/find.do', {
          code: this.formInline.code,
          inOrOut: this.formInline.inOrOut,
          name: this.formInline.name,
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
          path: '/scannerEdit/' + id
        })
      },
      detailTicket (id) {
        this.$router.push({
          path: '/scanner/' + id
        })
      },
      deleteTicket (id) {
        var that = this
        that.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/gatescanner/delete-by-id.do', {
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
            } else {
              that.$message({
                type: 'error',
                message: res.data.message
              })
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
