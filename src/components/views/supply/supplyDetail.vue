<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应商列表</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px">
        <el-form-item label="供应商名称:">
          <el-col :span="12">
            <span>{{ formData.supplierName }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商编码:">
          <el-col :span="12">
            <span type="text">{{ formData.supplierCode }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商地址:">
          <el-col :span="12">
            <span>{{ formData.supplierAddress }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商联系人:">
          <el-col :span="12">
            <span>{{ formData.supplierLiaison }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商联系方式:">
          <el-col :span="12">
            <span>{{ formData.supplierMobile }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="状态:" prop="supplierStatus">
          <el-col :span="12">
            <span>{{ formData.supplierStatus }}</span>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goEdit">
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
        this.fetchSupplyDetail(this.$route.params.sid)
      },
      data () {
        return {
          formData: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            supplierAddress: '',
            supplierCode: '',
            supplierLiaison: '',
            supplierMobile: '',
            supplierName: '',
            supplierStatus: ''
          },
          loading: false,
          rules: {
            supplierAddress: [
              { required: true, message: '供应商地址不能为空', trigger: 'change' }
            ],
            supplierCode: [
              { required: true, message: '供应商编码不能为空', trigger: 'blur' }
            ],
            supplierLiaison: [
              { required: true, message: '供应商联系人不能为空', trigger: 'blur' }
            ],
            supplierMobile: [
              { required: true, message: '供应商联系方式不能为空', trigger: 'blur' }
            ],
            supplierName: [
              { required: true, message: '供应商名称不能为空', trigger: 'blur' }
            ],
            supplierStatus: [
              { required: true, message: '供应商状态不能为空', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        goEdit () {
          this.$router.push({
            path: '/supplyEdit/' + this.formData.id
          })
        },
        fetchSupplyDetail (id) {
          axios.get(URL.api_name + 'merchandiseapi/supplier/find.do', {
            params: {
              id: id
            }
          }).then(res => {
            if (res.data.status === 'success') {
              this.formData = res.data.data
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
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
