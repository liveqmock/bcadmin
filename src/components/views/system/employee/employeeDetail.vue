<template>
  <div class="employee-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户头像：">
              <img :src="formData.imgUrl" class="user-img">
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名：">
              <p>{{ formData.name }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色：">
              <p>{{ formData.role | formatRole }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              <p>{{ formData.gender === 'm' ? '男' : '女' }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="员工编号：">
              <p>{{ formData.employeeNo }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系手机：">
              <p>{{ formData.mobile }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生日：">
              <p>{{ formData.birthday }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱地址：">
              <p>{{ formData.email }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="居住地：">
              <p>{{ formData.address }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人简介：">
              <p>{{ formData.introduce }}</p>
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">-->
            <!--<el-form-item label="佣金比例：">-->
              <!--<p></p>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户状态：">
              <p>{{ formData.status === 1 ? '正常' : '停用' }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建日期：">
              <p>{{ formData.createTime }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职务：">
              <p>{{ formData.position | formatType }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" @click="edit()">编辑</el-button>
      <el-button @click="$router.go('-1')">返回</el-button>
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
        formData: {}
      }
    },
    methods: {
      edit () {
        this.$router.push({
          path: '/employeeEdit/' + this.$route.params.eid
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/employee/details.do', {
          params: {
            id: this.$route.params.eid,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          } else {
            that.$mesage({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    filters: {
      formatRole (role) {
        let roleLists = JSON.parse(sessionStorage.getItem('roleList'))
        if (roleLists && roleLists.length > 0) {
          for (let i = 0; i < roleLists.length; i++) {
            if (role === roleLists[i].roleId) {
              return roleLists[i].roleName
            }
          }
        } else {
          return ''
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-form{
    overflow: hidden;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
  .user-img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .button-group{
    padding: 10px;
  }
</style>
