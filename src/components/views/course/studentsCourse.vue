<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>学员课节管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 课程顾问弹窗 -->
    <el-dialog :visible.sync="adviceDialog" :title="dialogTitle">
      <el-col :offset="5">
        <el-radio-group v-model="adviser">
          <el-radio class="my-radio" :label="0">无</el-radio>
          <el-radio class="my-radio"
                    v-for="(a, i) in adviserList" :key="i"
                    :label="a.id">{{ a.name }}</el-radio>
        </el-radio-group>
      </el-col>
      <span slot="footer" class="dialog-footer">
          <el-button @click="adviceDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDialog" :loading="cLoading">确 定</el-button>
      </span>
    </el-dialog>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="formInline.signupBegin"
            type="date"
            :editable='false'
            placeholder="开始日期">
          </el-date-picker>
          <div class="Zvertical">至</div>
          <el-date-picker
            v-model="formInline.signupEnd"
            type="date"
            :editable='false'
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学员查询">
          <el-input v-model="formInline.title" placeholder="学员手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="byCourse">购买课程</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="memberName" label="学员姓名">
        </el-table-column>
        <el-table-column prop="memberMobileNo" label="学员手机号码">
        </el-table-column>
        <el-table-column prop="afterCourseNum" label="剩余基础课节数">
        </el-table-column>
        <el-table-column prop="isRelationSalesName" label="销售顾问">
        </el-table-column>
        <el-table-column prop="isRelationSalesslaterName" label="课程顾问">
        </el-table-column>
        <!--<el-table-column label="是否关联顾问">-->
          <!--<template scope="scope">-->
            <!--{{ scope.row.isRelationSalesslater === 0 ? '否' : '是' }}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="是否关联销售">-->
          <!--<template scope="scope">-->
            <!--{{ scope.row.isRelationSales === 0 ? '否' : '是' }}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="info" size="small"
                       v-show="scope.row.afterCourseNum > 0 && arrangecourse"
                       @click="goCheck(scope.row.memberId)">排课</el-button>
            <el-button type="danger" size="small"
                       v-show="scope.row.afterCourseNum > 0 && moneyrefund"
                       @click="fetchData(scope.row.memberId)">
              退款</el-button>
            <el-button type="primary" size="small" v-show="scope.row.isRelationSalesslater === 0 && updateMemConsultant"
                       @click="showAdviseDialog(1, scope.row.memberId)">
              绑定课程顾问</el-button>
            <el-button type="warning" size="small" v-show="scope.row.isRelationSalesslater === 1 && updateMemConsultant"
                       @click="showAdviseDialog(2, scope.row.memberId, scope.row.isRelationSalesslaterId)">
              更换课程顾问</el-button>
            <el-button type="primary" size="small" v-show="scope.row.isRelationSales === 0 && updateMemSale"
                       @click="showAdviseDialog(3, scope.row.memberId)">
              绑定销售顾问</el-button>
            <el-button type="warning" size="small" v-show="scope.row.isRelationSales === 1 && updateMemSale"
                       @click="showAdviseDialog(4, scope.row.memberId, scope.row.isRelationSalesId)">
              更换销售顾问</el-button>
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
      // 获取按钮权限
      this.checkSaleLimit()
      this.checkConsulantLimit()
      this.checkrefundLimit()
      this.checkarrangLimit()
    },
    data () {
      return {
        memberId: '',
        actionType: '',
        confirmAction: '',
        dialogTitle: '',
        adviser: '',
        adviceDialog: false,
        adviserList: [],
        tableData: [],
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        formInline: {
          status: '',
          usice: '',
          signupBegin: '',
          signupEnd: '',
          title: ''
        },
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        cLoading: false,
        updateMemSale: false, // 销售按钮权限
        updateMemConsultant: false, // 顾问按钮权限
        arrangecourse: false, // 排课按钮权限
        moneyrefund: false // 退款按钮权限
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      checkarrangLimit () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/privilege/resource.do', {
          params: {
            resourceCode: 'arrangecourse'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.arrangecourse = true
          }
        })
      },
      checkrefundLimit () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/privilege/resource.do', {
          params: {
            resourceCode: 'moneyrefund'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.moneyrefund = true
          }
        })
      },
      checkSaleLimit () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/privilege/resource.do', {
          params: {
            resourceCode: 'update_mem_sale'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.updateMemSale = true
          }
        })
      },
      checkConsulantLimit () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/privilege/resource.do', {
          params: {
            resourceCode: 'update_mem_consultant'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.updateMemConsultant = true
          }
        })
      },
      confirmDialog () {
        if (this.actionType === 1) {
          // 绑定顾问
          this.bindSalerLater(this.memberId, this.adviser)
        } else if (this.actionType === 2) {
          // 更换顾问
          this.changebindSalerLater(this.memberId, this.adviser)
        } else if (this.actionType === 3) {
          this.bindSaler(this.memberId, this.adviser)
        } else if (this.actionType === 4) {
          this.changeBindSaler(this.memberId, this.adviser)
        }
      },
      // 显示绑定提示框
      showAdviseDialog (type, memberId, bindId) {
        this.actionType = type
        this.memberId = memberId
        this.adviser = bindId
        if (type === 1) {
          this.dialogTitle = '绑定课程顾问'
          this.getAdviserList()
        } else if (type === 2) {
          this.dialogTitle = '更换课程顾问'
          this.getAdviserList()
        } else if (type === 3) {
          this.dialogTitle = '绑定课程销售'
          this.getSalerList()
        } else if (type === 4) {
          this.dialogTitle = '更换课程销售'
          this.getSalerList()
        }
        this.adviceDialog = true
      },
      closeAdvisDialog () {
        this.adviceDialog = false
        this.adviser = ''
      },
      // 加载课程销售列表
      getSalerList () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/sales/member/list.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            position: 'sales'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.adviserList = res.data.data
          }
        })
      },
      // 绑定顾问
      bindSalerLater (memberId, saleId) {
        let that = this
        that.cLoading = true
        axios.get(URL.api_name + 'backofficeapi/member/consultant/adviser/associate/member.do', {
          params: {
            memberId: memberId,
            employeeId: saleId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.adviceDialog = false
            that.cLoading = false
            that.getListData(that.currentPage)
          } else {
            that.cLoading = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          that.cLoading = false
          console.log(err)
          that.$message({
            type: 'error',
            message: '请求失败'
          })
        })
      },
      // 更换顾问
      changebindSalerLater (memberId, saleId) {
        let that = this
        that.cLoading = true
        axios.get(URL.api_name + 'backofficeapi/api/course/addorupdcsales.do', {
          params: {
            consultantId: saleId,
            memberId: memberId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.adviceDialog = false
            that.cLoading = false
            that.getListData(that.currentPage)
          } else {
            that.cLoading = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
          that.cLoading = false
          that.$message({
            type: 'error',
            message: '请求失败'
          })
        })
      },
      // 绑定销售
      bindSaler (memberId, saleId) {
        let that = this
        that.cLoading = true
        axios.get(URL.api_name + 'backofficeapi/sales/member/binding.do', {
          params: {
            memberId: memberId,
            saleId: saleId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.adviceDialog = false
            that.cLoading = false
            that.getListData(that.currentPage)
          } else {
            that.cLoading = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          that.cLoading = false
          console.log(err)
          that.$message({
            type: 'error',
            message: '请求失败'
          })
        })
      },
      // 更换销售
      changeBindSaler (memberId, saleId) {
        let that = this
        that.cLoading = true
        axios.get(URL.api_name + 'backofficeapi/sales/member/chang/binding.do', {
          params: {
            memberId: memberId,
            saleId: saleId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.adviceDialog = false
            that.cLoading = false
            that.getListData(that.currentPage)
          } else {
            that.cLoading = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          that.cLoading = false
          console.log(err)
          that.$message({
            type: 'error',
            message: '请求失败'
          })
        })
      },
      // 加载课程顾问列表
      getAdviserList () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/employee/search/saleslist.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            position: 'sales_later'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.adviserList = res.data.data
          }
        })
      },
      fetchData (courseId) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/displayrefcourse.do', {
          params: {
            memberId: courseId,
            refundId: '',
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$router.push({
              path: '/dropCourse/' + courseId
            })
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      dateFormat (row, column) {
        let date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/member/list.do', {
          params: {
            memberMobile: that.formInline.title,
            createTimeBegin: that.signupBegin,
            createTimeEnd: that.signupEnd,
            storeId: that.storeId,
            pageSize: that.pageSize,
            pageNum: num
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
        }).catch((error) => {
          console.log(error)
        })
      },
      byCourse () {
        // 购买课程
        this.$router.push({
          path: '/courseBuyList'
        })
      },
      goDetial (id) {
        // 学员信息详情
        this.$router.push({
          // path: '/courseList'
        })
      },
      repay (courseId) {
        // 退款
        this.$router.push({
          path: '/dropCourse/' + courseId
        })
      },
      goCheck (id) {
        // 排课
        this.$router.push({
          path: '/studentCheckType/' + id
        })
      }
    },
    computed: {
      signupEnd () {
        if (this.formInline.signupEnd !== '') {
          return moment(this.formInline.signupEnd).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      signupBegin () {
        if (this.formInline.signupBegin !== '') {
          return moment(this.formInline.signupBegin).format('YYYY-MM-DD')
        } else {
          return ''
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .Zvertical{ display:inline-block; line-height: 36px; height:36px;}
  .my-radio{
    display: block;
    margin-left: 0;
    margin-bottom: 5px;
  }
</style>
