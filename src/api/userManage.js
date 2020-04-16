import path from '@/assets/js/path'
import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: path.userManage.userList,
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: path.userManage.editUser,
    method: 'post',
    data
  })
}

export function deleteUsers(ids) {
  return request({
    url: path.userManage.deleteUsers,
    method: 'post',
    data: { ids }
  })
}

export function deleteUser(id) {
  return request({
    url: path.userManage.deleteUser,
    method: 'get',
    params: { id }
  })
}

export function addUser(data) {
  return request({
    url: path.userManage.addUser,
    method: 'post',
    data
  })
}

export function getPermissionList(data) {
  return request({
    url: path.userManage.permList,
    method: 'post',
    data
  })
}

export function editPermission(data) {
  return request({
    url: path.userManage.editPerm,
    method: 'post',
    data
  })
}

export function deletePermissions(ids) {
  return request({
    url: path.userManage.deletePerms,
    method: 'post',
    data: { ids }
  })
}

export function deletePermission(id) {
  return request({
    url: path.userManage.deletePerm,
    method: 'get',
    params: { id }
  })
}

export function addPermission(data) {
  return request({
    url: path.userManage.addPerm,
    method: 'post',
    data
  })
}

export function getRoleList(data) {
  return request({
    url: path.userManage.roleList,
    method: 'post',
    data
  })
}

export function editRole(data) {
  return request({
    url: path.userManage.editRole,
    method: 'post',
    data
  })
}

export function deleteRoles(ids) {
  return request({
    url: path.userManage.deleteRoles,
    method: 'post',
    data: { ids }
  })
}

export function deleteRole(id) {
  return request({
    url: path.userManage.deleteRole,
    method: 'get',
    params: { id }
  })
}

export function addRole(data) {
  return request({
    url: path.userManage.addRole,
    method: 'post',
    data
  })
}

export function getMenu(data) {
  return request({
    url: path.userManage.menus,
    method: 'post',
    data
  })
}
