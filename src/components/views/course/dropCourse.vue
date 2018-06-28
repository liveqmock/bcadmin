<template>
  <div class="drop-course">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>学员课节管理</el-breadcrumb-item>
        <el-breadcrumb-item>退款</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <div class="form-label">会员信息</div>
      <div class="member-info">
        <el-form label-width="130px">
          <el-form-item label="会员编号：">{{ formData.memberId }}</el-form-item>
          <el-form-item label="会员姓名：">{{ formData.memberName }}</el-form-item>
          <el-form-item label="联系方式：">{{ formData.memberMobile }}</el-form-item>
          <el-form-item label="会员等级：">{{ formData.grade | formatMemberLevel }}</el-form-item>
          <el-form-item label="会员积分：">{{ formData.point }}</el-form-item>
        </el-form>
      </div>
      <div class="form-label">购课信息</div>
      <div class="member-info">
        <el-table :data="formData.courseRefundDtos" border>
          <el-table-column label="订单号" prop="orderCode"></el-table-column>
          <el-table-column label="课程名称" prop="courseName"></el-table-column>
          <el-table-column label="课程等级">
            <template scope="scope">
              {{ scope.row.courseLevel | formatCourseLevel }}
            </template>
          </el-table-column>
          <el-table-column label="课程内容" prop="brief"></el-table-column>
          <el-table-column label="课程数量" prop="courseNum"></el-table-column>
          <el-table-column label="每节时长" prop="coursePeriod"></el-table-column>
          <el-table-column label="课程价格" prop="coursePrice"></el-table-column>
          <el-table-column label="剩余课节" prop="basicCourseNumLeft"></el-table-column>
          <el-table-column label="退款金额" prop="refundAmount"></el-table-column>
          <el-table-column label="课程卡券" prop="orderCoupon"></el-table-column>
          <el-table-column label="折扣" prop="disCount"></el-table-column>
          <el-table-column label="支付方式" prop="paymentType"></el-table-column>
        </el-table>
      </div>
      <el-form label-width="130px">
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input v-model="remark" type="textarea" :rows="3" placeholder="备注信息(可输入退款人账户信息)"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="applyRefund" type="primary" :loading="loading">{{ loading ? '正在提交' : '申请退款' }}</el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
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
      this.fetchData()
    },
    data () {
      return {
        formData: {},
        loading: false,
        remark: ''
      }
    },
    methods: {
      applyRefund () {
        let that = this
        for (let c of this.formData.courseRefundDtos) {
          c.refundRemark = this.remark
          c.storeId = JSON.parse(sessionStorage.getItem('store')).k
          c.memberMobile = this.formData.memberMobile
        }
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/course/refund/add.do', this.formData.courseRefundDtos).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '申请成功，待财务人员审批，进行线下退款'
            })
            this.$router.push({
              path: '/courseRefund'
            })
          } else {
            that.loading = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
          that.loading = false
        })
      },
      fetchData () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/displayrefcourse.do', {
          params: {
            memberId: this.$route.params.courseId,
            refundId: '',
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          } else {
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
<style lang="less" scoped>
  .member-info{
    margin-bottom: 10px;
  }
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
      margin-bottom: 10px;
    }
    .form-data{
      padding-left: 20px;
    }
  }
</style>
