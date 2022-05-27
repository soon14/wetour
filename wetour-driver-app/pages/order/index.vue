<template>
	<view class="order-box">
		<view class="head">
			<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="订单列表" color="#272727">
				<navigator open-type="navigateBack" slot="left" hover-class="none">
					<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;"></image>
				</navigator>
				<view @click="onAccount" class="btn-account" slot="right">结算</view>
			</uni-nav-bar>

			<view style="width: 100%; background-color: #fff;z-index: 999;">
				<u-tabs
					:list="tabs"
					:current="current"
					@change="tabsChange"
					:is-scroll="false"
					font-size="32"
					inactive-color="#555"
					active-color="#FF8800"
					lineWidth="40rpx"
					lineHeight="5rpx"
					lineColor="#FF8800"
					class="myTabs"
				></u-tabs>
			</view>
		</view>

		<view class="main">
			<mescroll-uni
				:fixed="false"
				ref="mescrollRef"
				@init="mescrollInit"
				@down="downCallback"
				@up="upCallback"
				top="0"
				:up="upOption"
				:down="downOption"
				class="main-container"
			>
				<view class="order-item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
					<view class="flex-between">
						<text class="txt-title">{{ item.charteredCarType | busStatusFil }}</text>
						<text class="txt-state">{{ item.inquiryStatusShow }}</text>
					</view>

					<view class="txt-des">用车时间：{{ item.departureStartTime }}</view>

					<view class="flex-col">
						<view class="flex-row" @click.stop="gomapApp(item, 1)">
							<image src="@/static/newImg/navigation_icon.png" class="navigation-icon"></image>
							<!-- <image v-else src="@/static/newImg/address_icon.png" class="navigation-icon"></image> -->
							<text class="txt-des">{{ item.departureCity }}{{ item.departureAddress }}</text>
						</view>

						<view class="flex-row" v-if="item.charteredCarType != 1" @click.stop="gomapApp(item, 2)">
							<image src="@/static/newImg/navigation_icon.png" class="navigation-icon"></image>
							<!-- <image v-else src="@/static/newImg/address_icon.png" class="navigation-icon"></image> -->
							<text class="txt-des">{{ item.destinationCity }}{{ item.destinationAddress }}</text>
						</view>
					</view>

					<view class="flex-between">
						<text class="txt-des">用车数：{{ item.busCnt }}辆</text>

						<view @click.stop="onStop(item)" class="order-item_btn" v-if="item.inquiryStatus == 4">结束服务</view>

						<view v-else-if="item.inquiryStatus == 3" @click.stop="onOut(item)" class="index-item_btn" v-else>
							{{ item.bindStatus == 0 ? '绑定司机车辆' : '立即出行' }}
						</view>

						<text v-else class="order-item_txt">
							指导价：
							<text style="font-weight: 600;">{{ item.currency }}{{ item.guideRealAmount }}</text>
						</text>
					</view>
					<view v-if="item.inquiryStatus == 1" class="btn-quote" :style="{ opacity: item.surplusExpired == 0 ? 0.2 : 1 }">
						<u-count-down v-if="showDown(item)" @change="change(item, $event)" :timestamp="item.surplusExpired"></u-count-down>
						立即报价
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>
<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
import { mapGetters } from 'vuex';
import { throttle } from '@/utils/common';

