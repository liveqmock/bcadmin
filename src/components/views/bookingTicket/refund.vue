<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 票务管理</el-breadcrumb-item>
        <el-breadcrumb-item>退款</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="订单编号：">
          <el-input v-model="formInline.name" placeholder="请输入订单编号..."></el-input>
        </el-form-item>
        <el-form-item label="退款状态：">
          <el-select v-model="formInline.category" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="待退款" value="待退款"></el-option>
            <el-option label="退款中" value="退款中"></el-option>
            <el-option label="已退款" value="已退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="orderCode" label="订单编号">
        </el-table-column>
        <el-table-column prop="createTime" label="订单日期">
        </el-table-column>
        <el-table-column prop="description" label="审批意见">
        </el-table-column>
        <el-table-column prop="reason" label="退款原因">
        </el-table-column>
        <el-table-column label="实付金额">
          <template scope="scope">
            ¥{{ scope.row.paid }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button type="info" size="small" @click="goEdit(scope.row.orderId)">查看</el-button>
            <el-button v-show="scope.row.status === '待退款'" type="warning" size="small" @click="refundTicket(scope.row.id, scope.row.orderId, '已退款')">同意</el-button>
            <el-button v-show="scope.row.status === '待退款'" type="warning" size="small" @click="refundTicket(scope.row.id, scope.row.orderId, '已拒绝')">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="审核意见：">
          <el-col :span="12">
            <el-input v-model="description" type="textarea" :rows="3" placeholder="请输入审核意见..."></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading1">
          {{ loading1 ? '正在提交' : '确定' }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="退款清单" :visible.sync="dialogFormVisible2">
      <el-row>
        <el-col :offset="6">
          <p class="pay-item tip">
            微信，支付宝退款将原路返回,其他支付方式由财务线下退款
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="6">
          <p class="pay-item">
            支付记录
          </p>
        </el-col>
      </el-row>
      <el-row v-for="(c, i) in payments" :key="i">
        <el-col :offset="8">
          <p class="pay-item">
            <span>{{ c.orderPayType }}：</span>
            <span>{{ c.orderAmount }}</span>
          </p>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        payments: [],
        dialogFormVisible2: false,
        formInline: {
          category: '',
          name: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        categoryList: [],
        dialogFormVisible: false,
        description: '',
        status: '',
        orderId: '',
        id: '',
        loading1: false
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      closeDialog () {
        this.dialogFormVisible2 = false
        this.getListData(this.currentPage)
      },
      // 微信退款
      wxpayrefund (data) {
        let that = this
        axios.get(URL.api_name + 'payapi/wx/wxpayrefund.do', {
          params: {
            out_trade_no: data.orderCode,
            refund_fee: data.orderAmount,
            total_fee: data.orderAmount,
            userId: data.memberId,
            transaction_id: ''
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.dialogFormVisible2 = true
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      // 支付宝退款
      alirefund (data) {
        let that = this
        axios.get(URL.api_name + 'payapi/alipay/alirefund.do', {
          params: {
            outTradeNo: data.orderCode,
            refundAmount: data.orderAmount,
            userId: data.memberId,
            transaction_id: ''
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.dialogFormVisible2 = true
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      // 公众号退款
      wechatRefund (data) {
        let that = this
        axios.get(URL.api_name + 'payapi/wx/wxpublicpayrefund.do', {
          params: {
            out_trade_no: data.orderCode,
            refund_fee: data.orderAmount,
            total_fee: data.orderAmount,
            userId: data.memberId,
            transaction_id: ''
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.dialogFormVisible2 = true
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      confirm () {
        var that = this
        that.loading1 = true
        axios.post(URL.api_name + 'backofficeapi/order/refund/update.do', {
          description: this.description,
          id: this.id,
          orderId: this.orderId,
          status: this.status
        }).then((res) => {
          that.loading1 = false
          if (res.data.status === 'success') {
            that.description = ''
            that.dialogFormVisible = false
            that.payments = res.data.data
            if (that.status === '已退款') {
              // 同意
              // that.getListData()
              if (that.payments) {
                // 循环退款方式
                for (let p of that.payments) {
                  if (p.orderPayType === '微信') {
                    // 掉微信退款接口
                    that.wxpayrefund(p)
                  } else if (p.orderPayType === '支付宝') {
                    // 掉支付宝退款接口
                    that.alirefund(p)
                  } else if (p.orderPayType === '公众号') {
                    // 掉公众号退款接口
                    that.wechatRefund(p)
                  } else {
                    // 线下退款
                    that.dialogFormVisible2 = true
                  }
                }
              } else {
                that.getListData(that.currentPage)
                that.$message({
                  type: 'success',
                  message: res.data.message
                })
              }
            } else if (that.status === '已拒绝') {
              // 驳回
              that.getListData(that.currentPage)
            }
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      addCoupon () {
        this.$router.push({
          path: '/addCoupon'
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/order/refund/search.do', {
          params: {
            orderCode: this.formInline.name,
            status: this.formInline.category,
            pageSize: this.pageSize,
            pageNum: num,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            refundType: 'P'
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
        }, function (error) {
          console.log(error)
          that.loading = false
          that.$message({
            type: 'error',
            message: '查询失败',
            duration: 1000
          })
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/refundDetail/' + id + '/P'
        })
      },
      refundTicket (id, orderId, status) {
        this.id = id
        this.orderId = orderId
        this.status = status
        this.dialogFormVisible = true
      }
    }
  }
</script>
<style lang="less" scoped>
  .pay-item{
    line-height: 20px;
  }
  .tip{
    color: #13CE66;
  }
</style>
