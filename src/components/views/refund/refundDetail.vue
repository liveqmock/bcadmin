<template>
  <div class="renew-detail">
    <div class="crumbs" v-if="$route.params.from==='P'">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 退款管理</el-breadcrumb-item>
        <el-breadcrumb-item>退款</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="crumbs" v-if="$route.params.from==='G'">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费退款</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data" v-if="order">
      <el-form label-width="120px">
        <el-form-item label="订单编号：">
          {{ order.order.code }}
        </el-form-item>
        <el-form-item label="订单状态：">
          {{ order.order.status }}
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
        <el-form-item label="折扣：">
          <el-row v-for="(c, i) in order.discounts" :key="i">
            <el-col style="width: 80px; text-align: center;">{{ c.type }}：</el-col>
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
        <el-form-item>
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
        order: null,
        member: {}
      }
    },
    methods: {
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
    },
    computed: {
      memberDiscount () {
        if (this.order.discounts.length > 0) {
          return (this.order.discounts[0].discount * 10).toFixed(2) + '折'
        } else {
          return '无'
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
</style>
