<template>
  <div class="header-bar">
    <div class="logo">
      <span>后台管理系统</span>
      <span class="expand-label" @click="toggleNav">...</span>
    </div>
    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <div class="user-img">
          <img src="./3.jpg">
          <span class="username">{{ userInfo.userName }}</span>
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changeStore" v-if="currStore !== ''">切换门店</el-dropdown-item>
          <el-dropdown-item command="updatePass">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="选择门店" :visible.sync="dialogFormVisible">
      <el-form label-width="100px">
        <el-form-item label="当前门店：">
          {{ currStore.v }}
        </el-form-item>
        <el-form-item label="选择门店：">
          <el-select v-model="store">
            <el-option v-for="(s, i) in userInfo.stores"
                       :label="s.v"
                       :value="s.k"
                       :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    export default {
      created () {
      },
      data () {
        return {
          dialogFormVisible: false,
          store: '',
          expand: true
        }
      },
      methods: {
        toggleNav () {
          let rightDom = document.getElementById('right-content')
          if (this.expand) {
            rightDom.style.left = '40px'
          } else {
            rightDom.style.left = '230px'
          }
          this.expand = !this.expand
        },
        handleCommand (command) {
          if (command === 'loginout') {
            sessionStorage.clear()
            this.$router.push({
              path: '/login'
            })
          } else if (command === 'changeStore') {
            this.dialogFormVisible = true
          } else if (command === 'updatePass') {
            // 修改密码
            this.$router.push({
              path: '/updatePass'
            })
          }
        },
        confirm () {
          if (this.currStore.k === this.store) {
            this.dialogFormVisible = false
          } else {
            var storeArr = JSON.parse(sessionStorage.getItem('userInfo')).stores
            for (var i = 0; i < storeArr.length; i++) {
              if (storeArr[i].k === this.store) {
                sessionStorage.setItem('store', JSON.stringify(storeArr[i]))
              }
            }
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '门店切换成功',
              duration: 500,
              onClose: function () {
                window.location.reload()
              }
            })
          }
        }
      },
      computed: {
        userInfo () {
          return JSON.parse(sessionStorage.getItem('userInfo'))
        },
        currStore () {
          if (JSON.parse(sessionStorage.getItem('store'))) {
            return JSON.parse(sessionStorage.getItem('store'))
          } else {
            return ''
          }
        }
      }
    }
</script>
<style lang="less" scoped>
  .logo{
    width: 230px;
    float: left;
    font-size: 22px;
  }
  .user-info{
    float: right;
    height: 60px;
    line-height: 60px;
    margin-right: 30px;
  }
  .user-img{
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 60px;
    img{
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .username{
      padding: 0 5px;
    }
  }
  .el-dialog__wrapper{
    text-align: left;
  }
  .expand-label{
    display: inline-block;
    color: #fff;
    cursor: pointer;
  }
</style>
