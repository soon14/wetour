


import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/busadmin/mobileCode/page',
    method: 'get',
    params: query
  })
}
