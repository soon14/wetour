import {requestApi} from '@/utils/request'
import to from '@/utils/to.js'
//优惠券列表
export function couponList(data) {
	// let entries = Object.entries(data)
	// let url = '/user/activity/coupon/list'
	// entries.forEach((res,index)=>{
	// 	if(index===0){
	// 		url+=`?${res[0]}=${res[1]}`
	// 	}else{
	// 		url+=`&${res[0]}=${res[1]}`
	// 	}
	// })
  return to(requestApi({
		url: '/user/activity/coupon/list',
		data,
		method: 'GET',
	}))
}
//优惠券选择列表
export function couponChoose(data) {
  return requestApi({
		url: '/user/activity/coupon/choose',
		data,
		method: 'GET',
	})
}
//优惠券详情
export function couponDetail(couponId) {
	console.log("ssss",couponId)
	// http://intercity-dev:9999/user/activity/coupon/detail?couponId=128
  return requestApi({
    url: `/user/activity/coupon/detail?couponId=${couponId}`,
    method: 'GET',
	
  });
}
//优惠券活动页
export function couponActivity(activityId) {
  return requestApi({
    url: `/user/activity/${activityId}`,
    method: 'GET',
  });
}
//领取优惠券
export function couponGet(data) {
  return requestApi({
		url: '/user/activity/coupon/receive',
		data: data,
		method: 'POST',
	})
}
//兑换码兑换
export function couponExchange(exchangeKey) {
  return requestApi({
		url: '/user/activity/coupon/exchange',
		data: { exchangeKey },
		method: 'POST',
	})
}