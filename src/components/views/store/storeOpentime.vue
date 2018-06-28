<template>
<div class="store-list">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i>门店维护</el-breadcrumb-item>
            <el-breadcrumb-item>时间定义</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <div class="tabPane">
      <a href="javascript:;" class="tabChange current">清冰时间</a>
      <a href="javascript:;" class="tabChange" @click="goNext1($route.params.sid)">冰场预留时间</a>
      <a href="javascript:;" class="tabChange" @click="goNext2($route.params.sid)">教练预留时间</a>
    </div>

    <div class="addBtns">
      <el-button type="primary" @click="clearIceTimeAdd('')">添加</el-button>
    </div>
    <div class="xxxx">
      <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
        <el-table :data="tableDataClear" border style="width: 100%">
          <el-table-column prop="explain" label="时间属性" width="180">
          </el-table-column>
          <el-table-column prop="time" label="时间">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template scope="scope">
              <el-button type="primary" size="small" @click="clearIceTimeAdd(scope.row.type)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="日常清冰时间" :visible.sync="dialogFormVisible">
      <el-form label-width="100px" :model="formListForm" ref="formListForm">
        <el-form-item label="属性" >
          <el-radio-group v-model="formListForm.clearType">
            <el-radio label="1" v-show="showType1">平日清冰</el-radio>
            <el-radio label="2" v-show="showType2">节假日/周末</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="xxx" v-show="formListForm.clearType === '1'">
          <el-form-item label="时间" v-for="(domain, index) in formList.domains" :key="domain.key">
            <el-col :span="10">
              <el-select v-model="domain.cleariceTime" filterable placeholder="请选择">
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

        <div class="xxx" v-show="formListForm.clearType === '2'">
          <el-form-item label="时间" v-for="(domain, index) in formList2.domains" :key="index">
            <el-col :span="10">
              <el-select v-model="domain.cleariceTime" filterable placeholder="请选择">
                <el-option
                  v-for="item in times2"
                  :key="item.key"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button @click.prevent="removeFormList2(domain)" class="reduceBtn">-</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button @click.prevent="addFormList2()" type="primary">+添加时间</el-button>
          </el-form-item>
        </div>

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
      // storeId: this.$route.params.sid,
      storeId: JSON.parse(sessionStorage.getItem('store')).k,
      activeName: 'first',
      tableDataClear: [],
      tableDataReserve: [],
      currentPage: 1,
      loading: true,
      dialogFormVisible: false,
      isShow1: true,
      isShow2: false,
      showType1: true,
      showType2: true,
      times1: [],
      times2: [],
      value3: [],
      cleaStatue: '',
      formListForm: {
        dalyClearTimes: [],
        holidayClearTimes: [],
        clearType: '1',
        initTimeOptions: [],
        time1: '',
        time2: ''
      },
      formList: {
        domains: [{
          cleariceTime: '',
          cleariceType: '1'
        }]
      },
      formList2: {
        domains: [{
          cleariceTime: '',
          cleariceType: '2'
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
        path: '/storeIceReserve'
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
    addFormList () {
      this.formList.domains.push({
        storeId: this.storeId,
        cleariceTime: '',
        cleariceType: this.formListForm.clearType
      })
    },
    removeFormList (formlist) {
      let index = this.formList.domains.indexOf(formlist)
      if (index !== -1) {
        this.formList.domains.splice(index, 1)
      }
    },
    addFormList2 () {
      this.formList2.domains.push({
        storeId: this.storeId,
        cleariceTime: '',
        cleariceType: this.formListForm.clearType
      })
    },
    removeFormList2 (formlist) {
      let index = this.formList2.domains.indexOf(formlist)
      if (index !== -1) {
        this.formList2.domains.splice(index, 1)
      }
    },
    getListData (searchParams) {
      let that = this
      that.loading = true
      axios.get(URL.api_name + 'backofficeapi/store/clearlceTime/search.do', {
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
            let parames = []
            if (that.formListForm.clearType !== '1') {
              parames = this.formList2.domains
            } else {
              parames = this.formList.domains
            }
            axios.post(URL.api_name + 'backofficeapi/store/clearlceTime/update.do', parames).then(function (res) {
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
            let parames = []
            if (that.formListForm.clearType !== '1') {
              parames = this.formList2.domains
            } else {
              parames = this.formList.domains
            }
            axios.post(URL.api_name + 'backofficeapi/store/clearlceTime/create.do', parames).then(function (res) {
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
    clearIceTimeAdd (actionId) { // 获取日常清冰时间
      let that = this
      if (actionId !== '') {
        this.cleaStatue = 'update'
        // 修改
        axios.get(URL.api_name + 'backofficeapi/store/clearlceTime/searchByUpdate.do', {
          params: {
            type: actionId,
            storeId: this.storeId
          }
        }).then(function (respose) {
          let data = respose.data
          if (actionId === 1) {
            that.formList.domains = data.data
            that.showType1 = true
            that.showType2 = false
            that.formListForm.clearType = '1'
          } else if (actionId === 2) {
            that.formList2.domains = data.data
            that.showType1 = false
            that.showType2 = true
            that.formListForm.clearType = '2'
          }
        }, function (error) {
          console.log(error)
        })
        this.dialogFormVisible = true
      } else {
        // 添加操作
        this.cleaStatue = 'add'
        this.dialogFormVisible = true
        // 清空一遍内容
        this.showType1 = true
        this.showType2 = true
        this.formList.domains = []
        this.formList2.domains = []
      }
    },
    initialTime () {
      var that = this
      axios.get(URL.api_name + 'backofficeapi/store/clearlceTime/initialTime.do', {
        params: {
          storeId: this.storeId
        }
      }).then(function (res) {
        if (res.data.status === 'success') {
          that.formListForm.initTimeOptions = res.data.data
          that.times1 = res.data.data
          that.times2 = res.data.data
          that.formList.domains.cleariceType = that.formListForm.clearType
          that.formList2.domains.cleariceType = that.formListForm.clearType
        }
      })
    }

  }
}
</script>
<style scoped>
  .addBtns{ text-align: left; padding-bottom: 10px; }
  .tabPane{ padding:0 20px; margin:0 0 20px 0; border-bottom: 1px solid #ddd; }
.tabPane a{ margin:0 25px 0 0;
  color:#444;
  text-decoration: none;
  padding: 20px 10px 15px 10px;
  border-bottom: solid 3px #fff;
  display: inline-block;
  position: relative}
.tabPane a.current{ color:#20a0ff; border-bottom:solid 3px #20a0ff; }
</style>

