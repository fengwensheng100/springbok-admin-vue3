import request from "@/utils/request";

export function pageBanner(data) {
  return request({
    url: "/banner/pageBanner",
    method: "GET",
    params: data,
  });
}
export function selectBannerById(bannerId) {
  return request({
    url: "/banner/selectBannerById",
    method: "GET",
    params: { bannerId },
  });
}
export function addBanner(data) {
  return request({
    url: "/banner/addBanner",
    method: "POST",
    data,
  });
}
export function updateBanner(data) {
  return request({
    url: "/banner/updateBanner",
    method: "POST",
    data,
  });
}
export function deleteBanner(bannerId) {
  return request({
    url: "/banner/deleteBanner",
    method: "POST",
    params: { bannerId },
  });
}
