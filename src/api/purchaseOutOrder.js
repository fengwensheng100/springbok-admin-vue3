import request from "@/utils/request";

export function pagePurchaseOutOrder(data) {
  return request({
    url: "/purchaseOutOrder/pagePurchaseOutOrder",
    method: "GET",
    params: data,
  });
}
export function selectPurchaseOutOrderById(purchaseOutOrderId) {
  return request({
    url: "/purchaseOutOrder/selectPurchaseOutOrderById",
    method: "GET",
    params: { purchaseOutOrderId },
  });
}
export function addPurchaseOutOrder(data) {
  return request({
    url: "/purchaseOutOrder/addPurchaseOutOrder",
    method: "POST",
    data,
  });
}
export function updatePurchaseOutOrder(data) {
  return request({
    url: "/purchaseOutOrder/updatePurchaseOutOrder",
    method: "POST",
    data,
  });
}
export function deletePurchaseOutOrder(purchaseOutOrderId) {
  return request({
    url: "/purchaseOutOrder/deletePurchaseOutOrder",
    method: "POST",
    params: { purchaseOutOrderId },
  });
}
export function auditPurchaseOutOrder(purchaseOutOrderId) {
  return request({
    url: "/purchaseOutOrder/auditPurchaseOutOrder",
    method: "POST",
    params: { purchaseOutOrderId },
  });
}
