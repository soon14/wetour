<script>
	// import QQMapWX from "@/libs/qqmap-wx-jssdk.min.js"
	// var qqmapsdk = new QQMapWX({ key: 'D3ZBZ-DIDK6-KAWSM-ENOQV-LLEOJ-ZBB3A' });
	import {
		mapGetters
	} from 'vuex'
	import {
		oauthCheckToken
	} from "@/api/api.js"
	export default {
		data() {
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
				'timeNode'
			]),
		},
		onLaunch(options) {
			// #ifdef APP-PLUS
			//竖屏
			plus.screen.lockOrientation("portrait-primary");
			//关闭雪花
			setTimeout(() => {
				plus.navigator.closeSplashscreen();
			}, 1000)
			// #endif
		},
		onShow() {
			// if (this.access_token) {
			// 	this.refreshToken()
			// }
			//this.$store.dispatch('user/refreshToken');
		},
		onHide() {
			clearInterval(this.refreshTime)
		},
		methods: {
			// getUserInfo(){
			// 	getUserInfo().then(res=>{
			// 		this.$store.dispatch('user/setUserInfo', res.data)
			// 	})
			// },
			// 实时检测刷新token
			refreshToken() {
				console.log("timeNode", this.timeNode);
				this.$store.dispatch('user/refreshToken');
				// this.$store.dispatch('user/setUserInfo', res.data).t
				// this.refreshTime = setInterval(() => {
				// 	this.checkToken(this.refreshLock)
				// }, 60000)
			},
			checkToken() {
				return false
				oauthCheckToken({
					'token': access_token
				}).then(response => {
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

		}
	}
</script>

<style lang="scss">
	// /*每个页面公共css */
	@import 'uview-ui/index.scss';
	@import "@/styles/common.scss";

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
		background: rgba(0, 0, 0, .8);
	}
</style>
