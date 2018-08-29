<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="活动状态">
          <el-select v-model="formInline.status" clearable placeholder="请选择">
              <el-option :label="item.label" :value="item.value" v-for="item in searchTypes" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="formInline.signupBegin"
            type="date"
            :editable='false'
            @change="beginTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
          <div class="Zvertical">至</div>
          <el-date-picker
            v-model="formInline.signupEnd"
            type="date"
            :editable='false'
            @change="endTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <br/>
        <el-form-item label="关键字">
          <el-input v-model="formInline.title" placeholder="输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subActivity">新增活动</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="活动ID"></el-table-column>
        <el-table-column prop="title" label="活动标题">
        </el-table-column>
        <el-table-column prop="content" label="活动描述">
        </el-table-column>
        <el-table-column prop="countLimit" label="活动人数" width="100">
        </el-table-column>
        <el-table-column label="活动地点">
          <template scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="newsDetail" label="活动价格">
        </el-table-column> -->
        <el-table-column label="活动状态" width="96">
          <template scope="scope">
            {{ scope.row.status == 1 ? '未上架' : scope.row.status == 2 ? '已上架' : '已下架'}}
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
        </el-table-column>
        <el-table-column prop="signupEndTime" label="报名截止时间">
        </el-table-column>
        <el-table-column prop="inputerTime" label="发布时间">
        </el-table-column>
        <!-- <el-table-column prop="newsDetail" label="操作人">
        </el-table-column> -->
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button type="info" size="small" @click="detial(scope.row.id)">报名情况</el-button>
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="info" size="small" @click="update(scope.row.id)">编辑</el-button>
            <el-button type="info" size="small" v-show="scope.row.status != 2" @click="submit(scope.row.id)">上架</el-button>
            <el-button type="danger" size="small" v-show="scope.row.status == 2" @click="cancel(scope.row.id)">下架</el-button>
            <el-button type="info" size="small" @click="$router.push({path: '/activitySellList/' + scope.row.id})">售卖情况</el-button>
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
          status: '',
          begenTime: '',
          endTime: '',
          title: '',
          signupBegin: '',
          signupEnd: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        searchTypes: [{
          value: '1',
          label: '未上架'
        }, {
          value: '2',
          label: '已上架'
        }, {
          value: '3',
          label: '已下架'
        }],
        tableData: [],
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
        let date2 = moment(this.formInline.signupEnd)
        this.formInline.signupBegin = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.signupBegin = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.signupBegin)
        let date2 = moment(val)
        this.formInline.signupEnd = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.signupEnd = ''
        }
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/information/event/list.do', {
          params: {
            storeId: that.storeId,
            title: that.formInline.title,
            signupBegin: this.formInline.signupBegin,
            signupEnd: that.formInline.signupEnd,
            status: that.formInline.status,
            pageSize: that.pageSize,
            pageNum: num
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
      goDetail (id) {
        this.$router.push({
          path: '/activity/' + id
        })
      },
      submit (eid) {
        let that = this
        this.$confirm('确认上架吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/information/event/release.do', {
            params: {
              id: eid
            }
          }).then(function (res) {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '上架成功',
                duration: 1000
              })
              that.getListData(that.currentPage)
            } else {
              that.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      cancel (eid) {
        let that = this
        this.$confirm('确认下架吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/information/event/undercarriage.do', {
            params: {
              id: eid
            }
          }).then(function (res) {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '下架成功',
                duration: 1000
              })
              that.getListData(that.currentPage)
            } else {
              that.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }, function (error) {
            that.loading = false
            that.$message({
              type: 'error',
              message: error,
              duration: 1000
            })
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      update (eid) {
        this.$router.push({
          path: '/activityUpdate/' + eid
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
.el-button--small{ margin:5px 0;}
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
</style>
