import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/webusmarket/admin/usercoupon/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/webusmarket/admin/usercoupon/' + id,
    method: 'get'
  })
}

// export function addObj(obj) {
//   return request({
//     url: '/webusmarket/admin/coupontemplate/saveCouponTemplate',
//     method: 'post',
//     data: obj
//   })
// }


// export function putObj(obj) {
//   return request({
//     url: '/webusmarket/admin/coupontemplate/updateTemplateById',
//     method: 'put',
//     data: obj
//   })
// }