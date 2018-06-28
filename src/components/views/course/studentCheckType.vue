<template>
  <div class="student-checktype">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>学员课节管理</el-breadcrumb-item>
        <el-breadcrumb-item>排课</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper stepsss">
      <el-steps :space="200" :active="0" finish-status="success">
        <el-step title="选课类"></el-step>
        <el-step title="选教练"></el-step>
        <el-step title="选时间"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <div class="form-data">
      <div class="center-container">
        <el-form :inline="true" :model="formData" :rules="rules" ref="formData">
          <el-form-item label="课程类型：" prop="courseType" required>
            <el-select v-model="formData.courseType" placeholder="请选择">
              <el-option v-for="(e, index) in courseTypes"
                         :key="index"
                         :label="e.name"
                         :value='e.id'>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程级别：" prop="courseLevel" required>
            <el-select v-model="formData.courseLevel" placeholder="请选择">
              <el-option v-for="(e, index) in courseLevels"
                         :key="index"
                         :label="e.name"
                         :value='e.code'>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程标签：">
            <el-select v-model="formData.courseLabel">
              <el-option label="--全部--" value="total"></el-option>
              <el-option v-for="c in courseLabelList" :key="c.systemCode"
                         :label="c.systemName"
                         :value="c.systemCode"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="center-container">
        <el-button class="margin-r" type="primary" @click="ckeckCoach('formData')">选教练</el-button>
        <el-button @click="$router.go('-1')">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getDetail()
      this.getCourseLabel()
    },
    data () {
      return {
        formData: {
          courseType: '',
          courseLevel: '',
          courseLabel: 'total'
        },
        rules: {
          courseType: [
            { required: true, message: '请选择课程类型' }
          ],
          courseLevel: [
            { required: true, message: '请选择课程等级' }
          ]
        },
        courseTypes: [],
        courseLevels: [],
        courseLabelList: [],
        storeId: JSON.parse(sessionStorage.getItem('store')).k
      }
    },
    methods: {
      getCourseLabel () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'course_label'
          }
        }).then(res => {
          this.courseLabelList = res.data.data
        })
      },
      checkTime (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.$router.push({
            //   path: '/studentsCourse'
            // })
            this.$message({
              type: 'error',
              message: '请先选择教练'
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      ckeckCoach (formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({
              path: '/studentCheckCoach/' + that.formData.courseLevel + '/' + that.$route.params.courseMemberId + '/' +
              that.formData.courseType + '/' + that.formData.courseLabel
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/choose/one/type.do', {
          params: {
            courseLevel: 'all',
            courseMemberId: that.$route.params.courseMemberId,
            storeId: that.storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.courseTypes = res.data.data.courseTypeList
            that.courseLevels = res.data.data.courseLevelList
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
<style lang="less" scoped>
  .student-checktype{
    .stepsss{text-align: center;}
    .el-select{
      display: inline-block;
    }
  }
  .content-center{
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .margin-r{
    margin-right: 10px;
  }
  .center-container{
    display: flex;
    justify-content: center;
  }
</style>
