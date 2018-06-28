<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>报名详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input type="text" placeholder="请输入会员手机号..." v-model="formInline.mobile"></el-input>
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
        <el-table-column prop="signType" label="报名方式">
          <template scope="scope">
            {{ scope.row.signType == 1 ? '金额抵扣' : scope.row.signType == 2 ? '积分抵扣' : '课程抵扣'}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createBy" label="联系方式">
        </el-table-column> -->
        <el-table-column prop="signMoney" label="报名价格">
        </el-table-column>
        <el-table-column prop="signPoint" label="是否消耗积分">
        </el-table-column>
        <!--<el-table-column prop="signCourse" label="抵消课程">
        </el-table-column>-->
        <el-table-column prop="signUpTime" label="报名时间">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            {{ scope.row.status === 1 ? '未核销' : '已核销' }}
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
    },
    data () {
      return {
        formInline: {
          begenTime: '',
          endTime: '',
          mobile: ''
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
