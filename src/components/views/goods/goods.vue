<template>
  <div class="goods-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="商品名称:">
          <el-input type="text" placeholder="请输入商品名称" v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="商品种类:">
          <el-select v-model="formInline.type">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(t, i) in typeList" :label="t.name" :value="t.id" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="formInline.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
          <el-button @click="addGoods" type="primary">添加商品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData"
                @selection-change="handleSelectionChange"
                border
                style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="id" label="商品编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="商品名称">
        </el-table-column>
        <el-table-column prop="type" label="类别">
        </el-table-column>
        <el-table-column prop="stock" label="总库存">
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间">
        </el-table-column>
        <el-table-column prop="port" label="状态">
          <template scope="scope">
            <el-tag type="success" v-show="scope.row.status === '1'">已上架</el-tag>
            <el-tag type="danger" v-show="scope.row.status === '0'">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">修改</el-button>
            <el-button type="info" size="small" v-show="scope.row.status === '0'" @click="updownGoods(scope.row.id, '1')">上架</el-button>
            <el-button type="warning" size="small" v-show="scope.row.status === '1'" @click="updownGoods(scope.row.id, '0')">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="btn-group">
      <el-button @click="updownSelectData('1')">批量上架</el-button>
      <el-button @click="updownSelectData('0')">批量下架</el-button>
    </div>
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  export default {
    created () {
      this.getTypeList()
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          name: '',
          status: '',
          type: ''
        },
        typeList: [],
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
      addGoods () {
        this.$router.push({
          path: '/goodsAdd'
        })
      },
      getTypeList () {
        let that = this
        axios.get(URL.api_name + 'merchandiseapi/product/type/obtain/zero.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.typeList = res.data.data
          }
        })
      },
      updownSelectData (status) {
        var that = this
        // 循环取出列表id
        let tempList = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          tempList.push(this.multipleSelection[i].id)
        }
        let productids = tempList.join(',')
        let msg = ''
        if (status === '1') {
          msg = '确定批量上架吗？'
        } else {
          msg = '确定批量下架吗？'
        }
        that.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(URL.api_name + 'merchandiseapi/product/batch/up/down/frame.do', {
            productids: productids,
            status: status
          }).then(res => {
            if (res.data.status === 'success') {
              if (status === '1') {
                that.$message({
                  type: 'success',
                  message: '上架成功',
                  duration: 1000
                })
              } else {
                that.$message({
                  type: 'success',
                  message: '下架成功',
                  duration: 1000
                })
              }
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
      addCoupon () {
        this.$router.push({
          path: '/addCoupon'
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'merchandiseapi/product/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            name: this.formInline.name,
            status: this.formInline.status,
            type: this.formInline.type,
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
          path: '/goods/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/goodsEdit/' + id
        })
      },
      updownGoods (id, status) {
        var that = this
        var message = ''
        if (status === '1') {
          message = '确定上架吗？'
        } else if (status === '0') {
          message = '确定下架吗？'
        }
        that.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(URL.api_name + 'merchandiseapi/product/up/down/frame.do', {
            product: {
              id: id,
              status: status
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '操作成功',
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
        })
      }
    }
  }
</script>
<style lang="less">
  .goods-list{
    .el-table__row .cell{
      overflow: hidden;
    }
    .goods-img{
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      vertical-align: bottom;
    }
    .btn-group{
      float: left;
      padding-top: 20px;
    }
  }
</style>
