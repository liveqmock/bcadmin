<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 票务管理</el-breadcrumb-item>
        <el-breadcrumb-item>购票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <div class="ticket-type">
        <el-row>
          <el-col>
            <el-button @click="booking(1)">单次票</el-button>
            <el-button @click="booking(2)">时段票</el-button>
            <el-button @click="booking(3)">陪同票</el-button>
            <el-button @click="booking(4)">练习票</el-button>
            <el-button type="primary" @click="showDialog = true">延时续场费</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="请输入票码" :visible.sync="showDialog">
      <el-row>
        <el-col :span="12" :offset="6">
          <el-input v-model="orderNo11" auto-complete="off" placeholder="请输入票码" @keyup.enter.native="confirm_1"></el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm_1">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请输入购买订单号" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :offset="6">
          <el-input style="width: 50%;" placeholder="请输入订单编号" v-model="orderNo" auto-complete="off" type="text" @keyup.enter.native="confirm"></el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 练习票验证会员信息 -->
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
          <el-button type="primary" @click="nextStep()" :loading="loadingE">
            {{ loadingE ? '正在提交' : '确定' }}
          </el-button>
          <el-button @click="showSendCode = false">返回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import moment from 'moment'
  import { tokenMixin } from '@/common/mixin/token.js'
  export default {
    mixins: [tokenMixin],
    data () {
      return {
        dialogFormVisible: false,
        orderNo: '',
        type: '',
        timerCodeMsg: '获取验证码',
        QRcode: '',
        mobile: '',
        fetchCodeMsg: false,
        loadingE: false,
        showDialog: false,
        orderNo11: ''
      }
    },
    methods: {
      booking (n) {
        if (n === 1) {
          this.$router.push({
            path: '/bookSingle'
          })
        } else if (n === 2) {
          this.type = n
          this.showSendCode = true
          // this.$router.push({
          //   path: '/bookingPeriod'
          // })
        } else if (n === 3) {
          this.type = n
          this.dialogFormVisible = true
        } else if (n === 4) {
          this.type = n
          this.showSendCode = true
        }
      },
      confirm () {
        if (this.type === 3) {
          // 跳转到陪同票页面
          if (this.orderNo.trim() === '') {
            this.orderNo = 0
          }
          this.$router.push({
            path: '/bookingCompany/' + this.orderNo
          })
        }
        if (this.type === 4) {
          this.$router.push({
            path: '/bookingExercise/' + this.orderNo
          })
        }
      },
      confirm_1 () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/ticket/purchase-minute.do', {
          params: {
            code: this.orderNo11,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.$router.push({
              path: '/buyRenew/' + this.orderNo11
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      setCode () {
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
          mobile = that.mobile.toString().split('852')[1]
        } else {
          area = 86
          mobile = that.mobile
        }
        axios.get(URL.api_name + 'memberapi/api/sendCheckCode.do', {
          params: {
            area: area, // 大陆：86，香港 852 默认86
            mobile: mobile,
            type: 41,
            token: this.token
          }
        }).then(function (res) {
          if (res.data.status === 'success') {
            that.setToken()
            let sec = 59
            that.fetchCodeMsg = true
            var timer = setInterval(function () {
              if (sec > 0) {
                that.timerCodeMsg = sec + '秒后重发验证'
                sec--
              } else {
                that.fetchCodeMsg = false
                that.timerCodeMsg = '获取验证码'
                clearInterval(timer)
              }
            }, 1000)
            that.$succssMsg(res.data.message)
          } else {
            that.$errMsg(res.data.message)
          }
        })
      },
      nextStep (courseCoachId) {
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
          that.loadingE = true
          axios.get(URL.api_name + 'memberapi/api/checkUserInfo.do', {
            params: {
              area: area,
              checkCode: that.QRcode,
              mobile: mobile,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              // 校验会员是否可以购买练习票
              if (that.type === 4) {
                that.checkBuy(res.data.data.memberId)
              } else if (that.type === 2) {
                // 时段票只需要校验会员信息
                that.$router.push({
                  path: '/bookingPeriod/' + res.data.data.memberId
                })
              }
            } else {
              that.loadingE = false
              that.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          }).catch((error) => {
            that.loadingE = false
            console.log(error)
          })
        } else {
          that.$message({
            message: '请输入手机号验证注册信息',
            type: 'error'
          })
        }
      },
      checkBuy (memberId) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/ticket/exercise/check.do', {
          params: {
            memberId: memberId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss')
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.$router.push({
              path: '/bookingExercise/' + memberId
            })
          } else {
            that.loadingE = false
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          that.loadingE = false
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .search-wrapper{
    padding-bottom: 20px;
  }
</style>
