<template>
  <div class="add-goodsType" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品种类管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item label="类型名称:">
          <el-col :span="12">
            {{ formData.name }}
          </el-col>
        </el-form-item>
        <el-form-item label="隶属类别:">
          <el-col :span="12">
            <el-select v-model="formData.parentId" disabled>
              <el-option label="顶级结点" :value="0"></el-option>
              <el-option v-for="(t, i) in typeList" :label="t.name" :value="t.id" :key="i"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="类型描述:">
          <el-col :span="12">
            {{ formData.represent }}
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-col :span="12">
            {{ formData.remarks }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goEdit">编辑</el-button>
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
      this.getTypeDetail()
      this.getTypeList()
    },
    data () {
      return {
        formData: null,
        typeList: []
      }
    },
    methods: {
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
      goEdit () {
        this.$router.push({
          path: '/editGoodsType/' + this.$route.params.gid
        })
      },
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
      }
    }
  }
</script>
<style lang="less">

</style>
