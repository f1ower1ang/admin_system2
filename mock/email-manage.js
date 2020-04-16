const path = require('../src/assets/js/path')
// const path = require('./path')

module.exports = [
  {
    url: path.emailManage.attachList,
    type: 'post',
    response: config => {
      const { page, limit } = config.body
      const { data, count } = require('./json/attachment_findall')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        count,
        code: 0
      }
    }
  },
  {
    url: path.emailManage.emailList,
    type: 'post',
    response: config => {
      const { page, limit } = config.body
      const { data, count } = require('./json/email_findall')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        count,
        code: 0
      }
    }
  },
  {
    url: path.emailManage.deleteEmailById,
    type: 'get',
    response: () => {
      return {
        'data': 1,
        'code': 0,
        'msg': 'SUCCESS',
        'count': 1
      }
    }
  },
  {
    url: path.emailManage.deleteEmailByIds,
    type: 'post',
    response: config => {
      const { ids } = config.body
      return {
        'data': ids.length,
        'code': 0,
        'msg': 'SUCCESS',
        'count': ids.length
      }
    }
  },
  {
    url: path.emailManage.deleteAttachmentById,
    type: 'get',
    response: () => {
      return {
        'data': 1,
        'code': 0,
        'msg': 'SUCCESS',
        'count': 1
      }
    }
  },
  {
    url: path.emailManage.deleteAttachmentByIds,
    type: 'post',
    response: config => {
      const { ids } = config.body
      return {
        'data': ids.length,
        'code': 0,
        'msg': 'SUCCESS',
        'count': ids.length
      }
    }
  }
]
