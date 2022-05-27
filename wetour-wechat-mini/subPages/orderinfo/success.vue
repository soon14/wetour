<template>
	<view class="success-box">
		<uni-nav-bar
		  backgroundColor="fff"
		  statusBar
			fixed
			title="支付成功"
			color="#272727"
			>
			<!-- <navigator open-type="navigateBack" slot="left"  hover-class="none">
			  <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourg/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator> -->
		</uni-nav-bar>
		<view class="success-container">
			<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/successImg.png"  class="successImg"></image>
			<view class="successText">
				支付成功
			</view>
			<view class="successTip">
				专属客服将在最晚12小时内向您致电请保证电话畅通
				
			</view>
			<!-- <view class="successTip">
				请保证电话畅通
			</view> -->
			<view class="success-btns">
				<view class="success-btn" @click="goIndex">
					返回首页
				</view>
				<view class="success-btn look" @click="goDetail">
					查看订单
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderNo:''
			}
		},
		onLoad(options) {
			this.orderNo = options.orderNo
		},
		methods: {
			goIndex(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
			goDetail(){
				uni.navigateTo({
					url:`/order/orderDetail/orderDetail?orderNo=${this.orderNo}&newType=1`
				})
			},
		}
	}
</script>

<style scoped lang="scss">
.success-box{
	background-color: #F8F8F8;
	min-height: 100vh;
}
.success-container{
	text-align: center;
	padding:168rpx 65rpx 0;
	.successImg{
		width: 128rpx;
		height: 128rpx;
	}
	.successText{
		@include fs(36rpx,600,#111111,45rpx);
		padding: 40rpx 0 43rpx;
	}
	.successTip{
		@include fs(28rpx,400,#666666,42rpx);
	}
	.success-btns{
		margin-top: 72rpx;
		.success-btn{
			width: 620rpx;
			background: #FFFFFF;
			border: 1rpx solid #111111;
			opacity: 1;
			border-radius: 45rpx;
			@include fs(28rpx,400,#111111,88rpx);
			margin-bottom: 48rpx;
		}
		.look{
			background-color: #111111;
			border-color: #111111;
			@include fs(28rpx,500,#fff,88rpx);
			
		}
	}
}
</style>
