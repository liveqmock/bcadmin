<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员资料管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" label-width="80px" class="demo-form-inline">
        <el-form-item label="切换门店">
          <el-select v-model="formInline.storeId">
            <el-option v-if="isAdmin" label="全部" :value="0"></el-option>
            <el-option v-for="(s, index) in storeArr" :key="index" :label="s.v" :value="s.k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="formInline.grade">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(g, index) in gradeList" :key="index" :label="g.systemName" :value="g.systemCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="formInline.registerTimeBegin"
            type="date"
            @change="beginTimeRules"
            :editable='false'
            placeholder="开始时间">
          </el-date-picker>
          <el-date-picker
            v-model="formInline.registerTimeEnd"
            type="date"
            @change="endTimeRules"
            :editable='false'
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="mobileChange">会员手机号变更记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="会员编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="80">
        </el-table-column>
        <el-table-column label="性别" width="80">
          <template scope="scope">
            {{ scope.row.gender | formatSex }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式">
        </el-table-column>
        <el-table-column prop="grade" label="会员等级">
          <template scope="scope">
            {{ scope.row.grade | formatGrade }}
          </template>
        </el-table-column>
        <el-table-column prop="consumeMoney" label="消费金额">
        </el-table-column>
        <el-table-column prop="point" label="会员积分">
        </el-table-column>
        <el-table-column prop="address" label="联系地址">
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间">
        </el-table-column>
        <el-table-column prop="storeName" label="注册门店">
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
            <el-button type="info" size="small" @click="goEditPoint(scope.row.id)">补录积分</el-button>
            <el-button @click="lock(scope.row, 1)" type="danger" size="small" v-if="scope.row.status === '1'">黑名单</el-button>
            <el-button @click="lock(scope.row, 2)" type="warning" size="small" v-if="scope.row.status === '2'">白名单</el-button>
            <el-button @click="loginUnlock(scope.row.mobile)" type="warning" size="small" v-if="scope.row.loginStatus === 1">解锁</el-button>
            <el-button @click="changeMobile(scope.row)" size="small">变更手机号</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
    <el-dialog title="变更手机号"
               :close-on-click-modal="false"
               :show-close="false"
               :visible.sync="authorizeDialog">
      <el-form label-width="100px">
        <el-form-item label="旧手机号：">
          <el-col :span="12">
            {{ changeItem.mobile }}
          </el-col>
        </el-form-item>
        <el-form-item label="新手机号：">
          <el-col :span="12">
            <el-input auto-complete="off" v-model="mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="confirmChange" :loading="isLoading">确定</el-button>
          <el-button type="default" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    import Pager from '@/components/views/common/pager'
    import moment from 'moment'
    export default {
      created () {
        if (JSON.parse(sessionStorage.getItem('userInfo')).isAdmin) {
          this.formInline.storeId = 0
        } else {
          this.formInline.storeId = JSON.parse(sessionStorage.getItem('userInfo')).stores[0].k
        }
        this.getListData(this.currentPage)
        this.getMemberGrade()
      },
      data () {
        return {
          authorizeDialog: false,
          formInline: {
            grade: '',
            mobile: '',
            registerTimeBegin: '',
            registerTimeEnd: '',
            storeId: 0
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
        mobileChange () {
          this.$router.push({
            path: '/memberMobileChange'
          })
        },
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
          axios.get(URL.api_name + 'memberapi/member/list.do?pageSize=' + this.pageSize + '&pageNum=' + num, {
            params: {
              grade: that.formInline.grade,
              name: that.formInline.name,
              mobile: that.formInline.mobile,
              registerTimeBegin: that.bTime,
              registerTimeEnd: that.eTime,
              storeId: that.formInline.storeId
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
        isAdmin () {
          return JSON.parse(sessionStorage.getItem('userInfo')).isAdmin
        },
        storeArr () {
          return JSON.parse(sessionStorage.getItem('userInfo')).stores
        },
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
