import request from '@/router/axios'

//结算列表
export function accountList(data) {
    return request({
        url: '/wetour/admin/orderinquirysettlerecord/page',
        method: 'get',
        params:data
    })
}
//结算详情
export function accountDetail(id) {
    return request({
        url: `/wetour/admin/orderinquirysettlerecord/${id}`,
        method: 'get',
        params:id
    })
}
//审核通过
export function accountAccept(obj) {
    return request({
      url: '/wetour/admin/orderinquirysettlerecord/acceptSettleRecord',
      method: 'post',
      data: obj
    })
  }

  //审核驳回
export function accountReject(obj) {
    return request({
      url: '/wetour/admin/orderinquirysettlerecord/rejectSettleRecord',
      method: 'post',
      data: obj
    })
  }

  //审核驳回
  export function confirmRemit(id) {
    return request({
      url: `/wetour/admin/orderinquirysettlerecord/confirmRemit/${id}`,
      method: 'post',
      // data: obj
    })
  }
  
