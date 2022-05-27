<template>
	<!-- :class="{brl0:tabType==1,brr0:tabType==4,}" -->
	<view class="appointment-container">
		<!-- 	<view class="appointment-bg"></view> -->
		<view class="appointment-tabs">
			<view class="appointment-tabs-item" :class="{ active: tabType == 1 }" @tap="setTabType(1)">
				<text class="relative">日包</text>
			</view>
			<view class="line"></view>
			<view class="appointment-tabs-item" :class="{ active: tabType == 2 }" @tap="setTabType(2)">
				<text class="relative">接机</text>
				</view>
			<view class="line"></view>
			<view class="appointment-tabs-item" :class="{ active: tabType == 3 }" @tap="setTabType(3)">
				<text class="relative">送机</text>
			</view>
			<view class="line"></view>
			<view class="appointment-tabs-item" :class="{ active: tabType == 4 }" @tap="setTabType(4)">
				<text class="relative">单程</text>
			</view>
			<view class="tab-type-active" :style="{ left: typeActiveLeft }">
				<view class="active-line"></view>
				<!-- <u-image width="398rpx" height="90rpx" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourdex/tab-type-active.png"></u-image> -->
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourdex/tab-type-active.png" style="width:398rpx;height:90rpx;"></image> -->
			</view>
		</view>

		<view class="tabs-container">
			<!-- -->
			<view v-if="orderData && orderData.serverTime"  class="flex-start" style="justify-content: center;">
				<view class="order-box " @click="goOrderDetail">您有一个订单将在{{ countDown }}后关闭，点击查看</view>
			</view>
			<charterView v-show="tabType == 1" />
			<airportPickup v-show="tabType == 2" />
			<aircraftGive v-show="tabType == 3" />

			<one-way-view v-show="tabType == 4" />
			<!-- <go-back-view v-show="tabType==2" /> -->
			<!-- <daily-rent-view v-show="tabType==3" /> -->
			<view class="tabs-tip flex-between">
				<view class="tip-item flex-start">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/tipImg.png" mode="" style="height: 20rpx;width: 24rpx;"></image>
					<view class="tip-text">专属服务</view>
				</view>
				<view class="tip-item flex-start">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/tipImg.png" mode="" style="height: 20rpx;width: 24rpx;"></image>
					<view class="tip-text">自由行程</view>
				</view>
				<view class="tip-item flex-start">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/tipImg.png" mode="" style="height: 20rpx;width: 24rpx;"></image>
					<view class="tip-text">自营车辆</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// import goBackView from "./appointmentComponents/goBack"
import charterView from './charter';
import oneWayView from './oneWay';
import airportPickup from './airportPickup';
import aircraftGive from './aircraftGive';

// import dailyRentView from "./appointmentComponents/dailyRent"

// import amapFile from "@/libs/amap-wx.js"
import bus from '@/utils/bus';
// import {getQuotes} from "@/api/digital.js"
import { mapGetters } from 'vuex';
import { getTipOrder } from '@/api/order.js';
export default {
	name: 'appointment',
	data() {
		return {
			tabType: 1,
			typeActiveLeft: '40rpx',
			stationsData: {},
			// not_read_count:0,
			orderData: null,
			countDown: '',
			time: null
		};
	},
	components: {
		// goBackView,
		charterView,
		'one-way-view': oneWayView,
		airportPickup,
		aircraftGive
		// dailyRentView,
	},
	computed: {
		...mapGetters(['city_id', 'userInfo', 'access_token'])
	},
	watch: {
		access_token() {
			// this.getOrderList()
		}
	},
	onHide() {
		console.log(7777777);
	},
	destroyed() {
		// console.log(6666666)
		// this.$off('clearTime',this.clearTime )
		// if (this.time) {
		// 	clearInterval(this.time)
		// 	this.time = null
		// }
	},
	created() {
		console.log('created');
		// bus.$on('clearTime', this.clearTime )
		// bus.$on('setCharterAirport', this.setCharterAirport )
		// bus.$on('setCharterAddress', this.setCharterAddress )
	},
	beforDestory() {
		// 	console.log('beforDestory')
		// 　　this.$off('clearTime',this.clearTime )
		// 	this.$off('setCharterAirport',this.setCharterAirport )
		// 　　this.$off('setCharterAddress',this.setCharterAddress )
	},
	methods: {
		clearTime() {
			if (this.time) {
				clearInterval(this.time);
				this.time = null;
			}
		},
		goOrderDetail() {
			uni.navigateTo({
				url: `/order/orderDetail/orderDetail?orderNo=${this.orderData.orderNo}`
			});
		},
		getOrderList() {
			this.clearTime();

			let data = {
				current: 1,
				size: 1,
				orderStatusTab: 1
			};
			getTipOrder(data).then(res => {
				if (this.time) {
					clearInterval(this.time);
					this.time = null;
				}
				if (res.code == 0) {
					this.orderData = res.data;
					if (this.orderData && this.orderData?.serverTime) {
						this.showtime();
						this.time = setInterval(() => {
							this.orderData.serverTime = Number(this.orderData.serverTime) + 1;
							this.showtime();
						}, 1000);
					}
				}
			});
		},
		showtime(bol) {
			let nowtime = this.orderData.serverTime;
			let endtime = this.orderData.expired;
			let lefttime = endtime - nowtime;
			if (lefttime > 0) {
				let leftm = Math.floor((lefttime / 60) % 60);
				let lefts = Math.floor(lefttime % 60);
				this.countDown = (leftm < 10 ? '0' + leftm : leftm) + ':' + (lefts < 10 ? '0' + lefts : lefts);
			} else {
				this.orderData = null;
				clearInterval(this.time);
				this.time = null;

				// setTimeout(()=>{
				// 	this.getOrderList()
				// },bol?1500:0)
			}
		},
		setTabType(type) {
			if (this.tabType != type) {
				this.tabType = type;
				this.typeActiveLeft = (type - 1) * 172.5 + 40 + 'rpx';
			}
		}
		// getNotReadQuotes() {
		// 	getQuotes()
		// 		.then((res) => {
		// 			this.not_read_count =
		// 				res.data.not_read_count > 99
		// 				? '99+'
		// 				: res.data.not_read_count || 0

		// 		})
		// },
	}
};
</script>

