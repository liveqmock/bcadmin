<template>
  <div class="coupon-count">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡券统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="条件查询">
          <el-select v-model="formInline.province"  @change="chooseCity" placeholder="请选择省">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(g, index) in provinces" :key="index" :label="g.name" :value="g.id"></el-option>
          </el-select>
          <el-select v-model="formInline.city">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(g, index) in citys" :key="index" :label="g.name" :value="g.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-select v-model="formInline.store_name" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option :label="o.v" :value="o.v" v-for="(o, i) in storeList" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.kjseach">
            <el-option label="请选择" value=""></el-option>
            <el-option label="七天" value="七天"></el-option>
            <el-option label="一个月" value="一个月"></el-option>
            <el-option label="季度" value="季度"></el-option>
            <el-option label="半年" value="半年"></el-option>
            <el-option label="一年" value="一年"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券状态">
          <el-select v-model="formInline.status" style="width: 160px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="未使用" value="unused"></el-option>
            <el-option label="已使用" value="used"></el-option>
            <el-option label="已过期" value="expired"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker @change="getStartDate" type="date" v-model="formInline.starttime"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker @change="getEndDate" type="date" v-model="formInline.endtime"></el-date-picker>
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
        <el-table-column prop="name" label="序号" width="88">
          <template scope="scope">
            {{ (scope.$index + 1)  +  (currentPage - 1 ) * 15 }}
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="address">
        </el-table-column>
        <el-table-column label="门店名称" prop="store_name">
        </el-table-column>
        <el-table-column prop="coupon_sn" label="卡券编码">
        </el-table-column>
        <el-table-column prop="status" label="卡券状态">
        </el-table-column>
        <el-table-column prop="category" label="卡券类型">
        </el-table-column>
        <el-table-column prop="coupon_name" label="卡券名称">
        </el-table-column>
        <el-table-column prop="mark_amount" label="卡券金额">
        </el-table-column>
        <el-table-column prop="count_limit" label="数量">
        </el-table-column>
        <el-table-column prop="use_begin_time" label="开始生效时间">
        </el-table-column>
        <el-table-column prop="used_end_time" label="结束生效时间">
      </el-table-column>
        <el-table-column prop="usermobile" label="会员账号">
        </el-table-column>
        <el-table-column prop="create_time" label="发放时间">
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
    },
    computed: {
      address () {
        return this.formInline.province + this.formInline.city
      },
      storeList () {
        return JSON.parse(sessionStorage.getItem('userInfo')).stores
      },
      startTime () {
        if (this.formInline.starttime === '') {
          return ''
        } else {
          return moment(this.formInline.starttime + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
        }
      },
      endTime () {
        if (this.formInline.endtime === '') {
          return ''
        } else {
          return moment(this.formInline.endtime + ' 23:59:59').format('YYYY-MM-DD HH:mm:ss')
        }
      },
      exportLink () {
        return URL.api_name + 'backofficeapi/statisticscupon/export.do?' + 'endtime=' + this.endTime +
          '&starttime=' + this.startTime + '&status=' + this.formInline.status +
          '&store_name=' + this.formInline.store_name + '&kjseach=' + this.formInline.kjseach +
          '&address=' + this.address
      }
    },
    data () {
      return {
        formInline: {
          endtime: '',
          starttime: '',
          status: '',
          store_name: '',
          province: '',
          city: '',
          kjseach: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        provinces: [],
        citys: []
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      getStartDate (val) {
        this.formInline.starttime = val
      },
      getEndDate (val) {
        this.formInline.endtime = val
      },
      getProvince () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/store/initialPosition.do', {
          params: {}
        }).then((res) => {
          that.provinces = res.data.data.provinces
        })
      },
      chooseCity (val) {
        let that = this
        this.formInline.city = ''
        axios.get(URL.api_name + 'backofficeapi/store/obtainCitiesOrAreas.do', {
          params: {
            province: val
          }
        }).then((res) => {
          that.citys = res.data.data.citys
        }, function (error) {
          console.log(error)
        })
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
        axios.get(URL.api_name + 'backofficeapi/statisticscupon/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            endtime: this.endTime,
            starttime: this.startTime,
            status: this.formInline.status,
            store_name: this.formInline.store_name,
            kjseach: this.formInline.kjseach,
            address: this.address
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
      }
    }
  }
</script>
<style lang="less">
  .coupon-count{
    .el-select{
      display: inline-block;
      width: 160px;
    }
    .coupon-logo{
      display: inline-block;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      vertical-align: bottom;
    }
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
  }
</style>
