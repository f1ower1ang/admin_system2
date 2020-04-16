<template>
  <div class="group-manage-page app-container">
    <section-title title="组织管理" />
    <div class="group-manage-page__header">
      <el-form :model="formData" :inline="true" class="common-form" label-width="75px">
        <el-row>
          <el-form-item label="组织名称:">
            <el-input v-model="formData.name" size="small" placeholder="请输入组织名称" />
          </el-form-item>
          <el-form-item label="组织别名:">
            <el-input v-model="formData.synonym" size="small" placeholder="请输入组织别名" />
          </el-form-item>
          <el-form-item label="发起国家:">
            <el-input v-model="formData.initiator" size="small" placeholder="请输入发起国家" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="group-manage-page__content">
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
        <el-button size="small" type="primary" @click="showDialog('添加组织信息', '修改组织信息', 'groupForm')">添加</el-button>
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
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" plain size="mini" @click="showDialog('添加组织信息', '修改组织信息', 'groupForm', row, $index)">编辑</el-button>
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
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="50px" class="common-dialog" @close="cancel('groupForm')">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ dialogTitle }}</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px;" @click="fullscreen = !fullscreen" />
      </div>
      <el-form ref="groupForm" :model="groupForm" label-width="90px" :rules="rules">
        <el-form-item label="APT名称" prop="name">
          <el-input v-model="groupForm.name" placeholder="请输入APT名称" />
        </el-form-item>
        <el-form-item label="APT别名" prop="synonym">
          <el-input v-model="groupForm.synonym" placeholder="请输入APT别名" />
        </el-form-item>
        <el-form-item label="APT标志">
          <el-input v-model="groupForm.logo" placeholder="图片地址" style="width: calc(100% - 225px)" />
          <el-upload
            action="#"
            style="display: inline-block"
            :show-file-list="false"
            :before-upload="getImg"
          >
            <el-button icon="el-icon-upload">上传图片</el-button>
          </el-upload>
          <el-button style="position: relative" @click="checkPic">
            查看图片
          </el-button>
        </el-form-item>
        <el-form-item label="发起者" prop="initiator">
          <el-input v-model="groupForm.initiator" placeholder="请输入发起者" />
        </el-form-item>
        <el-form-item label="支持者" prop="sponsor">
          <el-input v-model="groupForm.sponsor" placeholder="请输入支持者" />
        </el-form-item>
        <el-form-item label="目标" prop="target">
          <el-input v-model="groupForm.target" placeholder="请输入目标" />
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="groupForm.industry" placeholder="请输入行业" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-checkbox-group v-model="groupForm.type">
            <el-checkbox label="勒索诈骗" />
            <el-checkbox label="拒绝服务" />
            <el-checkbox label="蓄意破坏" />
            <el-checkbox label="间谍情报" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="活跃日期" prop="date">
          <el-date-picker
            v-model="groupForm.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="态势页展示">
          <el-switch
            v-model="groupForm.isInIndex"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="概况" prop="summary">
          <el-input v-model="groupForm.summary" style="width: 100%" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="addOrEditItem">确 定</el-button>
        <el-button size="small" @click="cancel('groupForm')">取 消</el-button>
      </div>
    </el-dialog>
    <transition name="el-fade-in-linear">
      <div v-show="showPic" class="fullscreen-image">
        <i class="el-icon-circle-close icon" @click="showPic = false" />
        <img :src="groupForm.logo">
      </div>
    </transition>
  </div>
</template>

<script>
import { getAptList, editAPT, addAPT, delAPT, delAPTs, uploadImg } from '../../api/ruleManage'
import CommonMixin from '../common-mixin'

export default {
  name: 'GroupManage',
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        name: '',
        synonym: '',
        initiator: ''
      },
      headers: ['ID', '组织名称', '组织别名', '发起国家'],
      keys: ['id', 'name', 'synonym', 'initiator'],
      groupForm: {
        name: '',
        synonym: '',
        logo: '',
        initiator: '',
        sponsor: '',
        target: '',
        industry: '',
        type: [],
        date: '',
        isInIndex: false,
        summary: ''
      },
      rules: {
        name: { required: true, trigger: 'blur', message: '请输入APT名称' },
        synonym: { required: true, trigger: 'blur', message: '请输入APT别名' },
        initiator: { required: true, trigger: 'blur', message: '请输入发起者' },
        sponsor: { required: true, trigger: 'blur', message: '请输入支持者' },
        target: { required: true, trigger: 'blur', message: '请输入目标' },
        industry: { required: true, trigger: 'blur', message: '请输入行业' },
        type: { required: true, trigger: 'change', message: '请选择类型' },
        date: { required: true, trigger: 'change', message: '请选择活跃日期' },
        summary: { required: true, trigger: 'blur', message: '请输入概况' }
      },
      editItem: editAPT,
      delItem: delAPT,
      delItems: delAPTs,
      addItem: addAPT,
      getItems: getAptList,
      dialogTitle: '添加组织信息',
      showPic: false
    }
  },
  created() {
    this.getTableData(getAptList)
  },
  methods: {
    addOrEditItem() {
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          if (this.groupForm.type.length === 0) {
            this.groupForm.type = ''
          } else {
            this.groupForm.type = this.groupForm.type.join(';')
          }
          if (this.editIndex === -1) {
            addAPT(this.groupForm).then((res) => {
              this.tableData.unshift(res.data)
              if (this.tableData.length > this.limit) {
                this.tableData.pop()
              }
              this.total += 1
              this.$message.success('添加成功')
            })
          } else {
            editAPT(this.groupForm).then((res) => {
              Object.assign(this.tableData[this.editIndex], res.data)
              this.$message.success('修改成功')
            })
          }
          this.cancel('groupForm')
        }
      })
    },
    showDialog(addTitle, editTitle, itemKey = '', item = null, index = -1) {
      this.editIndex = index
      if (item) {
        Object.assign(this[itemKey], item)
        this[itemKey].type = item.type.split(';')
      }
      this.dialogTitle = index === -1 ? addTitle : editTitle
      this.dialogTableVisible = true
    },
    getImg(file) {
      const allowed = ['image/jpg', 'image/gif', 'image/png', 'image/jpeg']
      const limit = 2 * 1024 * 1024
      if (allowed.indexOf(file.type) === -1) {
        this.$message.error('只能上传jpg, gif, png图片')
      } else {
        if (file.size > limit) {
          this.$message.error('图片大小不能超过2M')
        } else {
          const form = new FormData()
          form.append('file', file)
          uploadImg(form).then((res) => {
            this.groupForm.logo = res.data
          })
        }
      }
      return false
    },
    checkPic() {
      if (this.groupForm.logo !== '') {
        this.showPic = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.group-manage-page {
  &__content {
    .option {
      margin-bottom: 10px;
    }
  }
  .el-dialog {
    .el-form {
      .el-form-item {
        display: inline-block;
        width: 45%;
        &:nth-child(3), &:nth-child(8), &:last-child {
          width: 90%;
        }
      }
    }
  }
  .fullscreen-image {
    position: fixed;
    z-index: 9999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    .icon {
      position: absolute;
      right: 40px;
      top: 40px;
      font-size: 40px;
      color: $color-pl;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        color: $color-theme;
      }
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
