<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px">
        <!-- <el-form-item label="课程状态：">
          <el-col :span="12">
            <p>{{ formData.status }}</p>
          </el-col>
        </el-form-item> -->
        <el-form-item label="课程名称：">
          <el-col :span="12">
            <p>{{ formData.courseName }}</p>
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
            {{ formData.useice === 0 ? '占用' : '不占用'}}
          </el-col>
        </el-form-item>
        <el-form-item label="课程数量：">
          <el-col :span="12">
            <p>{{ formData.courseNum }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="每节时长：">
          <el-col :span="12">
            <p>{{ formData.coursePeriod }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="初级价格：">
          <el-col :span="12">
            <p>{{ formData.primaryPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="中级价格：">
          <el-col :span="12">
            <p>{{ formData.middlePrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="高级价格：">
          <el-col :span="12">
            <p>{{ formData.seniorPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="国际价格：">
          <el-col :span="12">
            <p>{{ formData.internationalPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
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
        formData: {}
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
</style>
