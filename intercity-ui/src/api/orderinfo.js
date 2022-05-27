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

export function fetchList(query) {
  return request({
    url: '/busadmin/order/info/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/busadmin/order/info',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/busadmin/order/info/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/busadmin/order/info/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/busadmin/order/info',
    method: 'put',
    data: obj
  })
}



export function getBusInLine(lineId) {
  return request({
    url: `/busadmin/line/selectBusInLine/${lineId}`,
    method: 'get',
  })
}


export function orderDispatch(data) {
  return request({
    url: '/busadmin/order/dispatch',
    method: 'post',
    data: data
  })
}

export function getOrderDispatch(query) {
  return request({
    url: '/busadmin/order/dispatch/page',
    method: 'get',
    params: query
  })
}



export function getOrderSeatCount(query) {
  return request({
    url: '/busadmin/order/dispatch/seatCount',
    method: 'get',
    params: query
  })
}





export function orderRefund(data) {
  return request({
    url: '/busadmin/order/refund',
    method: 'post',
    data: data
  })
}

export function getOrderRefund(query) {
  return request({
    url: '/busadmin/order/refund/page',
    method: 'get',
    params: query
  })
}




//更新订单状态为已完成验票状态为已到达
export function updateCompleted(id) {
  return request({
    url: '/busadmin/order/info/updateCompleted/' + id,
    method: 'post',
  })
}


//更新订单状态为出行中验票状态为已上车已验票
export function updateTraveling(id) {
  return request({
    url: '/busadmin/order/info/updateTraveling/' + id,
    method: 'post',
  })
}


