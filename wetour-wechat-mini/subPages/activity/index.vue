<template>
	<view class="activity-box">
		<uni-nav-bar fixed statusBar color="#272727" title="活动页" backgroundColor="#FFFFFF">
			<!-- <navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator> -->

			<view @click="goIndex" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</view>
		</uni-nav-bar>

		<view
			class="activity-container"
			:style="{ backgroundImage: detail.backgroundImage ? 'url(' + detail.backgroundImage + ')' : '', minHeight: 'calc(100vh - ' + statusBarHeight + ')' }"
		>
			<!-- <image class="activity-img" :src="detail.backgroundImage" ></image> -->
			<view class="container-top" style="">
				<view class="top-des1">{{ detail.couponTemplate.templateTitle }}</view>
				<view class="flex-row">
					<text class="top-des2">{{ detail.couponTemplate.couponType == 1 ? '¥' : '折' }}</text>
					<text class="top-des3">{{ detail.couponTemplate.couponType == 1 ? detail.couponTemplate.reduceAmount : detail.couponTemplate.discount }}</text>
				</view>
				<view class="top-des4">满{{ detail.couponTemplate.withAmount }}可用</view>
				<view class="top-des5">{{ parseTime(detail.couponTemplate.createTime, '{y}/{m}/{d}') }}-{{ parseTime(detail.couponTemplate.endTime, '{y}/{m}/{d}') }}</view>
				<button @click="onDraw" :disabled="detail.couponTemplate.templateStatus == 2 ? false : true" class="top-btn">领取</button>
			</view>
			<image class="container-line" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/dotted-line.png"></image>
			<view class="container-bottom">
				<!-- 
				优惠券使用后，不会退回 
				优惠券不能兑换成现金 
				优惠券无法叠加使用 
				如有疑问，请联系客服 
				使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回 
				优惠券无法叠加使用 
				如有疑问，请联系客服 
				使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回 -->
				<view class="botton-content">
					<view v-html="detail.activityDesc" style="white-space: pre-wrap;"></view>
					<!-- <view>优惠券不能兑换成现金</view>
					<view>优惠券无法叠加使用</view> -->
					<!-- <view>如有疑问，请联系客服</view>
					<view>使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回</view>
					<view>优惠券无法叠加使用</view>
					<view>如有疑问，请联系客服</view>
					<view>使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回</view>
					<view>优惠券无法叠加使用</view>
					<view>如有疑问，请联系客服</view>
					<view>使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回</view>
					<view>优惠券无法叠加使用</view>
					<view>如有疑问，请联系客服</view>
					<view>使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import moment from '../../utils/moment.js';
import { parseTime, throttle } from '@/utils/common';
import { couponActivity, couponReceive } from '@/api/discounts.js';
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
export default {
	data() {
		return {
			detail: {},
			couponReceive: {
				businessType: 1, //1=wetour旅游，2=微巴士出行
				mobile: '', //用户手机
				newUser: '', //是否新用户，1=是，0不
				templateId: '', //优惠券模版ID
				userId: '' //用户ID
			},
			statusBarHeight: statusBarHeight
		};
	},
	onLoad(options) {
		if (options.q) {
			let query = decodeURIComponent(options.q);
			const id = this.getQueryVariable(query,'id')
			console.log("id==>",id);
			this.getCouponActivity(id);
		}
		//this.getCouponActivity(11);
	},
	methods: {
		goIndex() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		parseTime(time, cFormat) {
			if (!time) return '';
			return parseTime(moment(time).valueOf(), cFormat);
		},
		getQueryVariable(query, variable) {
			let str = query.slice(query.indexOf('?') + 1, query.length);
			var vars = str.split('&');
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (pair[0] == variable) {
					return pair[1];
				}
			}
			return false;
		},
		onDraw: throttle(function(item) {
			couponReceive({ templateId: this.detail.couponTemplate.id }).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: '领取成功',
						duration: 2000,
						icon: 'none'
					});
					//this.goIndex();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		}, 2000),
		getCouponActivity(activityId) {
			console.log('activityId', activityId);
			couponActivity(activityId).then(res => {
				if (res.code == 0 && res.data) {
					this.detail = res.data;
				} else if (res.code == 1001) {
					this.getCouponActivity(activityId);
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.activity-box {
	min-height: 100vh;
	overflow-y: hidden;
	background: #f8f8f8;
}

.flex-row {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
}

.activity-img {
	top: 0rpx;
	left: 0rpx;
	right: 0rpx;
	bottom: 0rpx;
	position: absolute;
}

.activity-container {
	padding: 199rpx 64rpx 0rpx;
	background-size: cover;
	min-height: 100%;
	.container-top {
		z-index: 999;
		display: flex;
		border-radius: 20rpx;
		background-color: #fff;
		flex-direction: column;
		align-items: center;
		padding: 52rpx 39rpx 74rpx;

		.top-des1 {
			@include fs(40rpx, 500, #666666, 60rpx);
		}

		.top-des2 {
			margin-top: 16rpx;
			@include fs(64rpx, 600, #cba56a, 72rpx);
		}

		.top-des3 {
			@include fs(200rpx, 600, #cba56a, 200rpx);
		}

		.top-des4 {
			margin-top: 3rpx;
			@include fs(32rpx, 400, #666666, 48rpx);
		}

		.top-des5 {
			margin-top: 2rpx;
			@include fs(24rpx, 400, #666666, 32rpx);
		}

		.top-btn {
			width: 544rpx;
			margin-top: 64rpx;
			border-radius: 88rpx;
			background-color: #111111;
			@include fs(28rpx, 500, #ffffff, 88rpx);
		}

		.top-btn[disabled] {
			background-color: #999999;
		}
	}
	.container-line {
		width: 560rpx;
		height: 12rpx;
		position: fixed;
		margin: -6rpx 25rpx 0rpx;
	}
	.container-bottom {
		padding: 40rpx 60rpx;
		border-radius: 20rpx;
		background-color: #fff;

		.botton-content {
			max-height: 400rpx;
			overflow-y: scroll;
			@include fs(24rpx, 400, #666666, 40rpx);
		}
	}
}
</style>
