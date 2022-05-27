import configs from '@/config.js'
import storage from './storage'
import store from "@/store/index.js"
export const requestApi = options => {

	return new Promise((resolve, reject) => {
		console.log(configs.BASE_URL,options, 'options')
		uni.request({
			url: configs.BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: options.header || {
				"Authorization": store.state.user.access_token ? ('Bearer ' + store.state.user
					.access_token) : '',
				//"Authorization": 'Bearer afef551f-853b-48fb-8672-96b73860c799',
			},
			success: res => {
				console.log(options.url, res, 2322222)
				// 0 .异常
				// 1. 正常
				// 10001: 需要重新登录
				// 10002: 登录刷新,会返回新的token
				// 20009: 伙伴被停用，重新获取用户信息
				if (res.statusCode == 200) {

					if (res.data.code == 0 || res.data.access_token) {
						resolve(res.data)
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						reject(res)
					}
				} else if (res.statusCode === 424) {
					if (res.data.code === 401) {
						store.dispatch('user/remoToken');
						store.dispatch('user/setUserInfo', "");
						uni.reLaunch({
							url: '/pages/login/login'
						})
						reject(res)
					} else {
						if (res.data.msg) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
						reject(res.data.msg)
					}

				} else {
					//2. 操作不成功返回数据，以toast方式弹出响应信息，如后端未格式化非操作成功异常信息，则可以统一定义异常提示
					if (res.data.msg) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
					}
					if(res.data.code===20009){
						console.log(store.state.user.userInfo)
						const userInfo = store.state.user.userInfo
						userInfo.partnerStatus = 0
						store.dispatch('user/setUserInfo',userInfo);
						// userInfo.partnerStatus==0
					}
					reject(res.data.msg)
				}
			},
			fail: err => {
				console.log("e", err)
				uni.hideLoading();
				uni.showToast({
					title: '页面加载失败，请返回重试',
					icon: 'none'
				})
				reject(err)
			},
		})
	})
}
