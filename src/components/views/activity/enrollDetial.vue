<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>报名情况</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input type="text" placeholder="请输入会员手机号..." v-model="formInline.mobile"></el-input>
        </el-form-item>
        <el-form-item label="报名方式">
          <el-select v-model="formInline.signType">
            <el-option label="全部" value=""></el-option>
            <el-option label="金额" value="1"></el-option>
            <el-option label="积分" value="2"></el-option>
            <el-option label="课程" value="3"></el-option>
            <el-option label="网页" value="4"></el-option>
            <el-option label="APP" value="5"></el-option>
            <el-option label="公众号" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="formInline.status">
            <el-option label="已报名" value="已报名"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="formInline.begenTime"
            type="date"
            :editable='false'
            @change="beginTimeRules"
            placeholder="">
          </el-date-picker>
          <div class="Zvertical">至</div>
          <el-date-picker
            v-model="formInline.endTime"
            type="date"
            :editable='false'
            @change="endTimeRules"
            placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="userId" label="会员编号">
        </el-table-column>
        <el-table-column prop="mobile" label="会员手机号">
        </el-table-column>
        <el-table-column prop="signUpTime" label="报名时间">
        </el-table-column>
        <el-table-column prop="signType" label="报名方式">
        </el-table-column>
         <el-table-column prop="voucher" label="活动凭证">
        </el-table-column>
        <el-table-column prop="signCondition" label="报名条件">
        </el-table-column>
        <el-table-column prop="signMoney" label="报名总价">
        </el-table-column>
        <el-table-column prop="signPoint" label="积分">
        </el-table-column>
        <el-table-column prop="signCourse" label="课节">
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
        </el-table-column>
        <el-table-column prop="status" label="用户状态">
        </el-table-column>
        <el-table-column prop="verificationTime" label="核销时间">
        </el-table-column>
        <el-table-column width="190px" label="操作">
          <template scope="scope">
            <el-button :disabled="scope.row.verificationTime !== undefined" type="primary" size="small" @click="verify(scope.row)">核销</el-button>
            <el-button type="success" size="small" @click="lookMore(scope.row)">查看更多</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查看更多弹窗 -->
    <el-dialog title="购买详情"
               :visible.sync="orderDialog"
               :show-close="false"
               :close-on-click-modal="false">
      <el-row style="line-height: 30px;">
        <el-col :span="12">订单编号：{{lookMoreData.orderNumber}}</el-col>
        <el-col :span="12">数量：{{lookMoreData.quantity}}</el-col>
      </el-row>
      <el-row style="line-height: 30px;">
        <el-col :span="12">订单时间：{{lookMoreData.orderTime}}</el-col>
        <el-col :span="12">单价：{{lookMoreData.price}}元</el-col>
      </el-row>
      <el-row style="line-height: 30px;">
        <el-col :span="12">购买品类：{{lookMoreData.itemDefName}}</el-col>
        <el-col :span="12">总价：{{lookMoreData.amount}}元</el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="10">&nbsp;</el-col>
        <el-col :span="6">
          <el-button type="default" @click="orderDialog = false">关闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 核销弹窗 -->
    <el-dialog title="核销"
               :visible.sync="verifyDialog"
               :show-close="false"
               :close-on-click-modal="false">
        <el-form label-width=""></el-form>
      <el-row>
        <el-col :span="4" style="height: 36px;line-height: 36px;">二维码凭证：</el-col>
        <el-col :span="16">
          <el-input placeholder="回车查询二维码凭证..."
                    type="text"
                    v-model="ticketCode"
                    :autofocus="true"
                    @keyup.enter.native="fetchVerifyData"></el-input>
        </el-col>
      </el-row>
      <el-form label-width="100px">
        <el-form-item label="订单编号：">{{verifyData.orderId}}</el-form-item>
        <el-form-item label="订单时间：">{{verifyData.orderTime}}</el-form-item>
        <el-form-item label="活动凭证：">{{verifyData.voucher}}</el-form-item>
        <el-form-item label="会员手机号：">{{verifyData.mobile}}</el-form-item>
        <el-form-item label="活动名称：">{{verifyData.title}}</el-form-item>
        <el-form-item label="购买品类：">{{verifyData.defName}}</el-form-item>
        <el-form-item label="单价：">{{verifyData.price}}</el-form-item>
        <el-form-item label="数量：">{{verifyData.quantity}}</el-form-item>
        <el-form-item label="支付总金额：">{{verifyData.amount}}</el-form-item>
        <el-form-item>
          <el-button type="primary" @click="verifyConfirm" :loading="confirmLoading">确认核销</el-button>
          <el-button type="default" @click="cancelVerify">取消</el-button>
        </el-form-item>
      </el-form>
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
        database: 'data:image/jpeg;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAD5ElEQVR42u3dUW7jMAwFwPT+h+6eYIEG4iNpax76VSSOY08Amrakz69IIB+HQMASsAQsEbAELAFLBCwBS8ASAUvAErBEwBKwBCwRsAQsAUsELAFLwBIBS8ASsEQWwfp8fsr/vt3+/15/sv9/2ea3+5zYz6rjDBZYYIEFFlhg7YWV2E4nrG+3k/7uU58FFlhggQUWWGDthVUF4mT7ic+quiBIXEAkfnhggQUWWGCBBdY7YU1dKJzsW1UTGCywwAILLLDAAmtjYzN987jzRwIWWGCBBRZYYIE1CTSRk31IN0inzhdYYIEFFlhggdUHKz2Ywv+N0gELLLDAAsv/b4HVWTifFL9VFxDphudzAxZYYIEFFlhgdYNIP8iWKFrTFxnp5vBri3ewwAILLLDAugRW56CJKiiJRmWigZy+gAALLLDAAgsssJ5RvE9N2JoohLc1MNODRMACCyywwAILrGfASjTo0geu871Tg0fAAgsssMACC6x7i/cqrImb0CffPXHzeMOAXrDAAgsssMAC63dkMEVnE3Jq8rQnLtgJFlhggQUWWGC9p3jftuhSJ8SqCwUNUrDAAgsssMC6C1biy2x4byemzoccwQILLLDAAgus9zdIpxYA37ZoVAIZWGCBBRZYYIH1/nGFVWg2TIxW1aTt/AEHzz5YYIEFFlhggTVYpFcVmBtQJor65052AhZYYIEFFlhgdTdF083MqRO84cHAqiYtWGCBBRZYYIG1C1bi5mjnokXbIG44VmCBBRZYYIEF1i5YUyc1cZI2TKSWLurBAgsssMACC6znFe9V7+1c/PIEUPpCJ3E8wQILLLDAAgusZxfvUwVvZyNxaqGDq68KwQILLLDAAuvCPlbngNINr99wg3kWGVhggQUWWGCB1d0g7fzynROgpfe56jWvvQkNFlhggQUWWBc2SKcmh+08YSc/tqrX70EGFlhggQUWWGBthHVy4DoX4Ox8IDHxAwMLLLDAAgsssN4Dq3NRpA1wp/76m6JggQUWWGCBBVYKVnx3h4rWdFN0w3vBAgsssMACC6xnFO+JIjTR5EycsM4m58k2rxilAxZYYIEFFlgvvleY3s7U5P1PvGi4YrYZsMACCyywwLoE1rZJQRIDLtIDRjZMsgIWWGCBBRZYYN0Fa0Nhnoa+c8FLsMACCyywwALrFljpz90wcUhVAa54BwsssMACCyzPY1W+d8Ni44liHyywwAILLLDAej+s9GCKRFHcOQlH5wVEf+MULLDAAgsssMASqQ9YApaAJWCJgCVgCVgiYAlYApYIWAKWgCUCloAlYImAJWAJWCJgCVgClghYApaAJXKUf56liK2Fs4dKAAAAAElFTkSuQmCC',
        verifyDialog: false,
        orderDialog: false,
        ticketCode: '',
        confirmLoading: false,
        verifyData: {},
        lookMoreData: {},
        formInline: {
          begenTime: '',
          endTime: '',
          mobile: '',
          signType: '',
          status: ''
        },
        searchTypes: [{
          value: '1',
          label: '已发布'
        }, {
          value: '2',
          label: '未发布'
        }],
        tableData: [],
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      lookMore (item) {
        this.lookMoreData = item
        this.orderDialog = true
      },
      cancelVerify () {
        this.verifyDialog = false
        this.ticketCode = ''
      },
      verifyConfirm () {
        this.confirmLoading = true
        axios.get(URL.api_name + 'backofficeapi/information/event/verification.do', {
          params: {
            euId: this.verifyData.euId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.$succssMsg(res.data.message)
            this.confirmLoading = false
            this.verifyDialog = false
            this.getListData(this.currentPage)
          } else {
            this.$errMsg(res.data.message)
            this.confirmLoading = false
          }
        }).catch(err => {
          console.log(err)
          this.confirmLoading = false
          this.$errMsg('请求失败，请稍候重试！')
        })
      },
      fetchVerifyData () {
        axios.get(URL.api_name + 'backofficeapi/information/event/search/verification.do', {
          params: {
            ticketCode: this.ticketCode
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.verifyData = res.data.data
          }
        })
      },
      verify (id) {
        this.verifyDialog = true
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.endTime)
        this.formInline.begenTime = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.begenTime = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.begenTime)
        let date2 = moment(val)
        this.formInline.endTime = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.endTime = ''
        }
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/information/event/signup/list.do', {
          params: {
            storeId: that.storeId,
            id: that.$route.params.eid,
            signBeginTime: '',
            signEndTime: '',
            pageSize: that.pageSize,
            pageNum: num,
            mobile: this.formInline.mobile
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
      detial (eid) {
        this.$router.push({
          path: '/enrollDetial/' + eid
        })
      },
      subActivity () {
        this.$router.push({
          path: '/activityAdd'
        })
      }
    },
    computed: {
      options () {
        return JSON.parse(sessionStorage.getItem('data')).options
      }
    }
  }
</script>
<style lang="less" scoped>
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
</style>
