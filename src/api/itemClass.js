import request from '@/utils/request'

export function pageItemClass(data) {
    return request({
        url: '/itemClass/pageItemClass',
        method: 'GET',
        params: data
    })
}
export function addItemClass(data) {
    return request({
        url: '/itemClass/addItemClass',
        method: 'POST',
        data
    })
}
export function updateItemClass(data) {
    return request({
        url: '/itemClass/updateItemClass',
        method: 'POST',
        data
    })
}
export function deleteItemClass(data) {
    return request({
        url: '/itemClass/deleteItemClass',
        method: 'POST',
        data
    })
}