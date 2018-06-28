<template>
  <div class="choose-way">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>体验课购买</el-breadcrumb-item>
        <el-breadcrumb-item>订单支付</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data of0" v-if="order">
      <el-form label-width="140px">
        <el-form-item class="no-margin" label="订单总金额：">
          ¥{{ order.order.price.toFixed(2) }}
        </el-form-item>
        <el-form-item label="　">
          <el-checkbox v-model="shopCard"></el-checkbox>
          <span class="label">购物卡支付</span>
          <el-input :disabled="!shopCard" style="width: 200px" v-model.number="shopPay"></el-input>
        </el-form-item>
        <el-form-item label="　">
          <el-checkbox v-model="cashCard"></el-checkbox>
          <span class="label">现金支付</span>
          <el-input :disabled="!cashCard" style="width: 200px" v-model.number="cashPay"></el-input>
        </el-form-item>
        <el-form-item label="　">
          <el-checkbox v-model="postCard"></el-checkbox>
          <span class="label">银行卡支付</span>
          <el-input :disabled="!postCard" style="width: 200px" v-model.number="postPay"></el-input>
        </el-form-item>
        <!--<el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" :rows="3" v-model="remark"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item class="no-margin" label="应付金额：">
          ¥{{ order.order.paid.toFixed(2) }}
        </el-form-item>
        <el-form-item class="no-margin" label="实付金额：">
          ¥{{ payAmount.toFixed(2) }}
        </el-form-item>
        <el-form-item v-show="order.order.paid - payAmount > 0" class="no-margin" label="需继续支付：">
          ¥{{ continueAmount }}
        </el-form-item>
        <el-form-item v-show="order.order.paid - payAmount < 0" class="no-margin" label="找零：">
          ¥{{ changeAmount }}
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" v-show="order.order.paid - payAmount > 0" @click="continuePay">继续支付</el-button>
          <el-button :loading="loading" type="primary" v-show="order.order.paid - payAmount <= 0" @click="confirmPay">
            {{ loading ? '正在支付' : '完成支付' }}
          </el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择支付方式" :visible.sync="secondDialog">
      <el-row class="tc">
        <el-button class="w-btn" @click="chooseWX('weixin')">微信</el-button>
      </el-row>
      <el-row class="tc">
        <el-button class="w-btn" @click="chooseWX('alipay')">支付宝</el-button>
      </el-row>
      <el-row class="tc">
        <el-button @click="secondDialog = false">返回</el-button>
      </el-row>
    </el-dialog>
    <el-dialog title="获取支付码" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="12" :offset="6">
          <el-input :autofocus="true" @keyup.enter.native="payOrder" v-model="payCode" placeholder="支付码获取框"></el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="payOrder" :loading="wechatLoading">
          {{ wechatLoading ? '正在支付' : '确 定' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getOrderInfo()
    },
    data () {
      return {
        formData: {
          orderId: this.$route.params.orderId,
          coachId: this.$route.params.coachId,
          courseId: this.$route.params.courseId,
          day: this.$route.params.day,
          memberId: this.$route.params.memberId,
          price: this.$route.params.price,
          timeOfDay: this.$route.params.timeOfDay,
          storeId: JSON.parse(sessionStorage.getItem('store')).k
        },
        cashPay: 0,
        shopPay: 0,
        postPay: 0,
        remark: '',
        amount: 0,
        secondDialog: false,
        dialogFormVisible: false,
        shopCard: false,
        cashCard: false,
        postCard: false,
        payType: '',
        payCode: '',
        loading: false,
        detail: false,
        wechatLoading: false,
        detailData: {},
        order: null
      }
    },
    methods: {
      payOrder () {
        // 微信或支付宝支付完成后，需要手动去掉创建支付记录的接口
        var that = this
        that.wechatLoading = true
        if (that.payType === 'weixin') {
          // 微信支付
          axios.get(URL.api_name + 'payapi/wx/wxscancard.do', {
            params: {
              amount: this.order.order.paid,
              authCode: this.payCode,
              body: this.order.order.name,
              orderNo: this.order.order.code,
              totalfee: this.continueAmount,
              userId: this.order.order.userId
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '支付成功',
                duration: 2000,
                onClose: function () {
                  that.confirmOnlinePay()
                }
              })
            } else {
              that.wechatLoading = false
              that.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(err => {
            console.log(err)
            that.wechatLoading = false
            that.$message({
              type: 'error',
              message: '支付失败'
            })
          })
        } else if (that.payType === 'alipay') {
          // 支付宝支付
          axios.get(URL.api_name + 'payapi/alipay/aliscancard.do', {
            params: {
              amount: this.order.order.paid,
              authCode: this.payCode,
              body: this.order.order.name,
              orderNo: this.order.order.code,
              totalfee: this.continueAmount,
              userId: this.order.order.userId
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '支付成功',
                duration: 2000,
                onClose: function () {
                  that.confirmOnlinePay()
                }
              })
            } else {
              that.wechatLoading = false
              that.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(err => {
            console.log(err)
            that.wechatLoading = false
            that.$message({
              type: 'error',
              message: '支付失败'
            })
          })
        }
      },
      getOrderInfo () {
        // 获取初始订单信息
        var that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: that.$route.params.orderId
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.order = res.data.data
          }
        }).catch((err) => {
          console.log(err)
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
        })
      },
      confirmPay () {
        // 判断订单状态
        if (this.order.order.status === '已支付') {
          this.$message({
            type: 'error',
            message: '订单已支付'
          })
          return
        }
        // 确认收款后去创建支付记录
        let that = this
        that.loading = true
        this.formData.payments = []
        if (this.shopCard) {
          this.formData.payments.push({
            amount: that.shopPay,
            orderId: that.formData.orderId,
            status: '已支付',
            type: '购物卡'
          })
        }
        if (this.cashCard) {
          this.formData.payments.push({
            amount: this.cashPay,
            orderId: that.formData.orderId,
            status: '已支付',
            type: '现金'
          })
        }
        if (this.postCard) {
          this.formData.payments.push({
            amount: this.postPay,
            orderId: that.formData.orderId,
            status: '已支付',
            type: '刷卡'
          })
        }
        let memid = ''
        if (parseInt(that.formData.memberId) === -1) {
          memid = ''
        } else {
          memid = parseInt(that.formData.memberId)
        }
        axios.post(URL.api_name + 'backofficeapi/course/experience/payment.do', {
          coachId: parseInt(that.formData.coachId),
          courseId: parseInt(that.formData.courseId),
          day: that.formData.day,
          memberId: memid,
          orderId: parseInt(that.formData.orderId),
          payments: that.formData.payments,
          price: parseInt(that.formData.price),
          storeId: that.formData.storeId,
          timeOfDay: that.formData.timeOfDay
        }).then((res) => {
          if (res.data.status === 'success') {
            // 创建支付记录成功后，跳转到订单详情页面
            that.$message({
              type: 'success',
              message: res.data.message,
              duration: 1000,
              onClose: function () {
                that.$router.push({
                  path: '/experienceOrderDetail/' + res.data.data.courseCoachId
                })
                that.loading = false
              }
            })
          } else {
            that.loading = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          that.loading = false
          console.log(err)
          that.$message({
            type: 'error',
            message: '失败'
          })
        })
      },
      confirmOnlinePay () {
        let that = this
        // 确认收款后去创建支付记录
        this.formData.payments = []
        if (this.shopCard) {
          this.formData.payments.push({
            amount: this.shopPay,
            orderId: that.formData.orderId,
            status: '已支付',
            type: '购物卡'
          })
        }
        if (this.cashCard) {
          this.formData.payments.push({
            amount: this.cashPay,
            orderId: that.formData.orderId,
            status: '已支付',
            type: '现金'
          })
        }
        if (this.postCard) {
          this.formData.payments.push({
            amount: this.postPay,
            orderId: that.formData.orderId,
            status: '已支付',
            type: '刷卡'
          })
        }
        axios.post(URL.api_name + 'backofficeapi/course/experience/payment.do', this.formData).then((res) => {
          if (res.data.status === 'success') {
            that.$router.push({
              path: '/experienceOrderDetail/' + res.data.data.courseCoachId
            })
          }
        })
      },
      continuePay () {
        // 判断订单状态
        if (this.order.order.status === '已支付') {
          this.$message({
            type: 'error',
            message: '订单已支付'
          })
          return
        }
        this.secondDialog = true
      },
      chooseWX (type) {
        this.dialogFormVisible = true
        this.payType = type
      }
    },
    filters: {
      formatTT (val) {
        return val.split('实例')[0]
      }
    },
    computed: {
      payAmount () {
        let amount = 0
        if (this.shopCard) {
          amount += this.shopPay
        }
        if (this.cashCard) {
          amount += this.cashPay
        }
        if (this.postCard) {
          amount += this.postPay
        }
        return amount
      },
      continueAmount () {
        return parseFloat(this.order.order.paid - this.payAmount).toFixed(2)
      },
      changeAmount () {
        return parseFloat(this.payAmount - this.order.order.paid).toFixed(2)
      }
    }
  }
</script>
<style lang="less" scoped>
  .no-margin{
    margin-bottom: 0;
  }
  .label{
    display: inline-block;
    width: 88px;
  }
  .tc{
    text-align: center;
    margin-bottom: 22px;
  }
  .w-btn{
    width: 100px;
  }
  .stepsss{text-align: center;}
  .of0 {overflow:hidden; padding: 0 0 30px 0;}
</style>
