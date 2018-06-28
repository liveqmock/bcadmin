<template>
  <div class="change-once-course">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>排课订单</el-breadcrumb-item>
        <el-breadcrumb-item>调课</el-breadcrumb-item>
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
                <el-radio :label="item.memberId" v-for="(item, i) in formData.memberList" :key="i">{{ item.memberName }}/{{ item.memberMobile }}</el-radio>
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
          <el-form-item label="课节数量：">
            <el-col>
              <p>{{ formData.courseNum }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="课节单价：">
            <el-col>
              <p>¥{{ formData.coursePrice }}</p>
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
        <el-form label-width="120px">
          <el-form-item label="调课方式：" required>
            <el-radio-group v-model="isPutOff">
              <el-radio :label="true">调课(整体)</el-radio>
              <el-radio :label="false">调课(本周)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="调换时间：">
            <el-button type="primary" @click="showCoachTable">选择时间</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="course-table">
        <div class="course-header">
          <div class="cell">星期</div>
          <div class="cell" v-for="(w, i) in chineseWeek" :key="i">{{ w }}</div>
        </div>
        <div class="course-body">
          <div class="line" v-for="(line, Pindex) in lines">
            <div class="cell" v-for="(item, Cindex) in line"
               :title="item.name"
               @click="checkCell(lines, item, Pindex, Cindex)"
               :class="{'active':item.isCheck === 1, 'ok':item.status === 0, 'no':item.status === 1}">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        title="更换调课时间"
        size="large"
        :visible.sync="updateDialog"
        :close-on-click-modal="false">
        <div class="course-table">
          <div class="course-header">
            <div class="cell">星期</div>
            <div class="cell" v-for="(w, i) in chineseWeek" :key="i">{{ w }}</div>
          </div>
          <div class="course-body">
            <div class="line" v-for="(line, Pindex) in coachTable">
              <div class="cell" v-for="(item, Cindex) in line"
                 @click="updateCell(coachTable, item, Pindex, Cindex)"
                 :class="{'active':item.isCheck === 1, 'ok':item.status === 1, 'no':item.status === 0}">
                <el-tooltip :offset="10" placement="top" effect="dark" v-if="item.title && item.title.length > 4">
                  <div slot="content">{{ item.title }}</div>
                  <span class="title">{{ item.isReserve ? item.title : item.name }}</span>
                </el-tooltip>
                <span v-else>{{ item.isReserve ? item.title : item.name }}</span>
              </div>
            </div>
          </div>
          <div class="course-btns">
            <el-button type="primary" @click="confirmDialog = true">
              提交
            </el-button>
            <el-button @click="updateDialog = !updateDialog">取消</el-button>
          </div>
        </div>
        <!--<span slot="footer" class="dialog-footer">-->
          <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
        <!--</span>-->
      </el-dialog>
    </div>
    <el-dialog :visible.sync="confirmDialog" title="调课原因">
      <el-form label-width="120px" required>
        <el-form-item label="调课原因：">
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
        loading: false,
        updateDialog: false,
        coachTable: [],
        causeType: '',
        remarks: '',
        causeTypeList: [],
        isPutOff: false,
        confirmDialog: false,
        checkedNum: 0, // 选中要调课的数量
        updateNum: 0 // 新排调课数量
      }
    },
    methods: {
      cancelConfirm () {
        this.confirmDialog = false
        this.causeType = ''
        this.remarks = ''
      },
      showCoachTable () {
        // 调课时间可以选择之前已排课的时间段
        this.lines.map((v, i, arr2) => {
          v.map((value, j, arr2) => {
            if (value.isCheck === 1) {
              // 我的课表中status === 0代表可选状态
              this.coachTable[i][j].status = 1 // 教练课表中status === 1代表可选状态
              // this.coachTable[i][j].name = '可排'
            }
          })
        })
        this.updateDialog = !this.updateDialog
      },
      fetchCoachTable (coachId, useice, storeId) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/adjustcourse/choose/time.do', {
          params: {
            coachId: coachId,
            useice: useice,
            storeId: storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.coachTable = res.data.data
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
          that.$message({
            type: 'error',
            message: '获取教练时间表失败'
          })
        })
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
            that.coursePeriod = res.data.data.coursePeriod
            // 获取教练时间表
            that.fetchCoachTable(that.formData.coachId, that.formData.useice, JSON.parse(sessionStorage.getItem('store')).k)
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
        // 调课原因必选
        if (!this.causeType) {
          this.$errMsg('请选择调课原因')
          return
        }
        let that = this
        console.log('checkedNum:' + this.checkedNum + '--updateNum:' + this.updateNum)
        // 不顺延，调课时间课节数必须等于已选中的课节数
        if (!this.isPutOff) {
          if (this.checkedNum !== this.updateNum / this.coursePeriod) {
            this.$message({
              type: 'error',
              message: '选中课节数必须与调整课节数相等'
            })
            return
          }
        }
        // 获取第一个表中的数据
        let checkList = []
        for (let i = 0; i < this.lines.length; i++) {
          for (let j = 0; j < this.lines[i].length; j++) {
            if (this.lines[i][j].status === 0) {
              checkList.push(this.lines[i][j])
            }
          }
        }
        // 获取教练课表中选中的数据
        let updateList = []
        for (let i = 0; i < this.coachTable.length; i++) {
          for (let j = 0; j < this.coachTable[i].length; j++) {
            if (this.coachTable[i][j].isCheck === 1) {
              updateList.push(this.coachTable[i][j])
            }
          }
        }
        if (checkList.length === 0) {
          this.$message({
            type: 'error',
            message: '调课时间段为空'
          })
          return
        }
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/course/arrange/adjustcourse/save.do', {
          courseMemberId: that.formData.courseCoachId,
          coursePeriod: that.formData.coursePeriod,
          dateListOne: checkList,
          dateListTwo: updateList,
          moveType: that.isPutOff ? 2 : 1,
          memberList: that.formData.memberList,
          coachId: that.formData.coachId,
          courseId: that.formData.courseId,
          coursePrice: that.formData.coursePrice,
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          causeType: that.causeType,
          remarks: that.remarks
        }).then((res) => {
          if (res.data.status === 'success') {
            that.$message({
              message: '提交成功',
              type: 'success',
              duration: 1500,
              onClose: function () {
                that.$router.push({
                  path: '/courseOrder'
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
      checkCell (table, cell, row, col) {
        if (this.coursePeriod > 1) {
          if (cell.isCheck === 0) {
            // 未选中单元格
            // 需要选中多个单元格
            if (table[0].length >= col + this.coursePeriod) {
              for (let i = 0; i < this.coursePeriod; i++) {
                if (table[row][col + i].status === 1 || table[row][col + i].isCheck === 1) {
                  // 如果有一个表格不可排
                  this.$message({
                    type: 'error',
                    message: '可排单元格不够'
                  })
                  return
                }
              }
              for (let j = 0; j < this.coursePeriod; j++) {
                // 选中所有单元格
                table[row][col + j].isCheck = 1
                table[row][col + j].groupId = row + '/' + col
              }
              // 选中一节课后，记录下选中的数量
              this.checkedNum++
              console.log('checkedNum===' + this.checkedNum)
            } else {
              this.$message({
                type: 'error',
                message: '可排单元格不够'
              })
            }
          } else {
            // 根据groupID取消对应组的单元格
            for (let c of table[row]) {
              if (cell.groupId === c.groupId) {
                c.isCheck = 0
              }
            }
            this.checkedNum--
            console.log('checkedNum--' + this.checkedNum)
          }
        } else {
          // 每次选中一个单元格
          if (cell.status === 0) {
            if (cell.isCheck === 1) {
              cell.isCheck = 0
              this.checkedNum--
              console.log('checkedNum--' + this.checkedNum)
            } else {
              cell.isCheck = 1
              this.checkedNum++
              console.log('checkedNum===' + this.checkedNum)
            }
          }
        }
      },
      updateCell (table, cell, row, col) {
        if (this.coursePeriod > 1) {
          if (cell.isCheck === 0) {
            // 未选中单元格
            // 需要选中多个单元格
            if (table[0].length >= col + this.coursePeriod) {
              for (let i = 0; i < this.coursePeriod; i++) {
                if (table[row][col + i].status === 0 || table[row][col + i].isCheck === 1) {
                  // 如果有一个表格不可排
                  console.log('不可拍' + this.coursePeriod + '--status' + table[row][col + i].status)
                  this.$message({
                    type: 'error',
                    message: '可排单元格不够'
                  })
                  return
                }
              }
              for (let j = 0; j < this.coursePeriod; j++) {
                if (this.isPutOff) {
                  // 顺延
                  console.log('顺延')
                  // 选中所有单元格
                  table[row][col + j].isCheck = 1
                  table[row][col + j].groupId = row + '/' + col
                  this.updateNum++
                } else {
                  // 只调本周
                  if (this.checkedNum > this.updateNum / this.coursePeriod && this.checkedNum > 0) {
                    // 选中所有单元格
                    table[row][col + j].isCheck = 1
                    table[row][col + j].groupId = row + '/' + col
                    this.updateNum++
                  } else {
                    this.$message({
                      type: 'error',
                      message: '调课节数不能超过需要调课的节数'
                    })
                  }
                }
              }
              console.log('updateNum===' + this.updateNum)
            } else {
              this.$message({
                type: 'error',
                message: '可排单元格不够'
              })
            }
          } else {
            // 根据groupID取消对应组的单元格
            for (let c of table[row]) {
              if (cell.groupId === c.groupId) {
                c.isCheck = 0
                this.updateNum--
              }
            }
            console.log('updateNum--' + this.updateNum)
          }
        } else {
          // 每次选中一个单元格
          if (cell.status === 1) {
            if (cell.isCheck === 0) {
              if (this.isPutOff) {
                // 顺延
                cell.isCheck = 1
                this.updateNum++
              } else {
                // 只调本周
                if (this.checkedNum > this.updateNum / this.coursePeriod && this.checkedNum > 0) {
                  // 选中所有单元格
                  cell.isCheck = 1
                  this.updateNum++
                } else {
                  this.$message({
                    type: 'error',
                    message: '调课节数不能超过需要调课的节数'
                  })
                }
              }
              console.log('updateNum==' + this.updateNum)
            } else {
              cell.isCheck = 0
              this.updateNum--
              console.log('updateNum--' + this.updateNum)
            }
          }
        }
      }
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
    .cell{
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
      overflow: hidden;
      .title{
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
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
      .cell{
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
