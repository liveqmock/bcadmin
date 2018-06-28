<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>购课</el-breadcrumb-item>
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
    <div class="form-data">
      <el-form label-width="180px">
        <el-form-item label="课程名称：">
          <el-col :span="12">
            <p>{{ formData.courseName }}</p>
          </el-col>
        </el-form-item>
        <!--<el-form-item label="教练等级：">
          <el-col :span="12">
            <p>{{ formData.courseLevel }}</p>
          </el-col>
        </el-form-item>-->
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
        <el-form-item label="每节时长：">
          <el-col :span="12">
            <p>{{ formData.coursePeriod }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课节单价：">
          <el-col :span="12">
            <p>¥{{ formData.coursePrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程总价：">
          <el-col :span="12">
            <p>¥{{ formData.courseTotalPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="订单总金额：">
          <el-col :span="12">
            <p>¥{{ formData.orderTotalPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="现金券折扣：">
          <el-col :span="12">
            <p>¥{{ formData.cashCouponDiscountPrice ? formData.cashCouponDiscountPrice : 0 }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程券折扣：">
          <el-col :span="12">
            <p>¥{{ formData.courseCouponDiscountPrice ? formData.courseCouponDiscountPrice : 0 }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="系统折扣：">
          <el-col :span="12">
            <p>¥{{ formData.systemDiscountPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="会员折扣：">
          <el-col :span="12">
            <p>¥{{ formData.memberDiscountPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="实付金额：">
          <el-col :span="12">
            <p>¥{{ formData.orderPaidPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="overOrder">完成订单</el-button>
          <!--<el-button type="info" @click="myPrint('student')">打印票据</el-button>-->
          <el-button @click="sortCourse">排课</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 打印信息 -->
    <div id="student" style="display: none">
      <div style="font-family: '微软雅黑'">
        <h1 style="font-size: 16px;color: #000;text-align: center; margin: 0;">冰纷万象·南山冰场</h1>
        <h3 style="font-size: 14px; text-align: center; margin: 0;">WORLD ICE AREAN</h3>
        <p style="font-size: 16px; margin-bottom: 1px;
          color: #000; text-align: center; padding-bottom: 8px; border-bottom: 1px dashed #222;
          margin-top: 12px;">收款票据</p>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">订单编号:</span>
          <p style="flex-grow: 1; margin: 0;">{{  }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">创建时间:</span>
          <p style="flex-grow: 1; margin: 0;">{{  }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; border-bottom: 1px dashed #000">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">收银编号:</span>
          <p style="flex-grow: 1; margin: 0;">{{  }}</p>
        </div>
        <!-- 销售明细 -->
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px;">
          <span style="padding-left: 12px;">销售明细:</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px;">
          <span style="padding-left: 12px;">{{ formData.courseName }}</span>
        </div>
        <!-- 分割线 -->
        <div style="border-bottom: 1px dashed #000;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">总计金额:</span>
          <span style="flex-grow: 1">¥{{  }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">系统折扣:</span>
          <span style="flex-grow: 1">¥{{  }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">实付金额:</span>
          <span style="flex-grow: 1">¥{{  }}</span>
        </div>
        <p style="text-align: center; font-size: 12px;">请保留次票据,作为退换凭证</p>
        <!-- 分割线 -->
        <div style="border-top: 1px dashed #ebebeb; height: 10px;"></div>
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
      sortCourse () {
        this.$router.push({
          path: '/checkCourseType/' + this.$route.params.courseLevel + '/' + this.formData.courseMemberId
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/buy/order/detail.do', {
          params: {
            courseId: that.$route.params.courseId,
            courseLevel: that.$route.params.courseLevel,
            orderId: that.$route.params.orderId
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
</style>
