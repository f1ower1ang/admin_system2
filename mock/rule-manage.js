// const path = require('./path')
const path = require('../src/assets/js/path')

module.exports = [
  {
    url: path.ruleManage.ruleList,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, count } = require('./json/rule_findall')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        count,
        code: 0
      }
    }
  },
  {
    url: path.ruleManage.ruleAdd,
    type: 'post',
    response: (config) => {
      return require('./json/rule_addone')
    }
  },
  {
    url: path.ruleManage.organise,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, total } = require('./json/aptManage')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        total,
        code: 0
      }
    }
  },
  {
    url: path.ruleManage.target,
    type: 'post',
    response: (config) => {
      const { page, limit } = config.body
      const { data, total } = require('./json/targetManage')
      return {
        data: data.slice((page - 1) * limit, page * limit),
        total,
        code: 0
      }
    }
  }
]
