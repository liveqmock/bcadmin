<template>
  <div class="booking">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 票务管理</el-breadcrumb-item>
        <el-breadcrumb-item>购票</el-breadcrumb-item>
        <el-breadcrumb-item>陪同票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="160px">
        <div class="order" v-if="order.items && order.items.length > 0">
          <p class="title">订单信息</p>
          <el-form-item class="no-margin" label="所属门店：">
            {{ storeInfo.storeName }}
          </el-form-item>
          <el-form-item class="no-margin" label="订单号：">
            {{ order.order.code }}
          </el-form-item>
          <el-form-item class="no-margin" label="订单状态：">
            {{ order.order.status }}
          </el-form-item>
          <el-row v-for="(o, i) in order.items" :key="i">
            <el-form-item class="no-margin" label="票种类型：">
              {{ o.itemType | formatOrderType }}
            </el-form-item>
            <el-form-item class="no-margin" label="单价：">
              ¥{{ o.price }}
            </el-form-item>
            <el-form-item class="no-margin" label="数量：">
              {{ o.quantity }}
            </el-form-item>
          </el-row>
        </div>
        <el-form-item label="售票类型:">
          陪同票
        </el-form-item>
        <el-form-item label="是否为免费陪同票：" v-if="companyTicket.isFree">
          <el-checkbox v-model="isFree"></el-checkbox>
        </el-form-item>
        <el-row>
          <el-form-item label="单价:">
            ¥{{ companyTicket.price }}
          </el-form-item>
          <el-form-item label="数量:">
            <el-input-number :min="1" v-model="cQuantity"></el-input-number>
          </el-form-item>
          <el-form-item label="合计:">
            ¥{{ companyTicket.price * cQuantity }}
          </el-form-item>
        </el-row>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" v-model="description" :rows="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="createOrder" :loading="loading">{{ loading ? '正在提交' : '确定' }}</el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    created () {
      this.getCompanyList()
      this.getOrderDetail()
    },
    data () {
      return {
        loading: false,
        itemType: '',
        itemDefId: '',
        totalPrice: 0,
        submitList: [],
        dayType: '',
        companyTicket: {},
        cQuantity: 1,
        order: {
          items: []
        },
        isFree: false,
        storeInfo: {},
        description: ''
      }
    },
    methods: {
      // 获取门店信息
      getStoreInfo (storeId) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/store/find.do', {
          params: {
            storeId: storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.storeInfo = res.data.data
          }
        })
      },
      getCompanyList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/ticket/search/company.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            status: '有效'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.companyTicket = res.data.data[0]
          }
        })
      },
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/order/find-by-code.do', {
          params: {
            code: this.$route.params.bid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.order = res.data.data
            that.getStoreInfo(that.order.order.storeId)
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      createOrder () {
        var that = this
        if (this.isFree) {
          that.companyTicket.price = 0
        }
        let cParams = {
          itemDefId: that.companyTicket.id,
          itemDefName: that.companyTicket.name,
          itemType: '陪同票实例',
          price: that.companyTicket.price,
          quantity: that.cQuantity,
          useDate: moment().format('YYYY-MM-DD')
        }
        that.submitList.push(cParams)
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/order/purchase.do', {
          items: that.submitList,
          order: {
            cashierId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            name: that.companyTicket.name,
            saleSource: 'web admin',
            code: 'P',
            type: '票',
            description: that.description
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            let orderId = res.data.data.items[0].orderId
            that.$router.push({
              path: '/addDiscount/' + orderId
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
          that.$message({
            type: 'error',
            message: '提交失败'
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-button{
    margin-right: 5px;
  }
  .active{
    background-color: #13CE66;
    border-color: #13CE66;
    color: #fff;
  }
  .no-margin{
    margin-bottom: 0;
  }
  .order{
    border-bottom: 1px solid #ebebeb;
    .title{
      line-height: 22px;
      margin-left: 20px;
      color: #13CE66;
    }
  }
</style>
