<template>
  <div class="dashboard-page app-container">
    <section-title more title="数据速览" @go-to="goTo('/statisticAnalysis')" />
    <el-row class="dashboard-page__header" :gutter="20">
      <el-col v-for="(item, index) in headerData" :key="index" :span="6">
        <el-card>
          <div class="wrapper">
            <div :style="{backgroundImage: `url(${item.bg})`}" class="bg" />
            <div class="item">
              <p>{{ item.title }}</p>
              <p>{{ item.data }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <section-title title="最近分析" more @go-to="goTo('/emailTrace/record')" />
    <div class="dashboard-page__content">
      <el-table :data="tableData" class="common-table" stripe>
        <el-table-column label="文件名" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <p class="no-wrap" style="cursor: pointer" @click="checkEmail(row.emailId)">
              {{ row.email.fileName }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="分析类型" align="center">
          <template slot-scope="{ row }">
            {{ dic.uploadType[row.type] }}
          </template>
        </el-table-column>
        <el-table-column label="分析结果" align="center">
          <template slot-scope="{ row }">
            <p v-for="(rule, index) in row.rules" :key="index" style="line-height: 35px">
              {{ dic.attr[rule.attr] }}:{{ rule.aptName }}
              <el-button size="mini" type="primary" plain style="padding: 5px 10px; margin-left: 5px;" @click="viewRule(rule)">查看</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="添加源数据" align="center" width="90">
          <template slot-scope="{ row }">
            <p :class="!row.addRule ? 'color-red': 'color-green'">{{ row.addRule | toWords }}</p>
          </template>
        </el-table-column>
        <el-table-column label="分析日期" align="center" width="200" prop="date" />
      </el-table>
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
  </div>
</template>

<script>
import { getStatistic } from '../../api/dashboard'
import { getRecordList } from '../../api/emailTrace'
import dic from '../../assets/js/dic'
import ViewEmailMixin from '../view-email-mixin'

export default {
  filters: {
    toWords(flag) {
      return flag ? '是' : '否'
    }
  },
  mixins: [ViewEmailMixin],
  data() {
    return {
      tableData: null,
      headerData: [
        {
          bg: require('../../assets/slices/source-data.png'),
          title: '源数据',
          data: 0
        }, {
          bg: require('../../assets/slices/analyse-rule.png'),
          title: '分析规则',
          data: 0
        }, {
          bg: require('../../assets/slices/group.png'),
          title: '组织',
          data: 0
        }, {
          bg: require('../../assets/slices/analyse-record.png'),
          title: '分析记录',
          data: 0
        }],
      dic
    }
  },
  created() {
    getStatistic().then(res => {
      const data = [res.data.sourceCount, res.data.ruleCount, res.data.aptCount, res.data.traceCount]
      for (let i = 0; i < 4; i++) {
        this.headerData[i].data = data[i]
      }
    })
    getRecordList({ limit: 10, page: 1 }).then((res) => {
      this.tableData = res.data
    })
  },
  methods: {
    goTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: $bg-page;
  min-height: calc(100vh - 55px);
  &__header{
    .bg {
      display: inline-block;
      width: 52px;
      height: 52px;
      vertical-align: bottom;
    }
    .item {
      height: 52px;
      display: inline-block;
      font-size: $font-size-medium-x;
      margin-left: 5px;
      p:first-child {
        margin: 10px 0 5px;
        color: $color-pl;
        font-size: $font-size-medium-s;
      }
    }
  }
}
</style>
