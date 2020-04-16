<template>
  <div :class="classObj" class="app-wrapper">
    <navbar />
    <div class="container">
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <app-main />
      </div>
    </div>
    <el-dialog
      width="400px"
      :visible.sync="dialogVisible"
      class="common-dialog"
      @close="cancel"
    >
      <div slot="title">
        <p>修改密码</p>
      </div>
      <el-form ref="ruleForm" :model="pwdForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="当前密码" prop="oldPwd">
          <el-input v-model="pwdForm.oldPwd" type="password" autocomplete="off" size="small" style="width: 95%" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdForm.password" type="password" autocomplete="off" size="small" style="width:95%" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd" style="margin-bottom: 0;">
          <el-input v-model="pwdForm.confirmPwd" type="password" autocomplete="off" size="small" style="width: 95%" />
        </el-form-item>
      </el-form>
      <p slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="changePwd">确 定</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { editUser } from '../api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.pwdForm.confirmPwd !== '') {
          this.$refs.ruleForm.validateField('confirmPwd')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前密码'))
      } else if (value !== sessionStorage.password) {
        callback(new Error('当前密码不正确'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        oldPwd: '',
        password: '',
        confirmPwd: ''
      },
      rules: {
        oldPwd: { required: true, validator: validateOld, trigger: 'blur' },
        password: { validator: validatePass, trigger: 'blur', required: true },
        confirmPwd: { validator: validatePass2, trigger: 'blur', required: true }
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    ...mapGetters([
      'name',
      'userInfo',
      'dialogVisible'
    ])
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    cancel() {
      this.$store.dispatch('settings/showDialog', false)
      this.pwdForm = this.$options.data().pwdForm
    },
    changePwd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.pwdForm.id = this.userInfo.id
          this.pwdForm.userName = this.name
          editUser(this.pwdForm).then((res) => {
            this.$store.dispatch('user/resetToken')
            this.$router.push('/login?redirect=' + this.$route.path)
          })
          this.cancel()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: auto;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
