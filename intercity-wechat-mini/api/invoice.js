import {requestApi} from '@/utils/request'
//开票管理-可开票记录
export function invoicelist() {
  return requestApi({
    url: `/invoice/list`,
    data: {},
    method: "GET"
  })
}
//开票管理-新增开票
export function invoiceadd(data) {
  return requestApi({
    url: `/invoice/store`,
    data: data,
    method: "POST"
  })
}
//开票管理-开票历史
export function invoicehistory(data) {
  return requestApi({
    url: `/invoice/history`,
    data: data,
    method: "GET"
  })
}
//开票管理-开票详情
export function invoicedetail(data) {
  return requestApi({
    url: `/invoice/detail`,
    data: data,
    method: "GET"
  })
}