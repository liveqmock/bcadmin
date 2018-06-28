<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据字典</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="字典名称">
          <el-input v-model="formInline.name" placeholder="字典名称模糊匹配"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addCoupon">+ 新增字典</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="systemCode" label="字典编码">
        </el-table-column>
        <el-table-column prop="systemValue" label="字典值">
        </el-table-column>
        <el-table-column prop="systemName" label="字典名称">
        </el-table-column>
        <el-table-column prop="dictType" label="字典类型">
          <template scope="scope">
            {{ scope.row.dictType === 1 ? '基础类型' : '业务类型' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <!--<el-table-column prop="createBy" label="创建人" width="100">-->
        <!--</el-table-column>-->
        <el-table-column label="操作">
          <template scope="scope">
            <el-button v-if="scope.row.dictType !== 1" type="info" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.dictType !== 1" type="warning" size="small" @click="del(scope.row.id, scope.row.parentId)">删除</el-button>
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
          name: ''
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
      addCoupon () {
        this.$router.push({
          path: '/dictionaryAdd'
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/system/rict/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            systemName: this.formInline.name,
            dictType: this.formInline.category
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
      },
      goEdit (id) {
        this.$router.push({
          path: '/dictionaryEdit/' + id
        })
      },
      del (id, pid) {
        var that = this
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/system/rict/delete.do', {
            params: {
              id: id,
              parentId: pid
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
</style>
