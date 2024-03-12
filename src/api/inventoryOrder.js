import request from "@/utils/request";

export function pageInventoryOrder(data) {
  return request({
    url: "/inventoryOrder/pageInventoryOrder",
    method: "GET",
    params: data,
  });
}
export function selectInventoryOrderById(inventoryOrderId) {
  return request({
    url: "/inventoryOrder/selectInventoryOrderById",
    method: "GET",
    params: { inventoryOrderId },
  });
}
export function addInventoryOrder(data) {
  return request({
    url: "/inventoryOrder/addInventoryOrder",
    method: "POST",
    data,
  });
}
export function updateInventoryOrder(data) {
  return request({
    url: "/inventoryOrder/updateInventoryOrder",
    method: "POST",
    data,
  });
}
export function deleteInventoryOrder(inventoryOrderId) {
  return request({
    url: "/inventoryOrder/deleteInventoryOrder",
    method: "POST",
    params: { inventoryOrderId },
  });
}
export function auditInventoryOrder(inventoryOrderId) {
  return request({
    url: "/inventoryOrder/auditInventoryOrder",
    method: "POST",
    params: { inventoryOrderId },
  });
}
