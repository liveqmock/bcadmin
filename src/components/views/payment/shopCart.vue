<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="formInline.name" placeholder="请输入缴费名称"></el-input>
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
        <el-table-column prop="paymentId" label="缴费id">
        </el-table-column>
        <el-table-column prop="paymentName" label="名称">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column label="单价">
          <template scope="scope">
            <el-input v-model.number="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="createUser" label="操作人">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button type="info" size="small" @click="addCart(scope.row.price, scope.row)">加入缴费清单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
    <!-- 缴费清单列表 -->
    <el-col :span="10" v-show="carts.length > 0">
      <div class="shop-cart">
        <h1 class="title"><span class="x" @click="clearCarts">×</span>缴费清单列表</h1>
        <ul>
          <li class="cart-item" v-for="(c, i) in carts" :key="i">
            <div class="check-box">
              <el-checkbox v-model="c.check"></el-checkbox>
            </div>
            <p class="name">{{ c.paymentName }}</p>
            <div class="item">
              <span class="price">¥{{ c.price }}</span>
              <el-button @click="minus(c)" icon="minus" size="mini"></el-button>
              <span class="count">{{ c.number }}</span>
              <el-button @click="plus(c)" icon="plus" size="mini"></el-button>
            </div>
          </li>
        </ul>
        <div class="cart-footer">
          <div>
            <el-checkbox v-model="checkAll" @change="chooseAll"></el-checkbox>
            <span>全选</span>
            <span class="total-label">合计：</span>
            <span class="total-price">¥{{ totalPrice }}</span>
          </div>
          <el-button @click="generateOrder" class="cal-btn" type="primary">结 算</el-button>
        </div>
      </div>
    </el-col>
    <!-- 折扣弹框 -->
    <el-dialog title="购买缴费" :visible.sync="showSendCode">
      <el-form label-width="100px">
        <div class="goods" v-for="(check, i) in checkedData">
          <el-form-item label="商品名称：">
            {{ check.paymentName }}
          </el-form-item>
          <el-form-item label="单价：">
            ¥{{ check.price }}
          </el-form-item>
          <el-form-item label="数量：">
            {{ check.number }}
          </el-form-item>
          <!--<el-form-item label="总金额：">-->
            <!--¥{{ check.price * check.number }}-->
          <!--</el-form-item>-->
          <el-form-item label="订单总金额：">
            ¥{{ totalPrice }}
          </el-form-item>
        </div>
        <el-form-item label="输入手机号：">
          <el-col :span="12">
            <el-input v-model.number="mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="6">
            <el-input v-model="QRcode" @keyup.enter.native="checkCode"></el-input>
          </el-col>
          <el-button :disabled="fetchCodeMsg" @click="setCode">{{ timerCodeMsg }}</el-button>
          回车验证会员信息
        </el-form-item>
        <el-form-item label="应付金额：">
          ¥{{ discountObj.amountPayable ? discountObj.amountPayable : totalPrice }}
        </el-form-item>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" v-model="description" :rows="2"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitOrder" :loading="loadingOrder">{{ loadingOrder ? '正在提交' : '提交订单' }}</el-button>
          <el-button @click="showSendCode = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import { tokenMixin } from '@/common/mixin/token.js'
  export default {
    mixins: [tokenMixin],
    data () {
      return {
        formInline: {
          name: ''
        },
        QRcode: '',
        jump: true,
        timerCodeMsg: '获取验证码',
        fetchCodeMsg: false,
        tableData: [],
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false,
        carts: [],
        authorizeDialog: false,
        authorForm: {
          mobile: '',
          password: ''
        },
        mobile: '',
        hasAtuthory: 0,
        discount: '',
        // 折扣返回值
        discountObj: {},
        loadingOrder: false,
        memberId: '',
        description: '',
        timer: 0
      }
    },
    components: {
      Pager: Pager
    },
    computed: {
      totalPrice () {
        var price = 0
        for (let i = 0; i < this.carts.length; i++) {
          if (this.carts[i].check) {
            price += this.carts[i].number * this.carts[i].price
          }
        }
        return price
      },
      checkAll () {
        for (let i = 0; i < this.carts.length; i++) {
          if (!this.carts[i].check) {
            return false
          }
        }
        return true
      },
      checkedData () {
        let list = []
        for (let i = 0; i < this.carts.length; i++) {
          if (this.carts[i].check) {
            list.push(this.carts[i])
          }
        }
        return list
      }
    },
    methods: {
      chooseAll () {
        if (this.checkAll) {
          // 反选
          for (let i = 0; i < this.carts.length; i++) {
            this.carts[i].check = false
          }
        } else {
          // 正选
          for (let i = 0; i < this.carts.length; i++) {
            this.carts[i].check = true
          }
        }
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
        axios.get(URL.api_name + 'backofficeapi/paymentcategory/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            name: this.formInline.name,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
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
      addCart (price, item) {
        this.$set(item, 'check', true)
        this.$set(item, 'number', 1)
        // alert(price)
        if (price === null) {
          this.$message({
            type: 'error',
            message: '请先设置单价'
          })
          return false
        }
        if (this.carts.length === 0) {
          this.carts.push(item)
        } else {
          for (var i = 0; i < this.carts.length; i++) {
            if (item.paymentId === this.carts[i].paymentId) {
              this.$message({
                type: 'error',
                message: '已购清单中已存在'
              })
              return
            }
          }
          this.carts.push(item)
        }
      },
      countTime () {
        var that = this
        var countTime = 59
        that.timerCodeMsg = countTime + 'S后重新发送'
        that.timer = setInterval(function () {
          countTime--
          that.timerCodeMsg = countTime + 'S后重新发送'
          if (countTime < 0) {
            clearInterval(that.timer)
            that.fetchCodeMsg = false
            that.timerCodeMsg = '重新发送'
          }
        }, 1000)
      },
      setCode () {
        let that = this
        if (that.mobile === '') {
          that.$message({
            message: '请先输入手机号',
            type: 'error'
          })
          return false
        }
        that.fetchCodeMsg = true
        let area, mobile
        if (that.mobile.toString().indexOf('852') > -1) {
          area = 852
          mobile = that.mobile.toString().split('852')[1]
        } else {
          area = 86
          mobile = that.mobile
        }
        axios.get(URL.api_name + 'memberapi/api/sendCheckCode.do', {
          params: {
            area: area, // 大陆：86，香港 852 默认86
            mobile: mobile,
            type: 41,
            token: this.token
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            this.$succssMsg(res.data.message)
            this.setToken()
            this.countTime()
          } else {
            that.fetchCodeMsg = false
            this.$errMsg(res.data.message)
          }
        })
      },
      checkCode () {
        let that = this
        let area, mobile
        if (that.mobile.toString().indexOf('852') > -1) {
          area = 852
          mobile = that.mobile.toString().split('852')[1]
        } else {
          area = 86
          mobile = that.mobile
        }
        if (that.mobile !== '' && that.QRcode !== '') {
          axios.get(URL.api_name + 'memberapi/api/checkUserInfo.do', {
            params: {
              area: area,
              checkCode: that.QRcode,
              mobile: mobile,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.memberId = res.data.data.memberId
              that.$message({
                message: '获取用户信息成功',
                type: 'success'
              })
              // 验证成功后，获取用户信息
            } else {
              clearInterval(this.timer)
              this.setToken()
              this.fetchCodeMsg = false
              this.timerCodeMsg = '获取验证码'
              that.$message({
                message: '验证失败：' + res.data.message,
                type: 'error'
              })
              // that.mobile = ''
              that.QRcode = ''
              return false
            }
          }).catch((error) => {
            that.isLoading = false
            console.log(error)
          })
        } else if (that.mobile !== '' && that.QRcode === '') {
          that.$message({
            message: '请输入验证码',
            type: 'error'
          })
        }
      },
      plus (item) {
        item.number++
      },
      minus (item) {
        if (item.number <= 1) {
          this.carts.splice(this.carts.indexOf(item), 1)
        } else {
          item.number--
        }
      },
      generateOrder () {
        this.showSendCode = !this.showSendCode
      },
      clearCarts () {
        this.carts = []
      },
      submitOrder () {
        let submitList = []
        var that = this
        console.log(that.checkedData)
        for (let c of that.checkedData) {
          submitList.push({
            itemDefId: c.paymentId,
            itemDefName: c.paymentName,
            itemType: '缴费',
            price: c.price,
            quantity: c.number
          })
        }
        that.loadingOrder = true
        axios.post(URL.api_name + 'backofficeapi/order/purchase.do', {
          items: submitList,
          order: {
            cashierId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            name: submitList[0].itemDefName + '等共' + submitList.length + '件商品',
            saleSource: 'web admin',
            code: 'G',
            type: '缴费',
            userId: that.memberId,
            description: that.description
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            let orderId = res.data.data.items[0].orderId
            that.$router.push({
              path: '/paymentDiscount/' + orderId
            })
          } else {
            that.loadingOrder = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
          that.loadingOrder = false
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
  .coupon-logo{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    vertical-align: bottom;
  }
  .shop-cart{
    border: 1px solid #999;
  }
  .cart-item{
    position: relative;
    padding: 10px 10px 10px 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
  }
  .check-box{
    position: absolute;
    top: 31%;
    left: 3%;
  }
  .cart-footer{
    margin-top: 20px;
    background-color: #ebebeb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
  }
  .total-label{
    margin-left: 20px;
  }
  .total-price{
    color: red;
  }
  .name{
    height: 20px;
    line-height: 20px;
    margin-bottom: 5px;
  }
  .price{
    margin-right: 10px;
    display: inline-block;
    width: 100px;
  }
  .item{
    display: flex;
    align-items: center;
  }
  .title{
    background-color: #00d1b2;
    color: #fff;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
  .price{
    color: red;
  }
  .count{
    display: inline-block;
    text-align: center;
    width: 35px;
    height: 20px;
    line-height: 20px;
    margin: 0 5px;
    border: 1px solid #ebebeb;
  }
  .cal-btn{
    border-radius: 0;
    width: 100px;
  }
  .goods{
    border-bottom: 1px solid #ebebeb;
  }
  .el-form-item{
    margin-bottom: 5px;
  }
  .x{ float: right; colr:#fff; margin-right:10px; cursor: pointer}
</style>
