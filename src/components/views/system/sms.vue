<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>短信验证码查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="手机号:">
          <el-input v-model="formInline.mobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="formInline.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker type="datetime"
                          v-model="formInline.createTimeBegin"
                          @change="startChange"
                          placeholder="开始时间"></el-date-picker>至
          <el-date-picker type="datetime"
                          v-model="formInline.createTimeEnd"
                          @change="endChange"
                          placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="验证码类型">
          <el-select v-model="formInline.smsType">
            <el-option label="快捷登录" value="11"></el-option>
            <el-option label="注册" value="21"></el-option>
            <el-option label="修改密码" value="31"></el-option>
            <el-option label="验证用户" value="41"></el-option>
            <el-option label="绑定用户" value="51"></el-option>
          </el-select>
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
        <el-table-column prop="createTime" label="发送时间">
        </el-table-column>
        <el-table-column prop="mobile" label="会员手机号">
        </el-table-column>
        <el-table-column prop="memberName" label="会员姓名">
        </el-table-column>
        <el-table-column label="验证码类型">
          <template scope="scope">
            {{ scope.row.type | formatSmsType }}
          </template>
        </el-table-column>
        <el-table-column prop="captchaCode" label="短信验证码">
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
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          name: '',
          mobile: '',
          createTimeBegin: '',
          createTimeEnd: '',
          smsType: ''
        },
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
    filters: {
      formatSmsType (val) {
        let str = ''
        switch (val) {
          case '11':
            str = '快捷登录'
            break
          case '21':
            str = '注册'
            break
          case '31':
            str = '修改密码'
            break
          case '41':
            str = '验证用户'
            break
          case '51':
            str = '绑定用户'
            break
          default:
            str = '未知的类型'
            break
        }
        return str
      }
    },
    methods: {
      startChange (val) {
        this.formInline.createTimeBegin = val
      },
      endChange (val) {
        this.formInline.createTimeEnd = val
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
        axios.get(URL.api_name + 'memberapi/member/mobilecode.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            name: this.formInline.name,
            mobile: this.formInline.mobile,
            createTimeBegin: this.formInline.createTimeBegin,
            createTimeEnd: this.formInline.createTimeEnd,
            type: this.formInline.smsType
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
<style lang="less" scoped>
</style>
