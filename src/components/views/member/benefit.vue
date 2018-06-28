<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员权益</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="levelName" label="会员等级" width="180">
        </el-table-column>
        <el-table-column prop="content" label="描述">
        </el-table-column>
        <!-- <el-table-column prop="minConsumption" label="最低消费" width="120">
        </el-table-column>
        <el-table-column prop="maxConsumption" label="最高消费" width="120">
        </el-table-column> -->
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.level)">权益</el-button>
            <el-button type="text" size="small" @click="editDetial(scope.row.id, scope.row.content)">编辑描述</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑描述 " :visible.sync="Dialog">
      <el-form label-width="100px">
        <el-form-item label="描述：">
          <el-col :span="22">
            <el-input type="textarea" :rows='4' v-model="content"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="nextStep()">确定</el-button>
          <el-button @click="Dialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    export default {
      created () {
        this.getMemberList()
      },
      data () {
        return {
          Dialog: false,
          content: '',
          id: '',
          tableData: [],
          loading: true
        }
      },
      methods: {
        editDetial (id, content) {
          // a
          let that = this
          that.content = content
          that.id = id
          that.Dialog = true
        },
        nextStep () {
          // a
          let that = this
          axios.post(URL.api_name + 'memberapi/member/level/update/content.do', {
            content: that.content,
            id: that.id
          }).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              that.getMemberList()
              that.Dialog = false
            } else {
              that.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          }).catch((err) => {
            that.$message({
              message: err.data.message,
              type: 'error'
            })
          })
        },
        getMemberList () {
          var that = this
          axios.get(URL.api_name + 'memberapi/member/level/list.do').then((res) => {
            that.loading = false
            if (res.data.status === 'success') {
              that.tableData = res.data.data
            } else {
              that.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          }).catch((err) => {
            console.log(err)
            that.loading = false
          })
        },
        edit (bid) {
          this.$router.push({
            path: '/editBenefit/' + bid
          })
        }
      }
    }
</script>
<style lang="less">
</style>
