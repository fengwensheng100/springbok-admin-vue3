import request from "@/utils/request";

export function pageSysApp(data) {
  return request({
    url: "/app/pageSysApp",
    method: "GET",
    params: data,
  });
}
export function addSysApp(data) {
  return request({
    url: "/app/addSysApp",
    method: "POST",
    data,
  });
}
export function updateSysApp(data) {
  return request({
    url: "/app/updateSysApp",
    method: "POST",
    data,
  });
}
export function deleteSysApp(id) {
  return request({
    url: "/app/deleteSysApp",
    method: "POST",
    params: { sysAppId: id },
  });
}
