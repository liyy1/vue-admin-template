import request from '@/utils/request'

export function query(params) {
  return request({
    url: '/user/query',
    method: 'get',
    params
  })
}

export function saveUser(params) {
  return request({
    url: '/user/save',
    method: 'post',
    params
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete',
    method: 'post',
    params: { id }
  })
}
