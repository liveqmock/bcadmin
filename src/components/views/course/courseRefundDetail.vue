<template>
  <div class="drop-course" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>退课管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <div class="form-label">会员信息</div>
      <div class="member-info">
        <el-form label-width="100px">
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
          <el-table-column prop="orderCode" label="订单编号">
          </el-table-column>
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
          <el-table-column label="备注" prop="refundRemark"></el-table-column>
        </el-table>
      </div>
      <div class="member-info">
        <el-form label-width="100px">
          <el-form-item label="审核意见：">
            <el-col :span="12" v-if="formData.courseRefundDtos.length > 0 && formData.courseRefundDtos[0].applyStatus === 1">
              <el-input type="textarea" v-model="description" :row="3"></el-input>
            </el-col>
            <el-col :span="12" v-if="formData.courseRefundDtos.length > 0 && formData.courseRefundDtos[0].applyStatus !== 1">
              {{ formData.courseRefundDtos[0].auditopinion }}
            </el-col>
          </el-form-item>
          <el-form-item label="">
            <el-button v-if="formData.courseRefundDtos.length > 0 && formData.courseRefundDtos[0].applyStatus === 1"
                       type="primary"
                       @click="confirm(2)"
                       :loading="loading1">
              {{ loading1 ? '正在提交' : '同意' }}
            </el-button>
            <el-button v-if="formData.courseRefundDtos.length > 0 && formData.courseRefundDtos[0].applyStatus === 1"
                       type="info"
                       @click="confirm(3)"
                       :loading2="loading2">
              {{ loading2 ? '正在提交' : '拒绝' }}
            </el-button>
            <el-button @click="$router.go('-1')">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="退款清单" :visible.sync="dialogFormVisible2">
      <el-row>
        <el-col :offset="6">
          <p class="pay-item tip">
            课程退款由财务线下退款
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="6">
          <p class="pay-item">
            支付记录
          </p>
        </el-col>
      </el-row>
      <el-row v-for="(c, i) in payments" :key="i">
        <el-col :offset="8">
          <p class="pay-item">
            <span>{{ c.orderPayType }}：</span>
            <span>¥{{ c.orderAmount }}</span>
          </p>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </div>
    </el-dialog>
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
        loading1: false,
        loading2: false,
        description: '',
        dialogFormVisible2: false,
        payments: []
      }
    },
    methods: {
      closeDialog () {
        this.dialogFormVisible2 = false
        this.$router.push({
          path: '/courseRefund'
        })
      },
      // 微信退款
      wxpayrefund (data) {
        let that = this
        axios.get(URL.api_name + 'payapi/wx/wxpayrefund.do', {
          params: {
            out_trade_no: data.orderCode,
            refund_fee: data.orderAmount,
            total_fee: data.orderAmount,
            userId: data.memberId,
            transaction_id: '',
            refundMoney: data.refundMoney
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.dialogFormVisible2 = true
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      // 支付宝退款
      alirefund (data) {
        let that = this
        axios.get(URL.api_name + 'payapi/alipay/alirefund.do', {
          params: {
            outTradeNo: data.orderCode,
            refundAmount: data.orderAmount,
            userId: data.memberId,
            transaction_id: '',
            refundMoney: data.refundMoney
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.dialogFormVisible2 = true
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      // 公众号退款
      wechatRefund (data) {
        let that = this
        axios.get(URL.api_name + 'payapi/wx/wxpublicpayrefund.do', {
          params: {
            out_trade_no: data.orderCode,
            refund_fee: data.orderAmount,
            total_fee: data.orderAmount,
            userId: data.memberId,
            transaction_id: ''
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.dialogFormVisible2 = true
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      confirm (status) {
        var that = this
        if (status === 2) {
          this.loading1 = true
        }
        if (status === 3) {
          this.loading2 = true
        }
        axios.get(URL.api_name + 'backofficeapi/course/refund/courserefundaudit.do', {
          params: {
            auditopinion: this.description,
            refundId: this.$route.params.courseId,
            applyStatus: status
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            if (status === 2) {
              // 同意
              that.description = ''
              that.payments = res.data.data
              if (that.payments) {
                // 循环退款方式
                for (let p of res.data.data) {
                  if (p.orderPayType === '微信') {
                    // 掉微信退款接口
                    that.wxpayrefund(p)
                  } else if (p.orderPayType === '支付宝') {
                    // 掉支付宝退款接口
                    that.alirefund(p)
                  } else if (p.orderPayType === '公众号') {
                    // 掉公众号退款接口
                    that.wechatRefund(p)
                  } else {
                    // 线下退款
                    that.dialogFormVisible2 = true
                  }
                }
              } else {
                // 驳回
//                this.$router.push({
//                  path: '/courseRefund'
//                })
                that.$message({
                  type: 'success',
                  message: res.data.message
                })
              }
            } else if (status === 3) {
              that.$message({
                type: 'success',
                message: res.data.message
              })
              // 驳回
              this.$router.push({
                path: '/courseRefund'
              })
            }
          } else {
            that.loading1 = false
            that.loading2 = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      fetchData () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/displayrefcourse.do', {
          params: {
            refundId: this.$route.params.courseId,
            memberId: this.$route.params.memberId
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
  .tip{
    color: #13CE66;
  }
  .pay-item{
    line-height: 20px;
  }
</style>
