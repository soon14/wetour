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
    url: '/wetour/admin/cityCn/getCityCnPage',
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
    url: '/wetour/admin/cityCn/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/wetour/admin/cityCn/' + id,
    method: 'delete'
  })
}

export function editObj(obj) {
  return request({
    url: '/wetour/admin/cityCn/updateCityConfig',
    method: 'post',
    data: obj
  })
}



export function createObj(obj) {
  return request({
    url: '/wetour/admin/cityCn/insertCityAllConfig',
    method: 'post',
    data: obj
  })
}
export function countryList(query) {
  return request({
    url: '/wetour/admin/cityCn/getCountrySelect',
    method: 'get',
    params: query
  })
}


export function getCountrySelect() {
  return request({
    url: '/wetour/admin/cityCn/getCountrySelect',
    method: 'get'
  })
}


export function checkCityName(query) {
  return request({
    url: '/wetour/admin/cityCn/checkCityName',
    method: 'get',
    params: query
  })
}


export function gmapPlace(data) {
  return request({
    url: `/wetour/common/gmap/place`,
    method: 'post',
    data,
  })
}