import { listOrderInquiryForMine, beginService, finishService } from '@/api/index.js';
import navTo from '@/utils/navigation.js';
import noDataView from '@/components/noDataView.vue';
import moment from '../../utils/moment.js';
export default {
	mixins: [MescrollMixin],
	components: {
		noDataView
	},
	data() {
		return {
			downOption: {
				auto: false //是否在初始化后,自动执行downCallback; 默认true
			},
			upOption: {
				empty: {
					fixed: true,
					top: '300rpx',
					icon: '/static/img/no_order.png', // 图标路径
					tip: '啊噢~您还没有订单哟~' // 提示
				}
			},

			list: [],
			current: 0,
			tabs: [
				{
					name: '全部'
				},
				{
					name: '已报价'
				},
				{
					name: '已服务'
				},
				{
					name: '已失效'
				}
			],
			queryParams: {
				size: 10,
				current: 1,
				queryStatus: 0 //0=全部，10=已报价，20=已服务，30=已失效
			},
			statusBarHeight: statusBarHeight
		};
	},
	computed: {
		...mapGetters(['userInfo', 'access_token', 'city_id'])
	},
	filters: {
		busStatusFil(val) {
			let map = {
				1: '日租',
				2: '接机',
				3: '送机',
				4: '单程'
			};
			return map[val];
		}
	},
	onLoad(e) {
		if (e.current != undefined) {
			this.current = e.current;
		}
	},
	onShow() {
		this.tabsChange(this.current);
	},
	methods: {
		change(item, timestamp) {
			item.surplusExpired = timestamp;
		},
		showDown(item) {
			if (item.surplusExpired <= 0) {
				return false;
			} else {
				return item.surplusExpired <= 1 * 60 * 60;
			}
		},
		gomapApp(item, type) {
			let name = '';
			let latitude = '';
			let longitude = '';
			if (type == 1) {
				name = item.departureAddress;
				latitude = item.departureLatitude;
				longitude = item.departureLongitude;
			} else {
				name = item.destinationAddress;
				latitude = item.destinationLatitude;
				longitude = item.destinationLongitude;
			}

			navTo(name, latitude, longitude, item.country == '中国' ? true : false);
		},
		upCallback(page) {
			this.queryParams.current = page.num;
			this.queryParams.queryStatus = this.current * 10;
			listOrderInquiryForMine(this.queryParams)
				.then(res => {
					if (res.code == 0) {
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						this.mescroll.endSuccess(res.data.records.length);
						//设置列表数据
						if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(res.data.records); //追加新数据
					} else {
						//联网失败, 结束加载
						this.mescroll.endErr();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})
				.catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
		},
		tabsChange(index) {
			this.$nextTick(() => {
				this.current = index;
				this.mescroll.optUp.empty.tip = `啊噢~您还没有${index !== 0 ? this.tabs[index].name : ''}订单哟~`;
				this.mescroll.resetUpScroll();
			});
		},
		onStop(item) {
			var self = this;
			var data = {
				id: item.id,
				orderNo: item.orderNo
			};
			finishService(data).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: '结束服务成功！',
						icon: 'none',
						success() {
							self.mescroll.resetUpScroll();
						}
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		onOut(item) {
			var self = this;
			if (item.bindStatus == 0) {
				this.goDetail(item);
			} else {
				beginService(item.id).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '立即出行成功！',
							icon: 'none',
							success() {
								self.mescroll.resetUpScroll();
							}
						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}
		},
		onAccount: throttle(function(item) {
			uni.navigateTo({
				url: '/pages/account/apply-account/index'
			});
		}, 1000),
		goDetail: throttle(function(item) {
			console.log(item, item.orderNo, 'orderNo--------------');
			uni.navigateTo({
				url: '/pages/index/detail-index/index?id=' + item.id
			});
		}, 1000)
	}
};
</script>

<style scoped lang="scss">
@import '@/styles/data.scss';

.order-box {
	display: flex;
	overflow: hidden;
	min-height: 100vh;
	flex-direction: column;
	background-color: #f5f5f5;
}

/deep/ .u-countdown-item {
	margin-right: 10rpx;
	background-color: transparent !important;
}

.head {
	display: flex;
	flex-direction: column;
}

.main {
	flex: 1;
	z-index: 88;
	position: relative;
	background-color: #f5f5f5;
}

.main-container {
	top: 0;
	left: 0;
	right: 0;
	bottom: 10;
	z-index: 666;
	display: flex;
	padding: 0rpx 16rpx;
	position: absolute;
	flex-direction: column;

	.order-item {
		margin: 20rpx 0rpx;
		padding: 20rpx 28rpx;
		border-radius: 16rpx;
		background-color: #fff;

		.flex-row {
			display: flex;
			align-items: center;
			margin: 5rpx 0rpx;
		}

		.flex-col {
			width: auto;
			display: inline-block;
		}

		&_btn {
			padding: 16rpx 44rpx;
			text-align: center;
			border-radius: 16rpx;
			background-color: #ffcc00;
			@include fs(28rpx, 400, #272727, 40rpx);
		}

		.txt-title {
			@include fs(32rpx, 600, #272727, 45rpx);
		}

		.txt-state {
			@include fs(32rpx, 400, #ff8800, 45rpx);
		}

		.txt-des {
			margin-top: 7rpx;
			@include fs(32rpx, 400, #272727, 45rpx);
		}

		.navigation-icon {
			width: 20rpx;
			height: 24rpx;
			margin-right: 10rpx;
		}

		.btn-quote {
			height: 80rpx;
			text-align: center;
			background: #ffcc00;
			border-radius: 12rpx;
			margin: 18rpx 14rpx 0rpx 14rpx;
			@include fs(32rpx, 400, #272727, 80rpx);
		}
	}
}

.btn-account {
	@include fs(28rpx, 400, #272727, 40rpx);
}

.myTabs {
	/deep/ .u-tab-bar {
		bottom: -6rpx;
		border-radius: 5rpx;
	}
}
</style>
