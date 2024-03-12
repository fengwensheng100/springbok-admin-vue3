import request from "@/utils/request";

export function pageSpec(data) {
  return request({
    url: "/spec/pageSpec",
    method: "GET",
    params: data,
  });
}
export function selectSpecById(specId) {
  return request({
    url: "/spec/selectSpecById",
    method: "GET",
    params: { specId },
  });
}
export function selectSpecByIds(ids) {
  return request({
    url: "/spec/selectSpecByIds",
    method: "GET",
    params: { ids: ids },
  });
}
export function addSpec(data) {
  return request({
    url: "/spec/addSpec",
    method: "POST",
    data,
  });
}
export function updateSpec(data) {
  return request({
    url: "/spec/updateSpec",
    method: "POST",
    data,
  });
}
export function deleteSpec(specId) {
  return request({
    url: "/spec/deleteSpec",
    method: "POST",
    params: { specId },
  });
}
