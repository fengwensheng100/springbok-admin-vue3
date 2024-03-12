import request from "@/utils/request";

export function pageItemSaleClass(data) {
  return request({
    url: "/itemSaleClass/pageItemSaleClass",
    method: "GET",
    params: data,
  });
}
export function listItemSaleClass(data) {
  return request({
    url: "/itemSaleClass/listItemSaleClass",
    method: "GET",
    params: data,
  });
}
export function addItemSaleClass(data) {
  return request({
    url: "/itemSaleClass/addItemSaleClass",
    method: "POST",
    data,
  });
}
export function updateItemSaleClass(data) {
  return request({
    url: "/itemSaleClass/updateItemSaleClass",
    method: "POST",
    data,
  });
}
export function deleteItemSaleClass(itemSaleClassId) {
  return request({
    url: "/itemSaleClass/deleteItemSaleClass",
    method: "POST",
    params: { itemSaleClassId },
  });
}
