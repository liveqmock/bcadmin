<template>
  <div class="renew-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>售票</el-breadcrumb-item>
        <el-breadcrumb-item>延时续场费</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px">
        <el-form-item label="延时："></el-form-item>
        <el-form-item label="需缴纳入场费："></el-form-item>
        <el-form-item label="入场时间："></el-form-item>
        <el-form-item label="出场时间："></el-form-item>
        <el-form-item label="订单编号：">
          {{ order.order.id }}
        </el-form-item>
        <div class="list-item">
          <el-row v-for="(o, i) in order.items" :key="i">
            <el-form-item label="售票类型：">
              {{ o.itemType.split('实例')[0] }}
            </el-form-item>
            <el-form-item label="单价：">
              ¥{{ o.price }}
            </el-form-item>
            <el-form-item label="数量：">
              {{ o.quantity }}
            </el-form-item>
            <el-form-item label="总金额：">
              ¥{{ o.amount }}
            </el-form-item>
          </el-row>
        </div>
        <el-form-item label="订单总金额：">
          ¥{{ order.order.price }}
        </el-form-item>
        <el-form-item label="新人卡券："></el-form-item>
        <el-form-item label="会员折扣：">
          ¥{{ order.order.price - order.order.paid }}
        </el-form-item>
        <el-form-item label="实付金额：">
          ¥{{ order.order.paid }}
        </el-form-item>
        <el-form-item label="手机号："></el-form-item>
        <el-form-item label="入场二维码："></el-form-item>
        <el-form-item label="支付方式：">
          <el-row v-for="(p, i) in order.payments" :key="i">
            <span>{{ p.type }}：</span>
            <span>¥{{ p.amount }}</span>
          </el-row>
        </el-form-item>
        <el-form-item label="创建时间：">
          {{ order.order.createTime }}
        </el-form-item>
        <el-form-item label="付款时间："></el-form-item>
        <el-form-item>
          <el-button @click="goPay">支付</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getOrderDetail()
    },
    data () {
      return {
        order: {
          items: [],
          order: {}
        }
      }
    },
    methods: {
      goPay () {
        this.$router.push({
          path: '/timeoutPay/' + this.$route.params.rid
        })
      },
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: this.$route.params.rid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.order = res.data.data
          }
        })
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
</style>
