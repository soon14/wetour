<template>
	<view class="driver-box">
		<image class="img-state" src="@/static/newImg/successImg.png"></image>
		<text class="txt-state">提交成功</text>

		<text @click="onAdd(1)" class="btn-driver">添加司机</text>
		<text @click="onAdd(2)" class="btn-cart">添加车辆</text>
		<text @click="onSee" class="btn-seek">查看记录</text>

	</view>
</template>

<script>
	export default {
		methods: {
			//点击添加
			onAdd(type) {
				if (type == 1) {
					uni.redirectTo({
						url: '../add-driver/index?isSkip=' + 1 
					})
				} else {
					uni.redirectTo({
						url: '../add-cart/index' 
					})
				}
			},
			//查看记录
			onSee() {
				uni.redirectTo({
					url: '../../audit/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.driver-box {
		display: flex;
		overflow: hidden;
		min-height: 100vh;
		align-items: center;
		flex-direction: column;
		background-color: #FFFFFF;
		padding: 168rpx 25rpx 0rpx 25rpx;


		.img-state {
			width: 128rpx;
			height: 128rpx;
		}

		.txt-state {
			margin: 40rpx 0rpx;
			@include fs(32rpx, 600, #272727, 45rpx);
		}

		.btn-driver {
			width: calc(100% - 50rpx);
			height: 90rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 12rpx;
			border: 1rpx solid #BDBDBD;
			margin: 60rpx 0rpx 20rpx 0rpx;
			@include fs(32rpx, 400, #272727, 90rpx);
		}

		.btn-cart {
			width: calc(100% - 50rpx);
			height: 90rpx;
			margin: 20rpx 0rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 12rpx;
			border: 1rpx solid #BDBDBD;
			@include fs(32rpx, 400, #272727, 90rpx);
		}

		.btn-seek {
			width: calc(100% - 50rpx);
			height: 90rpx;
			margin: 20rpx 0rpx;
			text-align: center;
			background: #FFCC00;
			border-radius: 12rpx;
			@include fs(32rpx, 400, #272727, 90rpx);
		}
	}
</style>
