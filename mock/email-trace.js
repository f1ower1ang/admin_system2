// const path = require('./path')
const path = require('../src/assets/js/path')

module.exports = [
  {
    url: path.emailTrace.recordList,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, count } = require('./json/trace_findall')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        count,
        code: 0
      }
    }
  },
  {
    url: path.emailTrace.checkRule,
    type: 'post',
    response: () => {
      return require('./json/rule_findone')
    }
  },
  {
    url: path.emailTrace.addSourceData,
    type: 'post',
    response: () => {
      return {
        'data': 'ok',
        'code': 0,
        'msg': 'SUCCESS',
        'count': 1
      }
    }
  },
  {
    url: path.emailTrace.uploadFile,
    type: 'post',
    response: () => {
      return require('./json/trace_uploadmany')
    }
  }
]
