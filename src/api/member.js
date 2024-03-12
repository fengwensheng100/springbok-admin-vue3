import request from '@/utils/request'

export function pageMember(data) {
    return request({
        url: '/member/pageMember',
        method: 'GET',
        params: data
    })
}
export function selectMemberById(data) {
    return request({
        url: '/member/selectMemberById',
        method: 'GET',
        params: data
    })
}