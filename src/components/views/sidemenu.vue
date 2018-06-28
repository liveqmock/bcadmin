<template>
  <div class="side-menu">
    <el-menu class="el-menu-vertical-demo" unique-opened>
      <template v-for="(item, index) in menus">
        <template v-if="item.privilegeVOs">
          <el-submenu :index="item.id + ''">
            <template slot="title">
              <i :class="item.icon"></i>
              {{ item.label }}
            </template>
            <el-menu-item v-for="(subItem, i) in item.privilegeVOs" :key="i" :index="subItem.id + ''">
              <router-link :to="subItem.path">{{ subItem.label }}</router-link>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <i :class="item.icon"></i>
            <router-link :to="item.index">{{ item.title }}</router-link>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
  import '@/common/css/font.css'
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  import ArrayUtils from '@/common/js/ArrayUtils'
  export default {
    created () {
      this.getMenus()
      // this.getAllPath()
    },
    data () {
      return {
        menus: [],
        arrUtils: new ArrayUtils('userPath')
      }
    },
    methods: {
      getMenus () {
        // 获取用户菜单
        var that = this
        let url = URL.api_name + 'backofficeapi/resource/role/menu.do'
        console.log(url)
        axios.get(url, {
          params: {
            roleId: JSON.parse(sessionStorage.getItem('userInfo')).roleId
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.menus = res.data.data
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .side-menu{
    .el-menu{
      border-radius: 2px;
      list-style: none;
      position: relative;
      margin: 0;
      padding-left: 0;
      background-color: rgb(238, 246, 246);
    }
  }
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active {
    color: #00d1b2;
  }
  .el-submenu .el-menu {
    background-color: rgb(228, 240, 241);
  }
  a{
    display: inline-block;
    width: 100%;
    text-decoration: none;
    color: #48576a;
    box-sizing: border-box;
    padding-left: 10px;
  }
  .router-link-active{
    color: #00d1b2;
  }
  i{
    font-size: 18px;
    display: inline-block;
    vertical-align: bottom;
  }
</style>
