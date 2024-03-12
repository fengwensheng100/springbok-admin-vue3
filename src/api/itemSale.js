import request from "@/utils/request";

export function pageItemSale(data) {
  return request({
    url: "/itemSale/pageItemSale",
    method: "GET",
    params: data,
  });
}
export function selectItemSaleById(id) {
  return request({
    url: "/itemSale/selectItemSaleById",
    method: "GET",
    params: { itemSaleId: id },
  });
}
export function addItemSale(data) {
  return request({
    url: "/itemSale/addItemSale",
    method: "POST",
    data,
  });
}
export function updateItemSale(data) {
  return request({
    url: "/itemSale/updateItemSale",
    method: "POST",
    data,
  });
}
export function deleteItemSale(itemSaleId) {
  return request({
    url: "/itemSale/deleteItemSale",
    method: "POST",
    params: { itemSaleId },
  });
}
