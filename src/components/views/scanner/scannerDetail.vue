<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 闸机扫描器管理</el-breadcrumb-item>
        <el-breadcrumb-item>扫描器列表</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="所属门店:" prop="storeId">
          <el-col :span="12">
            <el-select v-model="formData.storeId" disabled>
              <el-option v-for="(s, i) in storeArrList" :key="i" :label="s.storeName" :value="s.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="扫描器名称:" prop="name">
          <el-col :span="12">
            {{ formData.name }}
          </el-col>
        </el-form-item>
        <el-form-item label="设备编码:" prop="code">
          <el-col :span="12">
            {{ formData.code }}
          </el-col>
        </el-form-item>
        <el-form-item label="类型:" prop="inOrOut">
          <el-col :span="12">
            {{ formData.inOrOut }}
          </el-col>
        </el-form-item>
        <el-form-item label="描述:">
          <el-col :span="12">
            {{ formData.description }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editScanner" :loading="loading">
            编辑
          </el-button>
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
        this.getStoreArr()
        this.getScanner()
      },
      data () {
        var checkStore = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('门店不能为空'))
          } else {
            callback()
          }
        }
        return {
          formData: {
            code: '',
            description: '',
            inOrOut: '',
            name: '',
            storeId: ''
          },
          loading: false,
          storeArrList: [],
          rules: {
            code: [
              { required: true, message: '设备编码不能为空', trigger: 'change' }
            ],
            inOrOut: [
              { required: true, message: '类型不能为空', trigger: 'change' }
            ],
            name: [
              { required: true, message: '扫描器名称不能为空', trigger: 'blur' },
              { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
            ],
            description: [
              { required: true, message: '描述不能为空', trigger: 'blur' },
              { max: 300, message: '长度不能超过300个字符', trigger: 'blur' }
            ],
            storeId: [
              { required: true, validator: checkStore, trigger: 'change' }
            ]
          }
        }
      },
      methods: {
        editScanner () {
          this.$router.push({
            path: '/scannerEdit/' + this.$route.params.sid
          })
        },
        getScanner () {
          let that = this
          axios.get(URL.api_name + 'backofficeapi/gatescanner/find-by-id.do', {
            params: {
              id: this.$route.params.sid
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
            }
          })
        },
        getStoreArr () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/store/search.do', {
            params: {
              pageNum: 1,
              pageSize: 1000
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.storeArrList = res.data.data.list
            }
          })
        },
        onSubmit (name) {
          var that = this
          that.$refs[name].validate((valid) => {
            if (valid) {
              that.loading = true
              axios.post(URL.api_name + 'backoffice/gatescanner/add.do', that.formData).then(res => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '添加成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/scanner'
                      })
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
              }).catch(err => {
                that.loading = false
                that.$message({
                  type: 'error',
                  message: '添加失败',
                  duration: 1000
                })
                console.log(err)
              })
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
  .color-gry{ color:#999; font-size:12px; margin-left:10px;}
</style>
