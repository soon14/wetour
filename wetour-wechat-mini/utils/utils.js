// var QQMapWX = require('@/libs/qqmap-wx-jssdk.min.js');
// var qqmapsdk = new QQMapWX({ key: 'D3ZBZ-DIDK6-KAWSM-ENOQV-LLEOJ-ZBB3A' });

import store from "@/store/index.js"
// 校验是否开启定位信息
function checkAuth(){
  return new Promise((resolve,reject)=>{
    uni.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          resolve(false)
        }else{
          resolve(true)
        }
      }
    })
  })
}
// 开始定位权限
function getAuth(){
  uni.authorize({
    scope: 'scope.userLocation',
    fail() { // 首此拒绝获取定位权限后，手动跳转打开权限
      uni.showModal({
        title: '请打开定位权限！', //提示的标题,
        content: '下单需要您的定位信息', //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '确定', //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: '#FF7743', //取消按钮的文字颜色,
        confirmText: '取消', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#999999', //确定按钮的文字颜色,
        success: res => {
          if (res.cancel) {
            uni.openSetting({
              success : ()=>{
                
              },
              fail : () =>{
                return false
              }
            })
          }
        }
      });
    }
  })
}




module.exports = {
  checkAuth : checkAuth,
	getAuth : getAuth,
}
