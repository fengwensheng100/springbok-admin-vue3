import request from "@/utils/request";

export function pageSysPost(data) {
  return request({
    url: "/post/pageSysPost",
    method: "GET",
    params: data,
  });
}
export function listSysPost(data) {
  return request({
    url: "/post/listSysPost",
    method: "GET",
    params: data,
  });
}
export function selectSysPostById(sysPostId) {
  return request({
    url: "/post/selectSysPostById",
    method: "GET",
    params: { sysPostId },
  });
}
export function addSysPost(data) {
  return request({
    url: "/post/addSysPost",
    method: "POST",
    data,
  });
}
export function updateSysPost(data) {
  return request({
    url: "/post/updateSysPost",
    method: "POST",
    data,
  });
}
export function deleteSysPost(sysPostId) {
  return request({
    url: "/post/deleteSysPost",
    method: "POST",
    params: { sysPostId },
  });
}
