<template>
  <div class="victim-upload-page app-container">
    <section-title title="受害目标导入" />
    <div class="victim-upload-page__header">
      <p>选择包含受害目标信息的表格进行批量导入</p>
      <upload @file-change="handleFileChange" />
      <el-button size="medium" type="primary" class="btn" @click="beforeImport">开始导入</el-button>
    </div>
    <div class="victim-upload-page__content">
      <pagination :total="fileTableData ? fileTableData.length : 0" :size="fileLimit" :page="filePage">
        <el-table :data="fileTableData" class="common-table" stripe>
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" show-overflow-tooltip />
          <el-table-column label="进度" align="center">
            <template slot-scope="{ row }">
              <el-progress v-if="row.status === STATUS.ERROR" status="exception" :percentage="100" />
              <el-progress v-if="row.status === STATUS.DONE" status="success" :percentage="100" />
              <el-progress v-if="row.status === STATUS.WAITING || row.status === STATUS.UPLOADING" :percentage="row.percentage" />
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="120">
            <template slot-scope="{ row }">
              <span
                :class="{
                  'color-red': row.status === STATUS.ERROR,
                  'color-blue': row.status === STATUS.WAITING,
                  'color-green': row.status === STATUS.DONE,
                  'text-black': row.status === STATUS.UPLOADING
                }"
              >
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <el-select v-model="headerApt" size="mini" placeholder="选择APT">
                <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
              </el-select>
            </template>
            <template slot-scope="{ row }">
              <el-select v-model="row.apt" size="mini" placeholder="选择APT">
                <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="{ row, $index }">
              <el-button v-if="row.status === STATUS.DONE" size="mini" type="primary" plain @click="showEmailList(row)">查看</el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                hide-icon
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                placement="top"
                @onConfirm="deleteFile($index)"
              >
                <el-button slot="reference" size="mini" type="danger" plain :disabled="row.status === STATUS.UPLOADING">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="emailListDialogVisible" :fullscreen="emailFullscreen" top="70px" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ emailFileTitle }}</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="emailFullscreen = !emailFullscreen" />
      </div>
      <el-table :data="emailListData" border>
        <el-table-column v-for="(header, index) in emailListHeaders" :key="index" :label="header" :prop="emailListKeys[index]" align="center" show-overflow-tooltip />
      </el-table>
      <div slot="footer">
        <el-button type="primary" size="small" @click="emailListDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { victimUploadMany } from '../../api/ruleManage'
import UploadMixin from '../upload-mixin'
import Upload from '@/components/Upload/index.vue'
export default {
  name: 'VictimUploadMany',
  components: { Upload },
  mixins: [UploadMixin],
  data() {
    return {
      headers: ['文件名', '大小'],
      keys: ['filename', 'size'],
      uploadFunc: victimUploadMany,
      STATUS: {
        WAITING: '等待导入',
        UPLOADING: '正在导入',
        ERROR: '导入失败',
        DONE: '导入完成'
      },
      emailListHeaders: ['收件人', '省份', '单位'],
      emailListKeys: ['toAdd', 'province', 'organization'],
      directory: false
    }
  },
  watch: {
    files: {
      handler() {
        if (!this.files) return
        this.fileTableData = []
        let index = 0
        for (const file of this.files) {
          const obj = {
            filename: file.name,
            size: this.transformSize(file.size),
            percentage: 0,
            status: this.STATUS.WAITING,
            apt: '',
            file,
            index
          }
          this.fileTableData.push(obj)
          index++
        }
      },
      deep: true
    },
    headerApt: {
      handler(cur) {
        if (this.fileTableData) {
          for (let i = 0; i < this.fileTableData.length; i++) {
            this.fileTableData[i].apt = cur
          }
        }
      }
    }
  },
  methods: {
    beforeImport() {
      if (!this.fileTableData) return
      const index = this.fileTableData.findIndex(item => item.apt.length === 0)
      if (index > -1) {
        this.$message.warning('请为所有数据选择APT')
        return
      }
      this.startUpload()
    },
    handleResponse(data, index) {
      this.fileTableData[index].result = data
    }
  }
}
</script>

<style scoped lang="scss">
  .victim-upload-page {
    &__header {
      margin-top: 20px;
      p {
        padding-bottom: 20px;
      }
      .btn {
        margin-left: 5px;
      }
    }
    &__content {
      margin-top: 30px;
    }
  }
</style>
