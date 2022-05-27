export const primaryColor = '#CB4F99'
export const errorColor = '#E05164'
export const bgColor = 'linear-gradient(334deg, #4252d7 0%, #cb4f99 100%)'
let config = {
	BASE_URL:`http://192.168.1.216:9999`,  //程敏
	//BASE_URL:`http://192.168.1.15:9999`,  //栋哥
	//BASE_URL:`https://testintercity.weixiaoba.vip`, //测试站服务
	// BASE_URL:`http://192.168.1.15:9999`, //林陡伟
	// BASE_URL:`https://intercity-gateway:9999`,
	//BASE_URL:`https://intercity.ubus.vip`,  //线上服务
	
	
	// mqtt:'test',
	mqtt:'prod',
	h5url: `https://h5.ubus.vip`,
	// appType:'WX_PASSENGER,2.8.1,58',
	// wx_img_url: 'http://test.app.picture.weixiaoba.vip',
}
//#ifdef H5
	config.BASE_URL = '/api'
	// config.BASE_URL = 'http://cyapi.weixue.ltd'
//#endif
export default config;

