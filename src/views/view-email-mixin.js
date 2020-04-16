import { getEmail, getCommentList, addComment, checkRule, editEmail } from '@/api/emailManage'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      emailDialogTableVisible: false,
      ruleDialogTableVisible: false,
      ruleDialogHeaders: ['规则属性', '规则类型', '匹配源数据', '所属组织'],
      ruleDialogKeys: ['attr', 'type', 'value', 'aptName'],
      ruleDialogWidths: ['100', '100', '', '100', ''],
      ruleFullscreen: false,
      emailFullscreen: false,
      rule: null,
      curData: null,
      commentPage: 1,
      commentLimit: 10,
      commentList: [],
      emailId: -1,
      content: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    async checkEmail(dataOrId) {
      const t = Object.prototype.toString.call(dataOrId)
      let data = null
      if (t === '[object Object]') {
        data = dataOrId
        this.emailId = dataOrId.id
      } else {
        this.emailId = dataOrId
        const res = await getEmail(dataOrId)
        data = res.data
      }
      editEmail({
        id: this.emailId,
        readed: 1
      })
      this.curData = []
      const keys = ['发件邮箱', '发件IP', '收件邮箱', '发件时间', '邮件标题', '邮件正文', '邮件附件', '分析结果', '添加源数据']
      const maps = ['fromAdd', 'fromIp', 'toAdd', 'date', 'subject', 'content', 'attachments']
      maps.slice(0, 6).forEach((k, index) => {
        const obj = {
          key: keys[index],
          flag: false,
          value: data[k]
        }
        this.curData.push(obj)
      })
      this.curData.push({
        key: keys[6],
        value: data.attachments,
        flag: true
      })
      this.curData.push({
        key: keys[7],
        value: data.trace ? data.trace.rules : '',
        flag: !!data.trace
      })
      let addRule = ''
      if (data.trace) {
        addRule = data.trace.addRule ? '是' : '否'
      }
      this.curData.push({
        key: keys[8],
        value: addRule,
        flag: false
      })
      this.getComments()
      this.emailDialogTableVisible = true
    },
    closeDialog() {
      this.emailDialogTableVisible = false
      this.content = ''
      this.curData = null
      this.commentList = []
    },
    getComments() {
      this.commentList = []
      getCommentList({ page: this.commentPage, limit: this.commentLimit, emailId: this.emailId }).then((res) => {
        this.commentList.push(...res.data)
      })
    },
    addComment() {
      const data = {
        userName: this.name,
        emailId: this.emailId,
        content: this.content,
        date: this.getDate()
      }
      addComment(data).then((res) => {
        this.commentList.unshift(res.data)
      })
    },
    getDate() {
      return new Date().toLocaleString('chinese', { hour12: false }).replace(/\//g, '-')
    },
    download(item) {
      open(item.path)
    },
    viewRule(rule) {
      checkRule(rule.id).then((res) => {
        res.data.attr = this.dic.attr[res.data.attr]
        res.data.type = this.dic.types[res.data.type]
        this.rule = [res.data]
        this.ruleDialogTableVisible = true
      })
    }
  }
}
