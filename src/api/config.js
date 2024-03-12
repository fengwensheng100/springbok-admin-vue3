import request from "@/utils/request";

export function listSysConfig() {
  return request({
    url: "/config/listSysConfig",
    method: "GET",
  });
}
export function selectSysConfigByKey(configKey) {
  return request({
    url: "/config/selectSysConfigByKey",
    method: "GET",
    params: { configKey },
  });
}
export function updateSysConfig(data) {
  return request({
    url: "/config/updateSysConfig",
    method: "POST",
    data: data,
  });
}
