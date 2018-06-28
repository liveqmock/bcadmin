<template>
  <div class="add-goodsType" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品种类管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" ref="formData" :model="formData" :rules="rules">
        <el-form-item label="类型名称:" prop="name">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="隶属类别:" prop="parentId">
          <el-select v-model="formData.parentId">
            <el-option label="父节点" :value="0"></el-option>
            <el-option v-for="(t, i) in typeList" :label="t.name" :value="t.id" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型描述:" prop="represent">
          <el-col :span="12">
            <el-input type="textarea" :rows="5" v-model="formData.represent"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-col :span="12">
            <el-input type="textarea" :rows="5" v-model="formData.remarks"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="addGoodsType('formData')">{{ loading ? '正在保存' : '保存' }}</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
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
      this.getTypeList()
      this.getTypeDetail()
    },
    data () {
      var checkType = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('隶属类别不能为空'))
        } else {
          return callback()
        }
      }
      return {
        formData: null,
        typeList: [],
        loading: false,
        rules: {
          name: [
            { required: true, message: '类型名称不能为空', trigger: 'blur' },
            { max: 30, message: '名称最多输入30个字符', trigger: 'blur' }
          ],
          represent: [
            { required: true, message: '类型描述不能为空', trigger: 'blur' },
            { max: 250, message: '描述最多输入250个字符', trigger: 'blur' }
          ],
          parentId: [
            { required: true, validator: checkType, trigger: 'change' }
          ],
          remarks: [
            { max: 255, message: '备注最多输入255个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getTypeList () {
        let that = this
        axios.get(URL.api_name + 'merchandiseapi/product/type/obtain/zero.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.typeList = res.data.data
          }
        })
      },
      getTypeDetail () {
        let that = this
        axios.get(URL.api_name + 'merchandiseapi/product/type/find.do', {
          params: {
            id: this.$route.params.gid,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          }
        })
      },
      addGoodsType (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.loading = true
            axios.post(URL.api_name + 'merchandiseapi/product/type/update.do', this.formData).then(res => {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '更新成功',
                  duration: 1500,
                  onClose: function () {
                    that.$router.push({
                      path: '/goodsType'
                    })
                  }
                })
              } else {
                that.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            }).catch(err => {
              that.loading = false
              console.log(err)
              that.$message({
                type: 'error',
                message: '提交失败'
              })
            })
          }
        })
      }
    }
  }
</script>
<style lang="less">

</style>
