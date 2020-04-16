<template>
  <div class="rule-manage-page app-container">
    <section-title title="规则定义" />
    <div class="rule-manage-page__header">
      <el-form :model="formData" :inline="true" class="common-form" label-width="75px">
        <el-row>
          <el-form-item label="规则属性:">
            <el-select v-model="formData.attr" size="small" placeholder="请选择属性" filterable>
              <el-option label="全部" value="" />
              <el-option label="强规则" value="strong" />
              <el-option label="弱规则" value="weak" />
            </el-select>
          </el-form-item>
          <el-form-item label="规则类型:">
            <el-select v-model="formData.type" size="small" placeholder="请选择类型" filterable>
              <el-option label="全部" value="" />
              <el-option label="发件邮箱" value="send" />
              <el-option label="收件邮箱" value="receive" />
            </el-select>
          </el-form-item>
          <el-form-item label="源数据:">
            <el-input v-model="formData.value" size="small" placeholder="请输入源数据" />
          </el-form-item>
          <el-form-item label="关联邮件:">
            <el-input v-model="formData.emailId" size="small" clearable placeholder="选择邮件">
              <el-button slot="append" icon="el-icon-search" clearable @click.native="getEmailData" />
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="关系:">
            <el-select v-model="formData.relation" size="small" placeholder="请选择关系" filterable>
              <el-option label="全部" value="" />
              <el-option label="并且" value="and" />
              <el-option label="或者" value="or" />
            </el-select>
          </el-form-item>
          <el-form-item label="表达式:">
            <el-select v-model="formData.expression" size="small" placeholder="请选择表达式" filterable>
              <el-option label="全部" value="" />
              <el-option label="单条件" value="single" />
              <el-option label="多条件" value="multi" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属组织:">
            <el-select v-model="formData.aptName" size="small" placeholder="请选择所属组织" filterable>
              <el-option label="全部" value="" />
              <template v-if="dic.APT">
                <el-option v-for="(aptName, index) in dic.APT" :key="index" :label="aptName" :value="aptName" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="rule-manage-page__content">
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
        <el-button size="small" type="primary" @click="showDialog('添加规则', '修改规则')">添加</el-button>
      </div>
      <pagination
        :size="limit"
        :total="total"
        :page="page"
        @select-page="changePage"
        @select-size="changeSize"
      >
        <el-table v-loading="loading" :data="tableData" class="common-table" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="ID" prop="id" align="center" width="100" />
          <el-table-column label="规则类型" show-overflow-tooltip align="center">
            <template slot-scope="{ row }">
              {{ dic.types[row.type] }}
            </template>
          </el-table-column>
          <el-table-column label="源数据" show-overflow-tooltip align="center" prop="value" />
          <el-table-column label="对应源数据" show-overflow-tooltip align="center" width="100">
            <template slot-scope="{ row }">
              <span :class="!row.eqSource ? 'color-red': 'color-green'">
                {{ dic.eqSource[row.eqSource] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="规则属性" show-overflow-tooltip align="center">
            <template slot-scope="{ row }">
              {{ dic.attr[row.attr] }}
            </template>
          </el-table-column>
          <el-table-column label="所属于组织" prop="aptName" align="center" show-overflow-tooltip />
          <el-table-column label="关联邮件" align="center">
            <template slot-scope="{ row }">
              <p v-for="(email, index) in row.emailList" :key="index" class="no-wrap" :title="email.fileName" style="text-align: left;padding: 2px 0; cursor: pointer" @click="checkEmail(email.id)">
                {{ email.fileName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="表达式" align="center" width="90">
            <template slot-scope="{ row }">
              <p>{{ row.subRules | expression }}</p>
            </template>
          </el-table-column>
          <el-table-column label="关系" align="center" width="90">
            <template slot-scope="{ row, $index }">
              <p>{{ dic.relation[row.relation] }}</p>
              <template v-if="row.subRules && row.subRules.length > 0">
                <el-button type="text" @click="expandRelation($index)">{{ row.expand ? '收起' : '展开' }}</el-button>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" plain @click="showDialog('添加规则', '修改规则', 'ruleForm', row, $index)">编辑</el-button>
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
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="fullscreen" top="100px" width="690px" class="common-dialog" @close="cancel('ruleForm')">
      <div slot="title" style="display: flex; justify-content: space-between; height: 16px; align-items: center">
        <p>{{ dialogTitle }}</p>
        <el-button icon="el-icon-full-screen" type="text" style="margin-right: 30px" @click="fullscreen = !fullscreen" />
      </div>
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" :rules="rules">
        <el-form-item label="关联邮件" prop="emailId">
          <el-input v-model="ruleForm.emailId" size="small" style="width: 70%" disabled @click.native="getEmailData">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="规则属性" prop="attr">
          <el-select v-model="ruleForm.attr" size="small" placeholder="请选择属性">
            <el-option label="强规则" value="strong" />
            <el-option label="弱规则" value="weak" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则表达式" prop="type">
          <dl class="expression">
            <dt>
              <span>当待分析邮件的</span>
              <el-select v-model="ruleForm.type" size="small" placeholder="规则类型" style="width: 130px">
                <el-option v-for="(t, index) in Object.keys(dic.types)" :key="index" :value="t" :label="dic.types[t]" />
              </el-select>
              <span>=</span>
              <el-input v-model="ruleForm.value" size="small" style="width: 150px" :placeholder="ruleForm.placeholder" :disabled="ruleForm.eqSource" />
              <el-checkbox v-model="ruleForm.eqSource" class="common-checkbox" @click.native="changePlaceholder(ruleForm)">对应源数据</el-checkbox>
              <el-button size="mini" type="primary" icon="el-icon-plus" style="padding: 5px; border-radius: 0" @click="addSubRule" />
            </dt>
            <dd v-for="(subRule, index) in ruleForm.subRules" :key="index">
              <el-select v-model="subRule.relation" size="small" placeholder="关系" style="width: 98px">
                <el-option v-for="(relation, idx) in Object.keys(dic.relation)" :key="idx" :value="relation" :label="dic.relation[relation]" />
              </el-select>
              <el-select v-model="subRule.type" size="small" placeholder="规则类型" style="width: 130px">
                <el-option v-for="(type, idx) in Object.keys(dic.types)" :key="idx" :value="type" :label="dic.types[type]" />
              </el-select>
              <span>=</span>
              <el-input v-model="subRule.value" size="small" style="width: 150px" :placeholder="subRule.placeholder" :disabled="subRule.eqSource" />
              <el-checkbox v-model="subRule.eqSource" class="common-checkbox" @click.native="changePlaceholder(subRule)">对应源数据</el-checkbox>
              <el-button size="mini" type="primary" icon="el-icon-minus" style="padding: 5px; border-radius: 0" @click="delSubRule(index)" />
            </dd>
          </dl>
        </el-form-item>
        <el-form-item label="所属组织" prop="aptName">
          <el-select v-model="ruleForm.aptName" size="small" placeholder="请选择组织">
            <template v-if="dic.APT">
              <el-option v-for="(aptName, index) in dic.APT" :key="index" :label="aptName" :value="aptName" />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="addOrEditItem('ruleForm', 'ruleForm')">确 定</el-button>
        <el-button size="small" @click="cancel('ruleForm')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="searchDialog" :fullscreen="searchFullScreen" top="100px" width="60%" class="common-dialog" @close="closeSearch">
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
import { getRuleList, editRule, delRule, addRule, delRules, getAptList } from '../../api/ruleManage'
import CommonMixin from '../common-mixin'
import { getEmailList } from '../../api/emailManage'
import ViewEmailMixin from '../view-email-mixin'

export default {
  name: 'Index',
  filters: {
    expression(rules) {
      return rules.length === 0 ? '单条件' : '多条件'
    }
  },
  mixins: [CommonMixin, ViewEmailMixin],
  data() {
    return {
      formData: {
        attr: '',
        type: '',
        value: '',
        emailId: '',
        relation: '',
        aptName: '',
        expression: ''
      },
      keys: ['aptName', 'emailId', 'subRules', 'relation'],
      headers: ['所属于组织', '关联邮件'],
      ruleForm: {
        attr: '',
        type: '',
        value: '',
        eqSource: false,
        aptName: '',
        emailId: '',
        filePath: '',
        placeholder: '规则值',
        subRules: []
      },
      rules: {
        emailId: { required: true, message: '请点击搜索图标选择邮件', trigger: 'change' },
        attr: { required: true, message: '请选择规则属性', trigger: 'blur' },
        type: { required: true, message: '请选择规则类型', trigger: 'blur' },
        aptName: { required: true, message: '请选择所属组织', trigger: 'blur' }
      },
      dialogTitle: '添加规则',
      searchDialog: false,
      searchFullScreen: false,
      searchForm: {
        filePath: '',
        fromAdd: '',
        fromIp: '',
        subject: ''
      },
      editItem: editRule,
      delItem: delRule,
      delItems: delRules,
      addItem: addRule,
      getItems: getRuleList,
      searchHeaders: ['ID', '邮件路径', '发件邮箱', '发件IP', '邮件标题'],
      searchKeys: ['emailId', 'filePath', 'fromAdd', 'fromIp', 'subject'],
      searchLoading: false,
      searchPage: 1,
      searchLimit: 8,
      searchTotal: 0,
      emailData: null,
      selection: []
    }
  },
  watch: {
    tableData() {
      this.tableData.forEach((item, index) => {
        if (item.subRules && item.expand === undefined) {
          item.expand = false
          item.index = index
        }
      })
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
  },
  methods: {
    handleSearchSelection(val) {
      this.selection = val
    },
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
    selectEmails() {
      if (this.selection.length === 0) { return }
      const emailId = this.selection.map(item => item.emailId).join(',')
      if (this.dialogTableVisible) {
        Object.assign(this.ruleForm, {
          emailId
        })
      } else {
        this.formData.emailId = emailId
      }
      this.closeSearch()
      this.selection = []
    },
    selectEmail(email) {
      if (this.dialogTableVisible) {
        Object.assign(this.ruleForm, email)
      } else {
        this.formData.emailId = email.emailId
      }
      this.closeSearch()
    },
    addSubRule() {
      const obj = {
        type: '',
        relation: '',
        value: '',
        eqSource: false,
        placeholder: '规则值'
      }
      if (this.ruleForm.pid) {
        obj.pid = this.ruleForm.pid
      }
      this.ruleForm.subRules.push(obj)
    },
    delSubRule(index) {
      this.ruleForm.subRules.splice(index, 1)
    },
    changePlaceholder(rule) {
      if (!rule.eqSource) {
        rule.value = ''
        rule.placeholder = '对应源数据'
      } else {
        rule.placeholder = '规则值'
      }
    },
    expandRelation(index) {
      this.tableData[index].expand = !this.tableData[index].expand
      if (this.tableData[index].expand) {
        const before = this.tableData.slice(0, index + 1)
        const after = this.tableData.slice(index + 1)
        this.tableData[index].subRules.forEach((item) => {
          item.child = true
        })
        this.tableData = [].concat(before, this.tableData[index].subRules, after)
      } else {
        while (this.tableData[index + 1].child) {
          this.tableData.splice(index + 1, 1)
        }
      }
      console.log(this.tableData)
    }
  }
}
</script>

<style scoped lang="scss">
.rule-manage-page{
  &__content {
    .option {
      margin-bottom: 10px;
    }
  }
}
</style>
