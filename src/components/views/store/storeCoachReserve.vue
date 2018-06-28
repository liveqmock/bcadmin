<template>
<div class="store-list">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i>门店管理</el-breadcrumb-item>
            <el-breadcrumb-item>冰场时间定义</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <div class="tabPane">
      <a href="javascript:;" class="tabChange" @click="goNext1(storeId)">清冰时间</a>
      <a href="javascript:;" class="tabChange" @click="goNext2(storeId)">冰场预留时间</a>
      <a href="javascript:;" class="tabChange current">教练预留时间</a>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="条件查询">
          <el-input v-model="formInline.coachName" placeholder="输入教练名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Update('')">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="xxxx">
      <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
        <el-table :data="tableDataClear" border style="width: 100%">
          <el-table-column prop="weekDay" label="日期" width="120">
          </el-table-column>
          <el-table-column prop="timeStages" label="时间">
          </el-table-column>
          <el-table-column prop="coachName" label="教练名称" width="120">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template scope="scope">
              <el-button type="primary" size="small" @click="Update(scope.row.id)">修改</el-button>
              <el-button type="danger" size="small" @click="Del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
    </div>

    <el-dialog title="添加/修改教练预留时间" :visible.sync="dialogFormVisible">
      <el-form label-width="100px" :model="formListForm" ref="formListForm">
        <el-form-item label="预留时间：" >
          <el-select v-model="formListForm.weekDay" clearable placeholder="请选择">
            <el-option
              v-for="item in weekDays"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="xxx">
          <el-form-item label="时间：" v-for="(domain, index) in formList.domains" :key="domain.key">
            <el-col :span="10">
              <el-select v-model="domain.beginTimeSlot" filterable placeholder="请选择">
                <el-option
                  v-for="item in times1"
                  :key="item.key"
                  :label="item.text"
                  :value="item.text">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button @click.prevent="removeFormList(domain)" class="reduceBtn">-</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="　">
            <el-button @click.prevent="addFormList()" type="primary">+添加时间</el-button>
          </el-form-item>
        </div>
        <el-form-item label="备注：" >
          <el-input type="textarea" :rows='3' v-model="formListForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="选择教练：" >
          <el-select v-model="formListForm.coach" clearable placeholder="请选择">
            <el-option
              v-for="item in coachList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReset('formListForm')">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit('formListForm')">保 存</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import axios from 'axios'
