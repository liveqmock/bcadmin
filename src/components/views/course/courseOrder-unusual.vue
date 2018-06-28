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
        <el-form-item label="课程类型">
          <el-select v-model="formInline.courseType">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(e, index) in courseTypes"
                       :key="index"
                       :label="e.name"
                       :value="e.id">
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="课程状态">
          <el-select v-model="formInline.isstart">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(e, index) in types"
                       :key="index"
                       :label="e.systemName"
                       :value="e.systemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="formInline.signupBegin"
            type="date"
            :editable='false'
            @change="beginTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
          <div class="Zvertical">至</div>
          <el-date-picker
            v-model="formInline.signupEnd"
            type="date"
            :editable='false'
            @change="endTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学员手机号：">
          <el-input v-model="formInline.memberMobile" placeholder="请输入学员手机号"></el-input>
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
      <a href="javascript:;" class="tabChange current">异常订单</a>
      <a href="javascript:;" class="tabChange" @click="goNext2">体验课订单</a>
    </div>
    <div class="table-data courseData"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="学员信息">
          <template scope="scope">
            <div v-if="scope.row.memberList.length > 0">
              <p v-for="(item, i) in scope.row.memberList" :key="i">
                <span>{{ item ? item.name : '' }}/</span><span>{{ item ? item.mobile : '' }}</span>
              </p>
            </div>
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
            {{ scope.row.courseStartTime + '-' + scope.row.courseEndTime }}
          </template>
        </el-table-column>
        <el-table-column prop="relationCoach" label="关联教练">
        </el-table-column>
        <el-table-column prop="courseType" label="课程规模">
        </el-table-column>
        <el-table-column label="上课人数">
          <template scope="scope">
            {{ scope.row.curnum + '/' + scope.row.maxnum }}
          </template>
        </el-table-column>
        <el-table-column label="课程状态">
          <template scope="scope">
            {{ scope.row.isstart === 0 ? '未开课' : '已开课' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button type="info" size="small" v-show="scope.row.maxnum > scope.row.curnum" @click="checkAddStudent(scope.row.courseCoachId)">加入学员</el-button>
            <!-- <el-button type="info" size="small" @click="">开课</el-button> -->
            <el-button
              v-show="scope.row.memberList.length > 0"
              type="info" size="small" @click="changeOne(scope.row.courseCoachId)">调课</el-button>
            <el-button
              v-show="scope.row.memberList.length > 0"
              type="info" size="small" @click="changeAll(scope.row.courseCoachId)">换课/退课</el-button>
            <el-button
              v-show="scope.row.memberList.length > 0"
              type="info" size="small" @click="courseTable(scope.row.courseCoachId)">查看课表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="验证会员信息" :visible.sync="showSendCode">
      <el-form label-width="100px">
        <el-form-item label="输入手机号：">
          <el-col :span="12">
            <el-input v-model.number="mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="　　验证码：">
          <el-col :span="6">
            <el-input v-model="QRcode"></el-input>
          </el-col>
          <el-button type="info" :disabled="fetchCodeMsg" @click="setCode">{{ timerCodeMsg }}</el-button>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="nextStep()">下一步</el-button>
          <el-button @click="showSendCode = false">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import moment from 'moment'
  import { tokenMixin } from '@/common/mixin/token'
  export default {
    mixins: [tokenMixin],
    created () {
      this.getListData(this.currentPage)
      this.getCourseType()
      this.getCourseTime()
      this.getLeves()
    },
    data () {
      return {
        formInline: {
          coachLevel: '',
          courseType: '',
          signupBegin: '',
          signupEnd: '',
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
        timerCodeMsg: '获取验证码',
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
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      getCourseType () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/type/list.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
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
        axios.get(URL.api_name + 'backofficeapi/course/order/list.do', {
          params: {
            storeId: that.storeId,
            pageSize: that.pageSize,
            pageNum: num,
            coachLevel: this.formInline.coachLevel,
            courseType: this.formInline.courseType,
            isstart: this.formInline.isstart,
            createTimeBegin: this.createTimeBegin,
            createTimeEnd: this.createTimeEnd,
            queryType: 'abnormal',
            memberMobile: this.formInline.memberMobile,
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
      checkAddStudent (courseCoachId) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/order/check/join/member.do', {
          params: {
            courseCoachId: courseCoachId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.addStudents(courseCoachId)
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      addStudents (courseCoachId) {
        // 1
        let that = this
        that.courseCoachId = courseCoachId
        axios.get(URL.api_name + 'backofficeapi/course/order/join/member.do', {
          params: {
            courseCoachId: courseCoachId
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.showSendCode = true
            that.courseId = res.data.data.courseId
            that.courseLevel = res.data.data.courseLevel
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((error) => {
          that.isLoading = false
          console.log(error)
        })
      },
      // 直接排课
      arrangeCourse (courseCoachId, courseLevel, memberId) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/order/join/confirm.do', {
          params: {
            courseCoachId: courseCoachId,
            courseLevel: courseLevel,
            memberId: memberId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            console.log(res.data.data)
            // 跳转到订单详情页面
            that.$router.push({
              path: '/addStudentDetailF/' + res.data.data.ordreId
            })
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      nextStep (courseCoachId) {
        let that = this
        let area, mobile
        if (that.mobile.toString().indexOf('852') > -1) {
          area = 852
          mobile = that.mobile.toString().split('852')[1]
        } else {
          area = 86
          mobile = that.mobile
        }
        if (that.QRcode !== '' && that.mobile !== '') {
          axios.get(URL.api_name + 'memberapi/api/checkUserInfo.do', {
            params: {
              area: area,
              checkCode: that.QRcode,
              mobile: mobile,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              // 返回会员id
              that.userId = res.data.data.memberId
              that.arrangeCourse(that.courseCoachId, that.courseLevel, that.userId)
//              this.$router.push({
//                path: '/addStudentSure/' + that.courseCoachId + '/' + that.courseId + '/' + that.courseLevel + '/' + that.userId
//              })
            } else {
              that.$message({
                message: '验证失败：' + res.data.message,
                type: 'error'
              })
              that.mobile = ''
              that.QRcode = ''
            }
          }).catch((error) => {
            that.isLoading = false
            console.log(error)
          })
        } else {
          that.$message({
            message: '请输入手机号验证注册信息',
            type: 'error'
          })
        }
      },
      setCode () {
        // console.log('x')
        let that = this
        if (that.mobile === '') {
          that.$message({
            message: '请先输入手机号',
            type: 'error'
          })
          return false
        }
        let sec = 60
        that.fetchCodeMsg = true
        for (let i = 0; i <= 60; i++) {
          window.setTimeout(function () {
            if (sec > 0) {
              that.timerCodeMsg = sec + '秒后重发验证'
              sec--
            } else {
              that.fetchCodeMsg = false
              that.timerCodeMsg = '获取验证码'
              sec = 60 // 如果倒计时结束就让  获取验证码显示出来
            }
          }, i * 1000)
        }
        let area, mobile
        if (that.mobile.toString().indexOf('852') > -1) {
          area = 852
          mobile = that.mobile.toString().split('852')[1]
        } else {
          area = 86
          mobile = that.mobile
        }
        axios.get(URL.api_name + 'memberapi/api/sendCheckCode.do', {
          params: {
            area: area, // 大陆：86，香港 852 默认86
            mobile: mobile,
            type: 41,
            token: this.token
          }
        }).then((res) => {
          that.setToken()
          if (res.data.status === 'success') {
            this.$succssMsg(res.data.message)
          } else {
            this.$errMsg(res.data.message)
          }
        })
      },
      changeOne (courseCoachId, memberId) {
        this.$router.push({
          path: '/changeOneCourse/' + courseCoachId
        })
      },
      changeAll (courseCoachId) {
        this.$router.push({
          path: '/changeAllCourse/' + courseCoachId
        })
      },
      courseTable (courseCoachId) {
        this.$router.push({
          path: '/courseOrderTable/' + courseCoachId
        })
      },
      goNext1 () {
        this.$router.push({
          path: '/courseOrder'
        })
      },
      goNext2 () {
        this.$router.push({
          path: '/courseOrder-experience'
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
<style lang="less" scoped>
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
  .el-table__row .cell{
    overflow: auto;
  }
</style>
