<template>
  <div class="permission-manage-page app-container">
    <section-title title="资源管理" />
    <div class="permission-manage-page__header">
      <el-form :model="formData" :inline="true" label-width="75px" class="common-form">
        <el-row>
          <el-form-item label="资源名称:">
            <el-input v-model="formData.name" size="small" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="资源URL:">
            <el-input v-model="formData.url" size="small" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="资源类型:">
            <el-select v-model="formData.type" size="small" placeholder="请选择状态" filterable>
              <el-option label="全部" value="" />
              <el-option label="菜单" value="1" />
              <el-option label="按钮" value="2" />
              <el-option label="接口" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="permission-manage-page__content">
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
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="上级资源" align="center">
            <template slot-scope="{ row }">
              {{ dic.pid[row.pid] }}
            </template>
          </el-table-column>
          <el-table-column label="资源类型" align="center">
            <template slot-scope="{ row }">
              {{ dic.sourceType[row.type] }}
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
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="225px" width="40%" class="common-dialog" @close="cancel('permissionForm')">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ dialogTitle }}</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px;" @click="fullscreen = !fullscreen" />
      </div>
      <el-form ref="sourceForm" :model="permissionForm" label-width="90px" :rules="rules">
        <el-form-item label="上级资源" prop="pid">
          <el-select v-model="permissionForm.pid" size="small" placeholder="请选择上级资源">
            <template v-if="dic.pid">
              <el-option v-for="(pid) in Object.keys(dic.pid)" :key="pid" :value="pid" :label="dic.pid[pid]" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-select v-model="permissionForm.type" size="small" placeholder="请选择上级资源">
            <el-option label="菜单" value="1" />
            <el-option label="按钮" value="2" />
            <el-option label="接口" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="permissionForm.name" size="small" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源URL" prop="url">
          <el-input v-model="permissionForm.url" size="small" placeholder="请输入资源URL" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="addOrEditOneSource">确 定</el-button>
        <el-button size="small" @click="cancel('permissionForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addPermission,
  deletePermission,
  deletePermissions,
  editPermission,
  getPermissionList
} from '@/api/userManage'
import CommonMixin from '../common-mixin'

export default {
  name: 'PermissionManage',
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        name: '',
        type: '',
        url: ''
      },
      headers: ['ID', '资源名称', '资源URL'],
      keys: ['id', 'name', 'url'],
      permissionForm: {
        pid: 0,
        type: '',
        name: '',
        url: ''
      },
      rules: {
        pid: { required: true, message: '请选则上级资源', trigger: 'change' },
        type: { required: true, message: '请选择资源类型', trigger: 'change' },
        name: { required: true, message: '请输入资源名称', trigger: 'blur' },
        url: { required: true, message: '请输入资源URL', trigger: 'blur' }
      },
      dialogTitle: '添加资源信息',
      delItems: deletePermissions,
      delItem: deletePermission
    }
  },
  created() {
    this.initTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      setTimeout(() => {
        this.tableData = this.totalData.slice((this.page - 1) * this.limit, this.page * this.limit)
        this.loading = false
      }, 400)
    },
    async initTableData() {
      this.loading = true
      const data = {
        page: 1,
        limit: 9999
      }
      Object.assign(data, this.formData)
      this.dic.pid = {
        0: '根'
      }
      try {
        const res = await getPermissionList(data)
        res.data.forEach((source) => {
          this.dic.pid[source.id] = source.name
        })
        this.totalData = res.data
        this.total = res.count
        this.tableData = this.totalData.slice((this.page - 1) * this.limit, this.page * this.limit)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    search() {
      this.loading = true
      this.page = 1
      this.initTableData()
    },
    showDialog(source = null, index = -1) {
      this.editIndex = index
      if (source) {
        this.permissionForm = source
        this.permissionForm.pid = source.pid.toString()
        this.permissionForm.type = source.type.toString()
      }
      this.dialogTitle = index === -1 ? '添加资源信息' : '编辑资源信息'
      this.dialogTableVisible = true
    },
    addOrEditOneSource() {
      this.$refs.sourceForm.validate((valid) => {
        if (valid) {
          if (this.editIndex === -1) {
            addPermission(this.permissionForm).then((res) => {
              this.tableData.unshift(res.data)
              this.totalData.unshift(res.data)
              if (this.tableData.length > this.limit) {
                this.tableData.pop()
              }
              this.total += 1
              this.$message.success('添加成功')
            })
          } else {
            editPermission(this.permissionForm).then((res) => {
              Object.assign(this.tableData[this.editIndex], res.data)
              Object.assign(this.totalData[(this.page - 1) * this.limit + this.editIndex], res.data)
              this.$message.success('修改成功')
            })
          }
          this.cancel('permissionForm')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.permission-manage-page {
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
