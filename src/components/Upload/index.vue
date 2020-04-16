<template>
  <div class="app-upload">
    <el-button type="success" icon="el-icon-search" size="medium" @click="selectFile">{{ text }}</el-button>
    <input ref="input" type="file" multiple :directory="directory" :mozdirectory="directory" :webkitdirectory="directory" style="display: none" @change="handleFileChange">
  </div>
</template>

<script>
export default {
  props: {
    directory: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    text() {
      return !this.directory ? '选择表格' : '选择文件夹'
    }
  },
  methods: {
    handleFileChange(e) {
      const files = e.target.files
      if (!files) {
        return
      }
      this.$emit('file-change', files)
    },
    selectFile() {
      this.$refs.input.click()
    }
  }
}
</script>

<style scoped lang="scss">
  .app-upload {
    display: inline-block;
  }
</style>
