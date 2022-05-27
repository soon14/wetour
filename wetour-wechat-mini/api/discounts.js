import {
	requestApi
} from '@/utils/request'


// 优惠券活动页面
export function couponActivity(activityId) {
	return requestApi({
		url: `/wetour/wechat/activity/${activityId}`,
		method: "GET",
		data: {},
	})
}

// 优惠券选择
export function couponChoose(data) {
	return requestApi({
		url: `/wetour/wechat/activity/coupon/choose`,
		method: "GET",
		data: data,
	})
}

// 优惠券详情
export function couponDetail(couponId) {
	return requestApi({
		url: `/wetour/wechat/activity/coupon/detail`,
		method: "GET",
		data: { couponId },
	})
}


// 兑换码兑换
export function couponExchange(exchangeKey) {
	return requestApi({
		url: `/wetour/wechat/activity/coupon/exchange`,
		method: "POST",
		data: { exchangeKey },
	})
}

// 优惠券列表
export function couponList(data) {
	return requestApi({
		url: `/wetour/wechat/activity/coupon/list`,
		method: "GET",
		data: data,
	})
}

// 领取优惠券
export function couponReceive(data) {
	return requestApi({
		url: `/wetour/wechat/activity/coupon/receive`,
		method: "POST",
		data: data,
	})
}


