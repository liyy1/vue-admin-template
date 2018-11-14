import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/list',
    method: 'get',
    params
  })
}
