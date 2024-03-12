import request from "@/utils/request";

export function pageSysRole(data) {
  return request({
    url: "/role/pageSysRole",
    method: "GET",
    params: data,
  });
}
export function listSysRole(data) {
  return request({
    url: "/role/listSysRole",
    method: "GET",
    params: data,
  });
}
export function selectSysRoleById(sysRoleId) {
  return request({
    url: "/role/selectSysRoleById",
    method: "GET",
    params: { sysRoleId },
  });
}
export function addSysRole(data) {
  return request({
    url: "/role/addSysRole",
    method: "POST",
    data,
  });
}
export function updateSysRole(data) {
  return request({
    url: "/role/updateSysRole",
    method: "POST",
    data,
  });
}
export function deleteSysRole(sysRoleId) {
  return request({
    url: "/role/deleteSysRole",
    method: "POST",
    params: { sysRoleId },
  });
}
