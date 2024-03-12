import request from "@/utils/request";

export function listSysMenu(params) {
  return request({
    url: "/menu/listSysMenu",
    method: "GET",
    params: params,
  });
}
export function addSysMenu(data) {
  return request({
    url: "/menu/addSysMenu",
    method: "POST",
    data,
  });
}
export function updateSysMenu(data) {
  return request({
    url: "/menu/updateSysMenu",
    method: "POST",
    data,
  });
}
export function deleteSysMenu(sysMenuId) {
  return request({
    url: "/menu/deleteSysMenu",
    method: "POST",
    params: { sysMenuId },
  });
}
