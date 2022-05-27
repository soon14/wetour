import request from '@/router/axios'

// 校验发放优惠券
export function wetourCheckSendCoupon(obj) {  
  return request({
    url: '/wetour/admin/coupon/checkSendCoupon',
    method: 'put',
    data: obj
  })
}

// 发放优惠券
export function wetourSendCoupon(obj) {
  return request({
    url: '/wetour/admin/coupon/sendCoupon',
    method: 'put',
    data: obj
  })
}


