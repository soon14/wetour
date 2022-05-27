<template>
	<view class="content">
		<uni-nav-bar fixed statusBar title="我的" :backgroundColor="'transparent'" transition color="#272727"></uni-nav-bar>
		<image style="height: 585rpx;width: 100vw;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/user_bg.png"></image>

		<view class="user-container">
			<view class="user-data flex-start">
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/user/userImg.png" class="user-img"></image> -->
				<view class="userMobile" v-if="userInfo.mobile">{{ userInfo.mobile }}</view>
				<button v-else v-if="!userInfo.mobile" class="userMobileBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">登录</button>
			</view>
			<!-- <view class="user-view flex-between" style="height: 158rpx;" @click="toPages('/order/orderList/orderList')">
				<text class="user-view-title">我的订单</text>
				<view class="flex-start">
					<text>查看全部</text>
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/right.png" class="rightImg"></image>
				</view>
			</view> -->

			<view class="user-view" style="padding: 40rpx 32rpx;">
				<text class="user-view-title">我的订单</text>
				<view class="flex-start" style="margin-top: 40rpx;">
					<view class="flex-column" @click="toPages('/order/orderList/orderList')">
						<image style="width: 44rpx;height: 44rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/order_all.png"></image>
						<text>全部</text>
					</view>
					<view class="flex-column" @click="toPages('/order/orderList/orderList?current=1')">
						<image style="width: 44rpx;height: 44rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/order_treat.png"></image>
						<text>待支付</text>
					</view>
					<view class="flex-column" @click="toPages('/order/orderList/orderList?current=2')">
						<image style="width: 44rpx;height: 44rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/order_pay.png"></image>
						<text>已支付</text>
					</view>
					<view class="flex-column" @click="toPages('/order/orderList/orderList?current=3')">
						<image style="width: 44rpx;height: 44rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/order_lose.png"></image>
						<text>已失效</text>
					</view>
				</view>
			</view>

			<view class="user-view flex-between" style="height: 124rpx;" @click="toPages('/subPages/discounts/index')">
				<text class="user-view-title">优惠券包</text>
				<view class="flex-start">
					<text>查看全部</text>
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/right.png" class="rightImg"></image>
				</view>
			</view>
			<!--  -->
			<view class="user-view" style="padding: 40rpx 32rpx;">
				<!-- <text class="user-view-title">联系我们</text> -->
				<view class="flex-start" style="margin-top: 5rpx;">
					<view class="flex-column" @click="call('+864000918484')">
						<image style="width: 40rpx;height: 40rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/callChina.png"></image>
						<text>境内热线</text>
					</view>
					<view class="flex-column" @click="call('+13175406128')">
						<image style="width: 40rpx;height: 40rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/callAll.png"></image>
						<text>境外热线</text>
					</view>
					<button class="flex-column" open-type="contact">
						<image style="width: 40rpx;height: 40rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/robot.png"></image>
						<text style="font-size: 24rpx;color: #666666;">在线客服</text>
					</button>
					<view class="flex-column" @click="toPages('/subPages/user/about')">
						<image style="width: 40rpx;height: 40rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/about.png"></image>
						<text>关于我们</text>
					</view>
				</view>
			</view>

			<!-- <view class="user-view" style="padding: 40rpx 32rpx;">
				<text class="user-view-title">关于其他</text>
				<view class="flex-start" style="margin-top: 42rpx;">
					
					<view class="flex-column" @click="toPages('/subPages/user/other?url=wetour/serviceAgreement.html')">
						<image style="width: 40rpx;height: 40rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/service.png"></image>
						<text>服务协议</text>
					</view>
					<view class="flex-column" @click.stop="toPages('/subPages/user/other?url=wetour/privacyPolicy.html')">
						<image style="width: 40rpx;height: 40rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/Privacy.png"></image>
						<text>隐私政策</text>
					</view>
				</view>
			</view> -->
			
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getUserInfo, userBindPhone } from '@/api/user.js';
import { parseTime, throttle } from '@/utils/common';
export default {
	name: 'Login',
	components: {},
	props: {},
	data() {
		return {};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	watch: {},
	onLoad() {
		this.$store.dispatch('user/getUserInfo');
	},
	onShow() {},
	methods: {
		call(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		toPages: throttle(function(url) {
			uni.navigateTo({
				url
			});
		}, 1500),
		getPhoneNumber({ detail }) {
			console.log(detail, 3333333);
			let _this = this;
			if (detail.errMsg === 'getPhoneNumber:ok') {
				userBindPhone(detail.code).then(res => {
					if (res.code == 0) {
						_this.$store.dispatch('user/getUserInfo').then(res => {});
						// uni.showToast({
						// 	title: '您取消了授权',
						// 	icon: 'none'
						// })
						// this.$store.dispatch('user/setLogin', true)
					}
				});
			} else {
				uni.showToast({
					title: '您取消了授权',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	position: relative;
	min-height: 100vh;
	background-color: #f8f8f8;
}

.user-container {
	left: 0rpx;
	right: 0rpx;
	top: 242rpx;
	position: absolute;

	.user-data {
		justify-content: center;
		margin-bottom: 54rpx;

		.userMobile {
			@include fs(40rpx, 600, #272727, 47rpx);
		}

		.userMobileBtn {
			width: 172rpx;
			border: 1rpx solid #666666;
			border-radius: 34rpx;
			text-align: center;
			background-color: transparent;
			@include fs(28rpx, 400, #272727, 64rpx);
		}
	}
	.user-view {
		padding: 0rpx 32rpx;
		background: #ffffff;
		border-radius: 20rpx;
		margin: 20rpx 32rpx;
		@include fs(22rpx, 400, #666666, 26rpx);

		&-img {
			width: 36rpx;
			height: 36rpx;
		}
		.rightImg {
			width: 12rpx;
			height: 24rpx;
			margin-left: 12rpx;
		}

		&-title {
			@include fs(32rpx, 600, #272727, 38rpx);
		}

		.flex-column {
			flex: 1;
			margin: 0rpx;
			padding: 0rpx;
			height: 90rpx;
			display: flex;
			line-height: 1;
			align-items: center;
			background-color: #fff;
			flex-direction: column;
			justify-content: space-between;
		}
	}
}

button::after {
	height: auto;
	border: none;
	background-color: transparent;
}
</style>
