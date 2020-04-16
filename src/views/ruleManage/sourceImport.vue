<template>
  <div class="source-import-page app-container">
    <section-title title="源数据导入" />
    <el-radio-group v-model="directory" size="medium">
      <el-radio-button :label="true">文件夹</el-radio-button>
      <el-radio-button :label="false">表格</el-radio-button>
    </el-radio-group>
    <div class="source-import-page__header">
      <p>选择邮件所在文件夹进行批量上传</p>
      <upload :directory="directory" @file-change="handleFileChange" />
      <el-button v-if="canImport" size="medium" type="primary" class="btn" @click="beforeImport">开始导入</el-button>
      <template v-else>
        <el-select v-model="aptName" size="medium" placeholder="请选择APT" style="width: 160px" filterable>
          <el-option label="全部" value="" />
          <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
        </el-select>
        <el-select v-model="selectedDomainIndex" multiple size="medium" placeholder="请选择恶意域名" filterable>
          <el-option label="全部" value="" />
          <el-option v-for="(item, index) in domainList" :key="index" :label="item.domain" :value="index" />
        </el-select>
        <el-button type="primary" size="medium" @click="saveDomain">保存</el-button>
      </template>
    </div>
    <div class="source-import-page__content">
      <pagination :total="fileTableData ? fileTableData.length : 0" :size="fileLimit" :page="filePage" @select-size="handleFileSize" @select-page="handleFilePage">
        <el-table :data="fileTableData ? fileTableData.slice((filePage - 1) * fileLimit, filePage * fileLimit) : null" class="common-table" stripe>
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" align="center" :show-overflow-tooltip="true" />
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
          <el-table-column align="center" width="150">
            <template slot="header">
              <el-select v-model="headerApt" size="mini" placeholder="选择APT" filterable>
                <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
              </el-select>
            </template>
            <template slot-scope="{ row }">
              <el-select v-model="row.apt" size="mini" placeholder="选择APT" filterable>
                <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <el-button v-if="!directory && row.status === STATUS.DONE" size="mini" type="primary" plain @click="showEmailList(row)">查看</el-button>
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
    <el-dialog :visible.sync="emailListDialogVisible" :fullscreen="emailFullscreen" top="70px" class="common-dialog" width="60%">
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
import Upload from '@/components/Upload/index.vue'
import UploadMixin from '../upload-mixin'
import { importSourceData, saveHarmDomain } from '../../api/ruleManage'
export default {
  name: 'SourceImport',
  components: { Upload },
  mixins: [UploadMixin],
  data() {
    return {
      radio: 0,
      headers: ['文件名', '大小'],
      keys: ['filename', 'size'],
      uploadFunc: importSourceData,
      STATUS: {
        WAITING: '等待导入',
        UPLOADING: '正在导入',
        ERROR: '导入失败',
        DONE: '导入完成'
      },
      domainList: [],
      canImport: true,
      selectedDomainIndex: [],
      aptName: '',
      emailListHeaders: ['发件邮箱', '发件IP', '收件邮箱', '邮件标题', '发件日期'],
      emailListKeys: ['fromAdd', 'fromIp', 'toAdd', 'subject', 'date']
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
    async beforeImport() {
      if (!this.fileTableData) return
      const index = this.fileTableData.findIndex(item => item.apt.length === 0)
      if (index > -1) {
        this.$message.warning('请为所有数据选择APT')
        return
      }
      await this.startUpload()
      this.canImport = false
    },
    handleResponse(data, index) {
      this.fileTableData[index].result = data.emailList
      if (this.domainList.length === 0) {
        this.domainList = data.domainList
      } else {
        data.domainList.forEach((item) => {
          const index = this.domainList.findIndex(cur => cur.domain === item.domain)
          if (index === -1) {
            this.domainList.push(item)
          }
        })
      }
    },
    saveDomain() {
      if (this.aptName.length === 0) {
        this.$message.warning('请先选择APT')
        return
      }
      if (this.selectedDomainIndex.length === 0) {
        this.$message.warning('请选择恶意域名')
        return
      }
      const list = []
      this.selectedDomainIndex.forEach(index => {
        this.domainList[index].aptName = this.aptName
        list.push(this.domainList[index])
      })
      saveHarmDomain(list).then(() => {
        this.$message.success('保存成功')
      }).catch(e => {
        this.$message.error(e)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.source-import-page{
  .el-radio-group {
    margin: 20px 0;
  }
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
