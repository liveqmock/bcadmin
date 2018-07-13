<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="formInline.startCreateTime"
            type="date"
            :editable='false'
            @change="beginTimeRules"
            placeholder="选择日期">
          </el-date-picker>
          <el-date-picker
            v-model="formInline.endCreateTime"
            type="date"
            :editable='false'
            @change="endTimeRules"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题搜索">
          <el-input v-model="formInline.newsTitle" placeholder="输入标题名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addNews">添加消息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data newslist"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="createName" label="创建人">
        </el-table-column>
        <el-table-column prop="newsTitle" label="消息标题">
        </el-table-column>
        <el-table-column label="消息图片">
          <template scope="scope">
            <img :src="scope.row.newsImage">
          </template>
        </el-table-column>
        <el-table-column prop="newsDetail" label="消息内容">
          <template scope="scope">
            <span v-html='scope.row.newsDetail'></span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button v-show="scope.row.sendStatus !== 1" type="info" size="small" @click="send(scope.row.id)">发送</el-button>
            <el-button v-show="scope.row.sendStatus !== 1" type="info" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
            <el-button v-show="scope.row.sendStatus !== 1" type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
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
  import moment from 'moment'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          newsTitle: '',
          startCreateTime: '',
          endCreateTime: ''
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
      addNews () {
        this.$router.push({
          path: '/newsAdd'
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'memberapi/news/search.do', {
          params: {
            pageSize: that.pageSize,
            pageNum: num,
            endCreateTime: that.formInline.endCreateTime,
            newsTitle: that.formInline.newsTitle,
            startCreateTime: that.formInline.startCreateTime
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
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.endCreateTime)
        this.formInline.startCreateTime = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.startCreateTime = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.startCreateTime)
        let date2 = moment(val)
        this.formInline.endCreateTime = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.endCreateTime = ''
        }
      },
      goEdit (id) {
        this.$router.push({
          path: '/newsEdit/' + id
        })
      },
      del (nid) {
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'memberapi/news/delete.do', {
            params: {
              id: nid
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getListData()
        }).catch((error) => {
          console.log(error)
          // this.$message({
          //   type: 'info',
          //   message: ''
          // })
        })
      },
      send (nid) {
        this.$router.push({
          path: '/newsSend/' + nid
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
<style lang="less">
.newslist .el-table .cell{max-height: 75px;}
</style>
