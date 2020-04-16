module.exports = {
  user: {
    login: '/user/login',
    logout: '/user/logout_json',
    info: '/user/getCurrentUser',
    editUser: '/user/editOne'
  },
  dashboard: {
    statistic: '/getStatistics'
  },
  emailManage: {
    emailList: '/email/findAll',
    attachList: '/attachment/findAll',
    deleteEmailByIds: '/email/delMore',
    oneEmail: '/email/findOne',
    deleteEmailById: '/email/delOne',
    deleteAttachmentById: '/attachment/delOne',
    deleteAttachmentByIds: '/attachment/delMore',
    checkRule: '/rule/findOne',
    commentList: '/comment/findAll',
    addComment: '/comment/addOne',
    editEmail: '/email/editOne'
  },
  emailTrace: {
    recordList: '/trace/findAll',
    delRecord: '/trace/delOne',
    delRecords: '/trace/delMore',
    checkRule: '/rule/findOne',
    addSourceData: '/trace/addSourceForEmail',
    uploadFile: '/trace/uploadMany'
  },
  ruleManage: {
    ruleList: '/rule/findAll',
    addRule: '/rule/addOne',
    editRule: '/rule/editOne',
    deleteRule: '/rule/delOne',
    deleteRules: '/rule/delMore',
    import: '/email/uploadMany',
    targetList: '/victim/findAll',
    addTarget: '/victim/addOne',
    editTarget: '/victim/editOne',
    deleteTarget: '/victim/delOne',
    deleteTargets: '/victim/delMore',
    APTList: '/apts/findAll',
    addAPT: '/apts/addOne',
    editAPT: '/apts/editOne',
    deleteAPT: '/apts/delOne',
    deleteAPTs: '/apts/delMore',
    uploadImg: '/apts/uploadOne',
    saveDomain: '/trace/addSourceForDomains',
    victimUploadMany: '/victim/uploadMany'
  },
  userManage: {
    userList: '/user/findAll',
    deleteUser: '/user/delOne',
    deleteUsers: '/user/delMore',
    addUser: '/user/addOne',
    editUser: '/user/editOne',
    roleList: '/role/findAll',
    addRole: '/role/addOne',
    editRole: '/role/editOne',
    deleteRole: '/role/delOne',
    deleteRoles: '/role/delMore',
    permList: '/menu/findAll',
    addPerm: '/menu/addOne',
    editPerm: '/menu/editOne',
    deletePerm: '/menu/delOne',
    deletePerms: '/menu/delMore',
    menus: '/menu/findAllForTree'
  },
  threadInfo: {
    ipRank:'/countRank/byFromIp',
    emailRank: '/countRank/byFromAdd',
    AptCountryCount: '/countRank/byCountry',
    apt: '/countRank/byAptName',
    getDomain: '/countRank/byDomains',
    getHash: '/countRank/byHash',
    getProvince: '/countRank/byProvince',
    getOrganization: '/countRank/byOrganization',
    getEmail: '/countRank/byToAdd',
    reportAddOne: '/report/addOne',
    victimFindAll: '/victim/findAll'
  }
}
