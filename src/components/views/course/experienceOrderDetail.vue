<template>
  <div class="drop-course" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程订单</el-breadcrumb-item>
        <el-breadcrumb-item>体验课订单</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data" id="experience">
      <el-form label-width="100px">
        <el-form-item label="学员账号:">
          {{ formData.memberMobile }}
        </el-form-item>
        <el-form-item label="课程名称:">
          {{ formData.courseName }}
        </el-form-item>
        <el-form-item label="课程类型:">
          体验课
        </el-form-item>
        <el-form-item label="课程图片:">
          <img :src="formData.picturePath">
        </el-form-item>
        <el-form-item label="课程介绍:">
          <el-col :span="12">
            <p v-html="formData.introduce"></p>
          </el-col>
        </el-form-item>
        <el-form-item label="课节数量:">
          {{ formData.courseNum }}
        </el-form-item>
        <el-form-item label="课节单价:">
          ¥{{ formData.price }}
        </el-form-item>
        <el-form-item label="教练等级:">
          {{ formData.grade | formatCourseLevel }}
        </el-form-item>
        <el-form-item label="上课时间:">
          {{ formData.classTime }}
        </el-form-item>
        <el-form-item label="课程教练:">
          {{ formData.coachName }}
        </el-form-item>
        <el-form-item label="二维码:">
          <img :src="qrCodeUrl">
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="myPrint('order')">打印票码</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 打印信息 -->
    <div id="order" style="display: none">
      <div style="font-family: '微软雅黑';">
        <h1 style="font-size: 16px;color: #000;text-align: center; margin: 0;">{{ storeName }}</h1>
        <h3 style="font-size: 14px; text-align: center; margin: 0;">WORLD ICE AREAN</h3>
        <p style="font-size: 16px; margin-bottom: 1px;
          color: #000; text-align: center; padding-bottom: 8px; border-bottom: 1px dashed #222;
          margin-top: 12px;">收款票据</p>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">学员姓名:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">{{ formData.memberName }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">学员电话:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">{{ formData.memberMobile }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">课程名称:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">{{ formData.courseName }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">课程类型:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right;">体验课</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">课节数量:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">{{ formData.courseNum }}节</p>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px;">课节单价:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">¥{{ formData.price }}</p>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px;">教练等级:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">{{ formData.grade | formatCourseLevel }}</p>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px;">教练姓名:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">{{ formData.coachName }}</p>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px;">上课时间:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">{{ formData.classTime }}</p>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px; padding-right: 12px;">
          <span style="padding-left: 12px; padding-right: 5px;">缴费金额:</span>
          <p style="flex-grow: 1; margin: 0; text-align: right">¥{{ formData.price }}</p>
        </div>
        <div style="display: flex; justify-content: center; margin: 15px 0;">
          <img :src="qrCodeUrl" style="width: 130px; height: 130px;">
        </div>
        <p style="text-align: center; font-size: 12px;">闸机扫码入场</p>
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
      this.fetchData()
    },
    data () {
      return {
        formData: null,
        loading: false
      }
    },
    computed: {
      qrCodeUrl () {
        return 'data:image/png;base64,' + this.formData.qrCodeUrl
      },
      storeName () {
        return JSON.parse(sessionStorage.getItem('store')).v
      }
    },
    methods: {
      printTicket (data) {
        // 打印体验课票码
        let list = []
        list.push({
          code: this.formData.qrInfo,
          price: this.formData.price,
          useDate: '',
          type: '体验课'
        })
        sessionStorage.setItem('ticketList', JSON.stringify(list))
        window.open('./static/sample/index.html', '_blank')
      },
      goBack () {
        this.$router.push({
          path: '/tasteCourseBuy'
        })
      },
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
      fetchData () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/order/experience-by-order/find.do', {
          params: {
            courseCoachId: this.$route.params.oid
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .drop-course{
    .el-form-item{
      margin-bottom: 5px;
    }
    .title{
      font-size: 14px;
      color: #333;
    }
    .form-label{
      font-size: 14px;
      color: #20A0FF;
      margin-top: 10px;
    }
    .form-data{
      padding-left: 20px;
    }
  }
</style>
