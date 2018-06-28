<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
        <el-breadcrumb-item>佣金导出</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="年份：">
          <el-date-picker type="year" v-model="formInline.year" @change="getYear" placeholder="选择年"></el-date-picker>
        </el-form-item>
        <el-form-item label="月份：">
          <el-select v-model="formInline.month">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(m, k) in monthArr" :key="k" :label="m.label" :value="m.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工姓名：">
          <el-input type="text" v-model="formInline.empName"></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-select placeholder="请选择" v-model="formInline.position">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(e, index) in employDuty"
                       :key="index"
                       :label="e.systemName"
                       :value="e.systemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <a href="javascript:void(0)" class="btn-link" @click="downloadExcel">导出到EXCEL</a>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="year" label="年份">
        </el-table-column>
        <el-table-column prop="month" label="月份">
        </el-table-column>
        <el-table-column prop="employeeNo" label="员工编号">
        </el-table-column>
        <el-table-column prop="empName" label="员工姓名">
        </el-table-column>
        <el-table-column prop="position" label="员工职位">
          <template scope="scope">
            {{ scope.row.position | formatType }}
          </template>
        </el-table-column>
        <el-table-column prop="amountSum" label="销售总计">
        </el-table-column>
        <el-table-column prop="classesCount" label="销课节数">
        </el-table-column>
        <el-table-column prop="commissionPercent" label="佣金率">
        </el-table-column>
        <el-table-column prop="commission" label="销售佣金">
        </el-table-column>
        <el-table-column prop="extraMoney" label="销课佣金">
        </el-table-column>
        <el-table-column prop="commTotal" label="应发佣金">
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
  // import moment from 'moment'
  export default {
    created () {
      this.getDuty()
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          position: '',
          empName: '',
          year: '',
          month: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false,
        employDuty: [],
        monthArr: [
          { label: '一月', value: 1 },
          { label: '二月', value: 2 },
          { label: '三月', value: 3 },
          { label: '四月', value: 4 },
          { label: '五月', value: 5 },
          { label: '六月', value: 6 },
          { label: '七月', value: 7 },
          { label: '八月', value: 8 },
          { label: '九月', value: 9 },
          { label: '十月', value: 10 },
          { label: '十一月', value: 11 },
          { label: '十二月', value: 12 }
        ]
      }
    },
    computed: {
      exportLink () {
        return URL.api_name + 'backofficeapi/sales/commision/export.do?' + '&storeId=' + JSON.parse(sessionStorage.getItem('store')).k +
          '&authtoken=' + JSON.parse(sessionStorage.getItem('userInfo')).sessionId +
          '&position=' + this.formInline.position +
          '&empName=' + this.formInline.empName +
          '&year=' + this.formInline.year +
          '&month=' + this.formInline.month
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      getDuty () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'employee_position'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.employDuty = res.data.data
          }
        })
      },
      downloadExcel () {
        // location.href = this.exportLink
        window.open(this.exportLink, '_blank')
      },
      getYear (val) {
        this.formInline.year = val
      },
      getMonth (val) {
        this.formInline.month = val
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
        axios.get(URL.api_name + 'backofficeapi/sales/commision/list.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            position: this.formInline.position,
            empName: this.formInline.empName,
            year: this.formInline.year,
            month: this.formInline.month,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.totalCount = data.data.total
          that.loading = false
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
