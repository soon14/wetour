<script>
	import {requestPost} from "@/utils/request.js"
	// import QQMapWX from "@/libs/qqmap-wx-jssdk.min.js"
	// var qqmapsdk = new QQMapWX({ key: 'D3ZBZ-DIDK6-KAWSM-ENOQV-LLEOJ-ZBB3A' });
	import {mapGetters} from 'vuex'
	import { tokenSocial, getUserInfo , userBindPhone } from "@/api/user.js"
	import { oauthCheckToken } from "@/api/api.js"
export default {
	data(){
		return {
			// 刷新token锁
			refreshLock: false,
			// 刷新token的时间
			refreshTime: '',
			// 计时器
			timer: ''
		}
	},
  computed: {
		...mapGetters([
			'access_token',
		]),
  },
  onLaunch(options) {
		let _this = this
		
		_this.$store.dispatch('user/getWxCode').then(()=>{
			_this.getUserInfo() 
			// _this.$store.dispatch('user/getUserInfo')
			
		})
		
			// let _this = this
			// this.getCityName()
   //    uni.setStorageSync('hui_scene', options.scene);
   //    uni.setStorageSync('param', options.param);
   //    uni.removeStorageSync('smart_card')
   //   //  uni.getLocation({
   //   //    type: 'gcj02',
   //   //    success (res) {
			// 		// console.log(res,'res1')
			// 		// _this.$store.dispatch('app/setLatitude',res.latitude)
			// 		// _this.$store.dispatch('app/setLongitude',res.longitude)
   //   //    }
   //   //  });
			
			
   //    let date = new Date()
   //    let year = date.getFullYear()
   //    let month = date.getMonth() + 1
   //    let day = date.getDate()
   //    var now = new Date(year + '/' + month + '/' + day).getTime() / 1000;
			// _this.$store.dispatch('app/setMyTime',now)
			// _this.$store.dispatch('app/setNowTime',now)
   //    this.getRoute();
   //    var data = {};
   //    data.is_login = 1;
   //    requestPost('/index/other/system_config', data, function(_json) {
			// 	_this.$store.dispatch('app/setSystemDays',_json.days)
			// 	_this.$store.dispatch('app/setCharteredDays',_json.chartered_days)
   //    });
	},
  onShow() {
		console.log(this.access_token,'this.access_token')
		if(this.access_token){
			this.refreshToken()
		}
	},
  onHide() {
		clearInterval(this.refreshTime)
	},
	computed:{
		...mapGetters([
			'city_id',
			'access_token',
		]),
	},
	methods: {
		getUserInfo(){
			getUserInfo().then(res=>{
				this.$store.dispatch('user/setUserInfo', res.data)
			})
		},
		// 实时检测刷新token
		refreshToken() {
			// this.refreshTime = setInterval(() => {
			// 	this.checkToken(this.refreshLock)
			// }, 60000)
		},
		checkToken(){
			return false
			oauthCheckToken({'token':access_token}).then(response=>{
				const expire = response && response.data && response.data.exp
				if (expire) {
					const expiredPeriod = expire * 1000 - new Date().getTime()
					//小于半小时自动续约
					if (expiredPeriod <= 30 * 60 * 1000) {
						if (!refreshLock) {
							refreshLock = true
							this.$store.dispatch('user/RefreshToken')
								.catch(() => {
									clearInterval(this.refreshTime)
								})
							refreshLock = false
						}
					}
				}
			})
		},
		
		
		
		getRoute() {
			let city_id = this.city_id
			let data = {};
			let arr = [];
			data.city_id = city_id;
			data.scene = parseInt(uni.getStorageSync('hui_scene'));
			data.is_login = 1;
			var that = this;
			requestPost( '/index/line/get_routes_stations', data, function(_json) {
				uni.setStorageSync('route_list', _json);
			});
		},
		getCityName(){
			let _this = this
		  uni.getLocation({
		    success : (res)=>{
					console.log(res,'res2')
					_this.$store.dispatch('app/setLatitude',res.latitude)
					_this.$store.dispatch('app/setLongitude',res.longitude)
					
		     //  qqmapsdk.reverseGeocoder({
		     //    location: {
		     //      latitude: res.latitude,
		     //      longitude: res.longitude
		     //    },
		     //    success (res) {
		     //      let city_code = res.result.ad_info.city_code.substring(3,res.result.ad_info.city_code.length)
							// _this.$store.dispatch('app/setCityId',Number(city_code))
							// _this.$store.dispatch('app/setCityName',res.result.ad_info.city)
		     //    },
		     //    fail (res) {
		     //      uni.showToast({ title: '获取当前定位城市信息失败', icon: 'none' })
							// _this.$store.dispatch('app/setCityId',330100)
							// _this.$store.dispatch('app/setCityName','杭州市')
		     //    },
		     //  });
		    }
		  })
		}	
	}
}
</script>

<style lang="scss">
// /*每个页面公共css */
@import 'uview-ui/index.scss';
page {
  font-family: PingFangSC-Regular, PingFang SC;
  min-width: 100vw;
  min-height: 100vh;
  background: #f0f0f0;
}
uni-toast {
  z-index: 10000;
}
.ellipsis-words {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-start{
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
/deep/ .uni-popup {
  z-index: 999 !important;
}
/deep/ .uni-transition {
  background: rgba(0, 0, 0, .8);
}

</style>
