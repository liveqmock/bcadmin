<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="formInline.keyword" placeholder="请输入姓名关键字"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select placeholder="请选择" v-model="formInline.role">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(r, index) in roleList"
                       :key="index"
                       :label="r.roleName"
                       :value="r.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务：">
          <el-select placeholder="请选择" v-model="formInline.position">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(e, index) in employDuty"
                       :key="index"
                       :label="e.systemName"
                       :value="e.systemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="success" @click="addEmployee">+ 添加员工</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="employeeNo" label="员工工号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column label="职务">
          <template scope="scope">
            {{ scope.row.position | formatType }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式">
        </el-table-column>
        <el-table-column label="性别">
          <template scope="scope">
            {{ scope.row.gender === 'm' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            {{ scope.row.status === 1 ? '正常' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template scope="scope">
            <el-button type="info" size="small" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="info" size="small" @click="goEdit(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.status === 1" type="danger" size="small" @click="lock(scope.row, 1)">锁定</el-button>
            <el-button v-if="scope.row.status === 0" type="success" size="small" @click="lock(scope.row, 0)">解锁</el-button>
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
  import axios from 'axios'
  import Pager from '@/components/views/common/pager'
  export default {
    created () {
      this.getDuty()
      this.getRoleList()
    },
    data () {
      return {
        formInline: {
          keyword: '',
          role: '',
          position: ''
        },
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        tableData: [],
        currentPage: 1,
        pageSize: 15,
        pageNum: 0,
        totalCount: 0,
        loading: true,
        option: '',
        roleList: [],
        employDuty: []
      }
    },
    components: {
      Pager: Pager
    },
    methods: {
      getDuty () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'employee_position',
            pageSize: 100
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.employDuty = res.data.data
          }
        })
      },
      search () {
        if (this.currentPage > 1) {
          this.currentPage = 1
        } else {
          this.getListData(this.currentPage)
        }
      },
      addEmployee () {
        this.$router.push({
          path: '/employeeAdd'
        })
      },
      getListData (num) {
        var that = this
        that.currentPage = num
        that.loading = true
        axios.get(URL.api_name + 'backofficeapi/employee/search.do', {
          params: {
            storeId: that.storeId,
            name: this.formInline.keyword,
            role: this.formInline.role,
            position: this.formInline.position,
            pageSize: this.pageSize,
            pageNum: num
          }
        }).then(function (respose) {
          let data = respose.data
          that.tableData = data.data.list
          that.loading = false
          that.totalCount = data.data.total
        }).catch(function (error) {
          that.loading = false
          console.log(error)
        })
      },
      goDetail (id) {
        this.$router.push({
          path: '/employee/' + id
        })
      },
      goEdit (id) {
        this.$router.push({
          path: '/employeeEdit/' + id
        })
      },
      lock (scope, status) {
        var that = this
        let msg = ''
        if (status === 1) {
          msg = '确定锁定该账户吗？'
        } else {
          msg = '确定解锁该账户吗？'
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(URL.api_name + 'backofficeapi/employee/updateStatus.do', {
            params: {
              id: scope.id,
              status: scope.status
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              this.$message({
                type: 'success',
                message: res.data.message,
                duration: 1000
              })
              that.getListData(that.currentPage)
            } else {
              that.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      getRoleList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/role/list.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            pageSize: 1000
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.roleList = res.data.data.list
            sessionStorage.setItem('roleList', JSON.stringify(that.roleList))
            that.getListData(that.currentPage)
          }
        }).catch((err) => {
          that.loading = false
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="less">
</style>
