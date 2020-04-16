module.exports = {
  user: {
    login: '/user/login',
    logout: '/user/logout',
    info: '/user/getInfo'
  },
  dashboard: '/dashboard',
  emailManage: {
    emailList: '/email/findAll',
    attachList: '/attachment/findAll'
  },
  emailTrace: {
    record: '/email/record'
  },
  ruleManage: {
    define: '/ruleManage/define',
    import: '/ruleManage/import',
    organise: '/ruleManage/organise',
    target: '/ruleManage/target'
  },
  userManage: {
    accountManage: '/accountManage',
    roleManage: '/roleManage',
    permissionManage: '/permissionManage'
  },
  threadInfo: {
    ipRank: '/countRank/byFromIp',
    emailRank: '/countRank/byFromAdd',
    AptCountryCount: '/countRank/byCountry',
    apt: '/countRank/byAptName',
    getDomain: '/countRank/byDomains',
    getHash: '/countRank/byHash',
    getProvince: '/countRank/byProvince',
    getOrganization: '/countRank/byOrganization',
    getEmail: '/countRank/byToAdd',
    reportAddOne: '/report/addOne',
    victimUploadMany: '/victim/uploadMany'
  }
}
