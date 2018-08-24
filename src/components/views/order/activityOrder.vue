<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="订单编号：">
          <el-input v-model="formInline.name" placeholder="请输入订单号..."></el-input>
        </el-form-item>
        <el-form-item label="票号：">
          <el-input v-model="formInline.ticketCode" placeholder="请输入票号..."></el-input>
        </el-form-item>
        <el-form-item label="会员手机号：">
          <el-input v-model="formInline.mobile" placeholder="请输入手机号..."></el-input>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="formInline.startDate"
            type="datetime"
            placeholder="开始时间"
            :clearable="false"
            align="right">
          </el-date-picker>
          <el-date-picker
            v-model="formInline.endDate"
            type="datetime"
            placeholder="结束时间"
            :clearable="false"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态：">
          <el-select v-model="formInline.category" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="待付款" value="待付款"></el-option>
            <el-option label="已支付" value="已支付"></el-option>
            <el-option label="退款中" value="退款中"></el-option>
            <el-option label="已退款" value="已退款"></el-option>
            <el-option label="失效" value="失效"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售票终端：">
          <el-select v-model="formInline.saleSource" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="安卓 APP" value="android app"></el-option>
            <el-option label="IOS APP" value="ios app"></el-option>
            <el-option label="IOS PAD" value="ios ipad"></el-option>
            <el-option label="PC端" value="web admin"></el-option>
            <el-option label="微信公众号" value="wx"></el-option>
            <el-option label="售票机" value="vending machine"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <a href="javascript:void(0)" @click="downloadExcel" class="btn-link">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="code" label="订单编号">
        </el-table-column>
        <el-table-column prop="createTime" label="订单日期">
        </el-table-column>
        <el-table-column prop="eventId" label="活动编号">
        </el-table-column>
        <el-table-column prop="eventNo" label="活动凭证">
        </el-table-column>
        <el-table-column prop="euStatus" label="核销状态"></el-table-column>
        <el-table-column prop="employeeNo" label="员工工号">
          <template scope="scope">
            {{ scope.row.employeeNo ? scope.row.employeeNo : '系统' }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="会员名称">
        </el-table-column>
        <el-table-column prop="mobile" label="会员手机号">
        </el-table-column>
        <el-table-column prop="price" label="订单总金额">
        </el-table-column>
        <el-table-column prop="paid" label="实付金额">
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template scope="scope">
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">查看</el-button>
            <el-button v-show="scope.row.status === '已支付' && scope.row.paid > 0"
                       type="warning"
                       size="small"
                       @click="refundTicket(scope.row.id)">申请退款</el-button>
            <el-button type="success"
                       size="small"
                       v-show="scope.row.isInvoice === 0 && scope.row.status === '已支付'"
                       @click="invoice(scope.row.id)">开票</el-button>
            <el-button type="default"
                       :disabled="true"
                       size="small"
                       v-show="scope.row.isInvoice === 1">已开票</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="退款原因：">
          <el-col :span="12">
            <el-input v-model="reason" type="textarea" :rows="3" placeholder="请输入退款原因..."></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
  import moment from 'moment'
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import InvoiceMixin from '@/common/mixin/invoice.js'
  export default {
    mixins: [InvoiceMixin],
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          category: '',
          name: '',
          endDate: new Date(new Date().setHours(23, 59, 59, 0)),
          startDate: new Date(new Date().setHours(0, 0, 0, 0)),
          saleSource: '',
          mobile: '',
          ticketCode: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        categoryList: [],
        dialogFormVisible: false,
        reason: '',
        orderId: ''
      }
    },
    components: {
      Pager: Pager
    },
    computed: {
      exportLink () {
        return URL.api_name + 'backofficeapi/order/export-by-store-id.do' + '?code=' + this.formInline.name +
          '&status=' + this.formInline.category +
          '&endDate=' + this.endDate +
          '&startDate=' + this.startDate +
          '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&type=' + '活动' +
          '&saleSource=' + this.formInline.saleSource +
          '&mobile=' + this.formInline.mobile +
          '&eventNo=' + this.formInline.ticketCode +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId
      },
      startDate () {
        if (this.formInline.startDate === '') {
          return ''
        } else {
          return moment(this.formInline.startDate).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      endDate () {
        if (this.formInline.endDate === '') {
          return ''
        } else {
          return moment(this.formInline.endDate).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    methods: {
      downloadExcel () {
        // location.href = this.exportLink
        window.open(this.exportLink, '_blank')
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
        axios.get(URL.api_name + 'backofficeapi/order/find-by-store-id.do', {
          params: {
            code: this.formInline.name,
            status: this.formInline.category,
            endDate: this.endDate,
            startDate: this.startDate,
            pageSize: this.pageSize,
            pageNum: num,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            type: '活动',
            saleSource: this.formInline.saleSource,
            mobile: this.formInline.mobile,
            eventNo: this.formInline.ticketCode
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
          path: '/activityOrderDetail/' + id
        })
      },
      goPay (id) {
        this.$router.push({
          path: '/chooseWay/' + id
        })
      },
      printAgain (id) {
        this.$router.push({
          path: '/ticketInstance/' + id + '/ticketOrder'
        })
      },
      refundTicket (id) {
        this.orderId = id
        this.dialogFormVisible = true
      },
      confirm () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/order/refund.do', {
          params: {
            orderId: this.orderId,
            reason: this.reason
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.reason = ''
            that.dialogFormVisible = false
            that.$message({
              type: 'success',
              message: '退款申请已提交'
            })
            that.getListData(this.currentPage)
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .btn-link{
    display: inline-block;
    text-align: center;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    text-decoration: none;
    background-color: #13CE66;
    color: #fff;
  }
  .coupon-logo{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    vertical-align: bottom;
  }
</style>
