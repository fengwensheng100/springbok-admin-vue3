import request from "@/utils/request";

export function statistics() {
  return request({
    url: "/index/statistics",
    method: "GET",
  });
}