<style scoped lang="scss">
.appointment-container {
	margin: -95rpx 32rpx 0rpx 32rpx;
	background: #ffffff;
	box-shadow: 0rpx 4rpx 20rpx 1rpx rgba(32, 32, 32, 0.03);
	position: relative;
	overflow-x: hidden;
	background: #ffffff;
	border-radius: 20rpx;
	.appointment-bg {
		margin: 0 16rpx;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(20rpx);
		height: 90rpx;
		width: calc(100% - 32rpx);
		position: absolute;
		top: 10rpx;
		left: 0;
	}
	.line {
		width: 1rpx;
		height: 28rpx;
		background: #666666;
	}
	.appointment-tabs {
		z-index: 10;
		width: 100%;
		display: flex;
		align-items: center;
		margin: 40rpx 0rpx 25rpx 0rpx;
		position: relative;
		overflow-x: hidden;
		// background-color: #cba56a;
		// background-color: red;

		&-item {
			width: 25%;
			height: 100%;
			min-height: 56rpx;
			text-align:center;
			// background-color: greenyellow;
			transition: all 0.3s ease-in;
			@include fs(32rpx, 400, #666666, inherit);
			

			.relative {
				// background-color: red;
				z-index: 999;
				position: relative;
			}

			&.active {
				@include fs(36rpx, 600, #111111, inherit);
			}
		}
		.tab-type-active {
			bottom: 10rpx;
			position: absolute;
			transition: all 0.3s linear;

			.active-line {
				width: 96rpx;
				height: 15rpx;
				background: #cba56a;
				border-radius: 0rpx 0rpx 0rpx 0rpx;
			}
		}
	}
	.tabs-container {
		min-height: 300rpx;
		position: relative;
		justify-content: center;
		padding: 0 33rpx 37rpx;
		transition: all 0.3s linear;

		.order-box {
			text-align: center;
			width: 552rpx;
			color: #cba56a;
			font-size: 26rpx;
			font-weight: 600;
			padding: 12rpx 32rpx;
			background-color: #f8f2eb;
			margin: 14rpx 0rpx 20rpx;
			border-radius: 30rpx 30rpx 30rpx 0rpx;
		}
		&::before {
			content: '';
			display: table;
		}
	}
	.tabs-tip {
		// margin-top: 40rpx;
		margin: 40rpx 25rpx 0rpx;
		.tip-text {
			@include fs(24rpx, 400, #666666, 28rpx);
			margin-left: 12rpx;
		}
	}
}

// .brl0 {
// 	.tabs-container {
// 		border-top-left-radius: 0;
// 	}
// 	.appointment-tabs-item.active {
// 		margin-top: -10rpx;
// 		padding-top: 20rpx;
// 		border-radius: 20rpx 105rpx 0 0;
// 		background: #fff;
// 	}
// }
// .brr0 {
// 	.tabs-container {
// 		border-top-right-radius: 0;
// 	}
// 	.appointment-tabs-item.active {
// 		margin-top: -10rpx;
// 		padding-top: 29rpx;
// 		border-radius: 105rpx 20rpx 0 0;
// 		background: #fff;
// 	}
// }
</style>
