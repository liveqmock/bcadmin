<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="冰面占用">
          <el-select v-model="formInline.useice" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程状态">
          <el-select v-model="formInline.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上架" value="1"></el-option>
            <el-option label="已下架" value="2"></el-option>
            <el-option label="已删除" value="3"></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <!-- <el-form-item label="操作时间">
          <el-date-picker
            v-model="formInline.signupBegin"
            type="date"
            :editable='false'
            @change="beginTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
          <div class="Zvertical">至</div>
          <el-date-picker
            v-model="formInline.signupEnd"
            type="date"
            :editable='false'
            @change="endTimeRules"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="关键字查询">
          <el-input type="text" v-model="formInline.title" placeholder="输入课程名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="subCourse">发布课程</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="sort" label="序号">
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称">
          <template scope='scope'>
            <a class="courseName" @click='goDetial(scope.row.id)'>{{ scope.row.courseName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="useice" label="是否占用冰面">
          <template scope="scope">
            {{ scope.row.useice == 0 ? '占用' : '不占用' }}
          </template>
        </el-table-column>
        <el-table-column prop="courseNum" label="课程节数" width="100">
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="状态" width="140">
          <template scope="scope">
            {{ scope.row.status == 1 ? '已上架' : scope.row.status == 2 ? '已下架' : '已删除'}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="newsDetail" label="操作人">
        </el-table-column> -->
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button type="info" size="small" v-show="scope.row.status <= 2" @click="update(scope.row.id)">编辑</el-button>
            <el-button type="info" size="small" v-show="scope.row.status == 0 || scope.row.status == 2" @click="submit(scope.row.id)">上架</el-button>
            <el-button type="danger" size="small" v-show="scope.row.status == 1" @click="cancel(scope.row.id)">下架</el-button>
            <el-button type="danger" size="small" v-show="scope.row.status == 0 || scope.row.status == 2" @click="del(scope.row.id)">删除</el-button>
            <el-button type="info" size="small" v-show="scope.row.status >= 3" @click="recovery(scope.row.id)">恢复</el-button>
            <el-button type="primary" size="small" @click="setTop(scope.row.id)">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import Pager from '@/components/views/common/pager'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    created () {
      this.getListData(this.currentPage)
    },
    data () {
      return {
        tableData: [],
        formInline: {
          status: '',
          useice: '',
          signupBegin: '',
          signupEnd: '',
          title: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      setTop (id) {
        axios.get(URL.api_name + 'backofficeapi/course/settop.do', {
          params: {
            id: id
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.$succssMsg(res.data.message)
            this.getListData(this.currentPage)
          } else {
            this.$errMsg(res.data.message)
          }
        })
      },
      dateFormat (row, column) {
        let date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      beginTimeRules (val) {
        let date1 = moment(val)
        let date2 = moment(this.formInline.signupEnd)
        this.formInline.signupBegin = val
        // console.log(date2)
        if (date2 !== 'NaN' && date1.diff(date2) > 0) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error'
          })
          this.formInline.signupBegin = ''
        }
      },
      endTimeRules (val) {
        let date1 = moment(this.formInline.signupBegin)
        let date2 = moment(val)
        this.formInline.signupEnd = val
        // console.log(date2)
        if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'error'
          })
          this.formInline.signupEnd = ''
        }
      },
      getListData (num) {
        this.currentPage = num
        var that = this
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/course/list.do', {
          params: {
            courseName: that.formInline.title,
            // signupBegin: this.formInline.signupBegin,
            // signupEnd: that.formInline.signupEnd,
            status: that.formInline.status,
            useice: that.formInline.useice,
            storeId: that.storeId,
            pageSize: that.pageSize,
            pageNum: num
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
        }).catch((error) => {
          console.log(error)
        })
      },
      goDetial (eid) {
        this.$router.push({
          path: '/courseDetial/' + eid
        })
      },
      recovery (eid) {
        axios.get(URL.api_name + 'backofficeapi/course/recovery.do', {
          params: {
            id: eid
          }
        }).then(function (respose) {
          console.log(respose)
          this.getListData(this.currentPage)
        }).catch((error) => {
          console.log(error)
        })
        this.getListData(this.currentPage)
      },
      del (eid) {
        var that = this
        that.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/course/remove.do', {
            params: {
              id: eid
            }
          }).then(function (respose) {
            if (respose.data.status === 'success') {
              this.getListData(this.currentPage)
            }
          }).catch((error) => {
            console.log(error)
          })
          this.getListData(this.currentPage)
        }).catch(() => {})
      },
      submit (eid) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/publish.do', {
          params: {
            id: eid
          }
        }).then(function (res) {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.getListData(this.currentPage)
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((error) => {
          console.log(error)
        })
        this.getListData(this.currentPage)
      },
      cancel (eid) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/undercarriage.do', {
          params: {
            id: eid
          }
        }).then(function (res) {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.getListData(this.currentPage)
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((error) => {
          console.log(error)
        })
        this.getListData(this.currentPage)
      },
      update (id) {
        this.$router.push({
          path: '/courseEdit/' + id
        })
      },
      subCourse () {
        this.$router.push({
          path: '/courseAdd'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.el-button--small{ margin:5px 0;}
.Zvertical{ display:inline-block; line-height: 36px; height:36px;}
.el-input{ vertical-align: middle;}
.courseName{ color:#13ce66; text-decoration:underline; cursor: pointer;}
</style>
