import request from '@/utils/request'

export function pageSysJobLog(data) {
    return request({
        url: '/jobLog/pageSysJobLog',
        method: 'GET',
        params: data
    })
}
