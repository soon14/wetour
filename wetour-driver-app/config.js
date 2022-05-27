export const primaryColor = '#CB4F99'
export const errorColor = '#E05164'
export const bgColor = 'linear-gradient(334deg, #4252d7 0%, #cb4f99 100%)'
let config = {
	//BASE_URL:`https://intercity.ubus.vip`,  //线上服务
	//intercity.weixiaoba.vip  test-intercity.weixiaoba.vip
	BASE_URL: `http://testintercity.weixiaoba.vip`, //测试站服务
	//BASE_URL:`http://192.168.1.216:9999`,  //程敏
	// BASE_URL:`http://192.168.1.15:9999`,  //栋哥
	//BASE_URL: `http://192.168.1.32:9999`, //天柱
	// BASE_URL:`http://192.168.1.15:9999`, //林陡伟
	
	h5url: `https://h5.ubus.vip`
}
//#ifdef H5
config.BASE_URL = '/api'
// config.BASE_URL = 'http://192.168.1.32:9999/wetourpartnerapp'
//#endif
export default config;
