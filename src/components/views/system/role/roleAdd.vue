<template>
  <div class="menu">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="80px">
        <el-form-item label="角色名称:">
          <el-row>
            <el-col :span="6">
              <el-input type="text" v-model="roleName" :maxlength="10" placeholder="请输入角色名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="选择权限:">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button @click="updateRole" type="primary" :loading="loading">{{ loading ? '正在保存' : '保存' }}</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
          <el-button @click="resetChecked">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  // import ArrayUtils from '@/common/js/ArrayUtils'
  import axios from 'axios'
  export default {
    created () {
      this.getData()
    },
    methods: {
      getCheckedNodes () {
        console.log(this.$refs.tree.getCheckedNodes())
      },
      getCheckedKeys () {
        console.log(this.$refs.tree.getCheckedKeys())
      },
      resetChecked () {
        this.$refs.tree.setCheckedKeys([])
      },
      getData () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/resource/list/role.do', {
          params: {
            roleId: JSON.parse(sessionStorage.getItem('userInfo')).roleId
          }
        }).then((res) => {
          that.data = res.data.data.userRolePrivilge
        })
      },
      updateRole () {
        var that = this
        // 获取选中节点
        that.checkedRoles = that.$refs.tree.getCheckedNodes(true)
        // that.subArrs = ArrayUtils.getThirdParents(that.checkedRoles, that.data)
        if (that.checkedRoles.length === 0) {
          that.$message({
            type: 'error',
            message: '权限不能为空'
          })
          return
        }
        if (that.roleName === '') {
          that.$message({
            type: 'error',
            message: '角色名称不能为空'
          })
          return
        }
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/privilege/update.do', {
          roleId: '',
          privilegeVOs: that.checkedRoles,
          roleName: that.roleName,
          storeId: JSON.parse(sessionStorage.getItem('store')).k
        }).then(res => {
          that.loading = false
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '保存成功',
              duration: 1000,
              onClose: function () {
                that.$router.push({
                  path: '/role'
                })
              }
            })
          } else {
            that.$errMsg(res.data.message)
          }
        }).catch((err) => {
          console.log(err)
          that.loading = false
        })
      }
    },
    data () {
      return {
        defaultProps: {
          children: 'privilegeVOs',
          label: 'label'
        },
        data: [],
        roleName: '',
        checkedRoles: [],
        loading: false
      }
    }
  }
</script>
<style lang="less">
  .button-group{
    padding: 10px;
  }
</style>
