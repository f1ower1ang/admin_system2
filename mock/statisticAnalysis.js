const path = require('./path')

module.exports = [
  {
    url: path.threadInfo.ipRank,
    type: 'post',
    response: (config) => {
      const { data, total } = require('./json/countRank_byFromIp')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.emailRank,
    type: 'post',
    response: (config) => {
      const { data, total } = require('./json/countRank_byFromAdd')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.AptCountryCount,
    type: 'post',
    response: config => {
      const { data, total } = require('./json/countRank_byCountry')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.apt,
    type: 'post',
    response: config => {
      const { data, total } = require('./json/countRank_byAptName')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.getDomain,
    type: 'post',
    response: config => {
      const { data, total } = require('./json/countRank_byDomains')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.getHash,
    type: 'post',
    response: config => {
      const { data, total } = require('./json/countRank_byHash')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.getProvince,
    type: 'post',
    response: config => {
      const { data, total } = require('./json/countRank_byProvince')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.getOrganization,
    type: 'post',
    response: config => {
      const { data, total } = require('./json/countRank_byOrganization')
      return {
        data,
        total,
        code: 0
      }
    }
  },
  {
    url: path.threadInfo.getEmail,
    type: 'post',
    response: config => {
      const { data, total } = require('./json/countRank_byToAdd')
      return {
        data,
        total,
        code: 0
      }
    }
  }
]
