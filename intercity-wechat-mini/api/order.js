import {requestApi} from '@/utils/request'
// 总订单列表
export function orderList(data) {
  return requestApi({
    url: `/order`,
    data: data,
    method: 'GET',
  });
}

// 报名-订单状态查询(迭代)
export function orderState(id) {
  return requestApi({
    url: `/school/v1/signup/order_state/${id}`,
    data: {},
    method: 'GET',
  });
}