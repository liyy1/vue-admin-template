import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/query',
    method: 'get',
    params
  })
}
