<template>
  <div id="app">
    <div class="wrapper">
      <div class="header-wrapper" v-if="$route.path !== '/login' && $route.path !== '/'">
        <HeaderMenu></HeaderMenu>
      </div>
      <div class="side-wrapper" v-if="$route.path !== '/login' && $route.path !== '/'">
        <SideMenu></SideMenu>
      </div>
      <div class="content-wrapper" id="right-content">
        <transition name="fade">
          <transition name="fade" mode="out-in"><router-view></router-view></transition>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderMenu from '@/components/views/header'
  import SideMenu from '@/components/views/sidemenu'
  export default {
    name: 'app',
    components: {
      HeaderMenu: HeaderMenu,
      SideMenu: SideMenu
    }
  }
</script>

<style lang="less">
  #app, body, html, .wrapper{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  #app{
    position: absolute;
    top: 0;
  }
  body{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  ::-webkit-scrollbar
  {
    width: 5px;
    height: 5px;
    background-color: #fff;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
    border-radius: 10px;
    background-color: #fff;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #F2F6FC;
  }
  .header-wrapper{
    line-height: 60px;
    height: 60px;
    text-align: center;
    background-color: #00d1b2;
    color: #fff;
  }
  .side-wrapper{
    display: block;
    position: absolute;
    width: 230px;
    left: 0;
    top: 60px;
    bottom: 0;
    background: #eef6f6;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .content-wrapper{
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 230px;
    right: 0;
    top: 60px;
    bottom: 0;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: scroll;
    transition: all cubic-bezier(0.68, -0.55, 0.27, 1.55) 1s;
  }
  .tc{
    text-align: center;
  }
  .fade-enter-active, .fade-leave-active{
    transition: opacity .3s
  }
  .fade-enter, .fade-leave-active{
    opacity: 0;
  }
  .form-data{
    padding-top: 15px;
    background-color: #F5F8FA;
    border: 1px solid #ebebeb;
  }
  .crumbs{
    padding-bottom: 10px;
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 15px;
  }
  .search-wrapper{
    padding: 10px 12px;
    margin-bottom: 15px;
    background-color: #F5F8FA;
    .el-form-item{
      margin-bottom: 10px;
    }
  }
  .page-pagination{
    padding-top: 20px;
    overflow: hidden;
  }
  .el-pagination{
    float: right;
  }
  .el-button+.el-button{
    margin-left: 0;
  }
  .el-table__row .el-table__expand-column .cell {
    overflow: hidden;
  }
  pre{
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }
  span, p{
    word-break: break-all;
  }
  .btn-link{
    display: inline-block;
    height: 36px;
    line-height: 36px;
    text-align: center;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    text-decoration: none;
    background-color: #13CE66;
    color: #fff;
  }
</style>
