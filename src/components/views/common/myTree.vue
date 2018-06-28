<template>
  <div class="tree">
    <div class="item" v-for="item in data" :key="item.id">
      》<input type="checkbox" value="1" v-model="item.check"><span>{{ item.name }}</span>
      <div class="child-item" v-for="child in item.child" v-if="item.child.length > 0" :key="child.id">
        》<input type="checkbox"><span>{{ child.name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
      data () {
        return {
          data: [
            {
              id: 1,
              name: '系统管理',
              path: '',
              child: [
                {
                  id: 2,
                  name: '用户管理',
                  path: '/user',
                  child: [
                    {
                      id: 7,
                      name: '按钮A',
                      path: ''
                    }
                  ]
                },
                {
                  id: 3,
                  name: '菜单管理',
                  path: '/menu'
                }
              ]
            },
            {
              id: 4,
              name: '票种管理',
              child: [
                {
                  id: 5,
                  name: '制票',
                  path: '/produceTicket'
                },
                {
                  id: 6,
                  name: '单次票',
                  path: '/onceTicket'
                }
              ]
            }
          ]
        }
      }
    }
</script>
<style lang="less">
  .child-item{
    padding-left: 15px;
  }
</style>
