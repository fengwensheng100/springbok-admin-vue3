import request from '@/utils/request'

export function pageStock(data) {
    return request({
        url: '/stock/pageStock',
        method: 'GET',
        params: data
    })
}
export function pageStockLine(data) {
    return request({
        url: '/stock/pageStockLine',
        method: 'GET',
        params: data
    })
}