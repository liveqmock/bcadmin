<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程评价管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="教练姓名">
          <el-input v-model="formInline.coachName" placeholder="输入教练名称"></el-input>
        </el-form-item>
        <el-form-item label="学员姓名">
          <el-input v-model="formInline.memberName" placeholder="输入学员名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.courseType">
            <el-option label="课程类型" value=""></el-option>
            <el-option v-for="(e, index) in courseTypes"
                       :key="index"
                       :label="e.name"
                       :value="e.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker @change="getStartTime" type="date" v-model="formInline.startTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker @change="getEndTime" type="date" v-model="formInline.endTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tabPane">
      <a href="javascript:;" class="tabChange current">教练评价</a>
      <a href="javascript:;" class="tabChange" @click="goNext1">学员评价</a>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="coachName" label="教练姓名" width="100">
        </el-table-column>
        <el-table-column prop="memberName" label="学员姓名" width="100">
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称">
        </el-table-column>
        <el-table-column prop="courseType" label="课程类型" width="100">
        </el-table-column>
        <el-table-column prop="flowerNum" label="评分" width="80">
        </el-table-column>
        <!--<el-table-column prop="commentLabel" label="评价标签" width="100">
        </el-table-column>-->
        <el-table-column prop="commentDetails" label="评价内容" width="160">
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" width="120">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
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
      this.getCourseType()
    },
    data () {
      return {
        formInline: {
          coachName: '',
          courseType: '',
          endTime: '',
          memberName: '',
          startTime: ''
        },
        courseTypes: [],
        courseTimes: [],
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: false
      }
    },
    components: {
      Pager: Pager
    },
    computed: {
      startTime () {
        if (this.formInline.startTime !== '') {
          return moment(this.formInline.startTime + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      endTime () {
        if (this.formInline.endTime !== '') {
          return moment(this.formInline.endTime + ' 23:59:59').format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      }
    },
    methods: {
      getStartTime (val) {
        this.formInline.startTime = val
      },
      getEndTime (val) {
        this.formInline.endTime = val
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      getCourseType () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/type/list.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.courseTypes = res.data.data
          }
        })
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'memberapi/tomember_comment/web_search.do', {
          params: {
            pageSize: this.pageSize,
            pageNum: num,
            coachName: this.formInline.coachName,
            courseType: this.formInline.courseType,
            endTime: this.endTime,
            memberName: this.formInline.memberName,
            startTime: this.startTime,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
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
      goNext1 () {
        // console.log('success')
        this.$router.push({
          path: '/courseEvaluate-Student'
        })
      },
      del (id) {
        let that = this
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'memberapi/tomember_comment/delete.do', {
            params: {
              toMemberId: id
            }
          }).then(function (response) {
            that.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000
            })
            that.getListData(that.currentPage)
          }, function (error) {
            that.$message({
              type: 'error',
              message: '删除失败',
              duration: 1000
            })
            console.log(error)
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped>
.el-button--small{ margin:5px 0;}
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
.tabPane{ padding:0 20px; margin:0 0 20px 0; border-bottom: 1px solid #ddd; }
.tabPane a{ margin:0 25px 0 0;
  color:#444;
  text-decoration: none;
  padding: 20px 10px 15px 10px;
  border-bottom: solid 3px #fff;
  display: inline-block;
  position: relative}
.tabPane a.current{ color:#20a0ff; border-bottom:solid 3px #20a0ff; }
</style>
