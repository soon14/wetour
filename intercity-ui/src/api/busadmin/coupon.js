import request from '@/router/axios'

// 校验发放优惠券
export function busCheckSendCoupon(obj) {  
  return request({
    url: '/busadmin/coupon/checkSendCoupon',
    method: 'put',
    data: obj
  })
}

// 发放优惠券
export function busSendCoupon(obj) {
  return request({
    url: '/busadmin/coupon/sendCoupon',
    method: 'put',
    data: obj
  })
}


