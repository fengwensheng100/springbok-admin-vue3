import request from '@/utils/request'

export function pageItemSaleSku(data) {
    return request({
        url: '/itemSaleSku/pageItemSaleSku',
        method: 'GET',
        params: data
    })
}