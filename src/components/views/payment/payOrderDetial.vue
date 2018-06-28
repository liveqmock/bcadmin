<template>
  <div class="payOrderDetials" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费订单</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 打印信息 -->
    <div id="paymentOrder" style="display: none">
      <div style="font-family: '微软雅黑'">
        <h1 style="font-size: 16px;color: #000;text-align: center; margin: 0;">{{storeName}}</h1>
        <h3 style="font-size: 14px; text-align: center; margin: 0;">WORLD ICE AREAN</h3>
        <p style="font-size: 16px; margin-bottom: 1px;
          color: #000; text-align: center; padding-bottom: 8px; border-bottom: 1px dashed #222;
          margin-top: 12px;">收款票据</p>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">订单编号:</span>
          <p style="flex-grow: 1; margin: 0;">{{ formData.order.code }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">订单状态:</span>
          <p style="flex-grow: 1; margin: 0;">{{ formData.order.status }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">创建时间:</span>
          <p style="flex-grow: 1; margin: 0;">{{ formData.order.createTime }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; border-bottom: 1px dashed #000">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">收银编号:</span>
          <p style="flex-grow: 1; margin: 0;">{{ formData.empNo }}</p>
        </div>
        <!-- 销售明细 -->
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px;">
          <span style="padding-left: 12px;">销售明细:</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; line-height: 28px;"
             v-for="(o, i) in formData.items" :key="i">
          <span style="flex-grow: 1; padding-left: 12px; ">{{ o.itemType | formatOrderType }}</span>
          <span style="flex-grow: 1; padding-left: 12px; ">¥{{ o.price }}</span>
          <span style="flex-grow: 1; padding-left: 12px; ">x{{ o.quantity }}</span>
          <span style="flex-grow: 1; padding-left: 12px; ">¥{{ o.price * o.quantity | formatMoney }}</span>
        </div>
        <!-- 分割线 -->
        <div style="border-bottom: 1px dashed #000;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">总计金额:</span>
          <span style="flex-grow: 1">¥{{ formData.order.price }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;" v-for="(d, i) in formData.discounts" :key="i">
          <span style="padding-left: 12px; padding-right: 5px;">{{ d.type }}:</span>
          <span style="flex-grow: 1">¥{{ d.effect }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;" v-for="(d, i) in formData.coupons" :key="i">
          <span style="padding-left: 12px; padding-right: 5px;">{{ d.couponType | formatType }}:</span>
          <span style="flex-grow: 1">¥{{ d.effect }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">实付金额:</span>
          <span style="flex-grow: 1">¥{{ formData.order.paid }}</span>
        </div>
        <!-- 分割线 -->
        <div style="border-top: 1px dashed #000;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px;">
          <span style="padding-left: 12px;">支付方式:</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; line-height: 32px;"
             v-for="(p, i) in formData.payments" :key="i">
          <span style="padding-left: 12px;">{{ p.type }}：</span>
          <span style="flex-grow: 1;">¥{{ p.amount }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">备注:</span>
          <span style="flex-grow: 1">{{ formData.order.description }}</span>
        </div>
        <div style="display: flex; justify-content: center; margin: 15px 0;">
          <qr-code :text="orderCode" :size="100"></qr-code>
        </div>
        <p style="text-align: center; font-size: 12px;">请保留此票据,作为凭证</p>
        <!-- 分割线 -->
        <div style="border-top: 1px dashed #ebebeb; height: 10px;"></div>
      </div>
    </div>
    <div class="form-data" id="payment">
    	<el-form label-width="100px">
        <el-form-item label="订单号：">
          {{ formData.order.code }}
        </el-form-item>
        <el-form-item label="订单状态：">
          {{ formData.order.status }}
        </el-form-item>
        <el-row v-for="(item, index) in formData.items" :key="index">
          <el-form-item label="商品名称：">
            {{ item.itemDefName }}
          </el-form-item>
          <el-form-item label="类型：">
            {{ item.itemType }}
          </el-form-item>
          <el-form-item label="单价：">
            {{ item.price }}
          </el-form-item>
          <el-form-item label="数量：">
            {{ item.quantity }}
          </el-form-item>
          <el-form-item label="金额：">
            ¥{{ item.amount }}
          </el-form-item>
        </el-row>
        <el-form-item label="订单总金额：">
          ¥{{ formData.order.price }}
        </el-form-item>
        <el-form-item label="实付金额：">
          ¥{{ formData.order.paid }}
        </el-form-item>
        <el-form-item label="支付方式：" v-for="(item, index) in formData.payments" :key="index">
        	<el-row>
        		<span class="label-text">{{ item.type }}：</span>
	          <el-col :span="6">
	            ¥{{ item.amount }}
	          </el-col>
        	</el-row>
        </el-form-item>
        <el-form-item label="折扣：">
          <el-table :data="formData.discounts">
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
        <!--<el-form-item label="找零：">
          <el-row>
            <el-col :span="6">
              ¥{{ changeAmount }}
            </el-col>
          </el-row>
        </el-form-item>-->
        <el-form-item label="备注：">
          <el-row>
            <el-col :span="6">
              {{formData.order.description}}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="创建时间：">
					<el-row>
	          <el-col :span="6">
	            {{ formData.order.createTime }}
	          </el-col>
        	</el-row>
        </el-form-item>
        <el-form-item label="付款时间：" v-if="formData.payments.length > 0">
					<el-row>
	          <el-col :span="6">
	            {{ formData.payments[0].createTime }}
	          </el-col>
        	</el-row>
        </el-form-item>
        <el-form-item>
          <span class="label-text">&nbsp;</span>
          <el-button type="primary" :loading="loading" @click="myPrint('paymentOrder')">
            打印票据
          </el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import VueQRCodeComponent from 'vue-qrcode-component'
  export default {
    created () {
      this.getOrderDetail()
    },
    data () {
      return {
        formData: null,
        loading: false,
        employee: {}
      }
    },
    components: {
      'qr-code': VueQRCodeComponent
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
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: this.$route.params.oid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          } else {
            that.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      goBack () {
        this.$router.go(-1)
      }
    },
    computed: {
      orderCode () {
        if (this.formData.order.code) {
          return this.formData.order.code
        } else {
          return ''
        }
      },
      changeAmount () {
        let amount = 0
        for (let a of this.formData.payments) {
          amount += a.amount
        }
        return (amount - this.formData.order.paid).toFixed(2)
      },
      storeName () {
        return JSON.parse(sessionStorage.getItem('store')).v
      }
    }
  }
</script>
<style lang="less" scoped>
  .label-text{
    float: left;
    display: inline-block;
    margin-right: 5px;
    width:120px;
    text-align:right;
    margin-left:-80px;
  }
</style>
