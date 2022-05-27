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
    url: '/busadmin/line/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/busadmin/line',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/busadmin/line/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/busadmin/line/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/busadmin/line',
    method: 'put',
    data: obj
  })
}

export function updateInfoObj(obj) {
  return request({
    url: '/busadmin/line/updateBaseInfo',
    method: 'put',
    data: obj
  })
}


export function getLineIdAndName(query) {
  return request({
    url: '/busadmin/line/getLineIdAndName',
    method: 'get',
    params: query
  })
}


export function getInOrderBusId(id) {
  return request({
    url: `/busadmin/line/getInOrderBusId/${id}`,
    method: 'get',
  })
}




export function getCitySelect(query) {
  return request({
    url: '/busadmin/line/getCitySelect',
    method: 'get',
    params: query
  })
}

export function getLineSelect(query) {
  return request({
    url: '/busadmin/line/getLineSelect',
    method: 'get',
    params: query
  })
}