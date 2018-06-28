<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>发送记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="消息类型">
          <el-select v-model="formInline.messageType" clearable placeholder="请选择">
              <el-option :label="item.name"
                         :value="item.id"
                         v-for="(item, index) in searchTypes"
                         :key="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="formInline.startSendDate"
            type="date"
            :editable='false'
            @change="beginTimeRules"
            placeholder="开始时间">
          </el-date-picker>
          <div class="Zvertical">-</div>
          <el-date-picker
            v-model="formInline.endSendDate"
            type="date"
            :editable='false'
            @change="endTimeRules"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
<!--         <el-form-item label="消息标题">
          <el-select v-model="formInline.newsTitle" placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in searchTitles" :key="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <br/>
        <el-form-item label="关键字">
          <el-input v-model="formInline.newsTitle" placeholder="请输入标题关键字"></el-input>
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
        <el-table-column prop="title" label="消息标题">
        </el-table-column>
        <el-table-column prop="phone" label="发送对象">
        </el-table-column>
        <el-table-column prop="detail" label="消息内容">
          <template scope="scope">
            <span v-html='scope.row.detail'></span>
          </template>
        </el-table-column>
        <el-table-column prop="messageType" label="消息类型">
          <template scope="scope">
            {{ scope.row.type == '2' ? 'app消息' : '系统消息' }}
          </template>
        </el-table-column>
<!--         <el-table-column prop="isSuccess" label="发送状态">
          <template scope="scope">
            {{ scope.row.isSuccess == 1 ? '发送成功' : '发送失败' }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="newsImage" label="消息图片">
        </el-table-column> -->
        <!-- <el-table-column prop="newsDetail" label="创建人">
        </el-table-column> -->
        <el-table-column prop="sendDate" label="发送时间" :formatter="dateFormat">
        </el-table-column>
<!--         <el-table-column prop="sendDate" label="创建时间" :formatter="dateFormat">
        </el-table-column> -->
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
          messageType: 1,
          newsTitle: '',
          phone: '',
          startSendDate: '',
          endSendDate: '',
          type: ''
        },
        searchTypes: [
          {
            id: 1,
            name: '系统消息'
          },
          {
            id: 2,
            name: 'app消息'
          }
        ],
        searchTitles: [],
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
      dateFormat (row, column) {
        let date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.endSendDate)
        this.formInline.startSendDate = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.startSendDate = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.startSendDate)
        let date2 = moment(val)
        this.formInline.endSendDate = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.endSendDate = ''
        }
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'memberapi/news/send/record.do', {
          params: {
            endSendDate: that.formInline.endSendDate,
            newsTitle: that.formInline.newsTitle,
            phone: that.formInline.phone,
            startSendDate: that.formInline.startSendDate,
            pageSize: this.pageSize,
            pageNum: num,
            type: that.formInline.messageType
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
          // that.tableData.sendDate = moment(data.data.list.sendDate).format('YYYY-MM-DD HH:mm:ss')
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
    },
    computed: {
      options () {
        return JSON.parse(sessionStorage.getItem('data')).options
      }
    }
  }
</script>
<style lang="less">
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
</style>
