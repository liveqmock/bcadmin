<template>
  <div class="store-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i>门店管理</el-breadcrumb-item>
        <el-breadcrumb-item>组织结构管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="组织架构">
          <el-select v-model="formInline.organiz" placeholder="请选择">
            <el-option label="总部" value="sz"></el-option>
          </el-select>
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="华南大区" value="huanan"></el-option>
            <el-option label="华中大区" value="huazhong"></el-option>
            <el-option label="华东大区" value="huadong"></el-option>
          </el-select>
          <el-select v-model="formInline.place" placeholder="请选择">
            <el-option label="南宁清秀区冰粉冰场 nn01" value="shanghai"></el-option>
            <el-option label="深圳罗湖区缤纷冰场 nn02" value="beijing"></el-option>
            <el-option label="深圳南山区缤纷冰场 nn03" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联人">
          <el-select v-model="formInline.staff" placeholder="全部">
            <el-option label="教练A" value="jiaolian"></el-option>
            <el-option label="教练B" value="jiaolian2"></el-option>
            <el-option label="教练C" value="jiaolian3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="addStore">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="Catalog" label="一级目录" width="180">
        </el-table-column>
        <el-table-column prop="region" label="区域">
        </el-table-column>
        <el-table-column prop="store" label="门店" width="220">
        </el-table-column>
        <el-table-column prop="statue" label="营业状态">
        </el-table-column>
        <el-table-column prop="links" label="关联人">
        </el-table-column>
        <el-table-column prop="editime" label="操作时间">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button type="text" size="small"  @click="open2">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
    import axios from 'axios'
    export default {
      created () {
        this.getListData()
      },
      data () {
        return {
          formInline: {
            user: '',
            organiz: '',
            region: '',
            place: '',
            staff: ''
          },
          tableData: [],
          currentPage: 1,
          pageSize: 10,
          pageNum: 0,
          totalCount: 0,
          loading: true
        }
      },
      methods: {
        onSubmit () {
          console.log('submit')
        },
        handleCurrentChange (val) {
          this.currentPage = val
          this.getListData()
        },
        addStore () {
          this.$router.push({
            path: '/storeListAdd'
          })
        },
        getListData () {
          var that = this
          that.loading = true
          axios.get('static/storelist.json', {
            params: {
              pageSize: this.pageSize,
              pageNum: this.currentPage
            }
          }).then(function (respose) {
            let data = respose.data
            setTimeout(function () {
              that.tableData = data.data
              that.loading = false
              that.totalCount = data.totalCount
            }, 1000)
          }, function (error) {
            console.log(error)
          })
        },
        open2 () {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    }
</script>
<style lang="less">
</style>
