<template>
  <div class="wscn-http401-container">
    <div class="wrapper">
      <img :src="require('../assets/slices/401.png')" alt="">
      <p>没有权限</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wscn-http401-container {
    width: 100%;
    height: calc(100vh - 55px);
    background: $bg-page;
    .wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      p {
        text-align: center;
        margin-top: 15px;
      }
    }
  }
</style>