import URL from '@/common/js/URL.js'
import Pager from '@/components/views/common/pager'
export default {
  created () {
    this.getListData()
    this.initialTime()
    this.getCocah()
  },
  data () {
    return {
      // storeId: this.$route.params.id,
      storeId: JSON.parse(sessionStorage.getItem('store')).k,
      activeName: 'first',
      tableDataClear: [],
      tableDataReserve: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 15,
      loading: true,
      dialogFormVisible: false,
      dialogVisible: false,
      isShow1: true,
      isShow2: false,
      showType1: true,
      showType2: true,
      showType3: true,
      rinkReserveId: '',
      times1: [],
      times2: [],
      value3: [],
      cleaStatue: '',
      formInline: {
        coachName: ''
      },
      weekDays: [{
        value: '1',
        label: '星期一'
      }, {
        value: '2',
        label: '星期二'
      }, {
        value: '3',
        label: '星期三'
      }, {
        value: '4',
        label: '星期四'
      }, {
        value: '5',
        label: '星期五'
      }, {
        value: '6',
        label: '星期六'
      }, {
        value: '7',
        label: '星期日'
      }],
      formListForm: {
        remark: '',
        coachId: '',
        timeStagesArr: '',
        time1: '',
        weekDay: '',
        coach: ''
      },
      coachList: [],
      formList: {
        domains: [
          {
            beginTimeSlot: ''
          }
        ]
      }
    }
  },
  components: {
    Pager: Pager
  },
  methods: {
    search () {
      if (this.currentPage > 1) {
        this.currentPage = 1
      } else {
        this.getListData(this.currentPage)
      }
    },
    goNext1 (id) {
      // console.log('success')
      this.$router.push({
        path: '/storeOpentime'
      })
    },
    goNext2 (id) {
      // console.log('success')
      this.$router.push({
        path: '/storeIceReserve'
      })
    },
    addFormList () {
      this.formList.domains.push({
        beginTimeSlot: ''
      })
    },
    removeFormList (formlist) {
      let index = this.formList.domains.indexOf(formlist)
      if (index !== -1) {
        this.formList.domains.splice(index, 1)
      }
    },
    getListData (num) {
      this.currentPage = num
      let that = this
      that.loading = true
      axios.get(URL.api_name + 'backofficeapi/coach-reserve-time/search.do', {
        params: {
          pageNum: this.currentPage,
          pageSize: 15,
          storeId: that.storeId,
          coachName: that.formInline.coachName
        }
      }).then(function (respose) {
        let data = respose.data
        that.tableDataClear = data.data.list
        that.totalCount = data.data.total
        that.loading = false
      }, function (error) {
        console.log(error)
      })
    },
    // 修改保存、添加保存操作
    dialogSubmit (formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        // 验证是否有空值
        if (valid) {
          let timestage = []
          console.log(that.formList.domains.length)
          if (that.formList.domains.length > 0) {
            for (let s = 0; s < that.formList.domains.length; s++) {
              timestage.push(that.formList.domains[s].beginTimeSlot)
            }
          }
          if (this.cleaStatue === 'update') {
            // ↑↑↑↑判断为更新操作
            axios.post(URL.api_name + 'backofficeapi/coach-reserve-time/update.do', {
              coachId: that.formListForm.coach,
              id: that.rinkReserveId,
              remark: that.formListForm.remark,
              timeStagesArr: timestage,
              weekDay: that.formListForm.weekDay,
              storeId: that.storeId
            }).then(function (res) {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '修改成功',
                  duration: 1000,
                  onClose: function () {
                    that.getListData(that.currentPage)
                  }
                })
              } else {
                that.loading = false
                that.$message({
                  type: 'error',
                  message: '修改失败',
                  duration: 1000
                })
              }
            }, function (error) {
              console.log(error)
            })
            this.dialogFormVisible = false
          } else if (this.cleaStatue === 'add') {
            // ↑↑↑↑↑↑判断为新增、添加操作
            axios.post(URL.api_name + 'backofficeapi/coach-reserve-time/create.do', {
              coachId: that.formListForm.coach,
              remark: that.formListForm.remark,
              timeStagesArr: timestage,
              weekDay: that.formListForm.weekDay,
              storeId: that.storeId
            }).then(function (res) {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '添加成功',
                  duration: 1000,
                  onClose: function () {
                    that.getListData(that.currentPage)
                  }
                })
              } else {
                that.loading = false
                that.$message({
                  type: 'error',
                  message: res.data.message,
                  duration: 1000
                })
              }
            }, function (err) {
              console.log(err)
            })
            this.dialogFormVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dialogReset (formName) {
      this.dialogFormVisible = false
      // this.$refs[formName].resetFields()
    },
    setEndTime () {
    },
    Del (id) {
      var that = this
      that.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(id)
        axios.get(URL.api_name + 'backofficeapi/coach-reserve-time/delete.do', {
          params: {
            id: id
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000
            })
          }
        }).catch(err => {
          that.$message({
            type: 'error',
            message: '删除失败',
            duration: 1000
          })
          console.log(err)
        })
        that.getListData(that.currentPage)
      }).catch(() => {})
    },
    Update (actionId) {
      let that = this
      console.log(actionId)
      that.rinkReserveId = actionId
      if (actionId !== '') {
        this.cleaStatue = 'update'
        // 修改
        // 获取列表
        axios.get(URL.api_name + 'backofficeapi/coach-reserve-time/find.do', {
          params: {
            id: actionId
          }
        }).then(function (respose) {
          let data = respose.data
          // that.formListForm.weekDay = data.data.weekDay
          that.formListForm.weekDay = data.data.weekDay
          that.formList.domains = []
          for (let i = 0; i < data.data.timeStagesArr.length; i++) {
            that.formList.domains.push({
              beginTimeSlot: data.data.timeStagesArr[i]
            })
          }
          that.formListForm.remark = data.data.remark
          that.formListForm.coach = data.data.coachId
        }, function (error) {
          console.log(error)
        })
        this.dialogFormVisible = true
      } else {
        // 添加操作
        this.cleaStatue = 'add'
        this.dialogFormVisible = true
        that.formListForm.weekDay = ''
        that.formListForm.coach = ''
        that.formList.domains = [{beginTimeSlot: ''}]
        that.formListForm.remark = ''
        // 清空一遍内容
      }
    },
    getCocah () {
      let that = this
      axios.get(URL.api_name + 'backofficeapi/employee/coach-list/search.do', {
        params: {
          storeId: this.storeId
        }
      }).then(function (res) {
        if (res.data.status === 'success') {
          that.coachList = res.data.data.list
        }
      })
    },
    initialTime () {
      var that = this
      axios.get(URL.api_name + 'backofficeapi/coach-reserve-time/time-stage-get.do', {
        params: {
          // storeId: this.storeId
        }
      }).then(function (res) {
        if (res.data.status === 'success') {
          // that.formListForm.initTimeOptions = res.data.data
          that.times1 = res.data.data
          // that.formList.domains.cleariceType = that.formListForm.clearType
        }
      })
    }

  }
}
</script>
<style scoped>
  .el-col-1{
    text-align: center;
  }
  .addBtns{
    text-align: left; padding-bottom: 10px;
  }
  .tabPane{
    margin:0 0 20px 0;
    border-bottom: 1px solid #ddd;
  }
  .tabPane a{
    display: inline-block;
    height: 50px;
    line-height: 50px;
    margin:0 25px 0 0;
    color:#444;
    text-decoration: none;
  }
  .tabPane a.current{
    color:#20a0ff;
    border-bottom: 3px solid #20a0ff;
  }
</style>

