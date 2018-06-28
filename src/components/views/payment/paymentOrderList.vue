<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="条件查询">
          <el-select v-model="formInline.province" style="width: 160px;"  @change="chooseCity">
            <el-option label="省" value=""></el-option>
            <el-option v-for="(g, index) in provinces" :key="index" :label="g.name" :value="g.id"></el-option>
          </el-select>
          <el-select v-model="formInline.city" style="width: 200px;">
            <el-option label="市区" value=""></el-option>
            <el-option v-for="(g, index) in citys" :key="index" :label="g.name" :value="g.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店">
          <el-select v-model="formInline.storeId" style="width: 200px;">
            <el-option label="全部门店" value=""></el-option>
            <el-option v-for="(g, index) in stores" :key="index" :label="g.v" :value="g.k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input type="text" placeholder="请输入订单号..." v-model="formInline.orderNum"></el-input>
        </el-form-item>
        <!--<el-form-item label="支付类型">
          <el-select v-model="formInline.payType" style="width: 100px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(g, index) in payTypes" :key="index" :label="g.systemName" :value="g.systemCode"></el-option>
          </el-select>
        </el-form-item>-->
        <br/>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="formInline.startTime"
            type="date"
            @change="beginTimeRules"
            :editable='false'
            placeholder="开始时间">
          </el-date-picker>
          <el-date-picker
            v-model="formInline.endTime"
            type="date"
            @change="endTimeRules"
            :editable='false'
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <a :href="exportLink" class="btn-link">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="orderNumber" label="订单号">
        </el-table-column>
        <el-table-column prop="address" label="地区">
        </el-table-column>
        <el-table-column prop="storeName" label="门店名称">
        </el-table-column>
        <!-- <el-table-column prop="paymentName" label="收费名称">
        </el-table-column> -->
        <el-table-column prop="type" label="订单状态">
        </el-table-column>
        <el-table-column prop="employeeNo" label="收款人">
        </el-table-column>
        <el-table-column prop="discount" label="系统折扣">
        </el-table-column>
        <el-table-column prop="accountExec" label="授权账号">
        </el-table-column>
        <el-table-column prop="payType" label="支付类型">
        </el-table-column>
        <!-- <el-table-column prop="" label="卡券优惠">
        </el-table-column> -->
        <el-table-column prop="orderTotalAmount" label="订单金额">
        </el-table-column>
        <!--<el-table-column prop="totalAmount" label="实收金额">
        </el-table-column>-->
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="primary" size="small" @click="goDetail(scope.row.orderNumber)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      this.getProvince()
      // this.getStores()
      this.getPayType()
    },
    data () {
      return {
        formInline: {
          province: '',
          city: '',
          startTime: '',
          endTime: '',
          payType: '',
          storeId: '',
          orderNum: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        isFirst: true,
        tableData: [],
        currentPage: 1,
        provinces: [],
        citys: [],
        payTypes: [],
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        categoryList: []
      }
    },
    components: {
      Pager: Pager
    },
    computed: {
      exportLink () {
        return URL.api_name + 'backofficeapi/payment/export/list.do' +
          '?province=' + this.formInline.province +
          '&city=' + this.formInline.city +
          '&startime=' + this.formInline.startTime +
          '&endtime=' + this.formInline.endTime +
          '&storeid=' + this.storeId +
          '&paytype=' + this.formInline.payType +
          '&orderNum=' + this.formInline.orderNum +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId
      },
      stores () {
        if (sessionStorage.getItem('userInfo')) {
          return JSON.parse(sessionStorage.getItem('userInfo')).stores
        } else {
          return []
        }
      }
    },
    methods: {
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      getProvince () {
        let that = this
        axios.get(URL.api_name + '/backofficeapi/store/initialPosition.do', {
          params: {}
        }).then((res) => {
          that.provinces = res.data.data.provinces
        })
      },
      getStores () {
        let that = this
        axios.get(URL.api_name + '/backofficeapi/store/down.do', {
          params: {}
        }).then((res) => {
          that.stores = res.data.data
        })
      },
      chooseCity (val) {
        let that = this
        axios.get(URL.api_name + '/backofficeapi/store/obtainCitiesOrAreas.do', {
          params: {
            province: val
          }
        }).then((res) => {
          that.citys = res.data.data.citys
          if (!that.isFirst) {
            that.formInline.city = ''
          }
          this.isFirst = false
        }, function (error) {
          console.log(error)
        })
      },
      addCoupon () {
        this.$router.push({
          path: '/paymentAdd'
        })
      },
      getListData (num) {
        console.log(num)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/payment/list.do', {
          params: {
            province: this.formInline.province,
            city: this.formInline.city,
            startime: this.formInline.startTime,
            endtime: this.formInline.endTime,
            storeid: this.storeId,
            paytype: this.formInline.payType,
            pageSize: this.pageSize,
            pageNum: num,
            orderNumber: this.formInline.orderNum
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
      goDetail (orderId) {
        this.$router.push({
          path: '/oldOrderDetail/' + orderId
        })
      },
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.endTime)
        this.formInline.startTime = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.startTime = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.startTime)
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
      getPayType () {
        // 有待编辑
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'pay_type'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.payTypes = res.data.data
          }
        })
      },
      deleteTicket (id) {
        var that = this
        that.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/paymentcategory/delete.do', {
            params: {
              id: id
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000
              })
              that.getListData(that.currentPage)
            }
          }).catch(err => {
            that.$message({
              type: 'error',
              message: '删除失败',
              duration: 1000
            })
            console.log(err)
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="less" scoped>
  .btn-link{
    display: inline-block;
    height: 36px;
    line-height: 36px;
    text-align: center;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    text-decoration: none;
    background-color: #13CE66;
    color: #fff;
  }
</style>
