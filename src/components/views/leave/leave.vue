<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 请假管理</el-breadcrumb-item>
        <el-breadcrumb-item>请假列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!--<el-form-item label="员工职务:">-->
          <!--<el-select placeholder="请选择" v-model="formInline.position">-->
            <!--<el-option v-for="(e, index) in employDuty"-->
                       <!--:key="index"-->
                       <!--:label="e.systemName"-->
                       <!--:value="e.systemCode">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="请假类型:">
          <el-select placeholder="请选择" v-model="formInline.leaveType">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(e, index) in leaveTypes"
                       :key="index"
                       :label="e.systemName"
                       :value="e.systemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="formInline.leaveStatus">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(e, index) in leaveStatus"
                       :key="index"
                       :label="e.systemName"
                       :value="e.systemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请假时间:">
          <el-date-picker
          v-model="formInline.leaveStarttime"
          type="datetime"
          :editable='false'
          @change="beginTimeRules"
          placeholder="请假开始时间"></el-date-picker>
          至
          <el-date-picker
          v-model="formInline.leaveEndtime"
          type="datetime"
          :editable='false'
          @change='endTimeRules'
          placeholder="请假结束时间"></el-date-picker>
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
        <el-table-column label="申请人" prop="employeeName" width="80px">
        </el-table-column>
        <el-table-column prop="leaveType" label="请假类型" width="100px">
        </el-table-column>
        <el-table-column prop="leaveStarttime" label="开始时间">
        </el-table-column>
        <el-table-column prop="leaveEndtime" label="结束时间">
        </el-table-column>
        <el-table-column label="审核状态">
          <template scope="scope">
            {{ scope.row.leaveStatus | formatType }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button type="success" size="small"
                       v-show="scope.row.leaveStatus === 'in_audit' && auditvocation"
                       @click="goEdit(scope.row.id)">审批</el-button>
            <el-button type="info" size="small"
                       @click="goDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      // this.getDuty()
      this.getLeaveTypes()
      this.getLeaveStatus()
      this.getListData(this.currentPage)
      this.checkRoleBtn()
    },
    data () {
      return {
        formInline: {
          leaveEndtime: '',
          leaveStarttime: '',
          leaveStatus: '',
          leaveType: '',
          position: ''
        },
        tableData: [],
        employDuty: [],
        leaveTypes: [],
        leaveStatus: [],
        loading: true,
        currentPage: 1,
        totalCount: 0,
        auditvocation: false
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      // 获取角色按钮权限
      checkRoleBtn () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/privilege/resource.do', {
          params: {
            resourceCode: 'auditvocation'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.auditvocation = true
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
      addCoupon () {
        this.$router.push({
          path: '/leaveAdd'
        })
      },
      getListData (num) {
        var that = this
        this.currentPage = num
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/leave/search.do', {
          params: {
            leaveEndtime: that.leaveEndtime,
            leaveStarttime: that.leaveStarttime,
            leaveStatus: that.formInline.leaveStatus,
            leaveType: that.formInline.leaveType,
            position: that.formInline.position,
            pageSize: 15,
            pageNum: this.currentPage,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.totalCount = data.data.total
          that.loading = false
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
          path: '/leave/edit/' + id
        })
      },
      goDetail (id) {
        this.$router.push({
          path: '/leave/detail/' + id
        })
      },
      getDuty () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'employee_position'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.employDuty = res.data.data
          }
        })
      },
      getLeaveTypes () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'leave_type'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.leaveTypes = res.data.data
          }
        })
      },
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.leaveEndtime)
        this.formInline.leaveStarttime = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.leaveStarttime = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.leaveStarttime)
        let date2 = moment(val)
        this.formInline.leaveEndtime = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.leaveEndtime = ''
        }
      },
      getLeaveStatus () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'leave_status'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.leaveStatus = res.data.data
          }
        })
      }
    },
    computed: {
      leaveEndtime () {
        if (this.formInline.leaveEndtime === '') {
          return ''
        } else {
          return moment(this.formInline.leaveEndtime).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      leaveStarttime () {
        if (this.formInline.leaveStarttime === '') {
          return ''
        } else {
          return moment(this.formInline.leaveStarttime).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .banner-img{
    width: 80px;
    height: 60px;
  }
</style>
