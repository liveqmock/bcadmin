<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员积分管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" label-width="70px" class="demo-form-inline">
        <el-form-item label="会员类型">
          <el-select v-model="formInline.grade">
            <el-option label="初级会员" value="111"></el-option>
            <el-option label="中级会员" value="111"></el-option>
            <el-option label="高级会员" value="111"></el-option>
            <el-option label="VIP会员" value="111"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
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
        <el-table-column type="index" width="55">
        </el-table-column>
        <el-table-column prop="id" label="会员编号" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式">
        </el-table-column>
        <el-table-column prop="grade" label="会员等级">
        </el-table-column>
        <el-table-column prop="point" label="会员积分">
        </el-table-column>
        <el-table-column prop="name" label="兑换权限" width="80">
        </el-table-column>
        <el-table-column prop="gender" label="积分兑换比例" width="80">
        </el-table-column>
        <el-table-column prop="address" label="抵扣权限">
        </el-table-column>
        <el-table-column prop="registerTime" label="备注">
        </el-table-column>
      </el-table>
    </div>
    <div class="page-pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!--<div class="footer-bar">-->
      <!--<el-button type="info" size="small">导出EXCEL</el-button>-->
    <!--</div>-->
  </div>
</template>
<script>
    import moment from 'moment'
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    export default {
      created () {
        this.getListData()
      },
      data () {
        return {
          formInline: {
            grade: '',
            name: '',
            registerTimeBegin: '',
            registerTimeEnd: ''
          },
          tableData: [],
          currentPage: 1,
          pageSize: 10,
          totalCount: 0,
          loading: true,
          isSearch: false
        }
      },
      methods: {
        search () {
          this.getListData()
          console.log('submit')
        },
        handleCurrentChange (val) {
          this.currentPage = val
          this.getListData()
        },
        addCoupon () {
          this.$router.push({
            path: '/addCoupon'
          })
        },
        getListData () {
          var that = this
          that.loading = true
          axios.get(URL.api_name + 'memberapi/member/list.do', {
            params: {
              pageSize: this.pageSize,
              pageNum: this.currentPage,
              grade: this.formInline.grade,
              name: this.formInline.name,
              registerTimeBegin: this.bTime,
              registerTimeEnd: this.eTime
            }
          }).then(function (respose) {
            if (respose.data.status === 'success') {
              let data = respose.data
              that.tableData = data.data.list
              that.loading = false
              that.totalCount = data.data.total
            }
          }, function (error) {
            that.$message({
              type: 'error',
              message: '查询失败'
            })
            that.loading = false
            console.log(error)
          })
        },
        goDetail (id) {
          this.$router.push({
            path: '/memberInfoDetail/' + id
          })
        },
        goEdit (id) {
          this.$router.push({
            path: '/memberInfoEdit/' + id
          })
        },
        lock (scope, status) {
          var that = this
          let msg = ''
          if (status === 1) {
            msg = '确定锁定该账户吗？'
          } else {
            msg = '确定解锁该账户吗？'
          }
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.get(URL.api_name + 'memberapi/member/lock.do', {
              params: {
                id: scope.id,
                status: scope.status
              }
            }).then((res) => {
              if (res.data.status === 'success') {
                this.$message({
                  type: 'success',
                  message: res.data.message,
                  duration: 1000,
                  onClose: function () {
                    that.getListData()
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      },
      computed: {
        bTime () {
          if (this.formInline.registerTimeEnd !== '') {
            return moment(this.formInline.registerTimeEnd).format('YYYY-MM-DD')
          }
          return ''
        },
        eTime () {
          if (this.formInline.registerTimeBegin !== '') {
            return moment(this.formInline.registerTimeBegin).format('YYYY-MM-DD')
          }
          return ''
        }
      }
    }
</script>
<style lang="less" scoped>
</style>
