<template>
	<view class="discounts-box">
		<uni-nav-bar fixed statusBar color="#272727" title="优惠券详情" backgroundColor="#FFFFFF">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="discounts-container" :style="{ 'min-height': `calc(100vh - ${statusBarHeight})` }">
			<view class="head-title">{{ detail.templateTitle }}</view>
			<view class="bottom-content">
				<view class="discounts-item">
					<text class="txt-title">使用限制</text>
					<view class="flex-start row-item">
						<text class="row-left">有效期</text>
						<text class="row-right">{{ parseTime(detail.couponStartTime, '{y}.{m}.{d}') }}-{{ parseTime(detail.couponEndTime, '{y}.{m}.{d}') }}</text>
					</view>
					<view class="flex-start row-item">
						<text class="row-left">优惠规则</text>
						<text v-if="detail.couponType==1" class="row-right">满{{ detail.withAmount }}元减{{ detail.reduceAmount }}元</text>
						<text v-else class="row-right">满{{ detail.withAmount }}元打{{ detail.discount }}折</text>
					</view>
					<view class="flex-start row-item" >
						<text class="row-left">最大优惠额</text>
						<text class="row-right"v-if="detail.couponType===2">{{ detail.maxDiscountAmount }}元</text>
						<text class="row-right"v-else>不限</text>
					</view>
					<view class="flex-start row-item">
						<text class="row-left">状态</text>
						<text class="row-right">{{ detail.couponStatus | couponStatuseFil }}</text>
					</view>
					<view class="flex-row row-item">
						<text class="row-left">可用城市</text>
						<text class="row-right">{{ detail.cityConfigStr ? detail.cityConfigStr : '不限' }}</text>
					</view>
					<view v-if="getList.length > 0" class="flex-row row-item" style="justify-content: flex-start;">
						<text class="row-left">可用线路</text>
						<view class="row-right-content">
							<text class="row-right" v-for="(item, index) in getList" :key="index">{{ item }}</text>
						</view>
					</view>

					<view v-if="getList.length > 0&&list.length>3" @click="onSpread" class="flex-start" style="justify-content: center;">
						<text class="txt-spread">{{ spread ? '收起' : '展开' }}</text>
						<u-icon :name="spread ? 'arrow-up' : 'arrow-down'" color="#999999" size="28"></u-icon>
					</view>
				</view>
				<view class="discounts-item">
					<text class="txt-title">优惠券说明</text>
					<view v-html="detail.templateDesc" class="row-des" style="margin-top: 16rpx;margin-bottom: 12rpx;white-space: pre-wrap;">
						
					</view>
					<!-- <view class="row-des" style="margin-top: 16rpx;">1.优惠券使用后，不会退回</view>
					<view class="row-des">2.优惠券不能兑换成现金</view>
					<view class="row-des">3.优惠券无法叠加使用</view>
					<view class="row-des">4.如有疑问，请联系客服</view>
					<view class="row-des" style="margin-bottom: 12rpx;">5.使用优惠券的订单,进入待支付状态,订单失效后,优惠券不退回</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { parseTime } from '@/utils/common';
import moment from '@/utils/moment.js';
import { couponDetail } from '@/api/activity.js';
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
export default {
	data() {
		return {
			detail: {},
			spread: false,
			list: [],
			statusBarHeight: statusBarHeight
		};
	},
	filters: {
		couponStatuseFil(val) {
			let map = {
				1: '待使用',
				2: '已使用',
				3: '已使用'
			};
			return map[val];
		}
	},
	computed: {
		getList() {
			var copyList = this.list.concat();
			console.log("copyList",copyList)
			return this.spread ? copyList : copyList.splice(0, 3);
		}
	},
	onLoad(options) {
		if (options.couponId) {
			console.log('sss', options.couponId);
			this.getCouponDetail(options.couponId);
		}
		//console.log('spread', this.getList);
	},
	methods: {
		parseTime(time, cFormat) {
			if (!time) return '';
			return parseTime(moment(time).valueOf(), cFormat);
		},
		onSpread() {
			this.spread = !this.spread;
		},
		getCouponDetail(couponId) {
			couponDetail(couponId).then(res => {
				if (res.code == 0 && res.data) {
					if (res.data.lineConfigStr) {
						this.list = res.data.lineConfigStr.split(',');
					}
					this.detail = res.data;
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
.discounts-box {
	min-height: 100vh;
	background: #f0f1f4;
}

.discounts-container {
	display: flex;
	position: relative;

	.head-title {
		top: 0rpx;
		left: 0rpx;
		right: 0rpx;
		z-index: 6;
		height: 222rpx;
		position: absolute;
		padding: 0rpx 24rpx;
		@include fs(32rpx, 600, #272727, 45rpx);
		background: linear-gradient(180deg, #ffffff 0%, #f0f1f4 100%);
	}

	.bottom-content {
		width: 100%;
		z-index: 10;
		margin-top: 80rpx;
	}

	.discounts-item {
		padding: 24rpx;
		background: #ffffff;
		border-radius: 20rpx;
		margin: 0rpx 24rpx 20rpx;

		.txt-title {
			margin-bottom: 12rpx;
			@include fs(30rpx, 600, #272727, 42rpx);
		}

		.row-item {
			margin: 12rpx 0rpx;
		}

		.row-left {
			min-width: 200rpx;
			@include fs(28rpx, 400, #999999, 40rpx);
		}

		.flex-row {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
		}

		.row-right-content {
			display: flex;
			flex-direction: column;
		}
		.row-right {
			flex: 1;
			@include fs(28rpx, 400, #272727, 40rpx);
		}

		.row-des {
			@include fs(24rpx, 400, #999999, 40rpx);
		}

		.txt-spread {
			margin-right: 12rpx;
			@include fs(24rpx, 400, #999999, 34rpx);
		}
	}
}

</style>
