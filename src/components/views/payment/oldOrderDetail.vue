<template>
  <div class="payOrderDetials" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费订单</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 打印信息 -->
    <div class="form-data" id="order" style="padding-bottom: 20px; display: none">
      <p style="text-align: center; font-size: 14px;">缴费清单</p>
      <div class="delivery-item"
           v-if="formData.paymentOrders.length > 0"
           style="line-height: 24px; font-size: 10px; height: 24px;border-bottom: 1px dashed #000;">
        <span class="label" style="display: inline-block;width: 40px; text-align: right;">单号:</span>
        <span class="text" style="display: inline-block;">{{ formData.paymentOrders[0].orderNumber }}</span>
      </div>
      <div v-for="(o, i) in formData.paymentItems" :key="i">
        <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
          <span class="label" style="display: inline-block;width: 60px; text-align: right; margin-right: 5px;">缴费类目:</span>
          <span class="text" style="display: inline-block;">{{ o.paymentName }}</span>
        </div>
        <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
          <span class="label" style="display: inline-block;width: 60px; text-align: right; margin-right: 5px;">单价:</span>
          <span class="text" style="margin: 0;">¥{{ o.price }}</span>
        </div>
        <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
          <span class="label" style="display: inline-block;width: 60px; text-align: right; margin-right: 5px;">数量:</span>
          <span class="text" style="display: inline-block;">{{ o.number }}</span>
        </div>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">总金额:</span>
        <span class="text" style="display: inline-block;">¥{{ formData.totalAmount }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px;border-top: 1px dashed #000;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">实付金额:</span>
        <span class="text" style="display: inline-block;">¥{{ formData.orderTotalAmount }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px;">
        <span class="label" style="display: inline-block; width: 60px; text-align: right; margin-right: 5px;">创建时间:</span>
        <span class="text" style="display: inline-block;">{{ formData.paymentItems[0].createTime }}</span>
      </div>
      <div class="delivery-item" style="line-height: 24px; font-size: 10px; padding-bottom: 10px;">
        <p class="text" style="text-align: center;">请保留此票据，作为凭证</p>
      </div>
    </div>
    <div class="form-data" id="payment">
      <el-form label-width="140px">
        <el-form-item v-for="(item, index) in formData.paymentItems" :key="item.id">
          <el-row>
            <span class="label-text">商品名称：</span>
            <el-col :span="6">
              {{ item.paymentName }}
            </el-col>
          </el-row>
          <el-row>
            <span class="label-text">单价：</span>
            <el-col :span="6">
              {{ item.price }}
            </el-col>
          </el-row>
          <el-row>
            <span class="label-text">数量：</span>
            <el-col :span="6">
              {{ item.number }}
            </el-col>
          </el-row>
          <el-row>
            <span class="label-text">金额：</span>
            <el-col :span="6">
              ¥{{ item.amount }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <span class="label-text">订单总金额：</span>
            <el-col :span="6">
              ¥{{ formData.totalAmount }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <span class="label-text">实付金额：</span>
            <el-col :span="6">
              ¥{{ formData.orderTotalAmount }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-for="(item, index) in formData.paymentOrders" :key="item.id">
          <el-row>
            <span class="label-text">{{ item.type }}：</span>
            <el-col :span="6">
              {{ item.amount }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <span class="label-text">找零：</span>
            <el-col :span="6">
              ¥{{ changeAmount }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="formData.paymentOrders.length > 0">
          <el-row>
            <span class="label-text">备注：</span>
            <el-col :span="6">
              {{ formData.paymentOrders[0].remark }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <span class="label-text">创建时间：</span>
            <el-col :span="6">
              {{ formData.paymentItems[0].createTime }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="formData.paymentOrders.length > 0">
          <el-row>
            <span class="label-text">付款时间：</span>
            <el-col :span="6">
              {{ formData.paymentOrders[0].createTime }}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <span class="label-text">&nbsp;</span>
          <el-button type="primary" :loading="loading" @click="myPrint('order')">
            打印票据
          </el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
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
      this.getOrderDetail()
    },
    data () {
      return {
        formData: null,
        loading: false
      }
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
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/payment/settlement/details.do', {
          params: {
            orderno: that.$route.params.poid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            console.log(res)
            that.formData = res.data.data
            console.log(that.formData.paymentItems[0].amount)
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
      cancel () {
        this.$router.go('-1')
      }
    },
    computed: {
      changeAmount () {
        let amount = 0
        for (let a of this.formData.paymentOrders) {
          amount += a.amount
        }
        return (amount - this.formData.orderTotalAmount).toFixed(2)
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
