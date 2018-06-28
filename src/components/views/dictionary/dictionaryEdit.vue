<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据字典</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="字典名称" prop="systemName">
          <el-col :span="12">
            <el-input type="text" v-model="formData.systemName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="字典编码key" prop="systemCode">
          <el-col :span="12">
            <el-input type="text" v-model="formData.systemCode"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="字典编码值" prop="systemValue">
          <el-col :span="12">
            <el-input type="text" v-model="formData.systemValue"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="父节点">
          <el-col :span="12">
            <el-select placeholder="请选择父节点" v-model="formData.parentId">
              <el-option label="顶级结点" :value="0"></el-option>
              <el-option v-for="(p, index) in parentOptions" :key="index" :label="p.systemName" :value="p.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="字典类型">
          <el-col :span="12">
            <el-select v-model="formData.dictType" placeholder="请选择">
              <el-option label="基础类型" :value="1"></el-option>
              <el-option label="业务类型" :value="2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit('formData')">
            {{ loading ? '正在保存' : '保存' }}
          </el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    export default {
      created () {
        this.getDetail()
        this.getParentOptions()
      },
      data () {
        return {
          formData: {
            dictType: '',
            parentId: '',
            systemName: '',
            systemValue: '',
            systemCode: ''
          },
          rules: {
            systemName: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ],
            systemCode: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ],
            systemValue: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ]
          },
          loading: false,
          parentOptions: []
        }
      },
      methods: {
        onSubmit (formName) {
          var that = this
          this.$refs[formName].validate((valid) => {
            if (valid) {
              that.loading = true
              axios.post(URL.api_name + '/backofficeapi/system/rict/update.do', {
                dictType: that.formData.dictType,
                id: that.$route.params.did,
                parentId: that.formData.parentId,
                systemCode: that.formData.systemCode,
                systemName: that.formData.systemName,
                systemValue: that.formData.systemValue
              }).then(res => {
                that.loading = false
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '修改成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/dictionary'
                      })
                    }
                  })
                } else {
                  that.$message({
                    type: 'success',
                    message: res.data.message,
                    duration: 1000
                  })
                }
              }).catch(err => {
                that.$message({
                  type: 'error',
                  message: '修改失败',
                  duration: 1000
                })
                console.log(err)
              })
            } else {
            }
          })
        },
        getDetail () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/system/rict/find.do', {
            params: {
              id: that.$route.params.did
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
            }
          })
        },
        getParentOptions () {
          let that = this
          axios.get(URL.api_name + 'backofficeapi/system/rict/obtainByZeroParent.do').then((res) => {
            if (res.data.status === 'success') {
              that.parentOptions = res.data.data
            }
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .price{
    text-align: center;
  }
</style>
