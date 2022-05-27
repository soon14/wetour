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
    url: '/busadmin/driverVersion/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/busadmin/driverVersion/addDriverVersion',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/busadmin/driverVersion/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/busadmin/driverVersion/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/busadmin/driverVersion/updateById',
    method: 'post',
    data: obj
  })
}

export function updateStartStatusById(obj) {
  return request({
    url: '/busadmin/driverVersion/updateStartStatusById',
    method: 'get',
    params: obj
  })
}




export function UploadImageApi(formData) {
  return request({
    url: '/admin/sys-file/upload',
    headers: { 'Content-Type': 'multipart/form-data' } ,
    method: 'post',
    data:formData,
    timeout:180000
  })
}
