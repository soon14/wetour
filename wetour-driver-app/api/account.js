import {
	requestApi
} from '@/utils/request'
import to from '@/utils/to.js'
import config from "@/config.js"
import store from "@/store/index.js"

/**
 * 结算金额统计信息
 */
export function getSettleInfo() {
	return requestApi({
		url: `/wetour/app/orderinquirysettlerecord/getSettleInfo`,
		method: "GET",
		data: {},
	})
}

/**
 * 结算审核记录详情
 * @param {Object} id 结算审核记录主键ID
 */
export function getSettleRecordById(id) {
	return requestApi({
		url: `/wetour/app/orderinquirysettlerecord/getSettleRecordById/${id}`,
		method: "GET",
		data: {},
	})
}

/**
 * 新增结算审核记录
 * @param {Object} bankName 开户行
 * @param {Object} bankOwnerName 持卡人姓名
 * @param {Object} invoiceImage 发票图片，多张以逗号隔开 
 *    @param {Object} inquiryId 询价单主键ID
 *    @param {Object} orderNo 订单编号
 * @param {Object} settleAccount 申请结算的订单信息
 * @param {Object} settleType 结算方式，1=大陆银行卡，2=zelle，3=支付宝，4=微信
 * @param {Object} zelleName Zelle认证的姓名
 */
export function insertSettleRecord(data) {
	return requestApi({
		url: `/wetour/app/orderinquirysettlerecord/insertSettleRecord`,
		method: "post",
		data: data,
	})
}

/**
 * 分页获取结算审核记录列表
 * @param {Object} size
 * @param {Object} current 
 */
export function listSettleRecord(data) {
	return requestApi({
		url: `/wetour/app/orderinquirysettlerecord/listSettleRecord`,
		method: "GET",
		data: data,
	})
}

/**
 * 待结算订单列表
 * @param {Object} size
 * @param {Object} current 
 */
export function listWaitSettle(data) {
	return requestApi({
		url: `/wetour/app/orderinquirysettlerecord/listWaitSettle`,
		method: "GET",
		data: data,
	})
}
