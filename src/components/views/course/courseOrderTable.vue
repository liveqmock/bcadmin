<template>
  <div class="change-once-course">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>排课订单</el-breadcrumb-item>
        <el-breadcrumb-item>查看课表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <div class="student-area">
        <span class="label">选择学员：</span>
        <div class="content">
          <el-radio-group v-model="courseMemberId" @change="showTime(courseMemberId)">
            <el-radio :label="item.courseMemberId" v-for="(item, i) in formData.memberList" :key="i">{{ item.memberName }} / {{ item.memberMobile }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="left_detial">
        <el-form label-width="120px" :inline="true">
          <!--<el-form-item label="选择学员：">
            <el-col :span="12">
              <el-radio-group v-model="member" @change="showTime(member)">
                <el-radio :label="item.memberId" v-for="(item, i) in formData.memberList" :key="i">{{ item.memberName }} / {{ item.memberMobile }}</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>-->
          <el-form-item label="课程名称：">
            <el-col>
              <p>{{ formData.courseName }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程类型：">
            <el-col>
              <p>{{ formData.courseType }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程节数：">
            <el-col>
              <p>{{ formData.courseNum }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课节单价：">
            <el-col>
              <p>{{ formData.coursePrice }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="教练等级：">
            <el-col>
              <p>{{ formData.coachLevel | formatType }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课程教练：">
            <el-col>
              <p>{{ formData.courseCoach }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="剩余课节数：">
            <el-col>
              <p>{{ formData.surplusNum }}</p>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="course-table">
        <div class="course-title">
          <span class="change-btn left-btn"
                @click="changeWeek(0)"
                :class="{ active: plusWeek === 0 }">{{weekDay}}</span>
          <span class="change-btn right-btn"
                @click="changeWeek(1)"
                :class="{ active: plusWeek === 1 }">{{nextWeekData}}</span>
        </div>
        <div class="course-header">
          <a>星期</a>
          <a v-for="(w, i) in chineseWeek" :key="i">{{ w }}</a>
        </div>
        <div class="course-body">
          <div class="line" v-for="(line, Pindex) in lines">
            <a v-for="(item, Cindex) in line"
               @click="checkCell(lines, item, Pindex, Cindex)"
               :class="{'active':item.status === 0, 'no':item.status === 1}">
              {{ item.name }}
            </a>
          </div>
        </div>
        <div class="course-btns">
          <el-button type="" @click="$router.go('-1')">取消</el-button>
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
    },
    data () {
      return {
        formData: {},
        tableData: [],
        member: 0,
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        courseCoachId: this.$route.params.courseCoachId,
        memberIds: '',
        courseMemberId: '',
        isFirst: true,
        lines: [],
        chineseWeek: [],
        coursePeriod: '',
        checkedCell: [],
        plusWeek: 0,
        weekDay: '',
        nextWeekData: ''
      }
    },
    methods: {
      changeWeek (cWeek) {
        this.plusWeek = cWeek
        this.showTime(this.courseMemberId)
      },
      showTime (courseMemberId) {
        // 根据memberId查找courseMemberId
        for (let c of this.formData.memberList) {
          if (courseMemberId === c.courseMemberId) {
            this.memberId = c.memberId
          }
        }
        this.getDetail(this.formData.courseId, this.memberId, this.courseMemberId)
      },
      getDetail (courseCoachId, memberId, courseMemberId) {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/member/timetable.do', {
          params: {
            courseId: courseCoachId,
            courseMemberId: courseMemberId,
            storeId: that.storeId,
            memberId: memberId,
            plusWeek: this.plusWeek
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.loading = false
            that.lines = res.data.data.data.courseMemberTimes
            // 星期
            that.chineseWeek = res.data.data.data.chineseWeek
            that.weekDay = res.data.data.data.weekDay
            that.nextWeekData = res.data.data.data.nextWeekData
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
        axios.get(URL.api_name + 'backofficeapi/course/order/detail.do', {
          params: {
            courseCoachId: that.$route.params.courseCoachId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
            that.memberIds = res.data.data.memberList[0].memberId
            that.member = res.data.data.memberList[0].memberId
            that.courseMemberId = res.data.data.memberList[0].courseMemberId
            // 拉取第一个学员的数据
            // that.showTime(that.memberIds)
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
      sure () {
        let that = this
        axios.post(URL.api_name + 'backofficeapi/course/arrange/changecourse.do', {
          coachId: that.formData.courseCoachId,
          courseId: that.formData.courseId,
          courseLevel: that.formData.courseLevel,
          courseMemberId: that.courseMemberId,
          courseTypeCode: that.formData.courseTypeCode,
          dateList: [],
          coursePeriod: that.formData.coursePeriod,
          storeId: that.storeId
        }).then((res) => {
          if (res.data.status === 'success') {
            that.$message({
              message: '提交成功',
              type: 'success',
              duration: 1500,
              onClose: function () {
                that.$router.push({
                  path: '/studentsCourse'
                })
              }
            })
          } else {
            that.$message({
              message: res.data.message,
              type: 'error'
            })
            for (let n = 0; n < that.tableData.length; n++) {
              for (let i = 0; i < that.tableData[n].length; i++) {
                that.tableData[n][i].isCheck = 0
              }
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      checkCell (item) {
        if (item.status === 0) {
          if (item.isCheck === 0) {
            item.isCheck = 1
          } else {
            item.isCheck = 0
          }
        }
      },
      // 添加选中方法
      addCell () {}
    }
  }
</script>
<style lang="less" scoped>
  .student-area{
    overflow: hidden;
    margin-bottom: 22px;
    .label{
      float: left;
      padding-left: 40px;
      font-size: 14px;
      color: rgb(72, 106, 106);
    }
    .content{
      overflow: hidden;
    }
  }
  .course-table{
    overflow: hidden;
    .course-title{
      padding: 10px;
      overflow: hidden;
      .change-btn{
        padding: 5px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        background-color: #ebebeb;
        &.active{
          color: #fff;
          background-color: #13CE66;
        }
      }
      .left-btn{
        float: left;
      }
      .right-btn{
        float: right;
      }
    }
  .course-btns{
    text-align: center;
    margin-top: 10px;
  }
  .course-body{
    overflow: hidden;
  .line{
    float: left;
    width: 12%;
  &:first-child{
     width: 16%;
   }
  a{
    display: block;
    width: 100%;
    border-right: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    background-color: #fff;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    text-align: center;
  &:first-child{
     background-color: #DFF9F9;
   }
  &.active{
     background-color: #13CE66;
     color: #fff;
   }
  &.no{
     cursor: no-drop;
     background-color: #EFF2F7;
   }
  &.ok{
     cursor: pointer;
   }
  }
  }
  }
  .course-header{
    overflow: hidden;
    border-bottom: 1px solid #ebebeb;
    background-color: #DFF9F9;
  a{
    float: left;
    width: 12%;
    text-align: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-right: 1px solid #ebebeb;
    height: 30px;
    line-height: 30px;
  &:first-child{
     width: 16%;
   }
  }
  }}
</style>
