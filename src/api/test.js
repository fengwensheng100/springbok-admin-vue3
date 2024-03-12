import request from "@/utils/request";

export function pageTest(data) {
  return request({
    url: "/test/pageTest",
    method: "GET",
    params: data,
  });
}