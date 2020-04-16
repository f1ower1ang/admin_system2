import path from '@/assets/js/path'
import request from '@/utils/request'

export function getRecordList(data) {
  return request({
    url: path.emailTrace.recordList,
    method: 'post',
    data
  })
}

export function checkRule(id) {
  return request({
    url: path.emailTrace.checkRule,
    method: 'get',
    params: {
      id
    }
  })
}

export function deleteRecord(id) {
  return request({
    url: path.emailTrace.delRecord,
    method: 'get',
    params: {
      id
    }
  })
}

export function deleteRecords(ids) {
  return request({
    url: path.emailTrace.delRecords,
    method: 'post',
    data: {
      ids
    }
  })
}

export function uploadFile(data, updateProgress) {
  return request({
    url: path.emailTrace.uploadFile,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: updateProgress
  })
}

export function addSourceData(emailList) {
  return request({
    url: path.emailTrace.addSourceData,
    method: 'post',
    data: { emailList }
  })
}
