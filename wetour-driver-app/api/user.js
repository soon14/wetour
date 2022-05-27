import {
	requestApi
} from '@/utils/request'
import to from '@/utils/to.js'
import config from "@/config.js"
import store from "@/store/index.js"
// // 旅游页面推荐


//用户基本信息
export function tokenSocial(code) {
	return requestApi({
		url: '/auth/mobile/token/social?grant_type=mobile&mobile=MINI@' + code,
		method: 'POST',
		header: {
			"Authorization": 'Basic dXNlci13ZWNoYXQ6dXNlci13ZWNoYXQ=',
		}
	})
}

//刷新 Token
export function refreshToken(refresh_token) {
	return requestApi({
		url: `/auth/oauth/token?refresh_token=${refresh_token}&scope=server&grant_type=refresh_token`,
		data: {},
		method: "POST",
		header: {
			'isToken': false,
			'TENANT-ID': '1',
			'Authorization': 'Basic d2V0b3VyLXBhcnRuZXItYXBwOndldG91ci1wYXJ0bmVyLWFwcA=='
		},
	})
}

//获取用户
export function getUserInfo() {
	return requestApi({
		url: '/user/my/info',
		method: 'GET'
	})
}

//绑手机号
export function userBindPhone(code) {
	return requestApi({
		url: '/user/my/bind?code=' + code,
		method: 'POST',
	})
}


export function createOrder(data) {
	return requestApi({
		url: '/user/order/info',
		method: 'POST',
		data
	})
}


export function getOrderList(data) {
	return to(
		requestApi({
			url: '/user/order/info/page',
			data: data,
			method: "GET"
		})
	)
}





export function getOrderDetail(id) {
	return requestApi({
		url: `/user/order/info/${id}`,
		method: 'GET',
	})
}

export function getWxPay(orderNo) {
	return requestApi({
		url: `/user/wx/pay/${orderNo}`,
		method: 'GET',
	})
}


export function getNewOrder(data) {
	return requestApi({
		url: '/user/order/info/recent',
		data: data,
		method: "GET"
	})
}
