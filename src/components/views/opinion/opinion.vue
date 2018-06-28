<template>
  <div class="opinion">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 意见反馈</el-breadcrumb-item>
        <el-breadcrumb-item>反馈列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="手机号:">
          <el-input type="text" placeholder="请输入手机号" v-model="formInline.phone"></el-input>
        </el-form-item>
        <el-form-item label="端口:">
          <el-select v-model="formInline.port">
            <el-option label="全部" value=""></el-option>
            <el-option label="android" value="android"></el-option>
            <el-option label="ios" value="ios"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
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
        <el-table-column prop="name" label="编号" width="100">
          <template scope="scope">
            {{ (scope.$index + 1) + (currentPage - 1) * 15 }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码">
        </el-table-column>
        <el-table-column label="留言内容">
          <template scope="scope">
            <div class="opinion-content">
              {{ scope.row.message }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="port" label="端口">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button type="danger" size="small" @click="deleteTicket(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="btn-group">
      <el-button @click="delSelectData">删除选中数据</el-button>
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
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          phone: '',
          port: ''
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
        axios.get(URL.api_name + 'memberapi/feedback/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            phone: this.formInline.phone,
            port: this.formInline.port,
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
<style lang="less">
  .opinion{
    .btn-group{
      float: left;
      padding-top: 20px;
    }
    .opinion-content{
      max-height: 100px;
      overflow: auto;
    }
    .el-table__row .cell{
      max-height: 100px;
      overflow: hidden;
    }
  }
</style>
