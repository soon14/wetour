/*
 *    Copyright (c) 2018-2025, intercity All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: intercity
 */

import request from '@/router/axios'

//分页查询
export function orderInfoPage(query) {
  return request({
    url: '/wetour/admin/order/info/page',
    method: 'get',
    params: query
  })
}

//通过 id 查询
export function orderInfo(id) {
  return request({
    url: '/wetour/admin/order/info/' + id,
    method: 'get',
  })
}



export function fetchList(query) {
  return request({
    url: '/wetour/admin/order/charteredInquiry/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/wetour/admin/cityCn',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/wetour/admin/order/charteredInquiry/' + id,
    method: 'get'
  })
}

// export function delObj(id) {
//   return request({
//     url: '/wetour/admin/cityCn/' + id,
//     method: 'delete'
//   })
// }

// export function editObj(obj) {
//   return request({
//     url: '/wetour/admin/cityCn/updateCityConfig',
//     method: 'post',
//     data: obj
//   })
// }


export function visit(obj) {
  return request({
    url: '/wetour/admin/order/charteredInquiry/visit',
    method: 'post',
    data: obj
  })
}


//派单详情
export function orderinquiry(id) {
  return request({
    url: '/wetour/admin/orderinquiry/' + id,
    method: 'get',
  })
}

//批量询价
export function orderinquiryBatchInquiry(data) {
  return request({
    url: '/wetour/admin/orderinquiry/batchInquiry',
    method: 'post',
    data: data
  })
}

//派单
export function orderinquiryDispatchOrder(data) {
  return request({
    url: '/wetour/admin/orderinquiry/dispatchOrder',
    method: 'post',
    data: data
  })
}


//获取订单关联的询价单列表
export function orderinquiryListByOrderNo(orderNo) {
  return request({
    url: '/wetour/admin/orderinquiry/listByOrderNo/' + orderNo,
    method: 'get',
  })
}


//分页查询用车订单列表
export function orderinquiryListOrderInfoByPage(query) {
  return request({
    url: '/wetour/admin/orderinquiry/listOrderInfoByPage',
    method: 'get',
    params: query
  })
}

//查询询价单列表
export function orderinquiryListOrderInquiry(query) {
  return request({
    url: '/wetour/admin/orderinquiry/listOrderInquiry',
    method: 'get',
    params: query
  })
}

//派单
export function orderinquiryStopDispatch(data) {
  return request({
    url: '/wetour/admin/orderinquiry/stopDispatch',
    method: 'post',
    data: data
  })
}



// 取消订单
export function orderCancel(data) {
  return request({
    url: '/wetour/admin/order/info/cancel',
    method: 'post',
    data: data
  })
}


// 城市选择
export function cityCnSelect() {
  return request({
    url: '/wetour/admin/cityCn/select',
    method: 'get'
  })
}

//后台创建订单
export function addOrderInfo(data) {
  return request({
    url: '/wetour/admin/order/info',
    method: 'post',
    data: data
  })
}

//百度地图相关 - 公共端
export function commonMap(url, query) {
  return request({
    url: '/wetour/common/map/' + url,
    method: 'get',
    params: query
  })
}

//google地图相关 - 公共端
export function googleMap(data) {
  return request({
    url: '/wetour/common/gmap/place',
    method: 'post',
    data: data
  })
}


//机场
export function airportList() {
  return request({
    url: '/wetour/common/airport/select/list',
    method: 'get',
  })
}



// 退款订单
export function orderRefund(data) {
  return request({
    url: '/wetour/admin/order/refund',
    method: 'post',
    data: data
  })
}


// 编辑订单
export function updateOrder(data) {
  return request({
    url: '/wetour/admin/order/info/updateOrder',
    method: 'post',
    data: data
  })
}

//官网列表
export function siteList(data) {
  return request({
    url: '/wetour/admin/site/feedback/page',
    method: 'get',
    params:data
  })
}

//官网详情
export function siteDetail(id) {
  return request({
    url: `/wetour/admin/site/feedback/${id}`,
    method: 'get',
  })
}

// 官网回访
export function siteVisit(data) {
  return request({
    url: '/wetour/admin/site/feedback/visit',
    method: 'post',
    data: data
  })
}



