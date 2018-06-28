<template>
  <div class="choose-way">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 选择支付方式</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item class="no-margin" label="订单总金额：">
          ¥{{ formData.order.price }}
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="shopCard"></el-checkbox>
          <span class="label">购物卡支付</span>
          <el-input :min="0" :disabled="!shopCard" style="width: 200px" type="text" v-model.number="shopPay"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="cashCard"></el-checkbox>
          <span class="label">现金支付</span>
          <el-input :disabled="!cashCard" style="width: 200px" type="text" v-model.number="cashPay"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="postCard"></el-checkbox>
          <span class="label">银行卡支付</span>
          <el-input :disabled="!postCard" style="width: 200px" type="text" v-model.number="postPay"></el-input>
        </el-form-item>
        <el-form-item class="no-margin" label="应付金额：">
          ¥{{ formData.order.paid }}
        </el-form-item>
        <el-form-item class="no-margin" label="实付金额：">
          ¥{{ payAmount }}
        </el-form-item>
        <el-form-item v-show="formData.order.paid - payAmount > 0" class="no-margin" label="需继续支付：">
          ¥{{ continueAmount }}
        </el-form-item>
        <el-form-item v-show="formData.order.paid - payAmount < 0" class="no-margin" label="找零：">
          ¥{{ changeAmount }}
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-show="formData.order.paid - payAmount > 0" @click="continuePay">继续支付</el-button>
          <el-button :loading="loading" type="primary" v-show="formData.order.paid - payAmount <= 0" @click="confirmPay">
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
          order: {},
          items: []
        },
        cashPay: 0,
        shopPay: 0,
        postPay: 0,
        secondDialog: false,
        dialogFormVisible: false,
        shopCard: false,
        cashCard: false,
        postCard: false,
        payType: '',
        payCode: '',
        loading: false,
        wechatLoading: false
      }
    },
    methods: {
      payOrder () {
        // 微信或支付宝支付完成后，需要手动去掉创建支付记录的接口
        var that = this
        let amount = this.formData.order.paid - this.payAmount
        console.log('需继续支付：' + amount)
        that.wechatLoading = true
        if (that.payType === 'weixin') {
          // 微信支付
          axios.get(URL.api_name + 'payapi/wx/wxscancard.do', {
            params: {
              authCode: this.payCode,
              body: this.formData.order.name,
              orderNo: this.formData.order.code,
              totalfee: this.continueAmount
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
              authCode: this.payCode,
              body: this.formData.order.name,
              orderNo: this.formData.order.code,
              totalfee: this.continueAmount
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
            id: that.$route.params.oid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
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
      checkDataCorrect () {
        if (this.shopCard) {
          if (this.shopPay < 0) {
            this.$message({
              type: 'error',
              message: '金额不能为负数'
            })
            return null
          } else {
            this.formData.payments.push({
              amount: this.shopPay,
              orderId: this.formData.order.id,
              status: '已支付',
              type: '购物卡'
            })
          }
        }
        if (this.cashCard) {
          if (this.cashPay < 0) {
            this.$message({
              type: 'error',
              message: '金额不能为负数'
            })
            return null
          } else {
            this.formData.payments.push({
              amount: this.cashPay,
              orderId: this.formData.order.id,
              status: '已支付',
              type: '现金'
            })
          }
        }
        if (this.postCard) {
          if (this.postPay < 0) {
            this.$message({
              type: 'error',
              message: '金额不能为负数'
            })
            return null
          } else {
            this.formData.payments.push({
              amount: this.postPay,
              orderId: this.formData.order.id,
              status: '已支付',
              type: '刷卡'
            })
          }
        }
        return true
      },
      confirmPay () {
        // 判断订单状态
        if (this.formData.order.status === '已支付') {
          this.$message({
            type: 'error',
            message: '订单已支付，请勿重复支付'
          })
          return
        }
        // 确认收款后去创建支付记录
        var that = this
        this.formData.payments = []
        if (!this.checkDataCorrect()) {
          return
        }
        if (this.formData.payments.length === 0) {
          this.$message({
            type: 'error',
            message: '至少选择一种支付方式'
          })
          return
        }
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/order/pay.do', this.formData).then((res) => {
          if (res.data.status === 'success') {
            // 创建支付记录成功后，跳转到实例化订单票页面
            axios.get(URL.api_name + 'backofficeapi/order/instance.do', {
              params: {
                orderId: this.$route.params.oid
              }
            }).then(res => {
              if (res.data.status === 'success') {
                that.$router.push({
                  path: '/ticketInstance/' + that.formData.order.id + '/chooseWay'
                })
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
            message: '支付失败'
          })
        })
      },
      confirmOnlinePay () {
        // 确认收款后去创建支付记录
        var that = this
        this.formData.payments = []
        if (this.shopCard) {
          this.formData.payments.push({
            amount: this.shopPay,
            orderId: this.formData.order.id,
            status: '已支付',
            type: '购物卡'
          })
        }
        if (this.cashCard) {
          this.formData.payments.push({
            amount: this.cashPay,
            orderId: this.formData.order.id,
            status: '已支付',
            type: '现金'
          })
        }
        if (this.postCard) {
          this.formData.payments.push({
            amount: this.postPay,
            orderId: this.formData.order.id,
            status: '已支付',
            type: '刷卡'
          })
        }
        console.log(this.payType)
        // 判断是通过微信扫码还是支付宝扫码
        // 在线支付由后端自己创建支付记录
//        if (this.payType === 'weixin') {
//          this.formData.payments.push({
//            amount: this.formData.order.paid - this.payAmount,
//            orderId: this.formData.order.id,
//            status: '已支付',
//            type: '微信'
//          })
//        } else if (this.payType === 'alipay') {
//          this.formData.payments.push({
//            amount: this.formData.order.paid - this.payAmount,
//            orderId: this.formData.order.id,
//            status: '已支付',
//            type: '支付宝'
//          })
//        }
        axios.post(URL.api_name + 'backofficeapi/order/pay.do', this.formData).then((res) => {
          if (res.data.status === 'success') {
            // 创建支付记录成功后，跳转到实例化订单票页面
            axios.get(URL.api_name + 'backofficeapi/order/instance.do', {
              params: {
                orderId: this.$route.params.oid
              }
            }).then(res => {
              if (res.data.status === 'success') {
                that.$router.push({
                  path: '/ticketInstance/' + that.formData.order.id + '/chooseWay'
                })
              }
            })
          }
        })
      },
      continuePay () {
        // 判断订单状态
        if (this.formData.order.status === '已支付') {
          this.$message({
            type: 'error',
            message: '订单已支付，请勿重复支付'
          })
          return
        }
        if (!this.checkDataCorrect()) {
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
        return parseFloat(amount).toFixed(2)
      },
      continueAmount () {
        return parseFloat(this.formData.order.paid - this.payAmount).toFixed(2)
      },
      changeAmount () {
        return parseFloat(this.payAmount - this.formData.order.paid).toFixed(2)
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
</style>
