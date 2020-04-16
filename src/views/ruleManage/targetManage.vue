<template>
  <div class="target-manage-page app-container">
    <section-title title="受害目标管理" />
    <div class="target-manage-page__header">
      <el-form :model="formData" :inline="true">
        <el-form-item label="收件邮箱">
          <el-input v-model="formData.toAdd" size="small" placeholder="请输入收件邮箱" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="formData.province" size="small" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="formData.organization" size="small" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-select v-model="formData.aptName" size="small" placeholder="请选择所属组织" filterable>
            <el-option label="全部" value="" />
            <template v-if="dic.APT">
              <el-option v-for="(aptName, index) in dic.APT" :key="index" :label="aptName" :value="aptName" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="small" @click="search" />
        </el-form-item>
      </el-form>
    </div>
    <div class="target-manage-page__content">
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
        <el-button size="small" type="primary" @click="showDialog('添加受害者目标', '修改受害者目标')">添加</el-button>
        <el-button size="small" type="success"><router-link to="/victimUploadMany">批量导入</router-link></el-button>
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
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" plain size="mini" @click="showDialog('添加受害者目标', '修改受害者目标', 'targetForm', row, $index)">编辑</el-button>
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
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="180px" :rules="rules" width="40%" class="common-dialog" @close="cancel('targetForm')">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ dialogTitle }}</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="fullscreen = !fullscreen" />
      </div>
      <el-form ref="targetForm" :model="targetForm" label-width="90px" :rules="rules">
        <el-form-item label="收件邮箱" prop="toAdd">
          <el-input v-model="targetForm.toAdd" size="small" placeholder="请输入收件邮箱" style="width: 70%" />
        </el-form-item>
        <el-form-item label="单位" prop="organization">
          <el-input v-model="targetForm.organization" size="small" placeholder="请输入单位" style="width: 70%" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="targetForm.province" size="small" placeholder="请输入省份" style="width: 70%" />
        </el-form-item>
        <el-form-item label="所属组织" prop="aptName">
          <el-select v-model="targetForm.aptName" size="small" placeholder="请选择所属组织" filterable style="width: 70%">
            <template v-if="dic.APT">
              <el-option v-for="(aptName, index) in dic.APT" :key="index" :label="aptName" :value="aptName" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="addOrEditItem('targetForm', 'targetForm')">确 定</el-button>
        <el-button size="small" @click="cancel('targetForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delTarget, delTargets, getTargetList, addTarget, editTarget, getAptList } from '../../api/ruleManage'
import CommonMixin from '../common-mixin'

export default {
  name: 'TargetManage',
  mixins: [CommonMixin],
  data() {
    return {
      formData: {
        toAdd: '',
        province: '',
        organization: '',
        aptName: ''
      },
      tableData: null,
      headers: ['ID', '组织名称', '收件邮箱', '单位', '省份'],
      keys: ['id', 'aptName', 'toAdd', 'organization', 'province'],
      dialogTitle: '添加受害者目标',
      targetForm: {
        toAdd: '',
        organization: '',
        province: '',
        aptName: ''
      },
      rules: {
        toAdd: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        ],
        organization: { required: true, message: '请输入单位', trigger: 'blur' },
        province: { required: true, message: '请输入省份', trigger: 'blur' },
        aptName: { required: true, message: '请输入组织名称', trigger: 'change' }
      },
      editItem: editTarget,
      delItem: delTarget,
      delItems: delTargets,
      addItem: addTarget,
      getItems: getTargetList
    }
  },
  async created() {
    this.loading = true
    const res = await getAptList({ limit: 9999, page: 1 })
    this.dic.APT = []
    res.data.forEach((res) => {
      this.dic.APT.push(res.name)
    })
    this.getTableData()
  }
}
</script>

<style scoped lang="scss">
.target-manage-page {
  &__content {
    .option {
      margin-bottom: 10px;
    }
  }
}
</style>
