<template>
  <div class="email-trace-page app-container">
    <section-title title="分析任务" />
    <el-radio-group v-model="directory" size="medium">
      <el-radio-button :label="true">文件夹</el-radio-button>
      <el-radio-button :label="false">表格</el-radio-button>
    </el-radio-group>
    <div class="email-trace-page__header">
      <p>选择邮件所在文件夹进行批量上传</p>
      <upload :directory="directory" @file-change="handleFileChange" />
      <el-button size="medium" type="primary" class="btn" @click="startUpload">开始分析</el-button>
      <el-button v-if="directory" size="medium" type="primary" plain class="btn" @click="addMoreSource">添加源数据</el-button>
    </div>
    <div class="email-trace-page__content">
      <pagination :total="fileTableData ? fileTableData.length : 0" :size="fileLimit" :sizes="sizes" :page="filePage">
        <el-table :data="fileTableData ? fileTableData.slice((filePage - 1) * fileLimit, filePage * fileLimit) : null" class="common-table" :cell-style="{fontSize: '12px'}" stripe @selection-change="handleSelection">
          <el-table-column
            type="selection"
            width="50"
            align="center"
            size="small"
          />
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" :width="widths[index]" align="center" :show-overflow-tooltip="true" />
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
          <el-table-column v-if="directory" label="分析结果" align="center" width="200">
            <template v-if="row.result && row.result.rules" slot-scope="{ row }">
              <p v-for="(item, index) in row.result.rules" :key="index" style="line-height: 35px">
                {{ dic.attr[item.attr] }}:{{ item.aptName }}
                <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(item)">查看</el-button>
              </p>
            </template>
          </el-table-column>
          <el-table-column v-if="directory" align="center">
            <template slot="header">
              <el-select v-model="headerApt" size="mini" placeholder="选择APT" filterable>
                <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
              </el-select>
            </template>
            <template slot-scope="{ row }">
              <el-select v-if="row.result && row.result.email" v-model="row.result.email.aptName" size="mini" placeholder="选择APT" filterable>
                <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="{ row, $index }">
              <el-button v-if="!directory && row.status === STATUS.DONE" size="mini" type="primary" plain @click="showEmailList(row)">查看</el-button>
              <el-popconfirm
                v-if="row.status === STATUS.WAITING || row.status === STATUS.ERROR"
                confirm-button-text="确定"
                cancel-button-text="取消"
                hide-icon
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                placement="top"
                @onConfirm="deleteFile($index)"
              >
                <el-button slot="reference" size="mini" type="danger" plain>删除</el-button>
              </el-popconfirm>
              <el-button v-if="directory && row.status === STATUS.DONE" type="success" size="mini" plain :disabled="row.status === STATUS.UPLOADING" @click="addSource(row.result)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
    </div>
    <el-dialog :visible.sync="emailDialogTableVisible" :fullscreen="emailFullscreen" top="55px" class="common-dialog" @close="closeDialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看邮件</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="emailFullscreen = !emailFullscreen" />
      </div>
      <el-table :data="curData" border :show-header="false">
        <el-table-column property="key" width="150" align="center" />
        <el-table-column>
          <template slot-scope="{ row }">
            <div v-if="row.flag">
              <p v-for="(item, index) in row.value" :key="index" style="line-height: 35px">
                <template v-if="item.attr">
                  {{ dic.attr[item.attr] }}:{{ item.aptName }}
                  <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(item)">查看</el-button>
                </template>
                <template v-else>
                  {{ item.name }}
                  <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="download(item)">下载</el-button>
                </template>
              </p>
            </div>
            <div v-else style="white-space: pre-wrap;" v-html="row.value" />
          </template>
        </el-table-column>
      </el-table>
      <p style="margin: 15px 0">分析记录</p>
      <div class="comment-wrapper">
        <ul v-if="commentList.length > 0" class="comment-list">
          <li v-for="(comment, index) in commentList" :key="index" class="item">
            <p class="content no-wrap">{{ comment.content }}</p>
            <p class="username no-wrap">{{ comment.userName }}</p>
            <p class="time">{{ comment.date.split(' ')[0] }}</p>
          </li>
        </ul>
        <div class="comment-add">
          <p>添加记录</p>
          <el-input v-model="content" size="small" />
          <el-button size="small" type="primary" @click="addComment">添加</el-button>
        </div>
      </div>
      <div slot="footer">
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="small" @click="closeDialog">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="ruleDialogTableVisible" :fullscreen="ruleFullscreen" top="250px" class="common-dialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>查看依据</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="ruleFullscreen = !ruleFullscreen" />
      </div>
      <el-table :data="rule" border>
        <el-table-column v-for="(header, index) in ruleDialogHeaders" :key="index" :label="header" :prop="ruleDialogKeys[index]" align="center" :width="ruleDialogWidths[index]" show-overflow-tooltip />
        <el-table-column label="关联邮件" align="center">
          <template slot-scope="{ row }">
            <p v-for="(email, index) in row.emailList" :key="index" class="no-wrap" style="cursor: pointer" :title="email.fileName" @click="checkEmail(email.id)">
              {{ email.fileName }}
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button size="small" @click="ruleDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="ruleDialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="emailListDialogVisible" :fullscreen="emailFullscreen" top="70px" class="common-dialog" width="70%" @close="closeEmailDialog">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ emailFileTitle }}</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="emailFullscreen = !emailFullscreen" />
      </div>
      <el-button size="medium" type="primary" class="btn" style="margin-bottom: 10px;" @click="emailAddMoreSource">添加源数据</el-button>
      <el-table :data="emailListData" border @selection-change="handleEmailSelection">
        <el-table-column
          type="selection"
          width="50"
          align="center"
          size="small"
        />
        <el-table-column v-for="(header, index) in emailListHeaders" :key="index" :label="header" :prop="emailListKeys[index]" align="center" show-overflow-tooltip />
        <el-table-column label="分析结果" align="center" width="180">
          <template slot-scope="{ row }">
            <p v-for="(item, index) in row.rules" :key="index" style="line-height: 35px">
              {{ dic.attr[item.attr] }}:{{ item.aptName }}
              <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(item)">查看</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130">
          <template slot="header">
            <el-select v-model="emailHeaderApt" size="mini" placeholder="选择APT" filterable>
              <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
            </el-select>
          </template>
          <template slot-scope="{ row }">
            <el-select v-model="row.aptName" size="mini" placeholder="选择APT" filterable>
              <el-option v-for="(apt, index) in aptList" :key="index" :label="apt" :value="apt" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="{ row }">
            <el-button type="success" size="mini" plain @click="emailAddSource(row)">添加</el-button>
          </template>
        </el-table-column>
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
import ViewEmailMixin from '../view-email-mixin'
import { addSourceData, uploadFile } from '../../api/emailTrace'
export default {
  name: 'Index',
  components: { Upload },
  mixins: [UploadMixin, ViewEmailMixin],
  data() {
    return {
      headers: ['文件名', '文件大小'],
      keys: ['filename', 'size', 'percentage', 'status', 'result'],
      widths: ['', '80', '', '100', '180'],
      STATUS: {
        WAITING: '等待分析',
        UPLOADING: '正在分析',
        ERROR: '分析失败',
        DONE: '分析完成'
      },
      emailListHeaders: ['发件邮箱', '发件IP', '收件邮箱', '邮件标题', '发件日期'],
      emailListKeys: ['fromAdd', 'fromIp', 'toAdd', 'subject', 'date'],
      uploadFunc: uploadFile,
      sizes: [],
      limit: 9999,
      emailHeaderApt: '',
      emailSelection: null
    }
  },
  watch: {
    files: {
      handler() {
        this.fileTableData = []
        let index = 0
        for (const file of this.files) {
          const obj = {
            filename: file.name,
            size: this.transformSize(file.size),
            percentage: 0,
            status: this.STATUS.WAITING,
            apt: '',
            result: null,
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
            if (this.fileTableData[i].result && this.fileTableData[i].result.email) {
              this.fileTableData[i].result.email.aptName = cur
            }
          }
        }
      },
      deep: true
    },
    emailHeaderApt: {
      handler(cur) {
        if (this.emailListData) {
          for (let i = 0; i < this.emailListData.length; i++) {
            this.emailListData[i].aptName = cur
          }
        }
      },
      deep: true
    }
  },
  methods: {
    handleResponse(data, index) {
      if (this.directory) {
        this.fileTableData[index].result = {
          email: data[0].email,
          rules: data[0].rules
        }
      } else {
        this.fileTableData[index].result = data.map((item) => {
          const obj = {}
          Object.assign(obj, item.email)
          obj.rules = item.rules
          return obj
        })
      }
    },
    addSource(result) {
      if (result && result.email) {
        if (result.email.aptName === '') {
          this.$message.warning('请先选择APT')
          return
        }
        addSourceData([result.email]).then(() => {
          this.$message.success('添加成功')
        }).catch((e) => {
          this.$message.error(e)
        })
      }
    },
    addMoreSource() {
      if (!this.selection || this.selection.length === 0) {
        this.$message.warning('请选择要添加的数据')
        return
      }
      const selection = this.selection.filter((item) => item.status === this.STATUS.DONE).map((item) => item.result.email)
      const index = selection.findIndex((item) => item.aptName.length === 0)
      if (index > -1) {
        this.$message.warning('请先选择APT')
        return
      }
      addSourceData(selection).then(() => {
        this.$message.success('添加成功')
      }).catch((e) => {
        this.$message.error(e)
      })
    },
    handleSelection(val) {
      this.selection = val
    },
    emailAddSource(email) {
      if (email.aptName === '') {
        this.$message.warning('请先选择APT')
        return
      }
      const cur = email
      delete cur.rules
      addSourceData([cur]).then(() => {
        this.$message.success('添加成功')
      }).catch((e) => {
        this.$message.error(e)
      })
    },
    emailAddMoreSource() {
      if (!this.emailSelection || this.emailSelection.length === 0) {
        this.$message.warning('请选择要添加的数据')
        return
      }
      const index = this.emailSelection.findIndex(item => item.aptName.length === 0)
      if (index > -1) {
        this.$message.warning('请先选择APT')
        return
      }
      addSourceData(this.emailSelection).then(() => {
        this.$message.success('添加成功')
      }).catch((e) => {
        this.$message.error(e)
      })
    },
    handleEmailSelection(val) {
      this.emailSelection = val.map((item) => {
        delete item.rules
        return item
      })
    },
    closeEmailDialog() {
      this.emailListDialogVisible = false
      this.emailSelection = null
      this.emailHeaderApt = ''
    }
  }
}
</script>

<style scoped lang="scss">
.email-trace-page {
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
    margin-top: 20px;
    .options {
      margin-top: 20px;
    }
  }
}
</style>
