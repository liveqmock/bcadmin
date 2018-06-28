<template>
  <div class="change-once-course">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>排课订单</el-breadcrumb-item>
        <el-breadcrumb-item>退所有课</el-breadcrumb-item>
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
        <!--<el-form label-width="120px" :inline="true">
          <el-form-item label="选择学员：">
            <el-col>

            </el-col>
          </el-form-item>
        </el-form>-->
        <el-form label-width="120px" :inline="true">
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
          <el-form-item label="课节数量：">
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
        </el-form>
      </div>
      <div class="course-table">
        <div class="course-header">
          <a>星期</a>
          <a v-for="(w, i) in chineseWeek" :key="i">{{ w }}</a>
        </div>
        <div class="course-body">
          <div class="line" v-for="(line, Pindex) in lines">
            <a v-for="(item, Cindex) in line"
            :class="{'active':item.status === 0, 'no':item.status === 1}">
            {{ item.name }}
            </a>
          </div>
        </div>
        <div class="course-btns">
          <el-button type="primary" @click="confirmDialog = true">
            提交
          </el-button>
          <el-button type="" @click="$router.go('-1')">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="confirmDialog" title="退课原因">
      <el-form label-width="120px" required>
        <el-form-item label="退课原因：">
          <el-col :span="12">
            <el-select v-model="causeType">
              <el-option v-for="item in causeTypeList"
                         :key="item.id"
                         :label="item.systemName"
                         :value="item.systemCode"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" :row="3" v-model="remarks"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sure()" :loading="loading">
            {{ loading ? '正在提交' : '确定' }}
          </el-button>
          <el-button type="default" @click="cancelConfirm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import { getUpdateCourseReason } from '@/common/js/ajax'
  export default {
    created () {
      this.getDetailL()
      getUpdateCourseReason().then(res => {
        if (res.data.status === 'success') {
          this.causeTypeList = res.data.data
        } else {
          this.$errMsg(res.data.message)
        }
      })
    },
    data () {
      return {
        formData: {},
        tableData: [],
        memberId: 0,
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        courseCoachId: this.$route.params.courseCoachId,
        memberIds: '',
        courseMemberId: '',
        isFirst: true,
        lines: [],
        chineseWeek: [],
        coursePeriod: '',
        checkedCell: [],
        loading: false,
        causeTypeList: [],
        causeType: '',
        remarks: '',
        confirmDialog: false
      }
    },
    methods: {
      cancelConfirm () {
        this.confirmDialog = false
        this.causeType = ''
        this.remarks = ''
      },
      showTime (courseMemberId) {
        // 根据memberId查找courseMemberId
        for (let c of this.formData.memberList) {
          if (courseMemberId === c.courseMemberId) {
            this.memberId = c.memberId
          }
        }
        this.getDetail(this.formData.courseId, this.memberId, courseMemberId)
      },
      getDetail (courseCoachId, memberId, courseMemberId) {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/member/timetable.do', {
          params: {
            courseId: courseCoachId,
            courseMemberId: courseMemberId,
            storeId: that.storeId,
            memberId: memberId,
            plusWeek: 0
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.loading = false
            that.lines = res.data.data.data.courseMemberTimes
            // 星期
            that.chineseWeek = res.data.data.data.chineseWeek
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
        // 调课原因必选
        if (!this.causeType) {
          this.$errMsg('请选择调课原因')
          return
        }
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/arrange/changecourse.do', {
          params: {
            courseMemberId: that.courseMemberId,
            courseMark: 5,
            causeType: that.causeType,
            remarks: that.remarks
          }
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
            that.loading = false
            that.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        }).catch((error) => {
          that.loading = false
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
    }
  }
</style>
