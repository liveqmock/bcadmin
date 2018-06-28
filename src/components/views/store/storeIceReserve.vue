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
      <a href="javascript:;" class="tabChange current">冰场预留时间</a>
      <a href="javascript:;" class="tabChange" @click="goNext2(storeId)">教练预留时间</a>
    </div>

    <div class="addBtns">
      <el-button type="primary" @click="clearIceTimeUpdate('')">添加</el-button>
    </div>
    <div class="xxxx">
      <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
        <el-table :data="tableDataClear" border style="width: 100%">
          <el-table-column prop="dictCode" label="类型" width="180">
          </el-table-column>
          <el-table-column prop="time" label="时间">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template scope="scope">
              <el-button type="primary" size="small" @click="clearIceTimeUpdate(scope.row.rinkReserveId)">修改</el-button>
              <el-button type="danger" size="small" @click="clearIceTimeDel(scope.row.rinkReserveId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="添加/修改冰场预留时间" :visible.sync="dialogFormVisible">
      <el-form label-width="100px" :model="formListForm" ref="formListForm">
        <el-form-item label="属性：" >
          <el-radio-group v-model="formListForm.clearType">
            <el-radio label="日常" v-show="showType1">平日</el-radio>
            <el-radio label="周六日" v-show="showType2">周六日</el-radio>
            <el-radio label="节假日" v-show="showType3">节假日/暑假</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="xxx">
          <el-form-item label="时间" v-for="(domain, index) in formList.domains" :key="index" >
            <el-col :span="6">
              <el-select
                v-model="domain.beginTimeSlot"
                @change="beginTimes" filterable placeholder="请选择">
                <el-option
                  v-for="item in times1"
                  :key="item.key"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="6">
              <el-select
                v-model="domain.endTimeSlot"
                @change="endTimes(domain)" filterable placeholder="请选择">
                <el-option
                  v-for="item in times1"
                  :key="item.key"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button @click.prevent="removeFormList(domain)" class="reduceBtn">-</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button @click.prevent="addFormList()" type="primary">+添加时间</el-button>
          </el-form-item>
        </div>
        <el-form-item label="备注：" >
          <el-input type="textarea" :rows='3' v-model="remark"></el-input>
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
export default {
  created () {
    this.getListData()
    this.initialTime()
  },
  data () {
    return {
      // storeId: this.$route.params.id,
      storeId: JSON.parse(sessionStorage.getItem('store')).k,
      activeName: 'first',
      tableDataClear: [],
      tableDataReserve: [],
      currentPage: 1,
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
      remark: '',
      cleaStatue: '',
      formListForm: {
        dalyClearTimes: [],
        holidayClearTimes: [],
        clearType: '周六日',
        initTimeOptions: [],
        time1: '',
        time2: ''
      },
      formList: {
        domains: [{
          beginTimeSlot: '',
          endTimeSlot: ''
        }]
      }
    }
  },
  methods: {
    search () {
      console.log('submit')
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
        path: '/storeCoachReserve'
      })
    },
    handleCurrentChange (val) {
      this.getListData()
    },
    beginTimes (val) {
      console.log(val)
      if (val.endTimeSlot !== '' && val.endTimeSlot <= val.beginTimeSlot) {
        console.log('结束时间小于')
        this.$message({
          type: 'error',
          message: '结束时间不能小于开始时间'
        })
        val.beginTimeSlot = ''
      }
    },
    endTimes (val) {
      console.log(val)
      if (val.beginTimeSlot !== '' && val.endTimeSlot <= val.beginTimeSlot) {
        console.log('结束时间小于')
        this.$message({
          type: 'error',
          message: '结束时间不能小于开始时间'
        })
        val.endTimeSlot = ''
      }
    },
    addFormList () {
      this.formList.domains.push({
        beginTimeSlot: '',
        endTimeSlot: ''
      })
    },
    removeFormList (formlist) {
      let index = this.formList.domains.indexOf(formlist)
      if (index !== -1) {
        this.formList.domains.splice(index, 1)
      }
    },
    getListData (searchParams) {
      let that = this
      that.loading = true
      axios.get(URL.api_name + 'backofficeapi/store/rink/reserve/search.do', {
        params: {
          storeId: this.storeId
        }
      }).then(function (respose) {
        let data = respose.data
        that.tableDataClear = data.data
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
          if (this.cleaStatue === 'update') {
            // ↑↑↑↑判断为更新操作
            axios.post(URL.api_name + 'backofficeapi/store/rink/reserve/update.do', {
              dictCode: that.formListForm.clearType,
              remark: that.remark,
              rinkReserveId: that.rinkReserveId,
              rinkTimeSlotList: that.formList.domains
            }).then(function (res) {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '修改成功',
                  duration: 1000,
                  onClose: function () {
                    that.getListData()
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
            axios.post(URL.api_name + 'backofficeapi/store/rink/reserve/add.do', {
              dictCode: that.formListForm.clearType,
              remark: that.remark,
              rinkTimeSlotList: that.formList.domains,
              storeId: that.storeId
            }).then(function (res) {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '添加成功',
                  duration: 1000,
                  onClose: function () {
                    that.getListData()
                  }
                })
              } else {
                that.loading = false
                that.$message({
                  type: 'error',
                  message: res.data.message,
                  duration: 2000
                })
              }
            }, function (err) {
              console.log(err)
              that.$message({
                type: 'error',
                message: '添加失败，请完善信息重新添加',
                duration: 2000
              })
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
    clearIceTimeDel (id) {
      var that = this
      that.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(id)
        axios.get(URL.api_name + 'backofficeapi/store/rink/reserve/delete.do', {
          params: {
            rinkReserveId: id
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000
            })
          }
          that.getListData(that.currentPage)
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
    clearIceTimeUpdate (actionId) { // 获取日常清冰时间
      let that = this
      console.log(actionId)
      that.rinkReserveId = actionId
      if (actionId !== '') {
        this.cleaStatue = 'update'
        // 修改
        axios.get(URL.api_name + 'backofficeapi/store/rink/reserve/find.do', {
          params: {
            rinkReserveId: actionId
          }
        }).then(function (respose) {
          let data = respose.data
          that.formListForm.clearType = data.data.dictCode
          if (that.formListForm.clearType === '日常') {
            that.showType1 = true
            that.showType2 = false
            that.showType3 = false
          } else if (that.formListForm.clearType === '周六日') {
            that.showType1 = false
            that.showType2 = true
            that.showType3 = false
          } else {
            that.showType1 = false
            that.showType2 = false
            that.showType3 = true
          }
          that.formList.domains = []
          for (let i = 0; i < data.data.rinkTimeSlotList.length; i++) {
            that.formList.domains.push({
              beginTimeSlot: data.data.rinkTimeSlotList[i].beginTimeSlot,
              endTimeSlot: data.data.rinkTimeSlotList[i].endTimeSlot
            })
          }
          that.remark = data.data.remark
        }, function (error) {
          console.log(error)
        })
        this.dialogFormVisible = true
      } else {
        // 添加操作
        this.cleaStatue = 'add'
        this.dialogFormVisible = true
        that.formList.domains = []
        that.remark = ''
        that.showType1 = true
        that.showType2 = true
        that.showType3 = true
        // 清空一遍内容
      }
    },
    initialTime () {
      var that = this
      axios.get(URL.api_name + 'backofficeapi/store/rink/reserve/initialTime.do', {
        params: {
          storeId: this.storeId
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
.el-col-1{ text-align: center; }
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
    border-bottom: 3px solid #20a0ff;
    color:#20a0ff;
  }
</style>

