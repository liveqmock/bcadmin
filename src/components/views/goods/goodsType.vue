<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品类型管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="关键字:">
          <el-input type="text" placeholder="请输入类型名称" v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
          <el-button type="primary" @click="addType">添加类别</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData"
                border
                style="width: 100%">
        <!--<el-table-column
          type="selection"
          width="55">
        </el-table-column>-->
        <el-table-column prop="name" label="类型名称">
        </el-table-column>
        <el-table-column prop="parentName" label="父节点">
        </el-table-column>
        <el-table-column prop="represent" label="类型描述">
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">修改</el-button>
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <!--<el-button type="danger" size="small" @click="deleteTicket(scope.row.id)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!--<div class="btn-group">
      <el-button @click="delSelectData">删除选中数据</el-button>
    </div>-->
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
          name: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        multipleSelection: []
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      delSelectData () {
        var that = this
        // 循环取出列表id
        let tempList = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          tempList.push(this.multipleSelection[i].id)
        }
        that.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(URL.api_name + 'memberapi/feedback/batchdelete.do', {
            ids: tempList
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
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      addType () {
        this.$router.push({
          path: '/addGoodsType'
        })
      },
      getListData (num) {
        console.log(num)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'merchandiseapi/product/type/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            name: this.formInline.name,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(function (res) {
          that.loading = false
          if (res.data.status === 'success') {
            let data = res.data
            that.tableData = data.data.list
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
          path: '/goodsTypeDetail/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/editGoodsType/' + id
        })
      },
      deleteTicket (id) {
        var that = this
        that.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'memberapi/feedback/delete.do', {
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
  .btn-group{
    float: left;
    padding-top: 20px;
  }
</style>
