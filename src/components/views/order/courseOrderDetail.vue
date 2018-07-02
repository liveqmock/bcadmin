<template>
  <div class="renew-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/" v-show="$route.params.from === 'course'">
        <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>售课订单</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-show="$route.params.from === 'experience'">
        <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>体验课订单</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-show="$route.params.from === 'refund'">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>退款</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px">
        <el-form-item label="订单编号：">
          {{ order.order.code }}
        </el-form-item>
        <el-form-item label="订单状态：">
          {{ order.order.status }}
        </el-form-item>
        <div class="list-item">
          <el-row v-for="(o, i) in order.items" :key="i">
            <el-form-item label="课程名称：">
              {{ o.itemDefName }}
            </el-form-item>
            <el-form-item label="售课类型：">
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
        <el-form-item label="折扣：">
          <el-table :data="order.discounts">
            <el-table-column label="折扣类型" prop="type"></el-table-column>
            <el-table-column label="折扣金额" prop="effect"></el-table-column>
            <el-table-column label="折扣原因">
              <template scope="scope">
                {{ scope.row.discountedType | formatType }}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="discountedNotes"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="卡券优惠：">
          <el-row v-for="(c, i) in order.coupons" :key="i">
            <el-col style="width: 60px; text-align: center;">{{ c.couponType | formatType }}：</el-col>
            <el-col :span="2">¥{{ c.effect }}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="实付金额：">
          ¥{{ order.order.paid }}
        </el-form-item>
        <el-form-item label="手机号：">
          {{ order.memberMobile }}
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
        <el-form-item label="学员签名：" v-if="order.signPicturePath">
          <img :src="order.signPicturePath" class="sign-img">
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
        <h1 style="font-size: 16px;color: #000;text-align: center; margin: 0;">{{ storeName }}</h1>
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
        <div v-for="(o, i) in order.items" :key="i">
          <div style="display: flex; font-size: 10px; color: #000; line-height: 24px;">
            <span style="padding-left: 12px; ">{{ o.itemDefName.split('-')[1] }}</span>
            <span style="flex-grow: 1; padding-right: 12px; text-align: right">x{{ o.quantity }}</span>
          </div>
          <div style="display: flex; font-size: 10px; color: #000; line-height: 24px;">
            <span style="padding-left: 12px; ">单价</span>
            <span style="flex-grow: 1; padding-right: 12px; text-align: right">¥{{ o.price }}</span>
          </div>
        </div>
        <!-- 分割线 -->
        <div style="border-bottom: 1px dashed #000;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">总计金额:</span>
          <span style="flex-grow: 1">¥{{ order.order.price }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;"
             v-for="(c, i) in order.discounts" :key="i">
          <span style="padding-left: 12px; padding-right: 5px;">{{ c.type | formatDiscount }}:</span>
          <span style="flex-grow: 1">¥{{ c.effect }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;"
             v-for="(c, i) in order.coupons" :key="i">
          <span style="padding-left: 12px; padding-right: 5px;">{{ c.couponType | formatType }}:</span>
          <span style="flex-grow: 1">¥{{ c.effect }}</span>
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
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">备注:</span>
          <span style="flex-grow: 1">{{ order.order.description }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">签名图片:</span>
          <img :src="order.signPicturePath" width="50" height="50">
        </div>
        <div style="display: flex; justify-content: center; margin: 15px 0;">
          <qr-code :text="orderCode" :size="100"></qr-code>
        </div>
        <p style="text-align: center; font-size: 12px;">请保留此票据,作为退换凭证</p>
        <!-- 分割线 -->
        <div style="border-top: 1px dashed #ebebeb; height: 10px;"></div>
      </div>
    </div>
    <div class="delivery-btns">
      <el-button type="danger"
                 @click="tradeDialog = true">
                 补录交易
      </el-button>
      <el-button type="primary" @click="myPrint('order')">打印</el-button>
      <!--<el-button type="primary" @click="print">clodop</el-button>-->
      <el-button @click="$router.go('-1')">返回</el-button>
    </div>
    <el-dialog title="校验订单号" :visible.sync="tradeDialog">
      <el-row>
        <el-col :span="3" :offset="5">支付方式:</el-col>
        <el-col :span="10">
          <el-radio-group v-model="payway">
            <el-radio label="微信">微信</el-radio>
            <el-radio label="支付宝">支付宝</el-radio>
            <el-radio label="公众号">公众号</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="searchOrder">查询</el-button>
        </el-col>
      </el-row>
      <el-row class="line">
        <el-col :span="3" :offset="5">订单号：</el-col>
        <el-col :span="9">{{ orderNo }}</el-col>
      </el-row>
      <el-row class="line">
        <el-col :span="3" :offset="5">交易号：</el-col>
        <el-col :span="9">{{ tradeNo }}</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tradeDialog = false">取 消</el-button>
        <el-button type="primary" @click="goToTrade">去补录</el-button>
      </div>
    </el-dialog>
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
        employee: {},
        tradeDialog: false,
        payway: '微信',
        orderNo: '',
        tradeNo: ''
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
      print () {
        var LODOP = window.getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))
        // LODOP.ADD_PRINT_RECT(70, 27, 634, 242, 0, 1)
        LODOP.ADD_PRINT_HTM(0, 0, 321, 1000, document.getElementById('order').innerHTML)
        LODOP.PREVIEW()
        LODOP.PRINT()
      },
      goToTrade () {
        if (this.tradeNo) {
          this.$router.push({
            path: '/addTrade/' + this.order.order.id + '/' + this.tradeNo
          })
        } else {
          this.$message({
            type: 'error',
            message: '未查询到订单交易号'
          })
        }
      },
      searchOrder () {
        // 查询订单
        if (this.payway === '公众号') {
          this.wechatOrder(this.order.order.code)
        } else if (this.payway === '微信') {
          this.wxOrder(this.order.order.code)
        } else if (this.payway === '支付宝') {
          this.aliOrder(this.order.order.code)
        } else {
          // 混合支付
        }
      },
      // 查询公众号订单
      wechatOrder (orderNo) {
        let that = this
        axios.get(URL.api_name + 'payapi/wx/wxpuborderquery.do', {
          params: {
            out_trade_no: orderNo
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.orderNo = res.data.data.outTradeNo
            that.tradeNo = res.data.data.transactionId
          } else {
            that.orderNo = ''
            that.tradeNo = ''
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      // 查询app微信支付订单
      wxOrder (orderNo) {
        let that = this
        axios.get(URL.api_name + 'payapi/wx/wxOrderquery.do', {
          params: {
            out_trade_no: orderNo
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.orderNo = res.data.data.outTradeNo
            that.tradeNo = res.data.data.transactionId
          } else {
            that.orderNo = ''
            that.tradeNo = ''
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      // 查询支付宝订单
      aliOrder (orderNo) {
        let that = this
        axios.get(URL.api_name + 'payapi/alipay/orderquery.do', {
          params: {
            orderNo: orderNo
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.orderNo = res.data.data.order_no
            that.tradeNo = res.data.data.trade_no
          } else {
            that.orderNo = ''
            that.tradeNo = ''
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
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
        // newWindow.close()
      },
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: this.$route.params.tid
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
    },
    filters: {
      formatDiscount (val) {
        if (val === '会员权益') {
          return '会员折扣'
        } else if (val === '系统') {
          return '系统折扣'
        } else {
          return ''
        }
      }
    }
  }
</script>
<style lang="less" scoped>
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
  .sign-img{
    display: inline-block;
    width: 200px;
  }
</style>
