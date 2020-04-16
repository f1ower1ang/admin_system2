import path from '@/assets/js/path'
import request from '@/utils/request'

export function getRuleList(data) {
  return request({
    url: path.ruleManage.ruleList,
    method: 'post',
    data
  })
}

export function addRule(data) {
  return request({
    url: path.ruleManage.addRule,
    method: 'post',
    data
  })
}

export function editRule(data) {
  return request({
    url: path.ruleManage.editRule,
    method: 'post',
    data
  })
}

export function delRule(id) {
  return request({
    url: path.ruleManage.deleteRule,
    method: 'get',
    params: { id }
  })
}

export function delRules(ids) {
  return request({
    url: path.ruleManage.deleteRules,
    method: 'post',
    data: { ids }
  })
}

export function aptManage(data) {
  return request({
    url: path.ruleManage.organise,
    method: 'post',
    data
  })
}

export function getTargetList(data) {
  return request({
    url: path.ruleManage.targetList,
    method: 'post',
    data
  })
}

export function addTarget(data) {
  return request({
    url: path.ruleManage.addTarget,
    method: 'post',
    data
  })
}

export function editTarget(data) {
  return request({
    url: path.ruleManage.editTarget,
    method: 'post',
    data
  })
}

export function delTarget(id) {
  return request({
    url: path.ruleManage.deleteTarget,
    method: 'get',
    params: { id }
  })
}

export function delTargets(ids) {
  return request({
    url: path.ruleManage.deleteTargets,
    method: 'post',
    data: { ids }
  })
}

export function getAptList(data) {
  return request({
    url: path.ruleManage.APTList,
    method: 'post',
    data
  })
}

export function addAPT(data) {
  return request({
    url: path.ruleManage.addAPT,
    method: 'post',
    data
  })
}

export function editAPT(data) {
  return request({
    url: path.ruleManage.editAPT,
    method: 'post',
    data
  })
}

export function delAPT(id) {
  return request({
    url: path.ruleManage.deleteAPT,
    method: 'get',
    params: { id }
  })
}

export function delAPTs(ids) {
  return request({
    url: path.ruleManage.deleteAPTs,
    method: 'post',
    data: { ids }
  })
}

export function uploadImg(data) {
  return request({
    url: path.ruleManage.uploadImg,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function importSourceData(data, updateProgress) {
  return request({
    url: path.ruleManage.import,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: updateProgress
  })
}

export function saveHarmDomain(domainList) {
  return request({
    url: path.ruleManage.saveDomain,
    method: 'post',
    data: { domainList }
  })
}

export function victimUploadMany(data, updateProgress) {
  return request({
    url: path.ruleManage.victimUploadMany,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: updateProgress
  })
}
