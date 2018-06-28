<template>
    <div class="store-add">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-date"></i>门店管理</el-breadcrumb-item>
                <el-breadcrumb-item>添加门店</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="store-cont bg-purple">
          <div class="store-left">

          </div>
          <div class="store-tree">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
        </div>

    </div>
</template>
<script>
export default {
  data () {
    return {
      data: [{
        label: '1级1',
        children: [{
          label: '1级1-1',
          children: [{
            label: '1级1-1-1'
          },
          {
            label: '1级1-1-2'
          }]
        }]
      },
      {
        label: '1级2',
        children: [{
          label: '1级2-1',
          children: [{
            label: '1级2-1-1'
          },
          {
            label: '1级2-1-2'
          }]
        }]
      }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    }
  }
}
</script>
<style lang="less">
</style>
