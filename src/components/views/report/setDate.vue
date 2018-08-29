<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
        <el-breadcrumb-item>时间包状态</el-breadcrumb-item>
        <el-breadcrumb-item>有效期设定</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form label-width="100px">
      <el-form-item label="备注：">
        <el-col :span="10">
          <el-input type="textarea" :rows="3" v-model="remark"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="失效日期：">
        <el-date-picker :picker-options="pickerOption" type="date" v-model="expiredDate" @change="getDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="saveData">{{loading ? '正在保存' : '保存'}}</el-button>
        <el-button type="default" @click="$router.go('-1')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="recordList">
      <el-table-column label="失效日期" prop="newValue"></el-table-column>
      <el-table-column label="备注" prop="comment"></el-table-column>
      <el-table-column label="操作人" prop="createName"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    name: 'setDate',
    created () {
      this.getListData()
    },
    data () {
      return {
        remark: '',
        expiredDate: '',
        loading: false,
        recordList: []
      }
    },
    computed: {
      pickerOption () {
        var that = this
        return {
          disabledDate (time) {
            return time.getTime() <= new Date(that.$route.params.date).getTime()
          }
        }
      }
    },
    methods: {
      getDate (val) {
        this.expiredDate = val
      },
      getListData () {
        axios.get(URL.api_name + 'backofficeapi/fieldChange/getHistoryList.do', {
          params: {
            rowId: Number(this.$route.params.rid),
            tableName: 't_pass_record',
            columnName: 'failureDate'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.recordList = res.data.data
          }
        })
      },
      saveData () {
        this.loading = true
        axios.post(URL.api_name + 'backofficeapi/fieldChange/addHistory.do', {
          rowId: Number(this.$route.params.rid),
          tableName: 't_pass_record',
          columnName: 'failureDate',
          newValue: this.expiredDate,
          comment: this.remark,
          title: '失效日期'
        }).then(res => {
          if (res.data.status === 'success') {
            this.$succssMsg(res.data.message)
            this.getListData()
            this.loading = false
          } else {
            this.$errMsg(res.data.message)
            this.loading = false
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      }
    }
  }
</script>
