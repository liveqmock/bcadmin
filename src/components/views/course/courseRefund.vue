<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>退款管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键字：">
          <el-input v-model="formInline.keyword" placeholder="请输入会员账号"></el-input>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="formInline.verityStatus" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="待批准" :value="1"></el-option>
            <el-option label="已批准" :value="2"></el-option>
            <el-option label="不批准" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态：">
          <el-select placeholder="请选择" v-model="formInline.orderStatus">
            <el-option label="全部" value=""></el-option>
            <el-option label="待退款" value="待退款"></el-option>
            <el-option label="已退款" value="已退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间：">
          <el-date-picker v-model="formInline.startTime"
                          type="datetime"
                          @change="getStartTime"
                          placeholder="开始时间">
          </el-date-picker>
          <el-date-picker v-model="formInline.endTime"
                          type="datetime"
                          @change="getEndTime"
                          placeholder="结束时间">
          </el-date-picker>
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
        <el-table-column label="订单编号">
          <template scope="scope">
            <router-link :to="'/sellCourseOrderDetail/' + scope.row.orderId + '/refund'">{{ scope.row.orderCode }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="memberId" label="会员编号">
        </el-table-column>
        <el-table-column prop="memberMobile" label="会员账号">
        </el-table-column>
        <el-table-column prop="basicCourseNumLeft" label="基础课节">
        </el-table-column>
        <el-table-column label="退款金额">
          <template scope="scope">
            ¥{{ scope.row.refundAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="refundRemark" label="申请理由">
        </el-table-column>
        <el-table-column prop="auditopinion" label="审批意见">
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间">
        </el-table-column>
        <el-table-column label="审核状态">
          <template scope="scope">
            <el-tag v-if="scope.row.applyStatus === 1" type="danger">{{ scope.row.applyStatus | formatApplyStatus }}</el-tag>
            <el-tag v-else-if="scope.row.applyStatus === 2" type="success">{{ scope.row.applyStatus | formatApplyStatus }}</el-tag>
            <el-tag v-else="scope.row.applyStatus === 3" type="gray">{{ scope.row.applyStatus | formatApplyStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <!--<el-button type="info" size="small" @click="goEdit(scope.row.refundId, scope.row.memberId)">查看</el-button>-->
            <el-button v-show="scope.row.applyStatus === 1" type="warning" size="small" @click="refundTicket(scope.row.refundId, 2)">同意</el-button>
            <el-button v-show="scope.row.applyStatus === 1" type="warning" size="small" @click="refundTicket(scope.row.refundId, 3)">拒绝</el-button>
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
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="退款清单" :visible.sync="dialogFormVisible2">
      <el-row>
        <el-col :offset="6">
          <p class="pay-item tip">
            课程退款由财务线下退款
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
  import moment from 'moment'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        payments: [],
        dialogFormVisible2: false,
        formInline: {
          keyword: '',
          verityStatus: '',
          orderStatus: '',
          startTime: '',
          endTime: ''
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
        id: ''
      }
    },
    computed: {
      cStartTime () {
        if (this.formInline.startTime !== '') {
          return moment(this.formInline.startTime).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      cEndTime () {
        if (this.formInline.endTime !== '') {
          return moment(this.formInline.endTime).format('YYYY-MM-DD')
        } else {
          return ''
        }
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      getStartTime (val) {
        this.formInline.startTime = val
      },
      getEndTime (val) {
        this.formInline.endTime = val
      },
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
            transaction_id: '',
            refundMoney: data.refundMoney
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
            transaction_id: '',
            refundMoney: data.refundMoney
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
        axios.get(URL.api_name + 'backofficeapi/course/refund/courserefundaudit.do', {
          params: {
            auditopinion: this.description,
            refundId: this.id,
            applyStatus: this.status
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.description = ''
            that.dialogFormVisible = false
            if (that.status === 2) {
              // 同意
              that.payments = res.data.data
              if (that.payments) {
                // 循环退款方式
                for (let p of res.data.data) {
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
                that.dialogFormVisible = false
                // 刷新列表
                that.$message({
                  type: 'success',
                  message: res.data.message
                })
                that.getListData()
              }
            } else if (that.status === 3) {
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
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/refund/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            AuditState: this.formInline.verityStatus,
            createTimeBegin: this.formInline.startTime,
            createTimeEnd: this.formInline.endTime,
            memberMobile: this.formInline.keyword,
            orderStatus: this.formInline.orderStatus,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(function (res) {
          that.loading = false
          if (res.data.status === 'success') {
            let data = res.data
            that.tableData = data.data.list
            that.totalCount = data.data.total
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
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
      goEdit (rid, mid) {
        this.$router.push({
          path: '/courseRefundDetail/' + rid + '/' + mid
        })
      },
      refundTicket (id, status) {
        this.id = id
        this.status = status
        this.dialogFormVisible = true
      }
    }
  }
</script>
<style lang="less" scoped>
  .coupon-logo{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    vertical-align: bottom;
  }
  .pay-item{
    line-height: 20px;
  }
  .tip{
    color: #13CE66;
  }
</style>
