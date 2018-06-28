<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程订单确认</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper stepsss">
      <el-steps :space="150" :active="3" finish-status="success">
        <el-step title="选课"></el-step>
        <el-step title="确认订单"></el-step>
        <el-step title="付款"></el-step>
        <el-step title="完成订单"></el-step>
        <el-step title="选择时间/教练"></el-step>
      </el-steps>
    </div>
    <div class="form-data" id="order">
      <el-form label-width="180px">
        <el-form-item label="课程介绍：">
          <el-col :span="12">
            <p v-html="formData.brief"></p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程名称：">
          <el-col :span="12">
            <p>{{ formData.courseName }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程数量：">
          <el-col :span="12">
            <p>{{ formData.courseNum }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课节单价：">
          <el-col :span="12">
            <p>￥{{ formData.coursePrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程类型：">
          <el-col :span="12">
            <p>{{ formData.courseType }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="学员信息：">
          <el-col :span="12">
            <p>{{ formData.memberName }}/{{ formData.memberMobile }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程图片：">
          <el-col :span="12">
            <img :src="formData.picturePath" class="logo-img">
          </el-col>
        </el-form-item>
        <el-form-item label="课程教练：">
          <el-col :span="12">
            <p>{{ formData.relationCoach }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="上课时间：">
          <el-row v-for="(s, i) in formData.scheduleList" :key="i">
            <el-col :span="12">
              <span>{{ s.date }}</span>
              <span class="s-label">({{ s.week }})</span>
              <span>{{ s.cycle }}</span>
              <span class="s-label">{{ s.coachName }}</span>
              <span class="s-label">第{{ s.position }}节课</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="overOrder">完成订单</el-button>
          <!--<el-button @click="myPrint('order')">打印票据</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getDetail()
    },
    data () {
      return {
        formData: {},
        authorizeDialog: false,
        authorForm: {
          mobile: '',
          password: ''
        },
        formInline: {
          money: '',
          course: ''
        },
        courseOrderInfo: {},
        moneys: [],
        courses: [],
        hasAtuthory: 0,
        storeId: JSON.parse(sessionStorage.getItem('store')).k
      }
    },
    methods: {
      myPrint (id) {
        // this.formData.goOffWorkTime = moment().format('YYYY-MM-DD HH:mm:ss')
        var obj = document.getElementById(id)
        var newWindow = window.open('打印窗口', '_blank')
        var docStr = obj.innerHTML
        newWindow.document.write(docStr)
        newWindow.document.close()
        newWindow.print()
        newWindow.close()
      },
      overOrder () {
        this.$router.push({
          path: '/studentsCourse'
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/choose/one/detail.do', {
          params: {
            courseMemberIdTotal: that.$route.params.courseCoachId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
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
  .s-label{
    margin-right: 15px;
  }
</style>
