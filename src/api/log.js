import request from '@/utils/request'

export function pageSysLog(data) {
    return request({
        url: '/log/pageSysLog',
        method: 'GET',
        params: data
    })
}