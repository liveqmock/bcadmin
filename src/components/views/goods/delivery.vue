<template>
  <div class="delivery">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 收银管理</el-breadcrumb-item>
        <el-breadcrumb-item>交接单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">门店名称:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">{{ formData.storeName }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">上班人:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">{{ formData.cashierName }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">刷卡总金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.cardAmount }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">支付宝总金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.payAmount }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">微信总金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.wxAmount }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">现金总金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.moneyAmount }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">购物卡总金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.shopAmount }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">订单总应付金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.price }}</p>
      </div>

      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">打折抵扣总金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.discountEffect }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">卡券抵扣总金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.effect }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">实付金额:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">¥{{ formData.paid }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">上班时间:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">{{ formData.goToWorkTime }}</p>
      </div>
      <div class="delivery-item" style="display: flex; line-height: 30px; font-size: 10px;">
        <span class="label" style="width: 120px; text-align: right; margin-right: 5px;">下班时间:</span>
        <p class="text" style="flex-grow: 1; margin: 0;">{{ formData.goOffWorkTime }}</p>
      </div>
    </div>
    <!-- 打印信息 -->
    <div id="formData" style="display: none">
      <div style="font-family: '微软雅黑'; padding-right: 12px;">
        <h1 style="font-size: 16px;color: #000;text-align: center; margin: 0;">冰纷万象·南山冰场</h1>
        <h3 style="font-size: 14px; text-align: center; margin: 0;">WORLD ICE AREAN</h3>
        <p style="font-size: 16px; margin-bottom: 1px;
          color: #000; text-align: center; padding-bottom: 8px; border-bottom: 1px dashed #222;
          margin-top: 12px;">交班单据</p>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">门店名称:</span>
          <p style="flex-grow: 1; margin: 0;">{{ formData.storeName }}</p>
        </div>
        <div style="display: flex; font-size: 8px; line-height: 22px; color: #000; border-bottom: 1px dashed #000;">
          <span style="padding-left: 12px; padding-right: 5px; font-size: 10px;">上班员工:</span>
          <p style="flex-grow: 1; margin: 0;">{{ formData.cashierName }}</p>
        </div>
        <!-- 分割线 -->
        <div style="border-top: 1px dashed #000;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">刷卡总金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.cardAmount }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">购物卡总金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.shopAmount }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">现金总金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.moneyAmount }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">支付宝总金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.payAmount }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">微信总金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.wxAmount }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">订单总应付金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.price }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">打折抵扣总金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.discountEffect }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; padding-right: 5px;">卡券抵扣总金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.effect }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px; border-top: 1px dashed #000">
          <span style="padding-left: 12px; padding-right: 5px;">实付金额:</span>
          <span style="flex-grow: 1; text-align: right">¥{{ formData.paid }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px;">上班时间:</span>
          <span style="flex-grow: 1; text-align: right">{{ formData.goToWorkTime }}</span>
        </div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px; text-align: right">下班时间:</span>
          <span style="flex-grow: 1; text-align: right">{{ formData.goOffWorkTime }}</span>
        </div>
        <!-- 分割线 -->
        <div style="border-top: 1px solid #666;"></div>
        <div style="display: flex; font-size: 10px; color: #000; padding-top: 5px; line-height: 20px;">
          <span style="padding-left: 12px;">打印时间:</span>
          <span style="flex-grow: 1; text-align: right">{{ printTime }}</span>
        </div>
        <!-- 分割线 -->
        <div style="border-bottom: 1px dashed #ebebeb; height: 20px;"></div>
      </div>
    </div>
    <div class="delivery-btns">
      <!--<el-button type="info" @click="getFormData">刷新数据</el-button>-->
      <el-button type="primary" @click="print">打印</el-button>
      <el-button type="primary" @click="printAgain">重印</el-button>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    created () {
    },
    data () {
      return {
        formData: {},
        printTime: ''
      }
    },
    methods: {
      getFormData () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/print/change-shifts/detail.do', {
          params: {
            cashierId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.printTime = moment().format('YYYY-MM-DD HH:mm:ss')
            that.formData = res.data.data
            that.$nextTick(function () {
              that.myPrint('formData')
            })
          }
        })
      },
      print () {
        this.getFormData()
      },
      printAgain () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/print/reprint.do', {
          params: {
            cashierId: JSON.parse(sessionStorage.getItem('userInfo')).roleId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
            this.$nextTick(function () {
              that.myPrint('formData')
            })
          }
        })
      },
      myPrint (id) {
        var obj = document.getElementById(id)
        var newWindow = window.open('打印窗口', '_blank')
        var docStr = obj.innerHTML
        newWindow.document.write(docStr)
        newWindow.document.close()
        newWindow.print()
        newWindow.close()
      }
    }
  }
</script>
<style lang="less" scoped>
  .delivery-btns{
    padding: 10px;
  }
  .el-form-item{
    margin-bottom: 5px;
  }
  .el-form-item__label{
    color: #333;
  }
  .delivery-item{
    display: flex;
    line-height: 30px;
    font-size: 10px;
    .label{
      width: 120px;
      text-align: right;
      margin-right: 5px;
    }
    .text{
      flex-grow: 1;
    }
    &:last-child{
      padding-bottom: 20px;
     }
  }
</style>
