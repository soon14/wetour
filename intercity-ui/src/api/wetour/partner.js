import request from '@/router/axios'


export function partnerPageList(query) {
    return request({
        url: '/wetour/admin/partner/page',
        method: 'get',
        params: query
    })
}

export function partnerDetail(id) {
    return request({
        url: '/wetour/admin/partner/' + id,
        method: 'get'
    })
}

//禁用
export function partnerDisable(id, reason) {
    return request({
        url: '/wetour/admin/partner/disable/' + id + "/" + reason,
        method: 'post'
    })
}

//启用
export function partnerEnable(id) {
    return request({
        url: '/wetour/admin/partner/enable/' + id,
        method: 'post'
    })
}

