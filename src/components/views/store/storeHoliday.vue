<template>
  <div class="store-list">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i>门店维护</el-breadcrumb-item>
            <el-breadcrumb-item>节假日设定</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="条件查询">
          <el-input  placeholder="输入节假日名称..." v-model="keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="" @click="searchHoliday">查询</el-button>
          <el-button type="primary" @click="storeHolidayAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="holidayName" label="节假日名称" width="180">
        </el-table-column>
        <el-table-column label="开始时间" width="180">
          <template scope="scope">
            {{ scope.row.startHolidayDate | formatStoreDate }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template scope="scope">
            {{ scope.row.endHolidayDate | formatStoreDate }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="info" size="small" @click="Edit(scope.row.id)">修改</el-button>
            <el-button type="danger" size="small" @click="Del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
    import axios from 'axios'
    import URL from '@/common/js/URL.js'
    import Pager from '@/components/views/common/pager.vue'
    import moment from 'moment'
    export default {
      created () {
        this.getListData(this.currentPage)
      },
      data () {
        return {
          // storeId: this.$route.params.sid,
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          formInline: {
            user: '',
            region: ''
          },
          keyWord: '',
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
        searchHoliday () {
          if (this.currentPage > 1) {
            this.currentPage = 1
          } else {
            this.getListData(this.currentPage)
          }
        },
        Edit (id) {
          this.$router.push({
            path: '/storeHolidayEdit/' + id
          })
        },
        Del (tid) {
          // 二次确认
          this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.get(URL.api_name + 'backofficeapi/store/storeHoliday/delete.do', {
              params: {
                id: tid,
                storeId: this.storeId
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
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        },
        getListData (num) {
          var that = this
          that.currentPage = num
          that.loading = true
          axios.get(URL.api_name + 'backofficeapi/store/storeHoliday/search.do', {
            params: {
              storeId: this.storeId,
              pageSize: this.pageSize,
              pageNum: num,
              holidayName: this.keyWord
            }
          }).then(function (respose) {
            let data = respose.data
            that.tableData = data.data.list
            that.loading = false
            that.totalCount = data.data.total
          }, function (error) {
            console.log(error)
          })
        },
        storeHolidayAdd () {
          this.$router.push({
            path: '/storeHolidayAdd'
          })
        }
      },
      filters: {
        formatStoreDate (val) {
          return moment(val).format('YYYY-MM-DD')
        }
      }
    }
</script>
<style lang="less">
  .crumbs{
    padding-bottom: 10px;
    border-bottom: 1px solid #ebebeb;
  }
  .search-wrapper{
    padding-top: 20px;
  }
  .page-pagination{
    padding-top: 20px;
  }
</style>
