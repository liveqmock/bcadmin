<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <div class="formData1">
        <el-form label-width="120px">
          <el-form-item label="课程状态：">
            <el-col :span="12">
              <p>{{ formData.status }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程名称：">
            <el-col :span="12">
              <p>{{ formData.courseName }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="教练等级：">
            <el-col :span="12">
              <p>{{ formData.instructions }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程图片：">
            <el-col :span="12">
              <img :src="formData.picturePath" class="logo-img">
            </el-col>
          </el-form-item>
          <el-form-item label="课程介绍：">
            <el-col :span="12">
              <p v-html="formData.introduce"></p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程简介：">
            <el-col :span="12">
              <p>{{ formData.brief }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="冰面占用：">
            <el-col :span="12">
              <p>{{ formData.useice }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="关联时间：">
            <el-col :span="12">
              <p>{{ formData.courseNum }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程周期：">
            <el-col :span="12">
              <p>{{ formData.coursePeriod }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="关联教练：">
            <el-col :span="12">
              <p>{{ formData.primaryPrice }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="上课人数：">
            <el-col :span="12">
              <p>{{ formData.middlePrice }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程类型：">
            <el-col :span="12">
              <p>{{ formData.seniorPrice }}</p>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button @click="$router.go('-1')">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="formData2">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="courseName" label="会员帐号">
            <template scope='scope'>
              <a class="courseName" @click='goDetial(scope.row.id)'>{{ scope.row.courseName }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="" label="学员姓名" width="100">
          </el-table-column>
          <el-table-column prop="" label="联系方式">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button type="info" size="small" @click="update(scope.row.id)">调课</el-button>
              <el-button type="info" size="small" @click="submit(scope.row.id)">换课</el-button>
              <el-button type="danger" size="small" @click="cancel(scope.row.id)">请假</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      this.getInfo()
    },
    data () {
      return {
        formData: {},
        formData2: {}
      }
    },
    methods: {
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/detail.do', {
          params: {
            id: that.$route.params.id
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
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
      },
      getInfo () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/detail.do', {
          params: {
            id: that.$route.params.id
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
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
  .formData1{display: inline-block; width:40%; vertical-align: top}
  .formData2{display: inline-block; width:58%;}
  .courseName{ color:#13ce66; text-decoration:underline; cursor: pointer;}
</style>
