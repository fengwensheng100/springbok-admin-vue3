import request from "@/utils/request";

export function pagePurchaseInOrder(data) {
  return request({
    url: "/purchaseInOrder/pagePurchaseInOrder",
    method: "GET",
    params: data,
  });
}
export function selectPurchaseInOrderById(purchaseInOrderId) {
  return request({
    url: "/purchaseInOrder/selectPurchaseInOrderById",
    method: "GET",
    params: { purchaseInOrderId },
  });
}
export function addPurchaseInOrder(data) {
  return request({
    url: "/purchaseInOrder/addPurchaseInOrder",
    method: "POST",
    data,
  });
}
export function updatePurchaseInOrder(data) {
  return request({
    url: "/purchaseInOrder/updatePurchaseInOrder",
    method: "POST",
    data,
  });
}
export function deletePurchaseInOrder(purchaseInOrderId) {
  return request({
    url: "/purchaseInOrder/deletePurchaseInOrder",
    method: "POST",
    params: { purchaseInOrderId },
  });
}
export function auditPurchaseInOrder(purchaseInOrderId) {
  return request({
    url: "/purchaseInOrder/auditPurchaseInOrder",
    method: "POST",
    params: { purchaseInOrderId },
  });
}
