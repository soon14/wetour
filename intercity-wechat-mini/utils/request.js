import configs from '@/config.js'
import storage from './storage'
import store from "@/store/index.js"
export const requestApi = options => {
	
	
  return new Promise((resolve, reject) => {
    uni.request({
      url: configs.BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {
				// "Content-Type": "application/json", //设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
				"Authorization":store.state.user.access_token?('Bearer ' + store.state.user.access_token) : '',
				// "TENANT-ID": store.state.user.userInfo.id,
			},
      success: res => {
				// console.log(options.url,res,2322222)
				// 0 .异常
				// 1. 正常
				// 10001: 需要重新登录
				// 10002: 登录刷新,会返回新的token
				if(res.statusCode == 200){
					// if (res.data.status == 424) {
					// 	store.dispatch('user/remoToken')
					// 	store.dispatch('user/setUserInfo',{})
					// 	// uni.removeStorageSync('token_')
					// 	// uni.removeStorageSync('user_id')
					// 	// uni.setStorageSync('loginStatus', 1)
					// 	// uni.showToast({
					// 	//   title: res.data.msg,
					// 	//   icon: 'none'
					// 	// })
					// 	// uni.redirectTo({
					// 	// 	url: '/pages/login/quick_logon'
					// 	// })
						
					// 	console.log('退出登录')
					// }
					if(res.data.code ==0  || res.data.access_token){
						resolve(res.data)
					}else{
						setTimeout(()=>{
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						},700)
						reject(res)
					}
					
				} else if (res.statusCode === 424 ) {
					if(res.data.code === 401 ) {
						store.dispatch('user/remoToken')
						console.log('-----------------------')
						store.dispatch('user/getWxCode',true).then(()=>{
							console.log('66666666666666666-----------------')
							// store.dispatch('user/getUserInfo')
							resolve({code:1001})
						})
					}else{
						var errMsg = res.data.message
						reject(res)
					}
					
				} else {
					//2. 操作不成功返回数据，以toast方式弹出响应信息，如后端未格式化非操作成功异常信息，则可以统一定义异常提示
					if(res.msg) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					var errMsg = res.data.message
					reject(res)
					
				}
      },
      fail: err => {
        uni.hideLoading({
					success: (res) => {},
				})
				uni.showToast({
					title: '页面加载失败，请返回重试',
					icon: 'none'
					})
				reject(err)
      },
    })
  })
}


// export default requestApi

/**
 * 接口请求公用函数
 * url  接口完整链接
 * data post请求数据json对象
 * _cb 回调函数
 */

var CusBase64 = require("./base64.modified.js");
// 设置老的app-agent
function oldAgent(options){
	options = options ? options : ''
	const data = 'wx-smallprog,,,,,2.8.1,,' + options + ',,58,,,2.2'
	return data
}
export const requestPost = function (url, data, _cb,apiurl=configs.apiurl) {
  let openid = uni.getStorageSync('openid');
  openid = openid ? openid : '';
  var is_check = data.is_check ? data.is_check : 0;
  if (is_check == 1) {
    delete data[is_check];
  }
  const str = JSON.stringify(data);
  const base64 = CusBase64.encode(str);

  uni.request({
    url: apiurl + url,
    data: encodeURIComponent(base64),
    method: 'POST',
    header: { 'app-agent': oldAgent(openid) },
    success: function (res) {
      // console.log(res)
      if (res.data.code == 0) {
        if (res.data.data) {
          _cb(JSON.parse(CusBase64.decode(res.data.data)));
        } else {
          _cb(true);
        }
      } else if (res.data.code == 2012) {
        _cb(res.data)
      } else if (res.data.code == 1004) {
        // uni.setStorageSync('user_id');
				store.dispatch('user/setUserInfo',{})
        var url1 = '';
        if (is_check = 1) {
          url1 = '/pages/home/index?type=2'
        } else {
          url1 = '/pages/home/index?type=1'
        }
        uni.navigateTo({ url: url1, });
      } else if (res.data.code == 1002) {
        _cb(1002);
      } else if (res.data.code == 2) {
        uni.showToast({
          title: res.data.desc,
          icon: 'none',
          duration: 2000
        });
        _cb(res);
        // _cb(false)
      }  else if (res.data.code == 6004) {
        uni.showToast({
          title: '您查询的航班不存在，请重新查找',
          icon: 'none',
          duration: 2000
        });
        setTimeout(function () { uni.navigateBack() }, 1500);
      } else if (res.data.code == 2011) {
        uni.showToast({
          title: res.data.desc,
          icon: 'none',
          duration: 2000
        });
        setTimeout(function () { uni.navigateBack() }, 2000);
      } else if (res.data.code == 9002) {
        uni.showToast({
          title: res.data.desc,
          icon: 'none',
          duration: 2000
        });
        setTimeout(function () { uni.navigateBack() }, 2000);
      } else if (res.data.code == 6001) {
        uni.showToast({
          title: res.data.desc,
          icon: 'none',
          duration: 2000
        })
      } else {
        uni.showToast({
          title: res.data.desc,
          icon: 'none',
          duration: 2000
        });
        _cb(false);
      }
    },
    fail: function (res) {
      console.log(res)
      uni.showToast({
        title: '页面加载失败，请返回重试',
        icon: 'none'
      });
      _cb(false);
    }
  });
}