<template>
  <div class="email-manage-page app-container">
    <section-title title="邮件管理" />
    <el-form :model="formData" :inline="true" label-width="75px" class="common-form">
      <el-row>
        <el-form-item label="发件邮箱:">
          <el-input v-model="formData.fromAdd" size="small" type="email" placeholder="请输入发件邮箱" />
        </el-form-item>
        <el-form-item label="发件IP:">
          <el-input v-model="formData.fromIp" size="small" placeholder="请输入发件IP" />
        </el-form-item>
        <el-form-item label="邮件标题:">
          <el-input v-model="formData.subject" size="small" placeholder="请输入邮件标题" />
        </el-form-item>
        <el-form-item label="邮件正文:">
          <el-input v-model="formData.content" size="small" placeholder="请输入邮件正文" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所属组织:">
          <el-select v-model="formData.aptName" size="small" filterable placeholder="请选择所属组织">
            <el-option label="全部" value="" />
            <template v-if="dic.APT">
              <el-option v-for="(aptName, index) in dic.APT" :key="index" :label="aptName" :value="aptName" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="发件日期:">
          <el-date-picker
            v-model="formData.startDate"
            style="width: 100%"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <p slot="label" style="text-align: center">至</p>
          <el-date-picker
            v-model="formData.endDate"
            style="width: 100%"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="是否查看" style="min-width: 19.5%;">
          <el-radio-group v-model="formData.readed">
            <el-radio label="">全部</el-radio>
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" type="success" size="small" @click="search">查询</el-button>
      </el-row>
    </el-form>
    <div class="email-manage-page__content">
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
        <el-button size="small" type="primary"><router-link to="/statisticAnalysis">统计分析</router-link></el-button>
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
          <el-table-column v-for="(label, index) in headers" :key="index" :label="label" :prop="keys[index]" :width="widths[index]" align="center" show-overflow-tooltip />
          <el-table-column label="分析结果" width="180" align="center">
            <template v-if="row.trace" slot-scope="{ row }">
              <p v-for="(item, index) in row.trace.rules || []" :key="index" style="line-height: 35px">
                {{ dic.attr[item.attr] }}:{{ item.aptName }}
                <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(item)">查看</el-button>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="添加源数据" width="90" align="center">
            <template slot-scope="{ row }">
              <p :class="!row.trace || !row.trace.addRule ? 'color-red': 'color-green'">{{ row.trace | toWords }}</p>
            </template>
          </el-table-column>
          <el-table-column label="是否查看" width="80" align="center">
            <template slot-scope="{ row }">
              <p :class="!row.readed ? 'color-red': 'color-green'">{{ row.readed | toWords }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" plain @click="checkEmail(row)">查看</el-button>
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
            <p class="time">{{ comment.date }}</p>
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
            <p v-for="(email, index) in row.emailList" :key="index" class="no-wrap" style="cursor: pointer" @click="checkEmail(email.id)" :title="email.fileName">
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
  </div>
</template>
<script>
import { deleteEmail, deleteEmails, getEmailList } from '../../api/emailManage'
import { getAptList } from '../../api/ruleManage'
import CommonMixin from '../common-mixin'
import ViewEmailMixin from '../view-email-mixin'

export default {
  name: 'Index',
  filters: {
    toWords(flag) {
      const type = Object.prototype.toString.call(flag)
      if (type === '[object Object]') {
        if (flag.addRule) {
          return flag.addRule ? '是' : '否'
        } else {
          return '否'
        }
      } else {
        return flag ? '是' : '否'
      }
    }
  },
  mixins: [CommonMixin, ViewEmailMixin],
  data() {
    return {
      formData: {
        fromAdd: '',
        fromIp: '',
        subject: '',
        content: '',
        aptName: '',
        startDate: '',
        endDate: '',
        readed: ''
      },
      headers: ['ID', '发件邮箱', '发件IP', '邮件标题', '发件日期', '所属组织'],
      keys: ['id', 'fromAdd', 'fromIp', 'subject', 'date', 'aptName', 'trace', 'read'],
      widths: ['70', '', '130', '', '100', '', '', '100'],
      getItems: getEmailList,
      delItem: deleteEmail,
      delItems: deleteEmails
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
  .email-manage-page {
    background-color: #fff;
    &__content {
      .option {
        margin-bottom: 20px;
      }
    }
    .el-radio {
      margin-right: 10px;
    }
  }
</style>
