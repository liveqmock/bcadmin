<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>学员课节变更记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名：">
          <el-input v-model="formInline.memberName" placeholder="请输入学员姓名..."></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="formInline.memberMobile" placeholder="请输入学员手机号..."></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="formInline.createTimeBegin"
            type="date"
            :editable='false'
            @change="beginTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
          <div class="Zvertical">至</div>
          <el-date-picker
            v-model="formInline.createTimeEnd"
            type="date"
            :editable='false'
            @change="endTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="调整类型：">
          <el-select v-model="formInline.changeReason">
            <el-option label="请选择" value=""></el-option>
            <el-option label="购课" :value="1"></el-option>
            <el-option label="排课" :value="2"></el-option>
            <el-option label="调课" :value="3"></el-option>
            <el-option label="退本周课" :value="4"></el-option>
            <el-option label="退课" :value="5"></el-option>
            <el-option label="退款" :value="6"></el-option>
            <el-option label="退款驳回" :value="7"></el-option>
            <el-option label="还原课节" :value="8"></el-option>
            <el-option label="活动" :value="9"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作原因：">
          <el-select v-model="formInline.causeType">
            <el-option v-for="c in causeTypeList"
                       :label="c.systemName"
                       :value="c.systemCode"
                       :key="c.systemCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="search">查询</el-button>
          <a href="javascript:void(0)" @click="downloadExcel" class="btn-link">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data courseData"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="" label="课程/活动名称"></el-table-column>
        <el-table-column prop="memberName" label="会员姓名"></el-table-column>
        <el-table-column prop="memberMobile" label="会员手机号"></el-table-column>
        <el-table-column prop="beforeCourseNum" label="调整前基础课节">
        </el-table-column>
        <el-table-column prop="changedCourseNum" label="调整基础课节">
        </el-table-column>
        <el-table-column prop="afterCourseNum" label="调整后基础课节">
        </el-table-column>
        <el-table-column label="调整类型" prop="changeReason">
        </el-table-column>
        <el-table-column label="操作原因">
          <template scope="scope">
            {{ scope.row.causeType | formatType }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
        </el-table-column>
        <el-table-column prop="createName" label="操作人">
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间">
        </el-table-column>
        <el-table-column label="调整记录">
          <template scope="scope">
            <el-button type="primary" size="small" @click="seeDetail(scope.row)">查看</el-button>
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
      this.getCauseType()
    },
    data () {
      return {
        formInline: {
          memberMobile: '',
          memberName: '',
          createTimeBegin: '',
          createTimeEnd: '',
          changeReason: '',
          causeType: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false,
        causeTypeList: []
      }
    },
    computed: {
      exportLink () {
        return URL.api_name + 'backofficeapi/course/member/coursenumlist/export.do' +
          '?authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId +
          '&createTimeBegin=' + this.createTimeBegin + '&createTimeEnd=' + this.createTimeEnd +
          '&memberMobile=' + this.formInline.memberMobile + '&memberName=' + this.formInline.memberName +
          '&storeId=' + this.storeId + '&causeType=' + this.formInline.causeType +
          '&changeReason=' + this.formInline.changeReason
      },
      createTimeBegin () {
        if (this.formInline.createTimeBegin !== '') {
          return moment(this.formInline.createTimeBegin).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      createTimeEnd () {
        if (this.formInline.createTimeEnd !== '') {
          return moment(this.formInline.createTimeEnd).format('YYYY-MM-DD')
        } else {
          return ''
        }
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      getCauseType () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'causeType'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.causeTypeList = res.data.data
          }
        })
      },
      seeDetail (item) {
        this.$router.push({
          path: '/baseCourseChangeListDetail/' + item.memberCourseId + '/' + item.changeReason
        })
      },
      downloadExcel () {
        window.open(this.exportLink, '_blank')
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.signupEnd)
        this.formInline.signupBegin = val
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.signupBegin = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.signupBegin)
        let date2 = moment(val)
        this.formInline.signupEnd = val
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.signupEnd = ''
        }
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/member/coursenumlist.do', {
          params: {
            storeId: this.storeId,
            pageSize: this.pageSize,
            pageNum: num,
            createTimeBegin: this.createTimeBegin,
            createTimeEnd: this.createTimeEnd,
            memberMobile: this.formInline.memberMobile,
            memberName: this.formInline.memberName,
            changeReason: this.formInline.changeReason,
            causeType: this.formInline.causeType
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
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
