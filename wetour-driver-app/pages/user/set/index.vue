<template>
	<view class="set-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="设置" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>

		<view class="set-content" :style="{  'max-height': `calc(100vh - ${statusBarHeight})`,
		'height': `calc(100vh - ${statusBarHeight})`  }">

			<!-- <view class="set-item">
				<text>权限设置</text>
				<image src="@/static/img/right.png" style="height: 24rpx;width: 12rpx;">
				</image>
			</view> -->
			<view class="set-item" @click="onAbout">
				<text>关于我们</text>
				<image src="@/static/img/right.png" style="height: 24rpx;width: 12rpx;">
				</image>
			</view>

			<text @click="onOut" class="txt-out">退出登录</text>
		</view>
	</view>

</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	export default {
		data() {
			return {
				statusBarHeight: statusBarHeight,
			}
		},
		methods: {
			onAbout(){
				uni.navigateTo({
					url:'/pages/user/set/about/index'
				})
			},
			onOut() {
				let that = this
				uni.showModal({
					content: '您确认退出登录吗？',
					showCancel: true,
					cancelText: "取消",
					cancelColor: "#555555",
					confirmText: "确定",
					confirmColor: "#FF8800",
					success: function(res) {
						if (res.confirm) {
							that.$store.dispatch('user/remoToken');
							that.$store.dispatch('user/setUserInfo', "");
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}

					}
				})

			}
		}
	}
</script>

<style scoped lang="scss">
	.set-box {
		overflow: hidden;
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.title-right {
		@include fs(28rpx, 400, #272727, 40rpx);
	}

	.set-content {
		display: flex;
		flex-direction: column;
		background-color: #F5F5F5;

		.set-item {
			display: flex;
			height: 90rpx;
			padding: 0rpx 16rpx;
			flex-direction: row;
			align-items: center;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid #EEEEEE;

			text {
				flex: 1;
				@include fs(32rpx, 400, #272727, 45rpx);
			}
		}

		.txt-out {
			height: 90rpx;
			margin-top: 24rpx;
			text-align: center;
			background: #FFFFFF;
			@include fs(30rpx, 400, #272727, 90rpx);
		}
	}
</style>
