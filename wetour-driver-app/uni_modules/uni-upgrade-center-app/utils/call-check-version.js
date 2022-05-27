export default function() {
	// #ifdef APP-PLUS
	return new Promise((resolve, reject) => {
				// 	console.log("plus.runtime.appid", plus.runtime.version)
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			console.log("plus.runtime.appid", plus.runtime.appid)
			console.log("plus.runtime.version", plus.runtime.version)
			console.log("widgetInfo.version", widgetInfo.version)
			uniCloud.callFunction({
				name: 'check-version',
				data: {
					appid: plus.runtime.appid,
					appVersion: plus.runtime.version,
					wgtVersion: widgetInfo.version
				},
				success: (e) => {
					resolve(e)
				},
				fail: (error) => {
					reject(error)
				}
			})
		})
	})
	// #endif
	// #ifndef APP-PLUS
	return new Promise((resolve, reject) => {
		reject({
			message: '请在App中使用'
		})
	})
	// #endif
}
