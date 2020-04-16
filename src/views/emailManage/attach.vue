<template>
  <div class="attach-page app-container">
    <section-title title="附件管理" />
    <el-form :model="formData" :inline="true" label-width="75px" class="common-form">
      <el-row>
        <el-form-item label="文件名:">
          <el-input v-model="formData.name" size="small" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="哈希:">
          <el-input v-model="formData.md5" size="small" placeholder="请输入hash" />
        </el-form-item>
        <el-form-item label="所属邮件:">
          <el-input v-model="formData.emailId" size="small" clearable placeholder="选择邮件">
            <el-button slot="append" icon="el-icon-search" clearable @click.native="getEmailData" />
          </el-input>
        </el-form-item>
        <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
      </el-row>
    </el-form>
    <div class="attach-page__content">
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
      </div>
      <pagination
        :size="limit"
        :total="total"
        :page="page"
        @select-page="changePage"
        @select-size="changeSize"
      >
        <el-table v-loading="loading" :data="tableData" class="common-table" stripe :cell-style="{fontSize: '12px'}" @selection-change="handleSelectionChange">
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
            :width="widths[index]"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="所属邮件" align="center">
            <template v-if="row.email" slot-scope="{ row }">
              <p style="text-align: center; cursor: pointer" class="no-wrap" @click="checkEmail(row.email.id)" :title="row.email.fileName">
                {{ row.email.fileName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" plain @click="download(row)">下载</el-button>
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
    <el-dialog :visible.sync="searchDialog" :fullscreen="searchFullScreen" top="100px" width="50%" class="common-dialog" @close="closeSearch">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>邮件搜索</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="searchFullScreen = !searchFullScreen" />
      </div>
      <el-form :model="searchForm" inline label-width="90px">
        <el-form-item label="邮件路径:">
          <el-input v-model="searchForm.filePath" size="small" type="email" placeholder="请输入邮件路径" />
        </el-form-item>
        <el-form-item label="发件人邮箱:">
          <el-input v-model="searchForm.fromAdd" size="small" placeholder="请输入发件人邮箱" />
        </el-form-item>
        <el-form-item label="发件IP:">
          <el-input v-model="searchForm.fromIp" size="small" placeholder="请输入发件IP" />
        </el-form-item>
        <el-form-item label="邮件标题:">
          <el-input v-model="searchForm.subject" size="small" placeholder="请输入邮件标题" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="success" @click="searchEmail">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button size="small" type="primary" style="margin-bottom: 10px;" @click="selectEmails">选择</el-button>
      <pagination
        :total="searchTotal"
        :page="searchPage"
        :size="searchLimit"
        @select-page="changeSearchPage"
        @select-size="changeSearchSize"
      >
        <el-table v-loading="searchLoading" :data="emailData" class="common-table" stripe @selection-change="handleSearchSelection">
          <el-table-column
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column v-for="(header, index) in searchHeaders" :key="index" :label="header" :prop="searchKeys[index]" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="90" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" plain @click="selectEmail(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
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
  </div>
</template>

<script>
import { deleteAttachment, deleteAttachments, getAttachmentList, getEmailList } from '../../api/emailManage'
import CommonMixin from '../common-mixin'
import ViewEmailMixin from '../view-email-mixin'

export default {
  name: 'Attach',
  mixins: [CommonMixin, ViewEmailMixin],
  data() {
    return {
      formData: {
        name: '',
        md5: '',
        emailId: ''
      },
      keys: ['id', 'name', 'size', 'path', 'emailHash', 'emailId'],
      headers: ['ID', '文件名', '文件大小(KB)', '路径', '哈希'],
      widths: ['70', '', '120', '', '', ''],
      searchDialog: false,
      searchFullScreen: false,
      searchForm: {
        filePath: '',
        fromAdd: '',
        fromIp: '',
        subject: ''
      },
      getItems: getAttachmentList,
      delItem: deleteAttachment,
      delItems: deleteAttachments,
      searchHeaders: ['邮件路径', '发件邮箱', '发件IP', '邮件标题'],
      searchKeys: ['filePath', 'fromAdd', 'fromIp', 'subject'],
      searchLoading: false,
      searchPage: 1,
      searchLimit: 8,
      searchTotal: 0,
      emailData: null,
      emailSelection: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getEmailData() {
      this.searchDialog = true
      this.searchLoading = true
      const data = {}
      Object.assign(data, this.searchForm, {
        page: this.searchPage,
        limit: this.searchLimit
      })
      getEmailList(data).then((res) => {
        this.emailData = res.data.map((item) => {
          return {
            emailId: item.id,
            filePath: item.filePath,
            subject: item.subject,
            fromAdd: item.fromAdd,
            fromIp: item.fromIp
          }
        })
        this.searchTotal = res.count
        this.searchLoading = false
      })
    },
    handleSearchSelection(val) {
      this.emailSelection = val
    },
    selectEmails() {
      if (this.emailSelection.length === 0) { return }
      this.formData.emailId = this.emailSelection.map(item => item.emailId).join(',')
      this.closeSearch()
      this.emailSelection = []
    },
    searchEmail() {
      this.searchPage = 1
      this.searchLimit = 1
      this.getEmailData()
    },
    closeSearch() {
      this.searchDialog = false
      this.emailData = null
      this.searchTotal = 0
      this.searchPage = 1
      this.searchLimit = 8
      this.searchForm = this.$options.data().searchForm
    },
    changeSearchPage(page) {
      this.searchPage = page
      this.getEmailData()
    },
    changeSearchSize(size) {
      this.searchLimit = size
      this.getEmailData()
    },
    selectEmail(email) {
      this.formData.emailId = email.emailId
      this.closeSearch()
    }
  }
}
</script>

<style scoped lang="scss">
.attach-page {
  &__content {
    .option {
      margin-bottom: 20px;
    }
  }
}
</style>
