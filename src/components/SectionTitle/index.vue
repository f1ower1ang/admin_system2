<template>
  <div class="section-title">
    <div class="left">
      {{ title }}
    </div>
    <div v-if="more" class="right" @click="select">
      查看更多
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    more: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    select() {
      this.$emit('go-to')
    }
  }
}
</script>

<style scoped lang="scss">
  .section-title {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      font-size: $font-size-medium-x;
      &:before {
        content: '';
        display: inline-block;
        height: 16px;
        vertical-align: bottom;
        width: 4px;
        margin-right: 10px;
        background-color: $color-theme;
      }
    }
    .right {
      color: $color-theme;
      cursor: pointer;
      font-size: $font-size-medium-s;
    }
  }
</style>
