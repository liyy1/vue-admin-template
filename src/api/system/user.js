import request from '@/utils/request'

export function queryUser(params) {
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

export function deleteUser(id, tag) {
  return request({
    url: '/user/delete',
    method: 'post',
    params: { id, tag }
  })
}

export function queryDept() {
  return request({
    url: '/dept/query',
    method: 'post'
  })
}

export function saveDept(params) {
  return request({
    url: '/dept/save',
    method: 'post',
    params
  })
}

export function deleteDept(id) {
  return request({
    url: '/dept/delete',
    method: 'post',
    params: { id }
  })
}
