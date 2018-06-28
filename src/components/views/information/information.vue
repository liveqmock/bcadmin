<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="formInline.title" placeholder="标题模糊匹配"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addInformation">发布资讯</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="title" label="资讯标题" width="200">
        </el-table-column>
        <el-table-column prop="content" label="资讯简介">
        </el-table-column>
        <el-table-column label="资讯图片" width="160">
          <template scope="scope">
            <img :src="scope.row.pictureUrl" alt="" class="img">
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="180">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="primary" size="small" @click="goDetial(scope.row.id)">详情</el-button>
            <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
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
            title: ''
          },
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
        addInformation () {
          this.$router.push({
            path: '/addInformation'
          })
        },
        getListData (num) {
          this.currentPage = num
          var that = this
          that.loading = true
          axios.get(URL.api_name + 'backofficeapi/information/headlines/list.do', {
            params: {
              storeId: JSON.parse(sessionStorage.getItem('store')).k,
              title: this.formInline.title,
              pageSize: that.pageSize,
              pageNum: num
            }
          }).then(function (respose) {
            console.log(respose)
            let data = respose.data
            that.tableData = data.data.list
            that.loading = false
            that.totalCount = data.data.total
          }, function (error) {
            console.log(error)
          })
        },
        goDetial (id) {
          this.$router.push({
            path: '/informationDetial/' + id
          })
        },
        del (id) {
          this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.get(URL.api_name + 'backofficeapi/information/headlines/delete.do', {
              params: {
                id: id
              }
            }).then((res) => {
              if (res.data.status === 'success') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getListData()
                console.log('updated.')
              }
            })
          }).catch((error) => {
            console.log(error)
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
.img{ display:block; width:auto; height:auto; max-height:75px; margin:0 auto;}
</style>
