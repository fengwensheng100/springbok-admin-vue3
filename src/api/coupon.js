import request from "@/utils/request";

export function pageCoupon(data) {
  return request({
    url: "/coupon/pageCoupon",
    method: "GET",
    params: data,
  });
}
export function selectCouponById(couponId) {
  return request({
    url: "/coupon/selectCouponById",
    method: "GET",
    params: { couponId },
  });
}
export function addCoupon(data) {
  return request({
    url: "/coupon/addCoupon",
    method: "POST",
    data,
  });
}
export function updateCoupon(data) {
  return request({
    url: "/coupon/updateCoupon",
    method: "POST",
    data,
  });
}
export function deleteCoupon(couponId) {
  return request({
    url: "/coupon/deleteCoupon",
    method: "POST",
    params: { couponId },
  });
}
