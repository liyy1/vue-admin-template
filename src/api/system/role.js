import request from '@/utils/request'

export function queryRole() {
  return request({
    url: '/role/query',
    method: 'post'
  })
}
