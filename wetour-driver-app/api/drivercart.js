import {
	requestApi
} from '@/utils/request'
import to from '@/utils/to.js'
import config from "@/config.js"
import store from "@/store/index.js"

//                                          司机审核记录管理

/**
 * 通过id查询司机审核记录
 * @param {Object} id 司机审核记录主键id
 */
export function driverApply(id) {
	return requestApi({
		url: `/wetour/app/driverApply/${id}`,
		method: "GET",
		data: {},
	})

}

/**
 * 分页查询司机审核记录
 * @param {Object} data
 * countId 司机id
 * current 当前页
 */
export function driverApplyPage(data) {
	return requestApi({
		url: '/wetour/app/driverApply/page',
		method: "GET",
		data: data
	})

}


/**
 * 新增司机审核记录
 * @param {Object} data
 * driverImage          个人照片
 * driverLicenseExpired 驾照过期日期 (年-月-日 时:分:秒)
 * driverLicenseImage   驾驶证照片
 * driverName           司机姓名
 * gender               性别 1男 2女
 * identificationImage  身份证护照照片
 * mobile               司机手机
 * weixin               微信号
 */
export function driverApplySave(data) {
	return requestApi({
		url: '/wetour/app/driverApply/save',
		method: "POST",
		data: data
	})

}

/**
 * 修改司机信息并提交审核
 * @param {Object} data
 * driverImage          个人照片
 * driverLicenseExpired 驾照过期日期 (年-月-日 时:分:秒)
 * driverLicenseImage   驾驶证照片
 * driverName           司机姓名
 * id                   司机主键id
 * identificationImage  身份证护照照片
 * weixin               微信号
 */
export function driverApplyUpdateById(data) {
	return requestApi({
		url: '/wetour/app/driverApply/updateById',
		method: "PUT",
		data: data
	})

}



//                                        司机管理接口


/**
 * 通过id查询司机
 * @param {Object} id    司机主键id
 */
export function driver(id) {
	return requestApi({
		
		url: `/wetour/app/driver/${id}`,
		method: "GET",
		data: {}
	})

}

/**
 * 分页查询司机列表
 * @param {Object} data    
 * countId         司机id
 * current         当前页
 */
export function driverPage(data) {
	return requestApi({
		url: '/wetour/app/driver/page',
		method: "GET",
		data: data
	})

}


/**
 * 更新司机状态
 * @param {Object} data    
 * driverStatus    司机状态0禁用1启用
 * id              司机主键id
 */
export function driverUpdateStatusById(data) {
	return requestApi({
		url: '/wetour/app/driver/updateStatusById',
		method: "GET",
		data: data
	})
}

//                                        车辆审核记录管理


/**
 * 通过id查询车辆审核记录
 * @param {Object} id    车辆审核记录主键id
 */
export function busApply(id) {
	return requestApi({
		url: `/wetour/app/busApply/${id}`,
		method: "GET",
		data: {}
	})
}

/**
 * 查询车型列表
 * @param {Object} data  
 */
export function busApplylistBusType() {
	return requestApi({
		url: '/wetour/app/busApply/listBusType',
		method: "GET",
		data: {}
	})
}



/**
 * 分页查询车辆审核记录
 * @param {Object} data  
 * countId         司机id
 * current         当前页
 */
export function busApplyPage(data) {
	return requestApi({
		url: '/wetour/app/busApply/page',
		method: "GET",
		data: data
	})

}

/**
 * 新增车辆审核记录
 * @param {Object} data  
 * brand             品牌
 * busImage          车辆照片
 *   headImage       车头照片
 *   sideOneImage    左侧照片
 *   sideTwoImage    右侧照片
 *   tailImage       车尾照片
 * busType           车型
 * country           车辆的服务国家
 * licenseExpired    行驶证有效期
 * drivingLicense    行驶证照片
 * insuranceExpired  保险过期日期(年-月-日 时:分:秒)
 * insuranceImage    保险照片
 * number            车牌号码
 * registerFile      注册文件
 */
export function busApplySave(data) {
	return requestApi({
		url: '/wetour/app/busApply/save',
		method: "POST",
		data: data
	})

}


/**
 * 修改车辆并提交审核
 * @param {Object} data  
 * brand             品牌
 * busImage          车辆照片
 *   headImage       车头照片
 *   sideOneImage    左侧照片
 *   sideTwoImage    右侧照片
 *   tailImage       车尾照片
 * busType           车型
 * drivingLicense    行驶证照片
 * id                主键ID
 * insuranceExpired  保险过期日期(年-月-日 时:分:秒)
 * insuranceImage    保险照片
 * registerFile      注册文件
 */
export function busApplyUpdateById(data) {
	return requestApi({
		url: '/wetour/app/busApply/updateById',
		method: "PUT",
		data: data
	})
}




//                                        车辆管理接口

/**
 * 通过id查询车辆
 * @param {Object} id  车辆主键id
 */
export function bus(id) {
	return requestApi({
		url: `/wetour/app/bus/${id}`,
		method: "GET",
		data: {}
	})

}

/**
 * 分页查询车辆列表
 * @param {Object} data  
 * countId         司机id
 * current         当前页
 */
export function busPage(data) {
	return requestApi({
		url: '/wetour/app/bus/page',
		method: "GET",
		data: data
	})

}


/**
 * 更新车辆状态
 * @param {Object} data  
 * busStatus              车辆状态0禁用1启用
 * id                     车辆主键id
 */
export function busUpdateStatusById(data) {
	return requestApi({
		url: '/wetour/app/bus/updateStatusById',
		method: "GET",
		data: data
	})
}




/**
 * 阿里oss前端直传获取访问的token
 */
export function ossPolicy() {
	return requestApi({
		url: '/wetour/app/oss/policy',
		method: "GET",
		data: {}
	})
}

