<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>学员课节管理</el-breadcrumb-item>
        <el-breadcrumb-item>选择教练</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper stepsss">
      <el-steps :space="200" :active="1" finish-status="success">
        <el-step title="选课类"></el-step>
        <el-step title="选教练"></el-step>
        <el-step title="选时间"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <!-- <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="教练姓名">
          <el-input v-model="formInline.title" placeholder="输入教练姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="">查询</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="教练姓名" prop="coachName">
        </el-table-column>
        <el-table-column label="等级" prop="coachLevel">
          <template scope="scope">
           {{ scope.row.coachLevel === 'junior' ? '初级教练' : scope.row.coachLevel === 'medium' ? '中级教练' : scope.row.coachLevel === 'senior' ? '高级教练' : '国际教练' }}
          </template>
        </el-table-column>
        <el-table-column label="课程类型" prop="courseType">
        </el-table-column>
        <el-table-column label="课程内容">
          <template scope="scope">
            <el-select v-model="scope.row.courseId" placeholder="请选择">
              <el-option :label="item.courseName" :value="item.id" v-for="item in scope.row.courseContentList" :key="item.id"></el-option>
          </el-select>
          </template>
        </el-table-column>
        <el-table-column label="教龄" prop="coachYears">
        </el-table-column>
        <el-table-column label="上课时间" prop="fastestTime" width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="info" size="small" @click="check(scope.row.coachId, scope.row.courseId)">选定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getDetail()
    },
    data () {
      return {
        formInline: {
          title: ''
        },
        tableData: [],
        formData: {
          courseType: '',
          courseLevel: ''
        },
        courseContents: [],
        rules: {
          courseType: [
            { required: true, message: '请选择课程类型' }
          ],
          courseLevel: [
            { required: true, message: '请选择课程等级' }
          ]
        },
        courseId: '',
        courseTypes: [],
        courseLevels: [],
        courseContentLists: [],
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true
      }
    },
    methods: {
      checkTime (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({
              path: '/studentsCourse'
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      check (coachid, courseId) {
        if (courseId === null) {
          this.$message({
            type: 'error',
            message: '请选择课程内容先',
            duration: 1000
          })
        } else {
          this.$router.push({
            path: '/studentCheckTime/' + coachid + '/' + courseId + '/' + this.$route.params.courseLevel + '/' + this.$route.params.courseMemberId + '/' + this.$route.params.courseTypeCode
          })
        }
      },
      getDetail () {
        var that = this
        let courseLabel = ''
        if (that.$route.params.courseLabel !== 'total') {
          courseLabel = that.$route.params.courseLabel
        }
        axios.get(URL.api_name + 'backofficeapi/course/arrange/choose/two/coach.do', {
          params: {
            courseLevel: that.$route.params.courseLevel,
            courseMemberId: that.$route.params.courseMemberId,
            courseTypeCode: that.$route.params.courseTypeCode,
            storeId: that.storeId,
            courseLabel: courseLabel
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.tableData = res.data.data
            console.log(that.courseContentLists)
            that.loading = false
            console.log(that.tableData)
          } else {
            that.$message({
              type: 'error',
              message: '获取数据失败',
              duration: 1000
            })
          }
        }).catch(err => {
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
          console.log(err)
        })
      }
    }
  }
</script>
<style scoped>
  .logo-img{
    max-width: 50%;
    height: auto;
    border: 1px solid #ebebeb;
  }
.stepsss{text-align: center;}
</style>
