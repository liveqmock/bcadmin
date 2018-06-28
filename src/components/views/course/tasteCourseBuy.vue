<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>体验课购买</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="timeTable" v-loading="loadingData" element-loading-text="数据加载中...">
      <div class="tableTime">
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
    <div class="makeSure">
      <el-button type="primary" @click="sure()">确定</el-button>
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
        tableData: [],
        dateList: [],
        classNames: 'left',
        classNames1: 'right',
        lines: [],
        coursePeriod: '',
        beginTime: '2017/06/10-06/17',
        endTime: '2017/06/20-06/27',
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        checkCell: {},
        loadingData: false
      }
    },
    methods: {
      getDetail () {
        var that = this
        that.loadingData = true
        axios.get(URL.api_name + 'backofficeapi/course/experience/schedule-time/get.do', {
          params: {
            // coachId: that.$route.params.coachId,
            storeId: that.storeId
          }
        }).then(res => {
          that.loadingData = false
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
              message: res.data.message,
              duration: 1000
            })
          }
        }).catch(err => {
          that.loadingData = false
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
          console.log(err)
        })
      },
      sure () {
        if (this.checkCell.code) {
          this.$router.push({
            path: '/tasteCourseCoach/' + this.checkCell.code + '/' + this.checkCell.num
          })
        } else {
          this.$message({
            type: 'error',
            message: '请选择一个时间段'
          })
        }
      },
      jump (item, pIndex, cIndex) {
        if (item.status === 1) {
          if (item.isCheck === 1) {
            item.isCheck = 0
            this.checkCell = {}
          } else if (item.isCheck === 0) {
            if (this.checkCell.code) {
              this.$message({
                type: 'error',
                message: '只能选择一个时间段'
              })
            } else {
              item.isCheck = 1
              this.checkCell.code = item.code
              this.checkCell.num = pIndex
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .timeTable{
    min-height: 200px;
  }
.stepsss{text-align: center;}
.timeChoose{border:solid 1px rgb(223,236,235); overflow: hidden; margin-bottom:-1px;}
.timeChoose a{color:#13ce66; display: inline-block; height:40px; line-height: 40px; margin:0 20px; }
.timeChoose a.current{ color:#444; text-decoration: none; cursor: default;}
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
.timeBody a.ok{ cursor:pointer; }
.timeBody a.no{ cursor: no-drop; background: #eee; color:#999; }
.timeBody a:first-child.no{ cursor: default; }
.timeBody a.active{color:red; background: #13CE66;}
  .makeSure{
    text-align: center;
    margin-top: 10px;
  }
</style>
