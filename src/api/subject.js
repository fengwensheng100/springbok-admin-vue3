import request from "@/utils/request";

export function pageSubject(data) {
  return request({
    url: "/subject/pageSubject",
    method: "GET",
    params: data,
  });
}
export function selectSubjectById(subjectId) {
  return request({
    url: "/subject/selectSubjectById",
    method: "GET",
    params: { subjectId },
  });
}
export function addSubject(data) {
  return request({
    url: "/subject/addSubject",
    method: "POST",
    data,
  });
}
export function updateSubject(data) {
  return request({
    url: "/subject/updateSubject",
    method: "POST",
    data,
  });
}
export function deleteSubject(subjectId) {
  return request({
    url: "/subject/deleteSubject",
    method: "POST",
    params: { subjectId },
  });
}
