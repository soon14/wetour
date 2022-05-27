import {requestApi} from '@/utils/request'
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
			"Authorization":'Basic d2V0b3VyLXVzZXItd2VjaGF0OndldG91ci11c2VyLXdlY2hhdA==',
		}
  })
}



//获取用户
export function getUserInfo() {
  return requestApi({
    url: '/wetour/wechat/my/info',
    method: 'GET'
  })
}

//绑手机号
export function userBindPhone(code) {
  return requestApi({
    url: '/wetour/wechat/my/bind?code='+code,
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
	return  requestApi({
	  url: '/user/order/info/recent',
	  data: data,
	  method: "GET"
	})
}

