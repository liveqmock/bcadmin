<template>
  <div class="renew-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>售票订单</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
        <el-breadcrumb-item>补录交易</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px">
        <el-form-item label="订单编号：">
          {{ order.order.code }}
        </el-form-item>
        <el-form-item label="交易号：">
          {{ $route.params.tid }}
        </el-form-item>
        <el-form-item label="订单状态：">
          {{ order.order.status }}
        </el-form-item>
        <div class="list-item">
          <el-row v-for="(o, i) in order.items" :key="i">
            <el-form-item label="售票类型：">
              {{ o.itemType | formatOrderType }}
            </el-form-item>
            <el-form-item label="单价：">
              ¥{{ o.price }}
            </el-form-item>
            <el-form-item label="数量：">
              {{ o.quantity }}
            </el-form-item>
            <el-form-item label="总金额：">
              ¥{{ o.price * o.quantity | formatMoney }}
            </el-form-item>
          </el-row>
        </div>
        <el-form-item label="订单总金额：">
          ¥{{ order.order.price }}
        </el-form-item>
        <el-form-item label="会员折扣：">
          ¥{{ memberAmount }}
        </el-form-item>
        <el-form-item label="卡券优惠：">
          <el-row v-for="(c, i) in order.coupons" :key="i">
            <el-col style="width: 60px; text-align: center;">{{ c.couponType | formatType }}：</el-col>
            <el-col :span="2">¥{{ order.order.paid }}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="实付金额：">
          ¥{{ order.order.paid }}
        </el-form-item>
        <el-form-item label="手机号：">
          {{ order.memberMobile }}
        </el-form-item>
        <el-form-item label="入场二维码：">
          <div class="code-list" v-for="(o, i) in order.ticketInstanceOnce">
            <qr-code :text="o.code"></qr-code>
            <span class="code-name">{{ o.ticketDefName }}</span>
          </div>
          <div class="code-list" v-for="(o, i) in order.ticketInstanceCompany">
            <qr-code :text="o.code"></qr-code>
            <span class="code-name">{{ o.ticketDefName }}</span>
          </div>
          <div class="code-list" v-for="(o, i) in order.ticketInstanceExercise">
            <qr-code :text="o.code"></qr-code>
            <span class="code-name">{{ o.ticketDefName }}</span>
          </div>
          <div class="code-list" v-for="(o, i) in order.ticketInstancePeriod">
            <qr-code :text="o.code"></qr-code>
            <span class="code-name">{{ o.ticketDefName }}</span>
          </div>
        </el-form-item>
        <el-form-item label="支付方式：">
          <el-row v-for="(p, i) in order.payments" :key="i">
            <span>{{ p.type }}：</span>
            <span>¥{{ p.amount }}</span>
          </el-row>
        </el-form-item>
        <el-form-item label="创建时间：">
          {{ order.order.createTime }}
        </el-form-item>
        <el-form-item label="付款时间：">
          {{ payTime }}
        </el-form-item>
        <el-form-item label="终端：">
          {{ order.order.saleSource }}
        </el-form-item>
        <el-form-item label="创建人：">
          {{ order.receiverName }}
        </el-form-item>
      </el-form>
    </div>
    <!-- 打印信息 -->
    <div id="order" style="display: none">
      <div style="font-family: '微软雅黑'">
        <h1 style="font-size: 16px;color: #000;text-align: center; margin: 0;">冰纷万象·南山冰场</h1>
        <h3 style="font-size: 14px; text-align: center; margin: 0;">WORLD ICE AREAN</h3>
        <p style="font-size: 16px; margin-bottom: 1px;
          color: #000; text-align: center; padding-bottom: 8px; border-bottom: 1px dashed #222;
          margin-top: 12px;">收款票据</p>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">订单编号:</span>
          <p style="flex-grow: 1; margin: 0;">{{ order.order.code }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">订单状态:</span>
          <p style="flex-grow: 1; margin: 0;">{{ order.order.status }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">创建时间:</span>
          <p style="flex-grow: 1; margin: 0;">{{ order.order.createTime }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; border-bottom: 1px dashed #000">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">收银编号:</span>
          <p style="flex-grow: 1; margin: 0;">{{ order.empNo }}</p>
        </div>
        <!-- 销售明细 -->
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px;">
          <span style="padding-left: 12px;">销售明细:</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; line-height: 28px;"
             v-for="(o, i) in order.items" :key="i">
          <span style="flex-grow: 1; padding-left: 12px; ">{{ o.itemType | formatOrderType }}</span>
          <span style="flex-grow: 1; padding-left: 12px; ">¥{{ o.price }}</span>
          <span style="flex-grow: 1; padding-left: 12px; ">x{{ o.quantity }}</span>
          <span style="flex-grow: 1; padding-left: 12px; ">¥{{ o.price * o.quantity | formatMoney }}</span>
        </div>
        <!-- 分割线 -->
        <div style="border-bottom: 1px dashed #000;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">总计金额:</span>
          <span style="flex-grow: 1">¥{{ order.order.price }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">系统折扣:</span>
          <span style="flex-grow: 1">¥{{ memberAmount }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">实付金额:</span>
          <span style="flex-grow: 1">¥{{ order.order.paid }}</span>
        </div>
        <!-- 分割线 -->
        <div style="border-top: 1px dashed #000;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px;">
          <span style="padding-left: 12px;">支付方式:</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; line-height: 32px;"
             v-for="(p, i) in order.payments" :key="i">
          <span style="padding-left: 12px;">{{ p.type }}：</span>
          <span style="flex-grow: 1;">¥{{ p.amount }}</span>
        </div>
        <div style="display: flex; justify-content: center; margin: 15px 0;">
          <qr-code :text="orderCode" :size="100"></qr-code>
        </div>
        <p style="text-align: center; font-size: 12px;">请保留次票据,作为退换凭证</p>
        <!-- 分割线 -->
        <div style="border-top: 1px dashed #ebebeb; height: 10px;"></div>
      </div>
    </div>
    <div class="delivery-btns">
      <el-button type="primary" @click="myPrint('order')">打印</el-button>
      <el-button @click="$router.go('-1')">返回</el-button>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  import VueQRCodeComponent from 'vue-qrcode-component'
  export default {
    created () {
      this.getOrderDetail()
    },
    data () {
      return {
        order: {
          items: [],
          order: {}
        },
        member: null,
        employee: {}
      }
    },
    computed: {
      orderCode () {
        if (this.order.order.code) {
          return this.order.order.code
        } else {
          return ''
        }
      },
      payTime () {
        if (this.order.payments && this.order.payments.length > 0) {
          return this.order.payments[0].createTime
        } else {
          return ''
        }
      },
      couponAmount () {
        if (this.order.coupons && this.order.coupons.length > 0) {
          return this.order.coupons[0].effect
        } else {
          return 0
        }
      },
      memberAmount () {
        if (this.order.discounts && this.order.discounts.length > 0) {
          return ((1 - this.order.discounts[0].discount) * this.order.order.price).toFixed(2)
        } else {
          return 0
        }
      },
      storeName () {
        return JSON.parse(sessionStorage.getItem('store')).v
      }
    },
    methods: {
      getEmployeeInfo (id) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/employee/details.do', {
          params: {
            id: id,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.employee = res.data.data
          }
        })
      },
      getMemberInfo (id) {
        let that = this
        axios.get(URL.api_name + 'memberapi/member/detail.do', {
          params: {
            id: id
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.member = res.data.data
          }
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
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: this.$route.params.oid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.order = res.data.data
          }
        })
      }
    },
    components: {
      'qr-code': VueQRCodeComponent
    }
  }
</script>
<style lang="less" scoped>
  .line{
    line-height: 28px;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .list-item{
    margin: 10px 0;
  }
  .code-list{
    display: inline-block;
    float: left;
    margin-right: 10px;
  }
  .delivery-btns{
    padding: 10px;
  }
</style>
