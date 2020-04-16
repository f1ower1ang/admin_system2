<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">{{ title }}</h3>
    </div>
    <div class="loginDiv">
      <div class="loginTitle">
        <h3 class="loginText">用户登录</h3>
      </div>
      <el-form ref="loginForm" size="mini" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <el-form-item prop="userName">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.userName"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-checkbox v-model="checked" class="checked"><span>记住密码</span></el-checkbox>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { title } from '@/settings.js'
const ENV = process.env.NODE_ENV

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      title: title,
      checked: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    if (ENV === 'development') {
      Object.assign(this.loginForm, {
        userName: 'admin',
        password: 'abcd'
      })
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.$message.error('用户名或密码有误')
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 12%;
    width: 83%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 12%;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  height: 100%;
  width: 100%;
  background: url("logoBackground.png") no-repeat left top;
  background-size: cover;
  overflow: hidden;
  .loginDiv{
    width: 25%;
    height: 50%;
    position: absolute;
    background: url("login.png");
    background-size: cover;
    top: 30%;
    right: 10%;
    .loginTitle{
      position: relative;
      .loginText {
        font-size: 20px;
        letter-spacing: 5px;
        padding: 35px 35px 0;
        color: $light_gray;
        text-align: center;
        /*font-weight: bold;*/
      }
    }
    .login-form {
      position: relative;
     /* width: 90%;*/
      max-width: 100%;
      padding: 20px 35px 0;
      overflow: hidden;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 8px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      letter-spacing: 3px;
      color: $light_gray;
      margin: 50px 50px;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .checked{
    margin-bottom: 20px;
    span{
      font-size: 12px;
      color: $light_gray;
    }
  }
}
</style>
