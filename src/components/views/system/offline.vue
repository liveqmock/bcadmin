<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>脱机预警</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="门店名称:">
          <el-select v-model="formInline.storeId">
            <el-option v-for="s in storeArr" :key="s.k" :label="s.v" :value="s.k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件类型:">
          <el-select v-model="formInline.deviceType">
            <el-option v-for="d in deviceTypes" :key="d.id" :label="d.systemName" :value="d.systemCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警状态:">
          <el-select v-model="formInline.warningType">
            <el-option v-for="w in warningStatus" :key="w.id" :label="w.systemName" :value="w.systemCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker type="datetime"
                          v-model="formInline.beginTime"
                          @change="startChange"
                          placeholder="开始时间"></el-date-picker>至
          <el-date-picker type="datetime"
                          v-model="formInline.endTime"
                          @change="endChange"
                          placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="warning" @click="offlineDialog = true">预警配置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="storeId" label="门店名称">
        </el-table-column>
        <el-table-column prop="warningTime" label="预警时间">
        </el-table-column>
        <el-table-column prop="deviceNo" label="硬件编号">
        </el-table-column>
        <el-table-column prop="deviceType" label="硬件类型">
        </el-table-column>
        <el-table-column prop="ip" label="网络IP">
        </el-table-column>
        <el-table-column prop="status" label="预警状态">
        </el-table-column>
        <el-table-column prop="reason" label="预警原因">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
    <!-- 预警配置 -->
    <el-dialog title="预警配置"
               :visible.sync="offlineDialog"
               :close-on-click-modal="false"
               :show-close="false">
      <el-form label-width="100px">
        <el-form-item label="发送人员：">
          <el-checkbox-group v-model="sendPerson">
            <el-row>
              <el-checkbox label="门店经理"></el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox label="运维人员"></el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox label="IT人员"></el-checkbox>
            </el-row>
            <el-row>
              <el-col :span="3">
                <el-checkbox label="其他"></el-checkbox>
              </el-col>
              <el-col :span="10">
                <el-input type="text"></el-input>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="default" @click="confirm">确定</el-button>
          <el-button type="default" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  export default {
    created () {
      this.fetchDeviceType()
      this.fetchWarningStatus()
      this.getListData(this.currentPage)
    },
    data () {
      return {
        formInline: {
          storeId: '',
          deviceType: '',
          beginTime: '',
          endTime: '',
          warningType: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        offlineDialog: false,
        sendPerson: [],
        deviceTypes: [],
        warningStatus: []
      }
    },
    components: {
      Pager: Pager
    },
    computed: {
      storeArr () {
        return JSON.parse(sessionStorage.getItem('userInfo')).stores
      }
    },
    methods: {
      fetchDeviceType () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'deviceType'
          }
        }).then(res => {
          this.deviceTypes = res.data.data
        })
      },
      fetchWarningStatus () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'warningStatus'
          }
        }).then(res => {
          this.warningStatus = res.data.data
        })
      },
      confirm () {},
      cancel () {
        this.offlineDialog = false
        this.sendPerson = []
      },
      startChange (val) {
        this.formInline.beginTime = val
      },
      endChange (val) {
        this.formInline.endTime = val
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
        axios.get(URL.api_name + 'backofficeapi/warning/search', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            storeId: this.formInline.storeId,
            deviceType: this.formInline.deviceType,
            beginTime: this.formInline.beginTime,
            endTime: this.formInline.endTime,
            warningType: this.formInline.warningType
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
