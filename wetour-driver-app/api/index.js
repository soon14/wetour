import {
	requestApi
} from '@/utils/request'
import to from '@/utils/to.js'
import config from "@/config.js"
import store from "@/store/index.js"

/**
 * 询价单详情
 * @param {Object} id 询价单主键ID
 */
export function orderinquiry(id) {
	return requestApi({
		url: `/wetour/app/orderinquiry/${id}`,
		method: "GET",
		data: {},
	})
}

/**
 * 开始服务
 * @param {Object} data 
 */

export function beginService(id) {
	return requestApi({
		url: `/wetour/app/orderinquiry/beginService`,
		method: "post",
		data: {
			id
		},
	})
}

/**
 * 绑定司机车辆
 * @param {Object} data 
 * @param busId	    车辆ID
 * @param driverId	司机ID
 * @param busType	车型, 几座对应几
 * @param id        询价单主键ID
 * 
 */
export function bindInquiry(data) {
	return requestApi({
		url: `/wetour/app/orderinquiry/bindInquiry`,
		method: "post",
		data: data,
	})
}

/**
 * 修改绑定司机车辆
 * @param {Object} data 
 * @param busDriverId	   绑定的司机车辆主键ID
 * @param busId	           车辆ID
 * @param driverId	       司机ID
 * @param busType          车型, 几座对应几
 * 
 */
export function updateBindInquiry(data) {
	return requestApi({
		url: `/wetour/app/orderinquiry/updateBindInquiry`,
		method: "post",
		data: data,
	})
}


/**
 * 结束服务
 * @param {Object} id 询价单主键ID
 * @param {Object} orderNo 订单编号
 * 
 */
export function finishService(data) {
	return requestApi({
		url: `/wetour/app/orderinquiry/finishService`,
		method: "post",
		data: data,
	})
}

/**
 * 我的页面查询询价单
 * @param {Object} size
 * @param {Object} current 
 * @param {Object} queryStatus 查询状态，0=全部，10=已报价，20=已服务，30=已失效
 * 
 */
export function listOrderInquiryForMine(data) {
	return requestApi({
		url: `/wetour/app/orderinquiry/listOrderInquiryForMine`,
		method: "get",
		data: data,
	})
}


/**
 * 工作台查询询价单
 * @param {Object} size
 * @param {Object} current 
 * @param {Object} queryStatus 查询状态，10=待报价，20=待服务，30=服务中
 * 
 */
export function listOrderInquiryForWork(data) {
	return requestApi({
		url: `/wetour/app/orderinquiry/listOrderInquiryForWork`,
		method: "get",
		data: data,
	})
}

/**
 * 提交报价或拒绝报价
 * @param {Object} id          询价单主键ID
 * @param {Object} quoteAmount 报价
 * @param {Object} quoteStatus 是否报价，0=拒绝报价，1=提交报价
 * @param {Object} rejectQuoteReason 拒绝接单原因
 * 
 */
export function quoteInquiry(data) {
	return requestApi({
		url: `/wetour/app/orderinquiry/quoteInquiry`,
		method: "post",
		data: data,
	})
}

/**
 * 下拉选查询司机列表
 */
export function getDriverSelect() {
	return requestApi({
		url: `/wetour/app/driver/getDriverSelect`,
		method: "get",
		data: {},
	})
}

/**
 * 下拉选查询车辆列表
 */
export function getBusSelect() {
	return requestApi({
		url: `/wetour/app/bus/getBusSelect`,
		method: "get",
		data: {},
	})
}
