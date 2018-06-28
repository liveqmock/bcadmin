<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>发放卡券</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="发放状态">
          <el-select v-model="formInline.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上架" value="1"></el-option>
            <el-option label="已下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="发放时间">-->
          <!--<el-date-picker v-model="formInline.date" type="date" placeholder="选择日期"></el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="关键字">
          <el-input v-model="formInline.markName" placeholder="关键字模糊匹配"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addCoupon">+ 发放卡券</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="markName" label="卡券名称">
        </el-table-column>
        <el-table-column prop="receiveNum" label="领取量" width="80">
        </el-table-column>
        <el-table-column prop="status" label="发放状态" width="100">
          <template scope="scope">
            <el-tag type="danger" v-if="scope.row.status === 0">
              已下架
            </el-tag>
            <el-tag type="primary" v-if="scope.row.status === 1">
              已上架
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="limitType" label="发放方式" width="130">
          <template scope="scope">
            <span v-if="scope.row.limitType === 'register'">
              会员注册发放
            </span>
            <span type="primary" v-if="scope.row.limitType === 'complete'">
              完善资料后发放
            </span>
            <span type="primary" v-if="scope.row.limitType === 'self'">
              会员自助领取
            </span>
            <span type="primary" v-if="scope.row.limitType === 'auto'">
              会员发放
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="usedBeginTime" label="生效时间" width="170">
        </el-table-column> -->
        <el-table-column label="微信端领取地址">
          <template scope="scope">
            <span v-if="scope.row.limitType === 'self'">
              {{ scope.row.getCouponUrl }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="effectTime" label="发放时间" width="170">
        </el-table-column>
        <el-table-column prop="unused" label="未使用"></el-table-column>
        <el-table-column prop="expired" label="已过期"></el-table-column>
        <el-table-column prop="used" label="已核销/已使用"></el-table-column>
        <el-table-column prop="createByName" label="操作人" width="90">
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template scope="scope">
            <el-button type="info" size="small" @click="receive(scope.row.id)">领取明细</el-button>
            <el-button v-if="scope.row.status === 1" type="warning" size="small" @click="down(scope.row.id)">下架</el-button>
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
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          status: '',
          markName: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
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
      addCoupon () {
        this.$router.push({
          path: '/putOutTicketAdd'
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/coupon/grant/search.do', {
          params: {
            storeId: that.storeId,
            pageSize: this.pageSize,
            pageNum: num,
            markName: this.formInline.markName,
            status: this.formInline.status
          }
        }).then(function (respose) {
          that.loading = false
          if (respose.data.status === 'success') {
            let data = respose.data
            that.tableData = data.data.list
            that.totalCount = data.data.total
          } else {
            that.$message({
              type: 'error',
              message: respose.data.message,
              duration: 1000
            })
          }
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
      receive (id) {
        this.$router.push({
          path: '/receive/' + id
        })
      },
      down (id) {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/coupon/grant/updateStatus.do', {
          params: {
            id: id
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '操作成功',
              duration: 1000
            })
            that.getListData(that.currentPage)
          }
        }).catch(err => {
          that.$message({
            type: 'error',
            message: '下架失败',
            duration: 1000
          })
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
