<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程订单确认</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="180px">
        <el-form-item label="选择学员：">
          <el-col :span="12">
            <p>{{ formData.memberName }}/{{ formData.memberMobile }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程名称：">
          <el-col :span="12">
            <p>{{ formData.courseName }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程类型：">
          <el-col :span="12">
            <p>{{ formData.courseType }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程内容：">
          <el-col :span="12">
            <p>{{ formData.courseName }}</p>
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
        <el-form-item label="一句话介绍：">
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
        <el-form-item label="教练等级：">
          <el-col :span="12">
            <p>{{ formData.coachLevel | formatCourseLevel }}</p>
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
        <el-form-item label="课程教练：">
          <el-col :span="12">
            <p>{{ formData.courseCoach }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程原价：">
          <el-col :span="12">
            <p>￥{{ formData.courseTotalPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="基础余额：">
          <el-col :span="12">
            <p>￥{{ formData.principalPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="补差价：" v-show="formData.differencePrice > 0">
          <el-col :span="12">
            <p>￥{{ formData.differencePrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="　" v-show="formData.principalPrice - formData.courseTotalPrice < 0 && formData.isPay !== 1">
          <el-button type="primary" @click="goPay">补差价</el-button>
          <el-button @click="authorizeDialog = true" :loading="loading">
            {{ loading ? '免单操作中...' : '免单' }}
          </el-button>
        </el-form-item>
        <el-form-item label="　" v-show="formData.principalPrice - formData.courseTotalPrice >= 0 || formData.isPay === 1">
          <el-button type="primary" @click="overOrder">完成订单</el-button>
          <!--<el-button @click="myPrint('student')">打印票据</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <!-- 打印信息 -->
    <div class="form-data" id="student" style="padding-bottom: 20px; display: none">
      <p style="text-align: center;">电子小票</p>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; height: 24px;">
        <span class="label" style="display: inline-block;width: 60px; text-align: right; margin-right: 5px;">学员:</span>
        <span class="text" style="display: inline-block;">{{ formData.memberMobile }}</span>
      </div>
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
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">教练等级:</span>
        <span class="text" style="display: inline-block;">{{ formData.coachLevel | formatCourseLevel }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; height: 24px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">教练:</span>
        <span class="text" style="display: inline-block;">{{ formData.courseCoach }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; height: 24px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">课程原价:</span>
        <span class="text" style="display: inline-block;">{{ formData.courseTotalPrice }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; padding-bottom: 10px;">
        <p class="text" style="text-align: center;">请保留此票据，作为凭证</p>
      </div>
    </div>
    <authorize-page :authorizeDialog="authorizeDialog"
                    :orderNo="$route.params.orderNo"
                    @authorize="authorize"
                    @cancelAuthorize="cancel"></authorize-page>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import AuthorizePage from '@/components/views/common/authorize'
  export default {
    created () {
      this.getDetail()
    },
    data () {
      return {
        formData: {},
        authorizeDialog: false,
        formInline: {
          money: '',
          course: ''
        },
        courseOrderInfo: {},
        moneys: [],
        courses: [],
        hasAtuthory: 0,
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        loading: false
      }
    },
    components: {
      AuthorizePage
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
          path: '/courseOrder'
        })
      },
      goPay () {
        this.$router.push({
          path: '/addStudentClosingPrice/' + this.$route.params.orderNo
        })
      },
      authorize (obj) {
        if (obj) {
          this.authorizer = obj.authorizer
          this.hasAtuthory = obj.hasPermission
          this.authorizeDialog = !this.authorizeDialog
          this.loading = true
          axios.get(URL.api_name + 'backofficeapi/course/order/join/freeSingle.do', {
            params: {
              orderId: this.$route.params.orderNo,
              authorizer: this.authorizer
            }
          }).then(ressss => {
            if (ressss.data.status === 'success') {
              this.$message({
                type: 'success',
                message: ressss.data.message
              })
              // 免单成功改变订单状态
              this.formData.isPay = 1
            } else {
              this.loading = false
              this.$message({
                type: 'error',
                message: ressss.data.message
              })
            }
          })
        }
      },
      cancel (c) {
        this.authorizeDialog = c
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/order/detail.do', {
          params: {
            orderId: that.$route.params.orderNo
            // storeId: that.storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data.arrangeOrderDto
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
