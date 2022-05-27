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
    url: '/wetour/admin/driver/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/wetour/admin/driver',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/wetour/admin/driver/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/wetour/admin/driver/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/wetour/admin/driver',
    method: 'put',
    data: obj
  })
}


export function fetchAppleList(query) {
  return request({
    url: '/wetour/admin/driverApply/page',
    // url: '/busadmin/driver/page',
    method: 'get',
    params: query
  })
}


export function getAppleObj(id) {
  return request({
    url: '/wetour/admin/driverApply/' + id,
    method: 'get'
  })
}



export function putAppleObj(obj) {
  return request({
    url: '/wetour/admin/driverApply/updateById',
    method: 'put',
    data: obj
  })
}