<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="180px">
        <el-form-item label="课程名称：">
          <el-col :span="12">
            <p>{{ formData.courseName }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程教练：">
          <el-col :span="12">
            <p>{{ formData.relationCoach }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程图片：">
          <el-col :span="12">
            <img :src="formData.picturePath" class="logo-img">
          </el-col>
        </el-form-item>
        <el-form-item label="课程介绍：">
          <el-col :span="12">
            <p v-html="formData.introduce"></p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程简介：">
          <el-col :span="12">
            <p>{{ formData.brief }}</p>
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
        <el-form-item label="　">
          <el-button type="primary" @click="overOrder">完成订单</el-button>
          <!--<el-button @click="myPrint('student')">打印票据</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <!-- 打印信息 -->
    <div class="form-data" id="student" style="padding-bottom: 20px; display: none">
      <p style="text-align: center;">电子小票</p>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">课程名称:</span>
        <span class="text" style="display: inline-block;">{{ formData.courseName }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">课程类型:</span>
        <span class="text" style="display: inline-block;">{{ formData.courseType }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">课程数量:</span>
        <span class="text" style="display: inline-block;">{{ formData.courseNum }}节</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; height: 24px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">课节单价:</span>
        <span class="text" style="display: inline-block;">¥{{ formData.coursePrice }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; height: 24px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">课程教练:</span>
        <span class="text" style="display: inline-block;">{{ formData.relationCoach }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; padding-bottom: 10px;">
        <p class="text" style="text-align: center;">请保留此票据，作为凭证</p>
      </div>
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
        axios.get(URL.api_name + 'backofficeapi/employee/course/coach/door/detail.do', {
          params: {
            courseCoachId: that.$route.params.courseCoachId
            // storeId: that.storeId
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
.form-data { padding-bottom:30px; }
</style>
