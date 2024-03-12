import request from '@/utils/request'

export function listSpecValueBySpecIds(ids) {
    return request({
        url: '/specValue/listSpecValueBySpecIds',
        method: 'GET',
        params: {propertyIds:ids}
    })
}
