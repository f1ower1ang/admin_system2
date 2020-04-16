const path = require('./path')

module.exports = [
  {
    url: path.userManage.accountManage,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, total } = require('./json/accountManage')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        total,
        code: 0
      }
    }
  },
  {
    url: path.userManage.permissionManage,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, total } = require('./json/permissionManage')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        total,
        code: 0
      }
    }
  },
  {
    url: path.userManage.roleManage,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, total } = require('./json/roleManage')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        total,
        code: 0
      }
    }
  }
]
