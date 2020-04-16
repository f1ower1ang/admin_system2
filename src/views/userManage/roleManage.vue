<template>
  <div class="role-manage-page app-container">
    <section-title title="角色管理" />
    <div class="role-manage-page__header">
      <el-form :model="formData" :inline="true" class="common-form" labei-width="75px">
        <el-row>
          <el-form-item label="角色名称:">
            <el-input v-model="formData.name" size="small" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述:">
            <el-input v-model="formData.description" size="small" placeholder="请输入角色描述" />
          </el-form-item>
          <el-form-item label="英文名称:">
            <el-input v-model="formData.enName" size="small" placeholder="请输入英文名称" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="role-manage-page__content">
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
          <el-table-column
            v-for="(label, index) in headers"
            :key="index"
            :label="label"
            :prop="keys[index]"
            align="center"
            :show-overflow-tooltip="true"
          />
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
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="225px" width="40%" class="common-dialog" @close="cancel('roleForm')">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ dialogTitle }}</p>
        <el-button
          icon="el-icon-full-screen"
          type="text"
          style="margin-right: 30px"
          @click="fullscreen = !fullscreen"
        />
      </div>
      <el-form ref="roleForm" :model="roleForm" label-width="90px" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" size="small" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" size="small" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="英文名称" prop="enName">
          <el-input v-model="roleForm.enName" size="small" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="角色权限" style="vertical-align: top">
          <el-tree
            ref="tree"
            :data="roleForm.menus"
            show-checkbox
            node-key="id"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="addOrEditRole">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRole,
  deleteRole,
  deleteRoles,
  editRole,
  getMenu,
  getPermissionList,
  getRoleList
} from '../../api/userManage'
import CommonMixin from '../common-mixin'

export default {
  name: 'RoleManage',
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        name: '',
        description: '',
        enName: ''
      },
      headers: ['ID', '角色名称', '角色描述', '英文名称'],
      keys: ['id', 'name', 'description', 'enName'],
      roleForm: {
        name: '',
        description: '',
        enName: '',
        menus: []
      },
      rules: {
        name: { required: true, message: '请输入角色名称', trigger: 'blur' },
        enName: { required: true, message: '请输入英文名称', trigger: 'blur' }
      },
      dialogTitle: '添加角色信息',
      checkedList: [],
      trees: null,
      delItem: deleteRole,
      delItems: deleteRoles,
      getItems: getRoleList
    }
  },
  async created() {
    this.loading = true
    const res = await getMenu({ pid: 0 })
    let data = JSON.stringify(res.data)
    data = data.replace(/\"title\"/g, '"label"')
    this.trees = JSON.parse(data)
    this.roleForm.menus = this.trees
    await this.getTableData()
  },
  methods: {
    async showDialog(role = null, index = -1) {
      this.editIndex = index
      this.dialogTitle = index === -1 ? '添加角色信息' : '编辑角色信息'
      this.checkedList.splice(0)
      if (this.editIndex !== -1) {
        Object.assign(this.roleForm, this.tableData[index])
        const { data } = await getMenu({ pid: 0, roleId: this.tableData[index].id })
        const dfs = (item) => {
          if (item.checked) {
            this.checkedList.push(item.id)
          }
          if (item.children.length > 0) {
            item.children.forEach((child) => {
              dfs(child)
            })
          }
        }
        data.forEach((item) => {
          dfs(item)
        })
      }
      this.roleForm.menus = this.trees
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checkedList)
      })
    },
    getCheckedTree(checkedList) {
      const ret = JSON.parse(JSON.stringify(this.trees))
      const dfs = (item) => {
        if (checkedList.length > 0) {
          const index = checkedList.indexOf(item.id)
          if (index > -1) {
            item.checked = true
          }
          if (item.children.length === 0) return
          item.children.forEach((child) => {
            dfs(child)
          })
        }
      }
      ret.forEach((item) => {
        dfs(item)
      })
      return ret
    },
    addOrEditRole() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          let menus = JSON.stringify(this.getCheckedTree(this.$refs.tree.getCheckedKeys()))
          menus = menus.replace(/\"label\"/g, '"title"')
          this.roleForm.menus = JSON.parse(menus)
          if (this.editIndex === -1) {
            addRole(this.roleForm).then((res) => {
              this.tableData.unshift(res.data)
              if (this.tableData.length > this.limit) {
                this.tableData.pop()
              }
              this.total += 1
              this.$message.success('添加成功')
            })
          } else {
            editRole(this.roleForm).then((res) => {
              Object.assign(this.tableData[this.editIndex], res.data)
              this.$message.success('修改成功')
            })
          }
          this.cancel('roleForm')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .role-manage-page {
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
