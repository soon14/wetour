<template>
	<view class="discounts-box">
		<uni-nav-bar fixed statusBar color="#272727" title="优惠券" backgroundColor="#FFFFFF">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<!-- :style="{ 'min-height': `calc(100vh - ${statusBarHeight})` }" -->
		<view class="discounts-container">
			<view class="container-top">
				<view v-if="detail.couponStatus == 2 || detail.couponStatus == 3" class="mask"></view>
				<image
					v-if="detail.couponStatus == 2 || detail.couponStatus == 3"
					class="img-des"
					:src="
						detail.couponStatus == 2
							? 'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/use_icon.png'
							: 'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/exceed_icon.png'
					"
				></image>
				<view class="flex-start">
					<text class="txt-des1">{{ detail.templateTitle }}</text>
					<text v-if="detail.couponType == 1" class="txt-des2">满{{ detail.withAmount }}可用</text>
				</view>

				<view class="flex-row" style="margin: 8rpx 0rpx;">
					<view style="flex: 1;">
						<view class="txt-des3">{{ parseTime(detail.couponStartTime, '{y}/{m}/{d}') }}-{{ parseTime(detail.couponEndTime, '{y}/{m}/{d}') }}</view>
						<view class="txt-des4">最大可优惠金额：{{ detail.couponType == 2 ? detail.maxDiscountAmount + '元' : '不限' }}</view>
					</view>
					<view v-if="current == 0" class="flex-row">
						<text class="txt-des5">{{ detail.couponType == 1 ? detail.reduceAmount : detail.discount }}</text>
						<text class="txt-des6">{{ detail.couponType == 1 ? '元' : '折' }}</text>
					</view>
				</view>
				<view class="line-centent">
					<view class="left"></view>
					<view class="line"></view>
					<view class="right"></view>
				</view>
				<view class="flex-start">
					<text class="txt-des7" v-if="detail.charteredTypeConfigStr || detail.cityConfigStr || detail.busTypeConfigStr">
						可用限制：{{ detail.charteredTypeConfigStr ? '部分包车业务、' : '' }}{{ detail.cityConfigStr ? '部分城市、' : ''
						}}{{ detail.busTypeConfigStr ? '部分车型' : '' }}
					</text>
					<text v-else class="txt-des7">可用限制：不限</text>
					<image style="width: 24rpx;height: 24rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/right2.png"></image>
				</view>
			</view>

			<view class="container-detail">
				<view class="title">优惠券详情</view>
				<view class="title-line"></view>
				<view class="flex-row">
					<text class="txt_label">优惠券状态：</text>
					<text>{{ detail.couponStatus | couponStatusTypeFil }}</text>
				</view>
				<view class="flex-row">
					<text class="txt_label">优惠规则：</text>
					<text v-if="detail.couponType == 1">满{{ detail.withAmount }}减{{ detail.withAmount }}</text>
					<text v-else>满{{ detail.withAmount }}打{{ detail.discount }}折</text>
				</view>
				<view class="flex-row">
					<text class="txt_label">优惠上限：</text>
					<text>{{ detail.couponType == 2 ? detail.maxDiscountAmount + '元' : '不限' }}</text>
				</view>
				<view class="flex-row">
					<text class="txt_label">可用星期：</text>
					<text>{{ detail.weekConfig ? dgetWeekConfigStr(detail.weekConfig) : '不限' }}</text>
				</view>
				<view class="flex-row">
					<text class="txt_label">可用业务：</text>
					<text>{{ detail.charteredTypeConfigStr ? detail.charteredTypeConfigStr : '不限' }}</text>
				</view>
				<view class="flex-row">
					<text class="txt_label">可用城市：</text>
					<text>{{ detail.cityConfigStr ? detail.cityConfigStr : '不限' }}</text>
				</view>
				<view class="flex-row">
					<text class="txt_label">可用车型(包车)：</text>
					<text>{{ detail.busTypeConfigStr ? detail.busTypeConfigStr : '不限' }}</text>
				</view>
				<!-- <view class="flex-row">
					<text class="txt_label">可用商品(旅游)：</text>
					<text>不限</text>
				</view> -->
			</view>

			<view class="container-explain">
				<view class="title">优惠券说明</view>
				<view class="title-line"></view>
				<view class="flex-row">
					<view class="txt-circle"></view>
					<text>优惠券使用后，不会退回</text>
				</view>
				<view class="flex-row">
					<view class="txt-circle"></view>
					<text>优惠券不能兑换成现金</text>
				</view>
				<view class="flex-row">
					<view class="txt-circle"></view>
					<text>优惠券无法叠加使用</text>
				</view>
				<view class="flex-row">
					<view class="txt-circle"></view>
					<text>如有疑问，请联系客服</text>
				</view>
				<view class="flex-row">
					<view class="txt-circle"></view>
					<text>使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import moment from '../../utils/moment.js';
