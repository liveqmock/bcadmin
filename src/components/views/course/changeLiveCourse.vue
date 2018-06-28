<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <div class="left_detial">
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
          <el-form-item>
            <el-button @click="$router.go('-1')">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right_time_table">
        <div class="timeTable">
          <div class="timeChoose">
            <a href="javascript:;" :class="classNames" @click="getDetail(1)">{{ beginTime }}</a>
            <a href="javascript:;" :class="classNames1" @click="getDetail(2)">{{ endTime }}</a>
          </div>
          <div class="tableTime">
            <div class="timeHead">
              <a>星期</a>
              <a>周一</a>
              <a>周二</a>
              <a>周三</a>
              <a>周四</a>
              <a>周五</a>
              <a>周六</a>
              <a>周日</a>
            </div>
            <div class="timeBody">
              <div class="line" v-for="(line, Pindex) in lines">
                <a 
                @click="jump(item, Pindex, Cindex)" 
                :class="{'active':item.isCheck === 1, 'ok':item.status === 1, 'no':item.status === 0}" 
                v-for="(item, Cindex) in line">
                {{ item.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getDetailL()
      this.getDetail(1)
    },
    data () {
      return {
        formData: {}
      }
    },
    methods: {
      getDetail (dateType) {
        var that = this
        if (dateType === 1) {
          that.classNames = 'left current'
          that.classNames1 = 'right'
        } else {
          that.classNames = 'left'
          that.classNames1 = 'right current'
        }
        axios.get(URL.api_name + 'backofficeapi/course/arrange/choose/one/time.do', {
          params: {
            coachId: that.$route.params.coachId,
            // courseMemberId: 2,
            courseMemberId: that.$route.params.courseMemberId,
            courseTypeCode: that.$route.params.courseTypeCode,
            dateType: dateType,
            storeId: that.storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.tableData = res.data.data.courseCoachTimes
            that.loading = false
            that.beginTime = res.data.data.thisWeekDate
            that.endTime = res.data.data.nextWeekData
            that.lines = res.data.data.courseCoachTimes
            that.coursePeriod = res.data.data.coursePeriod
            // console.log(that.tableData.length)
            // 创建表格
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
      getDetailL () {
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
  .form-data{ overflow: hidden; }
  .left_detial { float:left; width:40%; margin-right:5%; }
  .right_time_table { float:left; width:40%; }
</style>
