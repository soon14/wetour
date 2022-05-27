<template>
	<view class="box">
		<view class="box-logo">
			<image src="@/static/image/common/logo.png" class="logoImg"></image>
			<view class="box-title">微途伙伴</view>
		</view>
	</view>
</template>

<script>
import { getDetail } from '@/api/login.js';
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
export default {
	onLoad() {
		// #ifdef APP-PLUS
		checkUpdate()
			.then(res => {
				console.log('res', res);
				console.log('res', res.code);
				if (res.result.code == 0) {
					this.getDetail();
				}
			})
			.catch(e => {
				console.log('e', e);
				this.getDetail();
			});
		//this.getDetail();
		// #endif
		// #ifdef H5
		this.getDetail();
		// #endif

		// if (this.userInfo.partnerName) {
		// 	uni.switchTab({
		// 		url: '/pages/index/index',
		// 		success: () => {
		// 			plus.navigator.closeSplashscreen()
		// 		}
		// 	})
		// } else {
		// 	uni.reLaunch({
		// 		url: '/pages/login/login',
		// 		success: () => {
		// 			plus.navigator.closeSplashscreen()
		// 		}
		// 	})
		// }
	},
	data() {
		return {};
	},
	methods: {
		getDetail() {
			getDetail().then(res => {
				console.log('res', res);
				if (res.code === 0) {
					if (res.data) {
						this.$store.dispatch('user/setUserInfo', res.data).then(val => {
							if (!res.data.partnerName) {
								// uni.navigateTo({
								// 	url: "/pages/register/register?country=" + this.array[this
								// 		.index].country
								// 	// url: "/pages/register/register"
								// })
								uni.reLaunch({
									url: '/pages/login/login'
								});
							} else {
								// 去首页
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						});
					} else {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.box {
	width: 100%;
	min-height: 100vh;
	background-color: #ffffff;

	.box-logo {
		padding: 139rpx 40rpx 313rpx;
		text-align: center;

		.logoImg {
			width: 160rpx;
			height: 160rpx;
			margin-bottom: 20rpx;
		}

		.box-title {
			@include fs(30rpx, 400, #272727, 42rpx);
		}
	}
}
</style>
