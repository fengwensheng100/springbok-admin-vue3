import request from "@/utils/request";

export function pageSaleOrder(data) {
  return request({
    url: "/saleOrder/pageSaleOrder",
    method: "GET",
    params: data,
  });
}
export function selectSaleOrderById(id) {
  return request({
    url: "/saleOrder/selectSaleOrderById?id=" + id,
    method: "GET",
  });
}
export function deliverSaleOrder(id) {
  return request({
    url: "/saleOrder/deliverSaleOrder?id=" + id,
    method: "POST",
  });
}
