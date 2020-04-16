<template>
  <div class="app-sidebar">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="title" :class="{'is-active': !sidebar.opened}">
        <p>导航菜单</p>
        <i class="el-icon-d-arrow-left el-icon" @click="toggleSideBar" />
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style scoped lang="scss">
  .app-sidebar {
    padding: 0 2px;
    box-sizing: border-box;
    .el-scrollbar {
      height: calc(100% - 65px) !important;
      border-radius: 4px;
      border: 1px solid $color-theme;
      overflow: hidden;
    }
    .title {
      height: 40px;
      font-size: $font-size-medium-x;
      color: #15a4ce;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      .el-icon {
        color: #567fc1;
        cursor: pointer;
        transition: all .3s;
      }
      &.is-active {
        display: block;
        text-align: center;
        line-height: 40px;
        p {
          display: none;
        }
        .el-icon {
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
