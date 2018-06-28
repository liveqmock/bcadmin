<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>体验课购买</el-breadcrumb-item>
        <el-breadcrumb-item>选择教练</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="教练姓名">
          <el-input type="text" v-model="formInline.title" placeholder="输入教练姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.grade" placeholder="请选择">
            <el-option :label="item.systemName" :value="item.systemValue" v-for="item in coachTypes" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="教练姓名" prop="name">
        </el-table-column>
        <el-table-column label="等级" prop="grade">
          <template scope="scope">
            {{ scope.row.grade | formatCourseLevel }}
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price">
        </el-table-column>
        <el-table-column label="教龄" prop="coachYears">
          <!-- <template scope="scope">
            <el-select v-model="scope.row.courseContent" placeholder="请选择">
              <el-option :label="item.label" :value="item.value" v-for="item in courseContents" :key="item.id"></el-option>
          </el-select>
          </template> -->
        </el-table-column>
        <el-table-column label="时间" width="200">
          <template scope="scope">
            {{scope.row.theDay + ' ' + scope.row.classTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="info" size="small"
                       @click="check(scope.row)">选定</el-button>
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
          <el-button type="primary" @click="nextStep(courseId)">下一步</el-button>
          <el-button @click="cancelDialog">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import { tokenMixin } from '@/common/mixin/token.js'
  export default {
    mixins: [tokenMixin],
    created () {
      this.getDetail()
      this.getCoachType()
    },
    data () {
      return {
        formInline: {
          title: '',
          grade: ''
        },
        tableData: [],
        formData: {
          courseType: '',
          courseLevel: ''
        },
        QRcode: '',
        mobile: '',
        courseContents: [],
        fetchCodeMsg: false,
        timerCodeMsg: '获取验证码',
        coachTypes: [],
        rules: {
          courseType: [
            { required: true, message: '请选择课程类型' }
          ],
          courseLevel: [
            { required: true, message: '请选择课程等级' }
          ]
        },
        courseTypes: [],
        courseLevels: [],
        coachId: 0,
        courseId: 0,
        day: '',
        memberId: '',
        price: 0,
        timeOfDay: '',
        grade: '',
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        timer: null
      }
    },
    methods: {
      check (item) {
        this.coachId = item.id
        this.day = item.theDay
        this.price = item.price
        this.timeOfDay = item.classTime
        this.coachGrade = item.grade
        this.showSendCode = true
        // this.$router.push({
        //   path: '/checkTime/' + id + '/' + this.$route.params.courseMemberId + '/' + this.$route.params.courseType + '/' + this.$route.params.courseLevel
        // })
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getDetail(this.currentPage)
        }
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/employee/course-experience/coach-search.do', {
          params: {
            grade: that.formInline.grade,
            name: that.formInline.title,
            classTime: that.$route.params.classTime,
            theDay: that.$route.params.theDay,
            storeId: that.storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.tableData = res.data.data
            that.loading = false
          } else {
            that.$message({
              type: 'error',
              message: '获取数据失败',
              duration: 1000
            })
          }
        }).catch(err => {
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
          console.log(err)
        })
      },
      getCoachType () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'coach_grade'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.coachTypes = res.data.data
          }
        })
      },
      nextStep (id) {
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
              that.memberId = res.data.data.memberId
              that.buyToPay()
            } else {
              that.$message({
                message: '验证失败：' + res.data.message,
                type: 'error'
              })
            }
          }).catch((error) => {
            that.isLoading = false
            console.log(error)
          })
        } else if (that.QRcode === '' && that.mobile === '') {
          // 没填手机号啥的，游客就是空
          that.buyToPay(that.memberId)
        }
      },
      buyToPay () {
        // 跳转到订单确认页
        this.$router.push({
          path: '/experienceOrderConfirm',
          query: {
            coachId: this.coachId,
            memberId: this.memberId,
            day: this.day,
            timeOfDay: this.timeOfDay,
            price: this.price,
            coachGrade: this.coachGrade
          }
        })
      },
      countTime () {
        console.log('倒计时。。。')
        var that = this
        var countTime = 59
        that.timerCodeMsg = countTime + 'S后重新发送'
        that.timer = setInterval(function () {
          countTime--
          that.timerCodeMsg = countTime + 'S后重新发送'
          if (countTime < 0) {
            clearInterval(that.timer)
            that.fetchCodeMsg = false
            that.timerCodeMsg = '重新发送'
          }
        }, 1000)
      },
      cancelDialog () {
        this.showSendCode = false
        this.fetchCodeMsg = false
        this.timerCodeMsg = '发送验证码'
        this.QRcode = ''
        this.mobile = ''
        clearInterval(this.timer)
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
        let area, mobile
        if (that.mobile.toString().indexOf('852') > -1) {
          area = 852
          mobile = that.mobile.split('852')[1]
        } else {
          area = 86
          mobile = that.mobile
        }
        that.fetchCodeMsg = true
        axios.get(URL.api_name + 'memberapi/api/sendCheckCode.do', {
          params: {
            area: area, // 大陆：86，香港 852 默认86
            mobile: mobile,
            type: 41,
            token: this.token
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.countTime()
          } else {
            that.fetchCodeMsg = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .logo-img{
    max-width: 50%;
    height: auto;
    border: 1px solid #ebebeb;
  }
.stepsss{text-align: center;}
</style>
