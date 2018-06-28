<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员手机号变更记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="memberName" label="会员姓名">
        </el-table-column>
        <el-table-column prop="oldMobile" label="修改前手机号">
        </el-table-column>
        <el-table-column prop="newMobile" label="修改后手机号">
        </el-table-column>
        <el-table-column prop="createUser" label="修改人">
        </el-table-column>
        <el-table-column prop="createTime" label="修改日期">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    import Pager from '@/components/views/common/pager'
    import moment from 'moment'
    export default {
      created () {
        this.getListData(this.currentPage)
      },
      data () {
        return {
          authorizeDialog: false,
          formInline: {
            grade: '',
            mobile: '',
            registerTimeBegin: '',
            registerTimeEnd: ''
          },
          gradeList: [],
          tableData: [],
          currentPage: 1,
          pageSize: 15,
          totalCount: 0,
          loading: true,
          isSearch: false,
          changeItem: {},
          mobile: '',
          isLoading: false
        }
      },
      components: {
        Pager: Pager
      },
      methods: {
        cancel () {
          this.authorizeDialog = false
          this.mobile = ''
        },
        changeMobile (item) {
          this.authorizeDialog = true
          this.changeItem = item
        },
        confirmChange () {
          this.isLoading = true
          axios.get(URL.api_name + 'memberapi/member/change/mobile.do', {
            params: {
              memberId: this.changeItem.id,
              mobile: this.mobile
            }
          }).then(res => {
            this.isLoading = false
            if (res.data.status === 'success') {
              this.$succssMsg(res.data.message)
              this.authorizeDialog = false
              this.mobile = ''
              this.getListData(this.currentPage)
            } else {
              this.$errMsg(res.data.message)
            }
          })
        },
        search () {
          if (this.currentPage > 1) {
            this.currentPage = 1
          } else {
            this.getListData(this.currentPage)
          }
        },
        loginUnlock (mobile) {
          axios.get(URL.api_name + 'memberapi/member/unlock.do', {
            params: {
              mobile: mobile
            }
          }).then(res => {
            if (res.data.status === 'success') {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.getListData(this.currentPage)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(err => {
            console.log(err)
          })
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
          axios.get(URL.api_name + 'memberapi/member/change/mobile/his.do', {
            params: {
              pageSize: this.pageSize,
              pageNum: num
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
        goEditPoint (id) {
          this.$router.push({
            path: '/memberPointEdit/' + id
          })
        },
        goEdit (id) {
          this.$router.push({
            path: '/memberInfoEdit/' + id
          })
        },
        beginTimeRules (val) {
          let date1 = moment(val)
          let date2 = moment(this.formInline.registerTimeEnd)
          this.formInline.registerTimeBegin = val
          // console.log(date2)
          if (date2 !== 'NaN' && date1.diff(date2) > 0) {
            this.$message({
              message: '开始时间不能大于结束时间',
              type: 'error'
            })
            this.formInline.registerTimeBegin = ''
          }
        },
        endTimeRules (val) {
          let date1 = moment(this.formInline.registerTimeBegin)
          let date2 = moment(val)
          this.formInline.registerTimeEnd = val
          // console.log(date2)
          if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'error'
            })
            this.formInline.registerTimeEnd = ''
          }
        },
        lock (scope, status) {
          var that = this
          let msg = ''
          if (status === 1) {
            msg = '确定拉黑该账户吗？'
          } else {
            msg = '确定恢复该账户吗？'
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
                  duration: 1000
                })
                that.getListData(that.currentPage)
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
        },
        getMemberGrade () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
            params: {
              systemCode: 'memberLevel'
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.gradeList = res.data.data
            }
          })
        }
      },
      computed: {
        bTime () {
          if (this.formInline.registerTimeBegin !== '') {
            return moment(this.formInline.registerTimeBegin).format('YYYY-MM-DD')
          }
          return ''
        },
        eTime () {
          if (this.formInline.registerTimeEnd !== '') {
            return moment(this.formInline.registerTimeEnd).format('YYYY-MM-DD')
          }
          return ''
        }
      },
      filters: {
        formatGrade (str) {
          if (str === 'LOW_LEVEL') {
            return '初级会员'
          } else if (str === 'IN_LEVEL') {
            return '中级会员'
          } else if (str === 'HIGH_LEVEL') {
            return '高级会员'
          } else if (str === 'VIP_LEVEL') {
            return 'VIP会员'
          } else {
            return ''
          }
        }
      }
    }
</script>
<style lang="less" scoped>
</style>
