import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role/getRoles',
    method: 'get'
  })
}

export function queryRole(params) {
  return request({
    url: '/role/query',
    method: 'get',
    params
  })
}

export function saveRole(params) {
  return request({
    url: '/role/save',
    method: 'post',
    data: params
  })
}

export function deleteRole(id, tag) {
  return request({
    url: '/role/delete',
    method: 'get',
    params: { id, tag }
  })
}

export function getRights(roleId) {
  return request({
    url: '/role/getRights',
    method: 'get',
    params: { roleId }
  })
}

export function saveRights(roleId, menus) {
  return request({
    url: '/role/saveRights',
    method: 'post',
    data: { roleId: roleId, menus: menus }
  })
}

