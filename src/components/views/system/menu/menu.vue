<template>
  <div class="menu">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>制票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="60px">
        <el-form-item label="角色:">
          <el-row>
            <el-col :span="6">
              <el-select v-model="roleId" placeholder="请选择角色" @change="changeRole">
                <el-option v-for="(role, index) in roles" :key="index" :label="role.roleName" :value="role.roleId"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-tree
        :data="data"
        show-checkbox
        node-key="resourceId"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <div class="button-group">
        <el-button @click="updateRole" type="primary">保存</el-button>
        <el-button @click="this.$router.go('-1')">返回</el-button>
        <el-button @click="resetChecked">清空</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
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
        axios.get(URL.api_name + 'backofficeapi/resource/list.do').then((res) => {
          that.data = res.data.data
        })
      },
      changeRole () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/privilege/role.do', {
          params: {
            roleId: this.roleId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.selectRoles = res.data.data
            // 设置菜单选中
            that.$refs.tree.setCheckedNodes(that.selectRoles)
          }
        })
      },
      updateRole () {
        var that = this
        that.loading = true
        // 获取选中节点
        that.checkedRoles = that.$refs.tree.getCheckedNodes()
        axios.get(URL.api_name + 'backofficeapi/privilege/update.do', {
          params: {
            roleId: that.roleId,
            privilegeVOs: that.checkedRoles,
            roleName: '',
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          that.loading = false
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '保存成功',
              duration: 1000
            })
          } else {
            that.$message({
              type: 'success',
              message: '保存失败',
              duration: 1000
            })
          }
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
        roles: [
          {
            roleName: '教练',
            roleId: 1
          },
          {
            roleName: '学员',
            roleId: 2
          },
          {
            roleName: '管理员',
            roleId: 3
          }
        ],
        roleId: '',
        selectRoles: [],
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
