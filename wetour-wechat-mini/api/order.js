import {requestApi} from '@/utils/request'
// 总订单列表
export function orderList(data) {
  return requestApi({
    url: `/wetour/wechat/order/info/page`,
    data: data,
    method: 'GET',
  });
}

// 订单详情
export function orderDetail(id) {
  return requestApi({
    url: `/wetour/wechat/order/info/${id}`,
    data: {},
    method: 'GET',
  });
}
// 取消订单
export function cancelOrder(id) {
  return requestApi({
    url: `/wetour/wechat/order/info/cancel/${id}`,
    data: {},
    method: 'POST',
  });
}



export function createOrderInfo(data) {
  return requestApi({
    url: `/wetour/wechat/order/info`,
    data: data,
    method: 'post',
		// header: {
		// 	"Authorization":'Bearer e17ef890-da8c-4e5d-8f92-8c1f91de5870',
		// }
  });
}


export function getSelectBus(data) {
  return requestApi({
    url: `/wetour/wechat/bus/select/list`,
    data: data,
    method: 'get',
		// header: {
		// 	"Authorization":'Bearer e17ef890-da8c-4e5d-8f92-8c1f91de5870',
		// }
  });
}

export function getSelectAirport(data) {
  return requestApi({
    url: `/wetour/common/airport/select/list`,
    data: data,
    method: 'get',
		// header: {
		// 	"Authorization":'Bearer e17ef890-da8c-4e5d-8f92-8c1f91de5870',
		// }
  });
}

export function getSelectCity(data) {
  return requestApi({
    url: `/wetour/wechat/city/select/list`,
    data: data,
    method: 'get',
		// header: {
		// 	"Authorization":'Bearer e17ef890-da8c-4e5d-8f92-8c1f91de5870',
		// }
  });
}
// 电子围栏
export function getCityDayPriceById(id) {
  return requestApi({
    url: `/wetour/wechat/city/select/getCityDayPriceById/${id}`,
    method: 'get',
		// header: {
		// 	"Authorization":'Bearer e17ef890-da8c-4e5d-8f92-8c1f91de5870',
		// }
  });
}


export function charteredInquiry(data) {
  return requestApi({
    url: `/wetour/wechat/order/charteredInquiry`,
    data: data,
    method: 'post',
		// header: {
		// 	"Authorization":'Bearer e17ef890-da8c-4e5d-8f92-8c1f91de5870',
		// }
  });
}


// 绑定订单
export function bindOrder(data) {
  return requestApi({
    url: `/wetour/wechat/order/info/bind`,
    data: data,
    method: 'POST',
  });
}



//百度地图相关 - 公共端
export function commonMap(url, query) {
  return requestApi({
    url: '/wetour/common/map/' + url,
    method: 'get',
    data: query
  })
}


//高德地图相关 - 公共端
export function commonGmap(keyword) {
  return requestApi({
    url: `/wetour/common/gmap/place/${keyword}`,
    method: 'get',
  })
}



export function getTipOrder() {
  return requestApi({
    url: `/wetour/wechat/order/info/getTipOrder`,
    method: 'get',
  })
}


export function gmapPlace(data) {
  return requestApi({
    url: `/wetour/common/gmap/place`,
    method: 'post',
    data,
  })
}

// 获取最近未出发行程
export function gerRecentOrder(data) {
  return requestApi({
    url: `/wetour/wechat/order/info/getRecentOrder`,
    data: data,
    method: 'get',
  });
}