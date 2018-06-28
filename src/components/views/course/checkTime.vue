<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>选择时间</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper stepsss">
      <el-steps :space="200" :active="2" finish-status="success">
        <el-step title="选课类"></el-step>
        <el-step title="选教练"></el-step>
        <el-step title="选时间"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>

    <div class="timeTable">
      <div class="timeChoose">
        <a href="javascript:;" class="left" :class="{ active: dateIndex === 1 }" @click="checkWeek(1)">{{ beginTime }}</a>
        <a href="javascript:;" class="right" :class="{ active: dateIndex === 2 }" @click="checkWeek(2)">{{ endTime }}</a>
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
        <div class="timeBody" v-show="dateIndex === 1">
          <div class="line" v-for="(line, Pindex) in firstTable">
            <a
              :title="item.title"
              :class="{'active':item.isCheck === 1, 'ok':item.status === 1, 'no':item.status === 0, 'reserve': item.isReserve === 1 }"
              v-for="(item, Cindex) in line"
              @click="checkCell(firstTable, item, Pindex, Cindex)">
              {{ item.isReserve === 1 ? '预' : item.name }}
            </a>
          </div>
        </div>
        <div class="timeBody" v-show="dateIndex === 2">
          <div class="line" v-for="(line, Pindex) in secondTable">
            <a
              :title="item.title"
              :class="{'active':item.isCheck === 1, 'ok':item.status === 1, 'no':item.status === 0, 'reserve': item.isReserve === 1 }"
              v-for="(item, Cindex) in line"
              @click="checkCell(secondTable, item, Pindex, Cindex)">
              {{ item.isReserve === 1 ? '预' : item.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="makeSure">
      <el-button type="primary" @click="sure()" :loading="loading">
        {{ loading ? '正在提交' : '确定' }}
      </el-button>
      <el-button type="" @click="$router.go('-1')">取消</el-button>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getDetail(1)
      this.getDetail(2)
    },
    data () {
      return {
        dateList: [],
        coursePeriod: 1,
        beginTime: '',
        endTime: '',
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        firstTable: [],
        secondTable: [],
        dateIndex: 1,
        loading: false
      }
    },
    methods: {
      checkWeek (dateType) {
        this.dateIndex = dateType
      },
      getDetail (dateType) {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/arrange/choose/one/time.do', {
          params: {
            coachId: that.$route.params.coachId,
            courseId: that.$route.params.courseId,
            courseMemberId: that.$route.params.courseMemberId,
            courseTypeCode: that.$route.params.courseTypeCode,
            dateType: dateType,
            storeId: that.storeId
          }
        }).then(res => {
          that.loading = false
          if (res.data.status === 'success') {
            if (dateType === 1) {
              that.beginTime = res.data.data.thisWeekDate
              that.endTime = res.data.data.nextWeekData
              that.firstTable = res.data.data.courseCoachTimes
              that.coursePeriod = res.data.data.coursePeriod
            }
            if (dateType === 2) {
              that.secondTable = res.data.data.courseCoachTimes
            }
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
        let dateListOne = []
        let dateListTwo = []
        // 获取第一周选中的单元格
        for (let t1 of this.firstTable) {
          for (let t of t1) {
            if (t.isCheck === 1) {
              dateListOne.push(t)
            }
          }
        }
        // 获取第二周选中的单元格
        for (let t2 of this.secondTable) {
          for (let t of t2) {
            if (t.isCheck === 1) {
              dateListTwo.push(t)
            }
          }
        }
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/course/arrange/choose/one/save.do', {
          coachId: that.$route.params.coachId,
          // courseId: that.$route.params.courseId,
          courseLevel: that.$route.params.courseLevel,
          courseMemberId: that.$route.params.courseMemberId,
          courseTypeCode: that.$route.params.courseTypeCode,
          dateListTwo: dateListTwo,
          dateListOne: dateListOne,
          coursePeriod: that.coursePeriod,
          storeId: that.storeId
        }).then((res) => {
          if (res.data.status === 'success') {
            that.$message({
              message: '提交成功',
              type: 'success'
            })
            that.$router.push({
              path: '/checkTimeOverDetial/' + res.data.data.courseMemberIdTotal
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
                if (table[row][col + i].status === 0 || table[row][col + i].isCheck === 1) {
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
          }
        } else {
          // 每次选中一个单元格
          if (cell.status === 1) {
            if (cell.isCheck === 1) {
              cell.isCheck = 0
            } else {
              cell.isCheck = 1
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.stepsss{text-align: center;}
.timeChoose{border:solid 1px rgb(223,236,235); overflow: hidden; margin-bottom:-1px;}
.timeChoose a{color:#13ce66; display: inline-block; height:40px; line-height: 40px; margin:0 20px; }
.timeChoose a.active{ color:#444; text-decoration: none; cursor: default;}
.left{ float:left; }
.right{ float:right; }
.newTable{width:100%; border-bottom:solid 1px rgb(223,236,235);border-right:solid 1px rgb(223,236,235);}
.newTable tr td,.newTable tr th{
  line-height: 30px;
  border-top:solid 1px rgb(223,236,235);
  border-left:solid 1px rgb(223,236,235);
  text-align:center; }

.timeChoose{background: rgb(228,243,243)}
.timeBody{ overflow: hidden;}
.tableTime a{ display: inline-block; text-align: center; width: 100%; height: 30px; line-height: 30px; color:#444; font-weight: normal; font-size:14px; }
.tableTime .timeHead{ overflow: hidden; border:solid 1px rgb(223,236,235); border-bottom:solid 1px rgb(223,236,235);background: rgb(223,249,249) }
.tableTime .timeHead a:first-child{ width:16%; }
.tableTime .timeHead a{ float: left; width:12%; box-sizing: border-box; border-left:solid 1px rgb(223,236,235);}
.timeBody .line:first-child{ width:16%; }
.timeBody .line{ float: left; width: 12%; box-sizing: border-box;
  border-left:solid 1px rgb(223,236,235);
  border-bottom:solid 1px rgb(223,236,235);
}
.timeBody .line a:first-child{ background: rgb(223,249,249) }
.timeBody a{ border-top:solid 1px rgb(223,236,235); }
.timeBody a.reserve{ color:#fff; background:#FF6633;}
.timeBody a.ok{ cursor:pointer; }
.timeBody a.no{ cursor: no-drop; background: #eee; color:#999; }
.timeBody a:first-child.no{ cursor: default; }
.timeBody a.active{color:red; background:#13CE66;}
.makeSure{ width:100%; height:40px; text-align: center; padding: 10px 0;}
</style>
