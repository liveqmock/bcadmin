<template>
  <div class="payway-count">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>支付方式统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="条件查询">
          <el-select v-model="formInline.province" @change="chooseCity" placeholder="请选择省">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(g, index) in provinces" :key="index" :label="g.name" :value="g.id"></el-option>
          </el-select>
          <el-select v-model="formInline.city" placeholder="请选择市">
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
        <el-form-item label="年份">
          <el-date-picker v-model="formInline.years" type="year" placeholder="请选择年份"></el-date-picker>
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
        <el-table-column prop="type_zf" label="支付类型">
        </el-table-column>
        <el-table-column prop="january" label="一月">
        </el-table-column>
        <el-table-column prop="february" label="二月">
        </el-table-column>
        <el-table-column prop="march" label="三月">
        </el-table-column>
        <el-table-column prop="april" label="四月">
        </el-table-column>
        <el-table-column prop="may" label="五月">
        </el-table-column>
        <el-table-column prop="june" label="六月">
        </el-table-column>
        <el-table-column prop="july" label="七月">
        </el-table-column>
        <el-table-column prop="august" label="八月">
        </el-table-column>
        <el-table-column prop="september" label="九月">
        </el-table-column>
        <el-table-column prop="october" label="十月">
        </el-table-column>
        <el-table-column prop="november" label="十一月">
        </el-table-column>
        <el-table-column prop="december" label="十二月">
        </el-table-column>
        <el-table-column prop="amount" label="统计总额">
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
      chooseYear () {
        if (this.formInline.years === '') {
          return ''
        } else {
          return parseInt(moment(this.formInline.years).format('YYYY'))
        }
      },
      exportLink () {
        return URL.api_name + 'backofficeapi/statisticsincome/zf/export.do?' +
          'store_name=' + this.formInline.store_name + '&years=' + this.chooseYear +
          '&address=' + this.address
      }
    },
    data () {
      return {
        formInline: {
          endtime: '',
          starttime: '',
          store_name: '',
          province: '',
          city: '',
          years: moment().format('YYYY')
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
        console.log(num)
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/statisticsincome/zflist.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            endtime: this.endTime,
            starttime: this.startTime,
            store_name: this.formInline.store_name,
            years: this.chooseYear,
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
  .payway-count{
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
