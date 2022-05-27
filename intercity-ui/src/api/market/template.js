import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/webusmarket/admin/coupontemplate/page',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/webusmarket/admin/coupontemplate/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/webusmarket/admin/coupontemplate/saveCouponTemplate',
    method: 'post',
    data: obj
  })
}


export function putObj(obj) {
  return request({
    url: '/webusmarket/admin/coupontemplate/updateTemplateById',
    method: 'put',
    data: obj
  })
}
export function updateStatusById(obj) {
  return request({
    url: '/webusmarket/admin/coupontemplate/updateStatusById',
    method: 'put',
    data: obj
  })
}

export function getCouponSelect(query) {
  return request({
    url: '/webusmarket/admin/coupontemplate/getCouponSelect',
    method: 'get',
    params: query
  })
}


export function getCouponexchangekey(query) {
  return request({
    url: '/webusmarket/admin/couponexchangekey/page',
    method: 'get',
    params: query
  })
}


export function getCouponActivity(templateId) {
  return request({
    url: `/webusmarket/admin/coupontemplate/activity/${templateId}`,
    method: 'get',
  })
}




export function updateActivityById(obj) {
  return request({
    url: '/webusmarket/admin/coupontemplate/updateActivityById',
    method: 'put',
    data: obj
  })
}