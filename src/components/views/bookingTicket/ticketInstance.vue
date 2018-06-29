<template>
  <div class="ticket-instance">
    <div class="crumbs">
      <el-breadcrumb separator="/" v-show="$route.params.from === 'chooseWay'">
        <el-breadcrumb-item><i class="el-icon-date"></i> 票务管理</el-breadcrumb-item>
        <el-breadcrumb-item>购票</el-breadcrumb-item>
        <el-breadcrumb-item>出票</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-show="$route.params.from === 'ticketOrder'">
        <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>售票订单</el-breadcrumb-item>
        <el-breadcrumb-item>重打票码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="10px">
        <el-form-item>
          <!--<el-button type="success" @click="selectAll">全 选</el-button>-->
          <el-button type="success" @click="printTicket">斑马打印</el-button>
          <el-button type="success" @click="print">佳博打印</el-button>
          <el-button type="success" @click="goBack">返 回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-data" v-for="(tick, index) in ticketInstanceOnce" :key="index">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票二维码：">
              <img :src="codeUrl + tick.url" class="ticket-img">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票名称：">
              {{ tick.ticketDefName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票编码：">
              <p>{{ tick.code }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              {{ tick.createTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="时长：">
              <p>{{ tick.hours }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用日期：">
              <p>{{ tick.useDate }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票种：">
              单次票
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人：">
              {{ formData.receiverName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="form-data" v-for="(tick, index) in ticketInstanceCompany" :key="index">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票二维码：">
              <img :src="codeUrl + tick.url" class="ticket-img">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票名称：">
              {{ tick.ticketDefName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票编码：">
              <p>{{ tick.code }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              {{ tick.createTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票种：">
              <p>陪同票</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用日期：">
              <p>{{ tick.useDate }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作人：">
              {{ formData.receiverName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="form-data" v-for="(tick, index) in ticketInstanceExercise" :key="index">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票二维码：">
              <img :src="codeUrl + tick.url" class="ticket-img">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票名称：">
              {{ tick.ticketDefName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票编码：">
              <p>{{ tick.code }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              {{ tick.createTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票种：">
              <p>练习票</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用日期：">
              <p>{{ tick.useDate }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作人：">
              {{ formData.receiverName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="form-data" v-for="(tick, index) in ticketInstancePeriod" :key="index">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票二维码：">
              <img :src="codeUrl + tick.url" class="ticket-img">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票名称：">
              {{ tick.ticketDefName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票编码：">
              <p>{{ tick.code }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              {{ tick.createTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="时长：">
              <p>{{ tick.hours }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效天数：">
              <p>{{ tick.validity }}天</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="票种：">
              时段票
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人：">
              {{ formData.receiverName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getTicketInstance()
    },
    data () {
      return {
        formData: {},
        ticketInstanceOnce: [],
        ticketInstanceCompany: [],
        ticketInstanceExercise: [],
        ticketInstancePeriod: [],
        selectData: [],
        employee: {}
      }
    },
    methods: {
      print () {
        var LODOP = window.getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))
        LODOP.SET_PRINT_PAGESIZE(1, 800, 1100, '')
        let list = []
        if (this.ticketInstanceOnce !== []) {
          for (let t of this.ticketInstanceOnce) {
            list.push(t)
          }
        }
        if (this.ticketInstanceCompany !== []) {
          for (let t of this.ticketInstanceCompany) {
            list.push(t)
          }
        }
        if (this.ticketInstanceExercise !== []) {
          for (let t of this.ticketInstanceExercise) {
            list.push(t)
          }
        }
        if (this.ticketInstancePeriod !== []) {
          for (let t of this.ticketInstancePeriod) {
            list.push(t)
          }
        }
        for (let t of list) {
          let hour = ''
          if (t.type === '单次票') {
            hour = t.hours + '小时'
          } else if (t.type === '陪同票') {
            hour = '全天有效,限两次进出场'
          } else {
            hour = '全天有效'
          }
          LODOP.PRINT_INIT('')
          LODOP.ADD_PRINT_HTM(142, 20, 200, 20, '<p style="font-size: 12px;"><span>票名称：</span>' + '<span>' + t.ticketDefName + '元' + '</span>' + '</p>')
          LODOP.ADD_PRINT_HTM(156, 20, 200, 20, '<p style="font-size: 12px;"><span>票价：</span>' + '<span>' + t.price + '元' + '</span>' + '</p>')
          LODOP.ADD_PRINT_HTM(170, 20, 200, 20, '<p style="font-size: 12px;"><span>时长：</span>' + hour + '</p>')
          LODOP.ADD_PRINT_HTM(184, 20, 200, 20, '<p style="font-size: 12px;"><span>使用日期：</span>' + t.useDate + '</p>')
          // LODOP.ADD_PRINT_HTM(196, 10, 500, 20, '<p style="font-size: 12px;"><span>票号：</span>' + t.code + '</p>')
          LODOP.ADD_PRINT_HTM(198, 80, 200, 160, '<img width="130" height="130" src="' + this.codeUrl + t.url + '">')
          LODOP.ADD_PRINT_HTM(366, 10, 500, 20, '<p style="font-size: 12px;"><span>票号：</span>' + t.code + '</p>')
          // LODOP.PREVIEW()
          LODOP.PRINT()
        }
      },
      getEmployeeInfo (id) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/employee/details.do', {
          params: {
            id: id,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.employee = res.data.data
          }
        })
      },
      selectAll () {},
      getTicketInstance () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: this.$route.params.oid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
            if (that.formData.ticketInstanceOnce) {
              that.ticketInstanceOnce = that.formData.ticketInstanceOnce
            }
            if (that.formData.ticketInstanceCompany) {
              that.ticketInstanceCompany = that.formData.ticketInstanceCompany
            }
            if (that.formData.ticketInstanceExercise) {
              that.ticketInstanceExercise = that.formData.ticketInstanceExercise
            }
            if (that.formData.ticketInstancePeriod) {
              that.ticketInstancePeriod = that.formData.ticketInstancePeriod
            }
          }
        })
      },
      printTicket () {
        let list = []
        if (this.ticketInstanceOnce !== []) {
          for (let t of this.ticketInstanceOnce) {
            list.push(t)
          }
        }
        if (this.ticketInstanceCompany !== []) {
          for (let t of this.ticketInstanceCompany) {
            list.push(t)
          }
        }
        if (this.ticketInstanceExercise !== []) {
          for (let t of this.ticketInstanceExercise) {
            list.push(t)
          }
        }
        if (this.ticketInstancePeriod !== []) {
          for (let t of this.ticketInstancePeriod) {
            list.push(t)
          }
        }
        sessionStorage.setItem('ticketList', JSON.stringify(list))
        window.open('./static/sample/index.html', '_blank')
      },
      goBack () {
        // 返回到售票页面
        this.$router.push({
          path: '/ticketOrder'
        })
      }
    },
    computed: {
      codeUrl () {
        return URL.api_name + 'backofficeapi'
      }
    }
  }
</script>
<style lang="less" scoped>
  .ticket-img{
    width: 100px;
    height: 100px;
    border: 1px solid #ebebeb;
  }
  .title{
    line-height: 30px;
    color: #666;
  }
  .form-data{
    margin-bottom: 5px;
  }
</style>
