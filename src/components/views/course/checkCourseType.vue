<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程订单确认</el-breadcrumb-item>
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
        <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
          <el-form-item label="课程类型：">
            <el-col :span="12">
              <el-form-item prop="courseType">
                <el-select v-model="formData.courseType" placeholder="请选择">
                  <el-option v-for="(e, index) in courseTypes"
                             :key="index"
                             :label="e.name"
                             :value='e.id'>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="courseLevel">
                <el-select v-model="formData.courseLevel" placeholder="请选择">
                  <el-option v-for="(e, index) in courseLevels"
                             :key="index"
                             :label="e.name"
                             :value='e.code'>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="center-container">
        <el-button style="margin-right: 10px;" type="primary" @click="ckeckCoach('formData')">选教练</el-button>
        <el-button @click="cancel">取消</el-button>
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
    },
    data () {
      return {
        formData: {
          courseType: '',
          courseLevel: ''
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
        storeId: JSON.parse(sessionStorage.getItem('store')).k
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
      ckeckCoach (formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({
              path: '/checkCoach/' + that.$route.params.courseMemberId + '/' + that.formData.courseType + '/' + that.$route.params.courseLevel
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      cancel () {
        this.$router.push({
          path: '/courseList'
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/choose/one/type.do', {
          params: {
            courseLevel: that.$route.params.courseLevel,
            courseMemberId: that.$route.params.courseMemberId,
            storeId: that.storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.courseTypes = res.data.data.courseTypeList
            that.courseLevels = res.data.data.courseLevelList
            that.formData.courseLevel = res.data.data.courseLevelList[0].name
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
.stepsss{text-align: center;}
  .center-container{
    display: flex;
    justify-content: center;
  }
</style>
