import path from '@/assets/js/path'
import request from '@/utils/request'

export function getIPRank(startDate, endDate, aptName) {
  const data = {
    startDate,
    endDate
  }
  return request({
    url: path.threadInfo.ipRank,
    method: 'post',
    data
  })
}

export function getEmailRank(startDate, endDate, aptName) {
  const data = {
    startDate,
    endDate
  }
  return request({
    url: path.threadInfo.emailRank,
    method: 'post',
    data
  })
}

export function getAptCountryCount(startDate, endDate) {
  const data = {
    startDate,
    endDate
  }
  return request({
    url: path.threadInfo.AptCountryCount,
    method: 'post',
    data
  })
}

export function getAptRank(startDate, endDate) {
  const data = {
    startDate,
    endDate
  }
  return request({
    url: path.threadInfo.apt,
    method: 'post',
    data
  })
}

export function getDomain(startDate, endDate, aptName) {
  const data = {
    startDate,
    endDate,
    aptName
  }
  return request({
    url: path.threadInfo.getDomain,
    method: 'post',
    data
  })
}

export function getHash(startDate, endDate, aptName) {
  const data = {
    startDate,
    endDate,
    aptName
  }
  return request({
    url: path.threadInfo.getHash,
    method: 'post',
    data
  })
}

export function getProvince(startDate, endDate) {
  const data = {
    startDate,
    endDate
  }
  return request({
    url: path.threadInfo.getProvince,
    method: 'post',
    data
  })
}

export function getOrganization(startDate, endDate) {
  const data = {
    startDate,
    endDate
  }
  return request({
    url: path.threadInfo.getOrganization,
    method: 'post',
    data
  })
}

export function getEmail(startDate, endDate) {
  const data = {
    startDate,
    endDate
  }
  return request({
    url: path.threadInfo.getEmail,
    method: 'post',
    data
  })
}

export function getReport(startDate, endDate, aptName, userName, iocs) {
  const data = {
    startDate,
    endDate,
    aptName,
    userName,
    iocs
  }
  return request({
    url: path.threadInfo.reportAddOne,
    method: 'post',
    data
  })
}

export function victimFindAll(page, limit) {
  const data = {
    page,
    limit
  }
  return request({
    url: path.threadInfo.victimFindAll,
    method: 'post',
    data
  })
}
