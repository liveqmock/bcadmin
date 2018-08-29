<template>
  <div class="payment">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费类型管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item label="业务名称：">
          <el-col :span="12">
            {{formData.typeName}}
          </el-col>
        </el-form-item>
        <el-form-item label="隶属类别：" prop="dictId">
          <el-col :span="12">
            {{dictName}}
          </el-col>
        </el-form-item>
        <el-form-item label="类型描述：">
          <el-col :span="12">
            {{formData.typeDes}}
          </el-col>
        </el-form-item>
        <el-form-item label="备注：">
          <el-col :span="12">
            {{formData.remarks}}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$router.push({path: '/paymentTypeEdit/' + formData.id})">
            编辑
          </el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getDepartmentName()
      this.getTypeDetail()
    },
    data () {
      return {
        formData: {
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          typeName: '',
          typeDes: '',
          remarks: '',
          dictId: ''
        },
        departmentNames: [],
        loading: false
      }
    },
    computed: {
      dictName () {
        let dictName
        for (let d of this.departmentNames) {
          if (d.id === this.formData.dictId) {
            dictName = d.systemName
            break
          }
        }
        return dictName
      }
    },
    methods: {
      getTypeDetail () {
        axios.get(URL.api_name + 'backofficeapi/paymenttype/getPaymentType.do', {
          params: {
            id: this.$route.params.pid
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.formData = res.data.data
          }
        })
      },
      getDepartmentName () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'departmentName',
            pageSize: 100
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.departmentNames = res.data.data
          }
        })
      }
    }
  }
</script>
<style lang="less">

</style
