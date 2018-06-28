<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员资料管理</el-breadcrumb-item>
        <el-breadcrumb-item>补录积分</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form label-width="100px" :model="formData" ref="formData" :rules="rules">
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="会员编号：">
              <p>{{ formData.id }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="会员等级：">
              <p>{{ formData.grade | formatType}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="会员原积分：">
              <p>{{ formData.point }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="票据/订单编号：">
              <el-input type="text"
                        @change="textChange"
                        v-model="formData.code"
                        @keyup.enter.native="searchCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button @click="searchCode" type="primary">查询</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="可补录积分：">
              {{ formData.makeupPoint }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="备注：">
              <el-input type="text" v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item>
              <el-button type="primary" :disabled="disable" :loading="isLoading" @click="updatePoint('formData')">
                {{ isLoading ? '正在保存' : '保存' }}
              </el-button>
              <el-button @click="$router.go('-1')">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="createTime" label="修改时间">
        </el-table-column>
        <el-table-column prop="point" label="原积分">
        </el-table-column>
        <el-table-column prop="newPoint" label="新积分">
        </el-table-column>
        <el-table-column prop="operateScore" label="补录积分">
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
        </el-table-column>
        <el-table-column prop="orderNo" label="补录订单号">
        </el-table-column>
        <el-table-column prop="operatorName" label="操作员">
        </el-table-column>
      </el-table>
    </div>
    <pager :current-page="currentPage" :total-count="totalCount" v-on:handleCurrentChange="getListData"></pager>
  </div>
</template>
<script>
    import Pager from '@/components/views/common/pager'
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    export default {
      created () {
        this.getDetail()
        this.getListData()
      },
      data () {
        return {
          list: [],
          currentPage: 1,
          pageSize: 15,
          totalCount: 0,
          loading: false,
          isLoading: false,
          disable: true,
          formData: {
            id: '',
            code: '',
            makeupPoint: '',
            remarks: '',
            grade: '',
            orderNo: '',
            orderPaid: '',
            memberId: ''
          },
          rules: {
            newPoint: [
              { required: true, message: '积分不能为空', trigger: 'blur' }
            ]
          }
        }
      },
      components: {
        Pager: Pager
      },
      methods: {
        textChange (val) {
          this.disable = true
        },
        searchCode () {
          let that = this
          axios.get(URL.api_name + 'backofficeapi/order/find-paid-by-code.do', {
            params: {
              code: that.formData.code,
              userId: that.formData.id
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.formData.makeupPoint = res.data.data.makeupPoint
              that.formData.orderNo = res.data.data.orderNo
              that.formData.orderPaid = res.data.data.orderPaid
              that.formData.memberId = res.data.data.memberId
              that.disable = false
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        },
        getDetail (searchParams) {
          var that = this
          axios.get(URL.api_name + 'memberapi/member/update/point/detail.do', {
            params: {
              id: this.$route.params.mid
            }
          }).then(function (response) {
            if (response.data.status === 'success') {
              // 更新表单数据
              that.formData.id = response.data.data.member.id
              that.formData.grade = response.data.data.member.grade
              that.formData.point = response.data.data.member.point
              that.formData.remarks = response.data.data.member.remarks
            } else {
              that.$message({
                type: 'error',
                message: response.data.message,
                duration: 1000
              })
            }
          }, function (error) {
            console.log(error)
          })
        },
        getListData (num) {
          var that = this
          that.currentPage = num
          that.loading = true
          axios.get(URL.api_name + 'memberapi/member/update/point/iolist.do', {
            params: {
              id: that.$route.params.mid,
              pageSize: this.pageSize,
              pageNum: num
            }
          }).then((res) => {
            that.loading = false
            that.list = res.data.data.list
            that.totalCount = res.data.data.total
          }).catch((err) => {
            that.loading = false
            console.log(err)
          })
        },
        updatePoint (formName) {
          var that = this
          this.$refs[formName].validate((valid) => {
            if (valid) {
              that.isLoading = true
              axios.post(URL.api_name + 'memberapi/member/update/point.do', that.formData).then((res) => {
                if (res.data.status === 'success') {
                  that.isLoading = false
                  that.$message({
                    type: 'success',
                    message: res.data.message,
                    duration: 500,
                    onClose: function () {
                      that.$router.push({
                        path: '/memberInfo'
                      })
                    }
                  })
                } else {
                  that.isLoading = false
                  that.$message({
                    type: 'error',
                    message: res.data.message,
                    duration: 500
                  })
                }
              }).catch((err) => {
                console.log(err)
              })
            } else {
              return false
            }
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .search-wrapper{
    padding-bottom: 15px;
  }
  .el-form-item{
    margin-bottom: 22px;
  }
</style>
