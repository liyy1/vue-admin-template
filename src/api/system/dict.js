import request from '@/utils/request'

export function queryDict(params) {
  return request({
    url: '/dict/query',
    method: 'get',
    params
  })
}

export function saveDict(params) {
  return request({
    url: '/dict/save',
    method: 'post',
    params
  })
}

export function deleteDict(id) {
  return request({
    url: '/dict/delete',
    method: 'post',
    params: { id }
  })
}

