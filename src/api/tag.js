import request from "@/utils/request";

export function pageTag(data) {
  return request({
    url: "/tag/pageTag",
    method: "GET",
    params: data,
  });
}
export function listTag(data) {
  return request({
    url: "/tag/listTag",
    method: "GET",
    params: data,
  });
}
export function addTag(data) {
  return request({
    url: "/tag/addTag",
    method: "POST",
    data,
  });
}
export function updateTag(data) {
  return request({
    url: "/tag/updateTag",
    method: "POST",
    data,
  });
}
export function deleteTag(tagId) {
  return request({
    url: "/tag/deleteTag",
    method: "POST",
    params: { tagId },
  });
}
