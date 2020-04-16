<template>
  <div class="user-manage-page app-container">
    <section-title title="账户管理" />
    <div class="user-manage-page__header">
      <el-form :model="formData" :inline="true" class="common-form" label-width="75px" label-position="left">
        <el-row>
          <el-form-item label="用户名:">
            <el-input v-model="formData.userName" size="small" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="真实姓名:">
            <el-input v-model="formData.realName" size="small" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="用户电话:">
            <el-input v-model="formData.telephone" size="small" placeholder="请输入用户电话" />
          </el-form-item>
          <el-form-item label="用户状态:">
            <el-select v-model="formData.state" size="small" placeholder="请选择状态" filterable>
              <el-option label="全部" value="" />
              <el-option label="正常" value="1" />
              <el-option label="锁定" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="user-manage-page__content">
      <div class="option">
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          hide-icon
          icon="el-icon-info"
          icon-color="red"
          title="确定删除吗？"
          placement="top"
          @onConfirm="deleteMoreItem"
        >
          <el-button slot="reference" size="small" type="danger">删除</el-button>
        </el-popconfirm>
        <el-button size="small" type="primary" @click="showDialog(null)">添加</el-button>
      </div>
      <pagination
        :size="limit"
        :total="total"
        :page="page"
        @select-page="changePage"
        @select-size="changeSize"
      >
        <el-table v-loading="loading" :data="tableData" class="common-table" stripe @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" show-overflow-tooltip :width="widths[index]" />
          <el-table-column label="用户状态" align="center" width="100">
            <template slot-scope="{ row }">
              {{ dic.state[row.state] }}
            </template>
          </el-table-column>
          <el-table-column label="用户角色" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              {{ dic.roleId[row.roleId] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" plain size="mini" @click="showDialog(row, $index)">编辑</el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                hide-icon
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                placement="top"
                @onConfirm="deleteOneItem(row, $index)"
              >
                <el-button slot="reference" size="mini" type="danger" plain>删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="150px" width="40%" class="common-dialog" @close="cancel('accountForm')">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ dialogTitle }}</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px;" @click="fullscreen = !fullscreen" />
      </div>
      <el-form ref="accountForm" :model="accountForm" label-width="90px" :rules="rules">
        <el-form-item label="用户账号" prop="userName">
          <el-input v-model="accountForm.userName" size="small" type="text" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="accountForm.realName" size="small" type="text" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="accountForm.password" size="small" type="password" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPwd">
          <el-input v-model="accountForm.confirmPwd" size="small" type="password" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="用户电话" prop="telephone">
          <el-input v-model="accountForm.telephone" size="small" placeholder="请输入用户电话" />
        </el-form-item>
        <el-form-item label="用户邮件" prop="email">
          <el-input v-model="accountForm.email" size="small" placeholder="请输入用户邮件" />
        </el-form-item>
        <el-form-item label="添加时间">
          <el-input v-model="accountForm.addTime" size="small" disabled placeholder="请输入添加时间" />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-radio-group v-model="accountForm.state">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select v-model="accountForm.roleId" size="small" placeholder="请选择用户角色">
            <template v-if="dic.roleId">
              <el-option v-for="roleId in Object.keys(dic.roleId)" :key="roleId" :value="roleId" :label="dic.roleId[roleId]" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="addOrEditItem('accountForm', 'accountForm')">确 定</el-button>
        <el-button size="small" @click="cancel('accountForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, deleteUser, deleteUsers, editUser, getRoleList, getUserList } from '../../api/userManage'
import { validPhone } from '../../utils/validate'
import CommonMixin from '../common-mixin'

export default {
  name: 'Index',
  mixins: [CommonMixin],
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '' && this.editIndex === -1) {
        callback(new Error('请输入密码'))
      } else {
        if (this.accountForm.confirmPwd !== '') {
          this.$refs.accountForm.validateField('confirmPwd')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '' && this.editIndex === -1) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.accountForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!validPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        userName: '',
        realName: '',
        telephone: '',
        state: ''
      },
      headers: ['ID', '用户名', '真实姓名', '用户电话', '用户邮箱', '添加时间'],
      keys: ['id', 'userName', 'realName', 'telephone', 'email', 'addTime'],
      widths: ['70', '', '90', '', '', '', '90', '100'],
      accountForm: {
        userName: '',
        realName: '',
        password: '',
        confirmPwd: '',
        telephone: '',
        email: '',
        addTime: '',
        state: '1',
        roleId: ''
      },
      rules: {
        password: { required: true, validator: validatePass, trigger: 'blur' },
        confirmPwd: { required: true, validator: validatePass2, trigger: 'blur' },
        userName: { required: true, message: '请输入用户账号', trigger: 'blur' },
        realName: { required: true, message: '请输入真实姓名', trigger: 'blur' },
        telephone: { required: true, validator: validatePhone, trigger: 'blur' },
        roleId: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        ]
      },
      dialogTitle: '添加用户信息',
      editItem: editUser,
      delItem: deleteUser,
      delItems: deleteUsers,
      addItem: addUser,
      getItems: getUserList
    }
  },
  async created() {
    this.loading = true
    const res = await getRoleList({ page: 1, limit: 9999 })
    this.dic.roleId = {}
    res.data.forEach((item) => {
      this.dic.roleId[item.id] = item.name
    })
    this.getTableData(getUserList)
  },
  methods: {
    showDialog(user = null, index = -1) {
      this.editIndex = index
      if (user) {
        Object.assign(this.accountForm, user)
        this.accountForm.state = this.accountForm.state.toString()
        this.accountForm.roleId = this.accountForm.roleId.toString()
        this.accountForm.password = ''
        this.accountForm.confirmPwd = ''
      }
      this.dialogTitle = index === -1 ? '添加用户信息' : '编辑用户信息'
      this.accountForm.addTime = this.getDate()
      this.dialogTableVisible = true
    },
    getDate() {
      return new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g, '-')
    }
  }
}
</script>

<style scoped lang="scss">
.user-manage-page {
  &__content {
    .option {
      margin-bottom: 10px
    }
  }
  .el-dialog {
    .el-form {
      .el-form-item {
        display: inline-block;
        width: 45%;
      }
    }
  }
}
</style>
