import request from "@/utils/request";

export function pageSysJob(data) {
  return request({
    url: "/job/pageSysJob",
    method: "GET",
    params: data,
  });
}
export function addSysJob(data) {
  return request({
    url: "/job/addSysJob",
    method: "POST",
    data,
  });
}
export function updateSysJob(data) {
  return request({
    url: "/job/updateSysJob",
    method: "POST",
    data,
  });
}
export function deleteSysJob(sysJobId) {
  return request({
    url: "/job/deleteSysJob",
    method: "POST",
    params: { sysJobId },
  });
}
export function executeOnce(data) {
  return request({
    url: "/job/executeOnce",
    method: "POST",
    data,
  });
}
export function enabledSysJob(sysJobId, status) {
  return request({
    url: "/job/enabledSysJob",
    method: "POST",
    params: { sysJobId, status },
  });
}
