<template>
	<u-popup v-model="visible" mode="bottom" bgColor="#FFF8F8F8" z-index="30000" safe-area-inset-bottom @close="visible = false">
		<view class="content">
			<scroll-view scroll-y="true" class="bottom-content">
				<view class="content-item" v-for="(item, index) in listData" :key="index" @click="onSelect(index)">
					<view class="flex-row">
						<view class="flex-row">
							<text class="txt-des1">{{ item.couponType === 1 ? item.reduceAmount : item.discount }}</text>
							<text class="txt-des2">{{ item.couponType === 1 ? '元' : '折' }}</text>
						</view>
						<view style="flex: 1;margin: 0rpx 16rpx;">
							<view class="txt-des3">{{ item.templateTitle }}</view>

							<view class="txt-des4">优惠上限：{{ item.couponType === 2 ? item.maxDiscountAmount : '不限' }}</view>
						</view>
						<!-- 		<image class="item-check"></image> -->
						<image v-if="checkIndex == index" class="item-check" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select-active.png"></image>
						<image v-else class="item-check" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select.png"></image>
					</view>
					<view class="txt-des5">满{{ item.withAmount }}可用</view>
					<view class="line-centent" style="margin-top: 12rpx;">
						<view class="left"></view>
						<view class="line"></view>
						<view class="right"></view>
					</view>
					<text class="txt-des6">有效期限：{{ parseTime(item.couponStartTime, '{y}/{m}/{d}') }}-{{ parseTime(item.couponEndTime, '{y}/{m}/{d}') }}</text>
				</view>
			</scroll-view>
			<view class="bottom-btn">
				<!-- 	<view class="price-content">
				<text>价格</text>
				<text class="txt-price">¥ {{ popupData.orderAmount }}</text>
			</view> -->
				<button @click="onConfirm" class="btn">确认</button>
			</view>
		</view>
	</u-popup>
</template>

<script>
import moment from '@/utils/moment.js';
import { parseTime, throttle } from '@/utils/common';
import { couponChoose } from '@/api/discounts.js';

export default {
	name: 'popupDiscounts',
	props: {
		selectIndex: {
			type: Number,
			default: -1
		},
		popVisible: {
			type: Boolean,
			default: false
		},
		listData: {
			type: Array,
			default: []
		}
	},
	computed: {
		visible: {
			get() {
				return this.popVisible;
			},
			set(val) {
				this.$emit('update:popVisible', val);
			}
		}
		// checkIndex: {
		// 	get() {
		// 		console.log('get', this.selectIndex);
		// 		return this.selectIndex;
		// 	},
		// 	set(val) {
		// 		console.log("val==>",val)
		// 		this.$emit('update:selectIndex', val);
		// 	}
		// }
	},
	data() {
		return {
			// list: [],
			checkIndex: -1
			// paramData: {
			// 	couponStatus: 1,
			// 	busType: this.popupData.busType,
			// 	orderAmount: this.popupData.orderAmount,
			// 	charteredCarType: this.popupData.charteredType,
			// 	departureCityCode: this.popupData.departureCityCode
			// }
		};
	},
	created() {
		this.checkIndex = this.selectIndex;
		console.log('----', this.popupData);
		// couponChoose(this.paramData).then(res => {
		// 	if (res.code == 0) {
		// 		this.list = res.data;
		// 	} else {
		// 		uni.showToast({
		// 			title: res.msg,
		// 			icon: 'none'
		// 		});
		// 	}
		// });
	},
	methods: {
		parseTime(time, cFormat) {
			if (!time) return '';
			return parseTime(moment(time).valueOf(), cFormat);
		},
		onSelect(index) {
			console.log('index', index);
			this.checkIndex = index;
			console.log('index', this.checkIndex);
		},
		onConfirm() {
			console.log('点击');
			this.$emit('onReuslt', { index: this.checkIndex, item: this.listData[this.checkIndex] });
			this.visible = false;
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	padding: 20rpx 0rpx;
	position: relative;
	background-color: #f8f8f8;
}

.bottom-btn {
	left: 32rpx;
	right: 32rpx;
	bottom: 16rpx;
	position: absolute;
	// background-color: #fff;

	//padding: 32rpx 32rpx 16rpx;
	// border-top: 1rpx solid #dfdfdf;

	.price-content {
		flex: 1;
		@include fs(32rpx, 400, #666666, 45rpx);
	}

	.txt-price {
		margin-left: 6rpx;
		@include fs(40rpx, 500, #111111, 56rpx);
	}

	.btn {
		width: 620rpx;
		background: #111111;
		border-radius: 88rpx;
		@include fs(28rpx, 500, #fff, 88rpx);
	}
}

.flex-row {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
}

.bottom-content {
	max-height: 800rpx;

	.content-item {
		flex-shrink: 0;
		margin: 20rpx 32rpx;
		border-radius: 20rpx;
		background-color: #fff;
		padding: 32rpx 32rpx 0rpx;

		.txt-des1 {
			@include fs(84rpx, 500, #cba56a, 72rpx);
		}

		.txt-des2 {
			margin-top: 30rpx;
			@include fs(36rpx, 500, #cba56a, 42rpx);
		}

		.txt-des3 {
			@include fs(32rpx, 500, #111111, 45rpx);
		}

		.txt-des4 {
			margin-top: 16rpx;
			@include fs(24rpx, 400, #666666, 32rpx);
		}

		.txt-des5 {
			margin-left: 60rpx;
			@include fs(24rpx, 400, #666666, 32rpx);
		}

		.txt-des6 {
			@include fs(24rpx, 400, #666666, 76rpx);
		}

		.item-check {
			width: 44rpx;
			height: 44rpx;
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
				width: 100%;
				height: 1rpx;
				background-color: #dfdfdf;
			}
		}
	}
}
</style>
