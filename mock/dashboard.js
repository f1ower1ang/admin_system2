// const path = require('./path')
const path = require('../src/assets/js/path')

module.exports = [
  {
    url: path.dashboard.statistic,
    type: 'post',
    response: () => {
      const { data } = require('./json/statistics')
      return {
        data,
        code: 0
      }
    }
  }
]
