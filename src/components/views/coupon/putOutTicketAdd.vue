<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>发放卡券</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item label="选择卡券:">
          <el-col :span="12">
            <el-select v-model="formData.markId" @change="getSelectCoupon">
              <el-option v-for="(item, index) in coupons" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券类型:">
          <el-col :span="12">
            {{ selectCoupon.category | formatType }}
          </el-col>
        </el-form-item>
        <el-form-item label="发放方式:">
          <el-radio-group v-model="formData.limitType">
            <!--<el-row>
              <el-col>
                <el-radio label="register">会员注册发放</el-radio>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col>
                <el-radio label="complete">完善资料后发放</el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-radio label="self">
                  <div class="Zvertical">会员自助领取</div><el-input v-model.number="formData.countLimit" :disabled="formData.limitType !== 'self'" class="inline-text"></el-input>张
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-radio label="auto">
                  <span class="label-me">会员发放</span>
                  <div class="content" v-show="formData.limitType === 'auto'">
                    <el-row>
                      <span class="f-label">会员等级</span>
                      <el-col :span="10">
                        <el-select v-model="formInline.grade">
                          <el-option label="全部" value=""></el-option>
                          <el-option v-for="(m, i) in memberLevel"
                                     :label="m.systemName"
                                     :value="m.systemCode"
                                     :key="i"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        年龄阶段
                        <el-input class="inline-input" @blur="ageBeginCheck" v-model.number="formInline.ageBegin" placeholder="起始年龄"></el-input>
                        至
                        <el-input class="inline-input" @blur="ageEndCheck" v-model.number="formInline.ageEnd" placeholder="最大年龄"></el-input>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        会员注册日期&nbsp;
                        <el-date-picker
                          type="date"
                          placeholder="开始日期"
                          :editable="false"
                          @change="beginTimeRules"
                          v-model="formInline.registerTimeBegin">
                        </el-date-picker>
                        &nbsp;至&nbsp;
                        <el-date-picker
                          type="date"
                          placeholder="结束日期"
                          :editable="false"
                          @change="endTimeRules"
                          v-model="formInline.registerTimeEnd">
                        </el-date-picker>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="10">手机号
                        <el-input
                        v-model.number="formInline.mobile"
                        placeholder="请输入手机号"></el-input>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col><el-button type='primary' @click="checkMemberNum">检索</el-button></el-col>
                      <el-col>
                        发放会员总数{{ num }}人<el-button type="info"
                                         size="small"
                                         @click="showMemberDetail"
                                         class="f-btn">明细详情</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生效时间:">
          <el-radio-group v-model="formData.effectType">
            <el-radio label="immediately">立即生效</el-radio>
            <el-radio label="time">
              <div class="Zvertical">生效时间</div>
              <el-date-picker
                :disabled="formData.effectType === 'immediately'"
                v-model="formData.effectTime"
                :editable="false"
                type="datetime"></el-date-picker>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createTicket" :loading="loading">
            {{ loading ? '正在提交' : '发放' }}
          </el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="会员明细" :visible.sync="showDialog">
      <el-table :data="tableData" border>
        <el-table-column property="id" label="会员编号" width="96"></el-table-column>
        <el-table-column property="name" label="姓名"></el-table-column>
        <el-table-column property="mobile" label="手机号" width="115"></el-table-column>
        <el-table-column label="会员等级">
          <template scope="scope">
            {{ scope.row.grade | formatType }}
          </template>
        </el-table-column>
        <el-table-column property="registerTime" label="注册时间"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
      <pager :current-page="currentPage" :pageSize="pageSize" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
    </el-dialog>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    created () {
      this.getCoupons()
      this.getMemberLevel()
    },
    components: {
      Pager: Pager
    },
    data () {
      return {
        formData: {
          limitType: 'complete',
          effectType: 'immediately',
          effectTime: '',
          markId: '',
          status: '',
          countLimit: '',
          storeId: JSON.parse(sessionStorage.getItem('store')).k
        },
        coupons: [],
        selectCoupon: {},
        loading: false,
        memberLevel: [],
        tableData1: [],
        memberIds: [],
        formInline: {
          grade: '',
          ageBegin: '',
          ageEnd: '',
          registerTimeBegin: '',
          registerTimeEnd: '',
          mobile: ''
        },
        num: 0,
        pageSize: 15,
        showDialog: false,
        currentPage: 1,
        totalCount: 0,
        tableData: []
      }
    },
    methods: {
      getCoupons () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/coupon/mark/grant-search-list.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.coupons = res.data.data
          }
        })
      },
      getSelectCoupon (id) {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/coupon/mark/details.do', {
          params: {
            id: this.formData.markId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.selectCoupon = res.data.data
          } else {
            that.$message({
              type: 'error',
              message: '获取数据失败',
              duration: 1000
            })
          }
        }).catch(err => {
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
          console.log(err)
        })
      },
      createTicket () {
        var that = this
        that.loading = true
        console.log(that.formData.effectType)
        if (that.formData.effectType === 'time') {
          if (that.formData.effectTime !== '') {
            that.formData.effectTime = moment(that.formData.effectTime).format('YYYY-MM-DD HH:mm:ss')
          } else {
            that.$message({
              type: 'error',
              message: '生效时间不能为空',
              duration: 1000
            })
            that.loading = false
            return false
          }
        }
        if (that.formData.limitType === 'auto' && that.num <= 0) {
          that.$message({
            type: 'error',
            message: '错误：没有发放对象，无法发放',
            duration: 2000
          })
          that.loading = false
          return false
        }
        axios.post(URL.api_name + 'backofficeapi/coupon/grant/create.do', that.formData).then((res) => {
          if (res.data.status === 'success') {
            if (that.formData.limitType === 'auto') {
              let couponId = res.data.data.grantId
              axios.post(URL.api_name + 'backofficeapi/coupon-user-rel/user/create.do', {
                couponId: couponId,
                storeId: that.formData.storeId,
                userIds: that.memberIds
              }).then((ress) => {
                if (ress.data.status === 'success') {
                  // 成功
                  that.$message({
                    type: 'success',
                    message: res.data.message,
                    duration: 2000
                  })
                  that.$router.push({
                    path: '/putOutTicket'
                  })
                } else {
                  that.$message({
                    type: 'error',
                    message: ress.data.message,
                    duration: 1000
                  })
                }
              }).catch((errrr) => {
                that.$message({
                  type: 'error',
                  message: '报错:' + errrr,
                  duration: 1000
                })
              })
            } else {
              that.$message({
                type: 'success',
                message: res.data.message,
                duration: 2000
              })
              that.$router.push({
                path: '/putOutTicket'
              })
            }
          } else {
            that.$message({
              type: 'error',
              message: res.data.message,
              duration: 1000
            })
            that.loading = false
          }
        }).catch((err) => {
          console.log(err)
          that.loading = false
          that.$message({
            type: 'error',
            message: '提交失败:' + err,
            duration: 1000
          })
        })
      },
      getMemberLevel () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'memberLevel'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.memberLevel = res.data.data
          }
        })
      },
      getListData (num) {
        console.log(num)
        this.currentPage = num
        var that = this
        axios.get(URL.api_name + 'memberapi/member/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            ageBegin: this.formInline.ageBegin,
            ageEnd: this.formInline.ageEnd,
            grade: this.formInline.grade,
            mobile: this.formInline.mobile,
            registerTimeBegin: this.formInline.registerTimeBegin,
            registerTimeEnd: this.formInline.registerTimeEnd
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.totalCount = data.data.total
          that.num = data.data.total
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
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.registerTimeEnd)
        this.formInline.registerTimeBegin = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.registerTimeBegin = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.registerTimeBegin)
        let date2 = moment(val)
        this.formInline.registerTimeEnd = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.registerTimeEnd = ''
        }
      },
      ageBeginCheck () {
        let that = this
        let age1 = this.formInline.ageBegin
        let age2 = this.formInline.ageEnd
        if (age2 != null && age1 > age2) {
          this.$message({
            message: '开始年龄不能大于结束年龄',
            type: 'error'
          })
          that.formInline.ageBegin = 0
        }
      },
      ageEndCheck () {
        let that = this
        let age1 = this.formInline.ageBegin
        let age2 = this.formInline.ageEnd
        if (age1 != null && age1 > age2) {
          this.$message({
            message: '结束年龄不能小于开始年龄',
            type: 'error'
          })
          that.formInline.ageEnd = that.formInline.ageBegin + 1
        }
      },
      showMemberDetail () {
        var that = this
        that.showDialog = true
        that.getListData(that.currentPage)
      },
      checkMemberNum () {
        var that = this
        axios.get(URL.api_name + 'memberapi/member/list.do', {
          params: {
            pageSize: 1000000000,
            pageNum: 1,
            ageBegin: this.formInline.ageBegin,
            ageEnd: this.formInline.ageEnd,
            grade: this.formInline.grade,
            mobile: this.formInline.mobile,
            registerTimeBegin: this.formInline.registerTimeBegin,
            registerTimeEnd: this.formInline.registerTimeEnd
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData1 = data.data.list
          that.num = data.data.total
          that.memberIds = []
          for (let w = 0; w < that.tableData1.length; w++) {
            that.memberIds.push(that.tableData1[w].id)
          }
          console.log(that.tableData1.length)
        }, function (error) {
          console.log(error)
          that.$message({
            type: 'error',
            message: '检测失败',
            duration: 1000
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .inline-text{
    width: 100px;
  }
  .f-label{
    float: left;
    position: relative;
    top: 10px;
  }
  .f-btn{
    margin-left: 10px;
  }
  .content{
    margin-left: 24px;
  }
  .inline-input{
    width: 100px;
  }
  .el-row{
    margin-bottom: 10px;
  }
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
</style>
