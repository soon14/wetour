<template>
	<view class="user-container">
		<view class="user-data flex-start">
			<image class="user-img" src="@/static/user/user-img.png"></image>
			<text class="txt-name">{{ userInfo.partnerName ? userInfo.partnerName : 'hello,微巴士用户' }}</text>
			<text class="txt-phone">{{ phonehide }}</text>
		</view>
		<!-- 结算-->
		<view class="account-content">
			<view class="account-item" @click="onAccount(0)">
				<text class="txt1-item">{{ accountData.currency }}{{ accountData.waitSettleAmount }}</text>
				<text class="txt2-item">待结算</text>
			</view>
			<view class="account-line"></view>
			<view class="account-item" @click="onAccount(1)">
				<text class="txt1-item">{{ accountData.currency }}{{ accountData.totalSettleAmount }}</text>
				<text class="txt2-item">已结算</text>
			</view>
		</view>

		<!-- 我的订单-->
		<view class="order-content">
			<text>我的订单</text>
			<view class="order-tab">
				<view class="order-item" @click="onOrder(0)">
					<image src="@/static/newImg/order_all.png"></image>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="onOrder(1)">
					<image src="@/static/newImg/order_offer.png"></image>
					<text>已报价</text>
				</view>
				<view class="order-item" @click="onOrder(2)">
					<image src="@/static/newImg/order_service.png"></image>
					<text>已服务</text>
				</view>
				<view class="order-item" @click="onOrder(3)">
					<image src="@/static/newImg/order_lose.png"></image>
					<text>已失效</text>
				</view>
			</view>
		</view>

		<!-- 其它服务-->
		<view class="order-content">
			<text>其它服务</text>
			<view class="order-tab">
				<view class="order-item" @click="onService(0)">
					<image src="@/static/newImg/service_info.png"></image>
					<text>个人信息</text>
				</view>
				<view class="order-item" @click="onService(1)">
					<image src="@/static/newImg/service_china.png"></image>
					<text>中国客服</text>
				</view>
				<view class="order-item" @click="onService(2)">
					<image src="@/static/newImg/service_other.png"></image>
					<text>其它客服</text>
				</view>
				<view class="order-item" @click="onService(3)">
					<image src="@/static/newImg/service_set.png"></image>
					<text>设置</text>
				</view>
			</view>
		</view>
		<tabbarView />
	</view>
</template>

<script>
import { strReplace } from '@/utils/common.js';

import { getSettleInfo } from '@/api/account.js';
import { mapGetters } from 'vuex';
import tabbarView from '@/components/tabbarView.vue';
export default {
	components: {
		tabbarView
	},
	data() {
		return {
			accountData: {}
		};
	},
	computed: {
		...mapGetters(['userInfo']),
		phonehide() {
			let mphone = '';
			if (this.userInfo) {
				var prefixlength = this.userInfo.mobile.length;
				mphone = this.userInfo.mobile.substring(0, prefixlength - 8) + '****' + this.userInfo.mobile.substring(prefixlength - 4, prefixlength);
			}

			return mphone;
		}
	},
	onShow() {
		this.getSettleInfo();
	},
	methods: {
		getSettleInfo() {
			getSettleInfo().then(res => {
				if (res.code === 0) {
					this.accountData = res.data;
				} else {
					this.$u.toast(res.msg);
				}
			});
		},
		//结算
		onAccount(type) {
			if (type == 0) {
				uni.navigateTo({
					url: '../account/apply-account/index'
				});
			} else {
				uni.navigateTo({
					url: '../account/record-account/index'
				});
			}
		},
		//订单
		onOrder(type) {
			uni.navigateTo({
				url: '../order/index?current=' + type
			});
		},
		//服务
		onService(type) {
			if (type == 0) {
				uni.navigateTo({
					url: 'set/userInfo/userInfo'
				});
			} else if (type == 1) {
				// #ifdef APP-PLUS
				//手机端的这样写
				plus.device.dial('4000918484', true);
				//#endif
				//H5的这样写
				uni.makePhoneCall({
					phoneNumber: '4000918484'
				});
			} else if (type == 2) {
				// #ifdef APP-PLUS
				//手机端的这样写
				plus.device.dial('+13175406128', true);
				//#endif
				//H5的这样写
				uni.makePhoneCall({
					phoneNumber: '+13175406128'
				});
			} else {
				uni.navigateTo({
					url: 'set/index'
				});
			}
		},
		//手机号
		strReplace(phone) {
		 
			return strReplace(phone, 1);
		},
		//打电话
		call(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		}
	}
};
</script>

<style scoped lang="scss">
.user-container {
	min-height: 100vh;
	background: #f5f5f5;

	.user-data {
		display: flex;
		height: 405rpx;
		flex-direction: column;
		justify-content: flex-end;
		background: url(@/static/newImg/mine_bg.png) no-repeat;

		.user-img {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			margin-bottom: 12rpx;
		}

		.txt-name {
			margin-bottom: 12rpx;
			@include fs(40rpx, 600, #272727, 40rpx);
		}

		.txt-phone {
			margin-bottom: 27rpx;
			@include fs(32rpx, 400, #272727, 32rpx);
		}
	}

	.account-content {
		display: flex;
		height: 160rpx;
		margin: 5rpx 16rpx;
		flex-direction: row;
		background: #ffffff;
		border-radius: 16px;
		align-items: center;

		.account-item {
			flex: 1;
			display: flex;
			align-items: center;
			flex-direction: column;

			.txt1-item {
				@include fs(48rpx, 500, #272727, 58rpx);
			}

			.txt2-item {
				margin-top: 4rpx;
				@include fs(24rpx, 400, #272727, 33rpx);
			}
		}

		.account-line {
			width: 1rpx;
			height: 50rpx;
			background-color: #eeeeee;
		}
	}

	.order-content {
		display: flex;
		padding: 24rpx 30rpx;
		border-radius: 16rpx;
		flex-direction: column;
		background-color: #ffffff;
		margin: 15rpx 16rpx 10rpx 16rpx;

		.txt-order {
			@include fs(28rpx, 400, #272727, 40rpx);
		}

		.order-tab {
			display: flex;
			flex-direction: row;

			.order-item {
				flex: 1;
				display: flex;
				align-items: center;
				flex-direction: column;
				margin: 32rpx 0rpx 0rpx 0rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}

				text {
					margin-top: 20rpx;
					@include fs(24rpx, 400, #555555, 33rpx);
				}
			}
		}
	}
}
</style>
