import request from '@/utils/request'

export function queryMenu(type) {
  return request({
    url: '/menu/query',
    method: 'post',
    params: { type: type }
  })
}

export function saveMenu(params) {
  return request({
    url: '/menu/save',
    method: 'post',
    params
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/delete',
    method: 'post',
    params: { id }
  })
}
