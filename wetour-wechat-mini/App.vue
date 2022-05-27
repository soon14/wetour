<script>
import { mapGetters } from 'vuex';
import { oauthCheckToken } from '@/api/api.js';
// import bmap from "@/utils/bmap-wx.min.js"
// ZpSY36IEOdwIwfER3kQ9FO8GOwFtGEpg

// 8854a8b82bce94cf68a1916a8a703b2a
export default {
	data() {
		return {
			// 刷新token锁
			refreshLock: false,
			// 刷新token的时间
			refreshTime: '',
			// 计时器
			timer: ''
		};
	},
	computed: {
		...mapGetters(['access_token'])
	},
	onLaunch(options) {
		let _this = this;
		// this.getCityName()
		_this.$store.dispatch('user/getWxCode').then(() => {
			// /wechat/my/info
			_this.$store.dispatch('user/getUserInfo');
		});
	},
	onPageScroll(e) {
		//console.log('ss', e);
		uni.$emit('onPageScroll', e.scrollTop);
	},
	onShow() {
		// console.log(this.access_token,'this.access_token')
		// if(this.access_token){
		// 	this.refreshToken()
		// }
		// var BMap = new bmap.BMapWX({
		// 	ak: 'IT4aMOApiKuEghER7mMKAxGii3v2FqME'
		// });
		//  //
		//  // https://api.map.baidu.com/place/v2/suggestion?query=天安门&region=北京&city_limit=true&output=json&ak=你的ak
		//  //
		//  BMap.suggestion({
		// 	 query: '一点点',
		// 	 region: '北京',
		// 	 city_limit: true,
		// 	 // SK:'haZgwzEbf8MaZQ8GlrNinaOvZb6DiHdv',
		// 	 fail: err=>{
		// 		 console.log(err,'err')
		// 	 },
		// 	 success: res=>{
		// 		 console.log(res,'res11111')
		// 	 }
		//  });
		// uni.request({
		//   // url: 'https://api.map.baidu.com/place/v2/suggestion?query=a&region=东京&city_limit=true&output=json&ak=IT4aMOApiKuEghER7mMKAxGii3v2FqME',
		//   url:'http://api.map.baidu.com/place_abroad/v1/suggestion?query=铁塔&region=东京&output=json&ak=IT4aMOApiKuEghER7mMKAxGii3v2FqME', //GET 请求
		//   method:  'GET',
		//   success: res => {
		// 	  console.log(res.data,'res')
		//   },
		//   fail: err => {
		// 	  console.log(err,'err')
		//   }
		// })
	},
	onHide() {
		clearInterval(this.refreshTime);
	},
	computed: {
		...mapGetters(['city_id', 'access_token'])
	},
	methods: {
		// getUserInfo(){
		// 	getUserInfo().then(res=>{
		// 		this.$store.dispatch('user/setUserInfo', res.data)
		// 	})
		// },
		// 实时检测刷新token
		refreshToken() {
			// this.refreshTime = setInterval(() => {
			// 	this.checkToken(this.refreshLock)
			// }, 60000)
		},
		checkToken() {
			return false;
			oauthCheckToken({ token: access_token }).then(response => {
				const expire = response && response.data && response.data.exp;
				if (expire) {
					const expiredPeriod = expire * 1000 - new Date().getTime();
					//小于半小时自动续约
					if (expiredPeriod <= 30 * 60 * 1000) {
						if (!refreshLock) {
							refreshLock = true;
							this.$store.dispatch('user/RefreshToken').catch(() => {
								clearInterval(this.refreshTime);
							});
							refreshLock = false;
						}
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
// /*每个页面公共css */
@import 'uview-ui/index.scss';
@import '@/styles/common.scss';
page {
	font-family: PingFangSC-Regular, PingFang SC;
	min-width: 100vw;
	min-height: 100vh;
	background: #f8f8f8;
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

.flex-between-align {
	display: flex;
	justify-content: space-between;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}
.flex-start {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
/deep/ .uni-popup {
	z-index: 999 !important;
}
/deep/ .uni-transition {
	background: rgba(0, 0, 0, 0.8);
}
</style>
