import path from '@/assets/js/path'
import request from '@/utils/request'

export function getStatistic(data) {
  return request({
    url: path.dashboard.statistic,
    method: 'post',
    data
  })
}
