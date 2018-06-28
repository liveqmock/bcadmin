<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="教练等级">
          <el-select v-model="formInline.coachLevel">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(e, index) in levels"
                       :key="index"
                       :label="e.systemName"
                       :value="e.systemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员手机号">
          <el-input type="text" v-model="formInline.memberMobile" placeholder="请输入会员手机号..."></el-input>
        </el-form-item>
        <el-form-item label="学员姓名：">
          <el-input v-model="formInline.memberName" placeholder="请输入学员姓名..."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tabPane">
      <a href="javascript:;" class="tabChange" @click="goNext1">正常订单</a>
      <a href="javascript:;" class="tabChange" @click="goNext2">异常订单</a>
      <a href="javascript:;" class="tabChange current">体验课订单</a>
    </div>
    <div class="table-data courseData"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="学员信息">
          <template scope="scope">
            {{ scope.row.memberName }}/{{ scope.row.memberMobile }}
          </template>
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称">
        </el-table-column>
        <el-table-column label="课节单价/节数">
          <template scope="scope">
            {{ scope.row.coursePrice + '/' + scope.row.courseNum }}
          </template>
        </el-table-column>
        <el-table-column label="课程周期">
          <template scope="scope">
            {{ scope.row.startTime }} - {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="relationCoach" label="教练">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="info" @click="goDetail(scope.row.courseCoachId)">查看详情</el-button>
            <!--<el-button type="primary" size="small" @click="printTicket(scope.row)">打印票码</el-button>-->
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
      // this.getCourseType()
      // this.getCourseTime()
      this.getLeves()
    },
    data () {
      return {
        formInline: {
          coachLevel: '',
          courseType: '',
          isstart: '',
          memberMobile: '',
          memberName: ''
        },
        types: [{
          systemName: '未开课',
          systemCode: 0
        }, {
          systemName: '已开课',
          systemCode: 1
        }],
        levels: [],
        courseCoachId: '',
        QRcode: '',
        mobile: '',
        courseId: '',
        courseLevel: '',
        userId: '',
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        courseTypes: [],
        courseTimes: [],
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        fetchCodeMsg: false,
        loading: false
      }
    },
    computed: {
      createTimeBegin () {
        if (this.formInline.signupBegin !== '') {
          return moment(this.formInline.signupBegin).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      createTimeEnd () {
        if (this.formInline.signupEnd !== '') {
          return moment(this.formInline.signupEnd).format('YYYY-MM-DD')
        } else {
          return ''
        }
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      printTicket (data) {
        // 打印体验课票码
        let list = []
        list.push({
          code: data.courseCode,
          price: data.coursePrice,
          useDate: '',
          type: '体验课'
        })
        sessionStorage.setItem('ticketList', JSON.stringify(list))
        window.open('./static/sample/index.html', '_blank')
      },
      goDetail (id) {
        this.$router.push({
          path: '/experienceOrderDetail/' + id
        })
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      getCourseType () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'course_type'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.courseTypes = res.data.data
          }
        })
      },
      getCourseTime () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'course_TimeLines'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.courseTimes = res.data.data
          }
        })
      },
      getLeves () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'coach_grade'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.levels = res.data.data
          }
        })
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
        axios.get(URL.api_name + 'backofficeapi/course/order/experience/list.do', {
          params: {
            pageSize: that.pageSize,
            pageNum: num,
            courseLevel: this.formInline.coachLevel,
            memberMobile: this.formInline.memberMobile,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            memberName: this.formInline.memberName
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
      goNext1 () {
        this.$router.push({
          path: '/courseOrder'
        })
      },
      goNext2 () {
        this.$router.push({
          path: '/courseOrder-unusual'
        })
      },
      del (id) {
        let that = this
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/course/type/delete.do', {
            params: {
              id: id
            }
          }).then(function (response) {
            that.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000
            })
            that.getListData(that.currentPage)
          }, function (error) {
            that.$message({
              type: 'error',
              message: '删除失败',
              duration: 1000
            })
            console.log(error)
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped>
.el-button--small{ margin:5px 0;}
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
.tabPane{ padding:0 20px; margin:0 0 20px 0; border-bottom: 1px solid #ddd; }
.tabPane a{ margin:0 25px 0 0;
  color:#444;
  text-decoration: none;
  padding: 20px 10px 15px 10px;
  border-bottom: solid 3px #fff;
  display: inline-block;
  position: relative}
  .tabPane a.current{ color:#20a0ff; border-bottom:solid 3px #20a0ff; }
  .courseData *{font-size:12px;}
</style>
