<template>
  <div>
    <!-- 加载编辑器的容器 -->
    <script id="editor" name="content" type="text/plain">
    </script>
  </div>
</template>

<script>
  window.UEDITOR_HOME_URL = '@/components/views/common/ueditor/'
  export default {
    name: 'ueditor',
    data () {
      return {}
    }
  }
</script>
