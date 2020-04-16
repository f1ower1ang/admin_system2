<template>
  <div class="navbar">
    <ul class="right-menu">
      <li class="item">
        <span>{{ name }}</span>
      </li>
      <li class="item" @click="showDialog">
        <i class="el-icon-lock" />
        <span>修改密码</span>
      </li>
      <li class="item" @click="logout">
        <i class="el-icon-switch-button" />
        <span>安全退出</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'name',
      'dialogVisible'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    showDialog() {
      this.$store.dispatch('settings/showDialog', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 55px;
  overflow: hidden;
  position: fixed;
  top: 0;
  background-image: url("../../assets/slices/header@2x.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100%;
  z-index: 2000;
  border-bottom: 5px solid $bg-page-dark;
  padding: 0 20px;

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .item {
      float: left;
      color: $color-weak;
      cursor: pointer;
      margin-left: 5px;
      &:hover {
        color: $color-theme;
      }
      &+.item {
        &:before {
          content: '';
          display: inline-block;
          width: 1px;
          height: 10px;
          margin-right: 5px;
          background-color: $color-weak;
        }
      }
    }
  }
}
</style>
