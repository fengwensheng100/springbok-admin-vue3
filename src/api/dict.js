import request from "@/utils/request";

export function pageDict(data) {
  return request({
    url: "/dict/pageDict",
    method: "GET",
    params: data,
  });
}
export function addDict(data) {
  return request({
    url: "/dict/addDict",
    method: "POST",
    data,
  });
}
export function updateDict(data) {
  return request({
    url: "/dict/updateDict",
    method: "POST",
    data,
  });
}
export function deleteDict(dictId) {
  return request({
    url: "/dict/deleteDict",
    method: "POST",
    params: { dictId },
  });
}
