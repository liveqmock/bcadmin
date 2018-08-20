<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 收银管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品收银</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="formInline.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input @keyup.enter.native="searchCode(formInline.productCode)" v-model="formInline.productCode" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="规格名称">
          <el-input v-model="formInline.standard" placeholder="请输入规格名称..."></el-input>
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
        <el-table-column prop="productCode" label="商品编号">
        </el-table-column>
        <el-table-column prop="name" label="商品名称">
        </el-table-column>
        <el-table-column prop="standard" label="规格名称">
        </el-table-column>
        <el-table-column prop="type" label="商品类型">
        </el-table-column>
        <el-table-column prop="changeIntegral" label="兑换积分">
        </el-table-column>
        <el-table-column prop="stock" label="库存">
        </el-table-column>
        <el-table-column label="原价">
          <template scope="scope">
            ¥{{ scope.row.sellingPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣">
        </el-table-column>
        <el-table-column label="现价">
          <template scope="scope">
            ¥{{ scope.row.nowPrice }}
          </template>
        </el-table-column>
        <!--<el-table-column prop="createBy" label="操作人">
        </el-table-column>-->
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="info" size="small" @click="addCart(scope.row)">加入购物车</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
    <!-- 购物车列表 -->
    <el-col :span="10" v-show="carts.length > 0">
      <div class="shop-cart">
        <h1 class="title"><span class="x" @click="clearCarts">×</span>购物车列表</h1>
        <ul>
          <li class="cart-item" v-for="(c, i) in carts" :key="i">
            <div class="check-box">
              <el-checkbox v-model="c.check"></el-checkbox>
            </div>
            <p class="name">{{ c.standard }}</p>
            <div class="item">
              <span class="price">¥{{ c.nowPrice }}</span>
              <el-button @click="minus(c)" icon="minus" size="mini"></el-button>
              <span class="count">
                <input class="inputText" v-model="c.number" @change="textChange(c)" type="text"/>
              </span>
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
    <el-dialog title="购买商品" :visible.sync="showSendCode">
      <el-form label-width="100px">
        <div class="goods" v-for="(check, i) in checkedData">
          <el-form-item label="商品名称：">
            {{ check.name }}
          </el-form-item>
          <el-form-item label="单价：">
            ¥{{ check.nowPrice }}
          </el-form-item>
          <el-form-item label="数量：">
            {{ check.number }}
          </el-form-item>
          <el-form-item label="兑换积分：" v-show="checkedData.length > 0 && checkedData[0].changeIntegral">
            {{ check.changeIntegral * check.number }}积分
          </el-form-item>
          <el-form-item label="订单总金额：">
            ¥{{ totalPrice }}
          </el-form-item>
        </div>
        <el-form-item label="系统折扣：">
          <el-col :span="4">
            <el-input v-model.number="discount" :disabled="hasAtuthory === 0"></el-input>
          </el-col>
          <el-button @click="authorizeDialog = true">授权</el-button>
        </el-form-item>
        <div>
          <el-form-item label="输入手机号：">
            <el-col :span="12">
              <el-input v-model.number="mobile"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="6">
              <el-input v-model="QRcode" @keyup.enter.native='checkCode'></el-input>
            </el-col>
            <el-button :disabled="fetchCodeMsg" @click="setCode">{{ timerCodeMsg }}</el-button>
            <small>输完验证码回车查询会员信息</small>
          </el-form-item>
        </div>
        <div>
          <!--<el-form-item label="折扣：">
            {{ discountObj.effect ? discountObj.effect : 0 }}¥
          </el-form-item>-->
          <el-form-item label="应付金额：">
            ¥{{ discountObj.amountPayable ? discountObj.amountPayable : totalPrice }}
          </el-form-item>
        </div>
        <div v-show="checkedData.length > 0 && checkedData[0].changeIntegral">
          <el-form-item label="订单总积分：">
            {{ totalPoint }}积分
          </el-form-item>
          <el-form-item label="会员积分：">
            {{ memberPoint }}积分
          </el-form-item>
        </div>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" v-model="description" :rows="2"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-show="checkedData.length > 0 && checkedData[0].changeIntegral"
            @click="exchange" :loading="loadingPoint">{{ loadingOrder ? '正在兑换' : '兑换' }}</el-button>
          <el-button
            type="info"
            @click="submitOrder" :loading="loadingOrder">{{ loadingOrder ? '正在提交' : '提交订单' }}</el-button>
          <el-button @click="showSendCode = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <authorize-page :authorizeDialog="authorizeDialog"
                    @authorize="authorize"
                    @cancelAuthorize="cancel"></authorize-page>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import AuthorizePage from '@/components/views/common/authorize'
  import { tokenMixin } from '@/common/mixin/token'

  export default {
    mixins: [tokenMixin],
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          name: '',
          productCode: ''
        },
        QRcode: '',
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
        mobile: '',
        hasAtuthory: 0,
        discount: '',
        // 折扣返回值
        discountObj: {},
        loadingOrder: false,
        loadingPoint: false,
        // 会员积分
        memberPoint: '',
        memberId: '',
        authorizer: '',
        description: ''
      }
    },
    components: {
      Pager,
      AuthorizePage
    },
    computed: {
      totalPrice () {
        var price = 0
        for (let i = 0; i < this.carts.length; i++) {
          if (this.carts[i].check) {
            price += this.carts[i].number * this.carts[i].nowPrice
          }
        }
        return price.toFixed(2)
      },
      totalPoint () {
        var point = 0
        for (let i = 0; i < this.carts.length; i++) {
          if (this.carts[i].check) {
            point += this.carts[i].number * this.carts[i].changeIntegral
          }
        }
        return point
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
      searchCode (code) {
        axios.get(URL.api_name + 'merchandiseapi/commodity/search.do', {
          params: {
            productCode: code,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            if (res.data.data.list.length > 0) {
              this.addCart(res.data.data.list[0])
            } else {
              this.$errMsg('未查询到该商品！')
            }
          }
        })
      },
      textChange (item) {
        if (item.number > item.stock) {
          this.$errMsg('商品' + item.name + '只剩' + item.stock + '件了')
        }
      },
      authorize (obj) {
        if (obj) {
          this.authorizer = obj.authorizer
          this.hasAtuthory = obj.hasPermission
          this.authorizeDialog = !this.authorizeDialog
        }
      },
      cancel (c) {
        this.authorizeDialog = c
      },
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
        axios.get(URL.api_name + 'merchandiseapi/commodity/search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            name: this.formInline.name,
            productCode: this.formInline.productCode,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            standard: this.formInline.standard
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
      addCart (item) {
        if (item.stock > 0) {
          this.$set(item, 'check', true)
          this.$set(item, 'number', 1)
          // 购物车只能添加同类型商品，积分或者价格其中一种
          if (this.carts.length === 0) {
            this.carts.push(item)
          } else {
            if (!this.carts[0].changeIntegral && !item.changeIntegral) {
              // 非积分商品
              for (let i = 0; i < this.carts.length; i++) {
                if (this.carts[i].id === item.id) {
                  this.$message({
                    type: 'error',
                    message: '商品已在购物清单中'
                  })
                  return
                }
              }
              this.carts.push(item)
            } else if (this.carts[0].changeIntegral && item.changeIntegral) {
              // 积分类商品
              for (let j = 0; j < this.carts.length; j++) {
                if (this.carts[j].id === item.id) {
                  this.$message({
                    type: 'error',
                    message: '商品已在购物清单中'
                  })
                  return
                }
              }
              this.carts.push(item)
            } else {
              this.$message({
                type: 'error',
                message: '购物车不能同时存在积分和非积分商品'
              })
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: '库存不足'
          })
        }
      },
      setCode () {
        // console.log('x')
        let that = this
        if (that.mobile === '') {
          that.$message({
            message: '请先输入手机号',
            type: 'error'
          })
          return false
        }
        let area, mobile
        if (that.mobile.toString().indexOf('852') > -1) {
          area = 852
          mobile = that.mobile.split('852')[1]
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
        }).then(function (respose) {
          that.setToken()
          if (respose.data.status === 'success') {
            that.countTime()
          } else {
            that.$message({
              type: 'error',
              message: respose.data.message
            })
            that.fetchCodeMsg = false
          }
        }, function (error) {
          console.log(error)
        })
      },
      countTime: function () {
        var that = this
        that.fetchCodeMsg = true
        var countTime = 59
        console.log(countTime)
        that.timerCodeMsg = countTime + 'S后重新获取'
        var timer = setInterval(function () {
          countTime--
          that.timerCodeMsg = countTime + 'S后重新获取'
          if (countTime < 0) {
            clearInterval(timer)
            that.timerCodeMsg = '重新发送'
            that.fetchCodeMsg = false
          }
        }, 1000)
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
        if (that.QRcode !== '') {
          axios.get(URL.api_name + 'memberapi/api/checkUserInfo.do', {
            params: {
              area: area,
              checkCode: that.QRcode,
              mobile: mobile,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.memberPoint = res.data.data.point
              that.memberId = res.data.data.memberId
              that.$message({
                message: '会员验证成功',
                type: 'success'
              })
            } else {
              that.$message({
                message: '验证失败：' + res.data.message,
                type: 'error'
              })
//              that.mobile = ''
//              that.QRcode = ''
            }
          }).catch((error) => {
            that.isLoading = false
            console.log(error)
          })
        }
      },
      plus (item) {
        if (item.number < item.stock) {
          item.number++
        } else {
          this.$message({
            type: 'error',
            message: '库存不足'
          })
        }
      },
      minus (item) {
        if (item.number <= 1) {
          this.carts.splice(this.carts.indexOf(item), 1)
        } else {
          item.number--
        }
      },
      generateOrder () {
        if (this.totalPrice > 0) {
          this.showSendCode = !this.showSendCode
        } else {
          this.$message({
            type: 'error',
            message: '缴费金额不能为0'
          })
        }
      },
      getDiscount () {
        let that = this
        // 计算折扣
        axios.post(URL.api_name + 'backofficeapi/order/discount.do', {
          discount: {
            discount: this.discount,
            paymentId: 0,
            type: '系统'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.discountObj = res.data.data.discount
          }
        })
      },
      clearCarts () {
        this.carts = []
      },
      exchange () {
        // 提交订单
        if (!this.memberPoint || this.memberPoint < this.totalPoint) {
          this.$message({
            type: 'warning',
            message: '积分不足'
          })
          return
        }
        let that = this
        let submitList = []
        for (let i = 0; i < that.checkedData.length; i++) {
          submitList.push({
            itemDefId: that.checkedData[i].id,
            itemDefName: that.checkedData[i].name,
            itemType: that.checkedData[i].standard,
            price: that.checkedData[i].nowPrice,
            quantity: that.checkedData[i].number,
            userScore: that.checkedData[i].changeIntegral
          })
        }
        that.loadingPoint = true
        axios.post(URL.api_name + 'backofficeapi/order/purchase.do', {
          discounts: [],
          items: submitList,
          order: {
            cashierId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            name: that.checkedData[0].name + '等共' + submitList.length + '件商品',
            saleSource: 'web admin',
            code: 'S',
            userId: that.memberId,
            type: '商品',
            description: that.description
          },
          integralPay: true
        }).then((res) => {
          if (res.data.status === 'success') {
            let order = res.data.data
            // 支付成功后手动调用减库存接口
            axios.post(URL.api_name + 'merchandiseapi/stock/consume.do', order).then(res => {
              if (res.data.status === 'success') {
                // 提交成功跳转到订单详情页面，去支付
                that.$message({
                  type: 'success',
                  message: '兑换成功',
                  duration: 1000,
                  onClose: function () {
                    that.$router.push({
                      path: '/goodsOrderDetail/' + order.order.id
                    })
                  }
                })
              }
            })
          } else {
            that.loadingOrder = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((err) => {
          console.log(err)
          that.loadingPoint = false
        })
      },
      submitOrder () {
        // 提交订单
        let that = this
        let submitList = []
        for (let i = 0; i < that.checkedData.length; i++) {
          submitList.push({
            itemDefId: that.checkedData[i].id,
            itemDefName: that.checkedData[i].name,
            itemType: that.checkedData[i].standard,
            price: that.checkedData[i].nowPrice,
            quantity: that.checkedData[i].number
          })
        }
        let discounts = []
        if (this.discount !== '') {
          // 如果填了折扣
          discounts.push({
            discount: this.discount / 10,
            type: '系统',
            endorser: that.authorizer
          })
        }
        that.loadingOrder = true
        axios.post(URL.api_name + 'backofficeapi/order/purchase.do', {
          discounts: discounts,
          items: submitList,
          order: {
            cashierId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            name: that.checkedData[0].name + '等共' + submitList.length + '件商品',
            saleSource: 'web admin',
            code: 'S',
            type: '商品',
            userId: that.memberId,
            description: that.description
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            // 提交成功跳转到订单详情页面，去支付
            that.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000,
              onClose: function () {
                that.$router.push({
                  path: '/goodsPayWay/' + res.data.data.order.id
                })
              }
            })
          } else {
            that.loadingOrder = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((err) => {
          console.log(err)
          that.loadingOrder = false
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .goods-img{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
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
  .inputText{
    display: block;
    width: 100%;
    text-align: center;
  }
</style>