import { parseTime, throttle } from '@/utils/common';
import { couponDetail } from '@/api/discounts.js';
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 120 + 'px';
export default {
	data() {
		return {
			detail: {},
			statusBarHeight: statusBarHeight
		};
	},
	onLoad(options) {
		if (options.couponId) {
			this.getCouponDetail(options.couponId);
		}
	},
	filters: {
		couponStatusTypeFil(val) {
			let map = {
				1: '待使用',
				2: '已使用',
				3: '已过期'
			};
			return map[val];
		}
	},
	methods: {
		dgetWeekConfigStr(weekConfig) {
			let map = {
				1: '周一',
				2: '周二',
				3: '周三',
				4: '周四',
				5: '周五',
				6: '周六',
				0: '周日'
			};
			var weekConfigStr = '';
			var arry = weekConfig.split(',').forEach((item)=>{
							weekConfigStr += map[item] + ',';
			});
			return weekConfigStr;
		},
		getCouponDetail(couponId) {
			couponDetail(couponId).then(res => {
				if (res.code == 0 && res.data) {
					this.detail = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		parseTime(time, cFormat) {
			if (!time) return '';
			return parseTime(moment(time).valueOf(), cFormat);
		}
	}
};
</script>

<style scoped lang="scss">
.discounts-box {
	min-height: 100vh;
	background: #f8f8f8;
	padding: 20rpx 32rpx;
}

.flex-row {
	display: flex;
	margin: 10rpx 0rpx;
	flex-direction: row;
	justify-content: flex-start;
}

.txt_label {
	min-width: 180rpx;
}

.title {
	@include fs(32rpx, 500, #111111, 45rpx);
}

.title-line {
	width: 100%;
	height: 1rpx;
	margin: 20rpx 0rpx;
	background-color: #dfdfdf;
}

.txt-des {
	@include fs(24rpx, 400, #666666, 36rpx);
}

.txt-circle {
	width: 10rpx;
	height: 10rpx;
	min-width: 10rpx;
	margin: 15rpx 10rpx;
	border-radius: 50%;
	background-color: #111111;
}

.container-top {
	position: relative;
	margin: 20rpx 0rpx;
	border-radius: 20rpx;
	background-color: #fff;
	padding: 28rpx 32rpx 0rpx;

	.mask {
		top: 0rpx;
		left: 0rpx;
		right: 0rpx;
		bottom: 0rpx;
		position: absolute;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 0.8);
	}

	.img-des {
		top: 0rpx;
		right: 0rpx;
		width: 152rpx;
		height: 152rpx;
		position: absolute;
		border-top-right-radius: 20rpx;
	}

	.txt-des1 {
		@include fs(32rpx, 500, #111111, 45rpx);
	}

	.txt-des2 {
		color: #fff;
		font-size: 20rpx;
		margin-left: 12rpx;
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
		font-weight: 400rpx;
		background-color: #cba56a;
		//@include fs(20rpx, 400, #fff, 23rpx);
	}

	.txt-des3 {
		margin: 8rpx 0rpx;
		@include fs(22rpx, 400, #666666, 23rpx);
	}

	.txt-des4 {
		margin: 8rpx 0rpx;
		@include fs(24rpx, 400, #666666, 32rpx);
	}

	.txt-des5 {
		color: #111111;
		font-size: 48rpx;
		font-weight: 500;
	}

	.txt-des6 {
		color: #111111;
		font-size: 24rpx;
		font-weight: 400;
		margin-top: 24rpx;
		margin-left: 4rpx;
	}

	.txt-des7 {
		flex: 1;
		margin: 16rpx 0rpx;
		@include fs(24rpx, 400, #666666, 36rpx);
	}

	.line-centent {
		position: relative;

		.left {
			top: -12rpx;
			left: -44rpx;
			width: 24rpx;
			height: 24rpx;
			border-radius: 50%;
			position: absolute;
			background-color: #f8f8f8;
		}
		.right {
			top: -12rpx;
			right: -44rpx;
			width: 24rpx;
			height: 24rpx;
			border-radius: 50%;
			position: absolute;
			background-color: #f8f8f8;
		}

		.line {
			height: 1rpx;
			width: 100%;
			background-color: #dfdfdf;
		}
	}
}

.container-detail {
	margin: 20rpx 0rpx;
	padding: 20rpx 32rpx;
	border-radius: 20rpx;
	background-color: #fff;
	@include fs(24rpx, 400, #666666, 36rpx);
}

.container-explain {
	margin: 20rpx 0rpx;
	padding: 20rpx 32rpx;
	border-radius: 20rpx;
	background-color: #fff;
	@include fs(24rpx, 400, #666666, 40rpx);
}
</style>
