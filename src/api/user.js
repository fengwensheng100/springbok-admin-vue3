import request from "@/utils/request";

export function pageSysUser(data) {
  return request({
    url: "/user/pageSysUser",
    method: "GET",
    params: data,
  });
}
export function listSysMenuByUser() {
  return request({
    url: "/user/listSysMenuByUser",
    method: "GET",
  });
}
export function addSysUser(data) {
  return request({
    url: "/user/addSysUser",
    method: "POST",
    data,
  });
}
export function updateSysUser(data) {
  return request({
    url: "/user/updateSysUser",
    method: "POST",
    data,
  });
}
export function deleteSysUser(sysUserId) {
  return request({
    url: "/user/deleteSysUser",
    method: "POST",
    params: { sysUserId },
  });
}
