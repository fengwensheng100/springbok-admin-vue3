import request from "@/utils/request";

export function pageDictValue(data) {
  return request({
    url: "/dictValue/pageDictValue",
    method: "GET",
    params: data,
  });
}
export function listDictValueByDictCode(dictCode) {
  return request({
    url: "/dictValue/listDictValueByDictCode",
    method: "GET",
    params: { dictCode: dictCode },
  });
}
export function addDictValue(data) {
  return request({
    url: "/dictValue/addDictValue",
    method: "POST",
    data,
  });
}
export function updateDictValue(data) {
  return request({
    url: "/dictValue/updateDictValue",
    method: "POST",
    data,
  });
}
export function deleteDictValue(dictValueId) {
  return request({
    url: "/dictValue/deleteDictValue",
    method: "POST",
    params: { dictValueId },
  });
}
