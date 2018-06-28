<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>购课</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper stepsss">
      <el-steps :space="150" :active="0" finish-status="success">
        <el-step title="选课"></el-step>
        <el-step title="确认订单"></el-step>
        <el-step title="付款"></el-step>
        <el-step title="完成订单"></el-step>
        <el-step title="选择时间/教练"></el-step>
      </el-steps>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="冰面占用">
          <el-select v-model="formInline.usice" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程状态">
          <el-select v-model="formInline.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上架" value="1"></el-option>
            <el-option label="已下架" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="formInline.title" placeholder="可查询课程名称"></el-input>
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
        <el-table-column prop="courseName" label="课程名称">
          <template scope='scope'>
            <a class="courseName" @click='goDetial(scope.row.id)'>{{ scope.row.courseName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="useice" label="占用冰面">
          <template scope="scope">
            {{ scope.row.useice == 0 ? '占用' : '不占用' }}
          </template>
        </el-table-column>
        <el-table-column prop="primaryPrice" label="初级价格" width="96">
        </el-table-column>
        <el-table-column prop="middlePrice" label="中级价格" width="96">
        </el-table-column>
        <el-table-column prop="seniorPrice" label="高级价格" width="96">
        </el-table-column>
        <el-table-column prop="internationalPrice" label="国际价格" width="96">
        </el-table-column>
        <el-table-column prop="courseNum" label="课程节数" width="96">
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template scope="scope">
            {{ scope.row.status == 0 ? '创建成功' : scope.row.status == 1 ? '发布' : scope.row.status == 2 ? '下架' : '删除'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template scope="scope">
            <el-button v-show="scope.row.primaryPrice" type="info" size="small" @click="buyType(scope.row.id, 'junior')">初级</el-button>
            <el-button v-show="scope.row.middlePrice" type="info" size="small" @click="buyType(scope.row.id, 'medium')">中级</el-button>
            <el-button v-show="scope.row.seniorPrice" type="info" size="small" @click="buyType(scope.row.id, 'senior')">高级</el-button>
            <el-button v-show="scope.row.internationalPrice" type="info" size="small" @click="buyType(scope.row.id, 'international')">国际</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="验证会员信息" :visible.sync="showSendCode">
      <el-form label-width="100px">
        <el-form-item label="输入手机号：">
          <el-col :span="12">
            <el-input v-model.number="mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="　　验证码：">
          <el-col :span="6">
            <el-input v-model="QRcode"></el-input>
          </el-col>
          <el-button type="info" :disabled="fetchCodeMsg" @click="setCode">{{ timerCodeMsg }}</el-button>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="nextStep(courseId, coursesType)">下一步</el-button>
          <el-button @click="cancelDialog">返回</el-button>
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
  import { tokenMixin } from '@/common/mixin/token.js'
  export default {
    mixins: [tokenMixin],
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        tableData: [],
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        formInline: {
          status: '',
          usice: '',
          signupBegin: '',
          signupEnd: '',
          title: ''
        },
        QRcode: '',
        mobile: '',
        userId: '',
        fetchCodeMsg: false,
        timerCodeMsg: '获取验证码',
        coursesType: '',
        courseId: '',
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        timer: null
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      cancelDialog () {
        this.showSendCode = false
        this.fetchCodeMsg = false
        this.timerCodeMsg = '发送验证码'
        this.QRcode = ''
        this.mobile = ''
        clearInterval(this.timer)
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
        axios.get(URL.api_name + 'backofficeapi/course/buy/list.do', {
          params: {
            courseName: that.formInline.title,
            status: that.formInline.status,
            useice: that.formInline.usice,
            storeId: that.storeId,
            pageSize: that.pageSize,
            pageNum: num
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
        }).catch((error) => {
          console.log(error)
        })
      },
      goDetial (eid) {
        this.$router.push({
          path: '/courseDetial/' + eid
        })
      },
      buyType (courseId, type) {
        let that = this
        that.showSendCode = true
        that.coursesType = type
        that.courseId = courseId
        // this.$router.push({
        //   path: '/courseAdd'
        // })
      },
      nextStep (id, types) {
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
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              // 返回会员id
              that.userId = res.data.data.memberId
              this.$router.push({
                path: '/courseOrderSure/' + id + '/' + types + '/' + that.userId
              })
            } else {
              that.$message({
                message: '验证失败：' + res.data.message,
                type: 'error'
              })
            }
          }).catch((error) => {
            that.isLoading = false
            console.log(error)
          })
        } else {
          that.$message({
            message: '请输入手机号验证注册信息',
            type: 'error'
          })
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
        let area, mobile
        if (that.mobile.toString().indexOf('852') > -1) {
          area = 852
          mobile = that.mobile.toString().split('852')[1]
        } else {
          area = 86
          mobile = that.mobile
        }
        that.fetchCodeMsg = true
        axios.get(URL.api_name + 'memberapi/api/sendCheckCode.do', {
          params: {
            area: area, // 大陆：86，香港 852 默认86
            mobile: mobile,
            type: 41,
            token: this.token
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.setToken()
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.countTime()
          } else {
            that.fetchCodeMsg = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
          that.fetchCodeMsg = false
        })
      }
    }
  }
</script>
<style scoped>
.el-button--small{ margin:5px 0;}
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
.courseName{ color:#13ce66; text-decoration:underline; cursor: pointer;}
.stepsss{text-align: center;}
.el-button{vertical-align: middle;}
</style>
<style>
.search-wrapper .el-step__title.is-wait{
    width: 140px;
    margin-left: -54px;
    text-align: center;
}
</style>
