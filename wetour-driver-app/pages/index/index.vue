<template>
	<view class="indexBox">
		<view class="head">
			<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="微途伙伴" color="#272727"></uni-nav-bar>

			<view
				style="width: 100%; background-color: #fff;
			padding-bottom: 15rpx;z-index: 999;"
			>
				<view v-if="userInfo.partnerStatus == 0" class="account_disabled" @click="onService">
					<view class="account_disabled_txt">账号已被停用，无法接单，请点击联系客服启用账号</view>
					<view class="account_disabled_txt2">停用原因：{{ userInfo.disableReason || '请及时更新司机车辆信息' }}</view>
				</view>
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
				:up="upOption"
				:down="downOption"
				top="0"
				class="main-container"
			>
				<view class="index-item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
					<view class="flex-between">
						<text class="index-item_title">{{ item.charteredCarType | busStatusFil }}</text>
						<text class="index-item_state">{{ item.inquiryStatusShow }}</text>
					</view>
					<view class="index-item_txt">用车时间：{{ item.departureStartTime }}</view>

					<view class="flex-col">
						<view class="flex-row" @click.stop="gomapApp(item, 1)">
							<image  class="index-item_img" src="@/static/newImg/navigation_icon.png" />
<!-- 							<image v-else class="index-item_img" src="@/static/newImg/address_icon.png" /> -->
							<text class="index-item_txt">{{ item.departureCity }}{{ item.departureAddress }}</text>
						</view>

						<view class="flex-row" v-if="item.charteredCarType != 1" @click.stop="gomapApp(item, 2)">
							<image  class="index-item_img" src="@/static/newImg/navigation_icon.png" />
							<!-- <image v-else class="index-item_img" src="@/static/newImg/address_icon.png" /> -->
							<text class="index-item_txt">{{ item.destinationCity }}{{ item.destinationAddress }}</text>
						</view>
					</view>

					<view class="flex-between">
						<text class="index-item_txt">用车数：{{ item.busCnt }}辆</text>
						<view @click.stop="onStop(item)" class="index-item_btn" v-if="item.inquiryStatus == 4">结束服务</view>
						<view v-else-if="item.inquiryStatus == 3" @click.stop="onOut(item)" class="index-item_btn">{{ item.bindStatus == 0 ? '绑定司机车辆' : '立即出行' }}</view>

						<text v-else class="index-item_txt">
							指导价：
							<text style="font-weight: 600;">{{ item.currency }}{{ item.guideRealAmount }}</text>
						</text>
					</view>

					<view v-if="item.inquiryStatus == 1" class="index-item_offer" :style="{ opacity: item.surplusExpired == 0 ? 0.2 : 1 }">
						<u-count-down v-if="showDown(item)" :timestamp="item.surplusExpired" @change="change(item, $event)"></u-count-down>
						立即报价
					</view>
				</view>
			</mescroll-uni>
		</view>

		<tabbarView />
	</view>
</template>

<script>
import bus from '@/utils/bus';
import { mapGetters } from 'vuex';
import { throttle } from '@/utils/common';

import { listOrderInquiryForWork, beginService, finishService } from '@/api/index.js';
import { getDetail } from '@/api/login.js';

import navTo from '@/utils/navigation.js';

import tabbarView from '@/components/tabbarView.vue';
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';

export default {
	mixins: [MescrollMixin],
	computed: {
		...mapGetters(['userInfo'])
	},

	components: {
		tabbarView
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
	data() {
		return {
			downOption: {
				auto: false //是否在初始化后,自动执行downCallback; 默认true
			},
			upOption: {
				empty: {
					fixed: true,
					top: '300rpx',
					icon: '/static/img/no_order.png' // 图标路径
				}
			},
			listKey: {
				lineStatus: 1,
				driverId: ''
			},
			tabs: [
				{
					count: 0,
					name: '待报价'
				},
				{
					count: 0,
					name: '待服务'
				},
				{
					count: 0,
					name: '服务中'
				}
			],
			list: [],
			current: 0,
			queryParams: {
				size: 10,
				current: 1,
				queryStatus: 10 //10=待报价，20=待服务，30=服务中
			},
			statusBarHeight: statusBarHeight
		};
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
		// 打开的点击事件，传经纬度和地点名
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
		onService() {
			// #ifdef APP-PLUS
			//手机端的这样写
			plus.device.dial('4000918484', true);
			//#endif
			//H5的这样写
			uni.makePhoneCall({
				phoneNumber: '4000918484'
			});
		},
		upCallback(page) {
			this.queryParams.current = page.num;
			this.queryParams.queryStatus = (this.current + 1) * 10;
			listOrderInquiryForWork(this.queryParams)
				.then(res => {
					if (res.code == 0) {
						this.tabs[0].count = res.data.waitQuoteUnreadNumber;
						this.tabs[1].count = res.data.waitServiceUnreadNumber;
						this.tabs[2].count = res.data.serviceIngUnreadNumber;

						this.$store.dispatch('user/setTotalUnreadNumber', res.data.totalUnreadNumber);
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						this.mescroll.endSuccess(res.data.pageResult.records.length);
						//设置列表数据
						if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(res.data.pageResult.records); //追加新数据
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

			if (page.num == 1) {
				//如果是第一页获取用户详情修改启用停用
				getDetail().then(res => {
					if (res.code === 0) {
						this.$store.dispatch('user/setUserInfo', res.data);
					}
				});
			}
		},
		tabsChange(index) {
			this.$nextTick(() => {
				this.current = index;
				this.mescroll.optUp.empty.tip = `啊噢~您还没有${this.tabs[index].name}订单哟~`;
				this.mescroll.resetUpScroll();
			});
		},
		goDetail: throttle(function(item) {
			console.log('item', item);
			uni.navigateTo({
				url: '/pages/index/detail-index/index?id=' + item.id
			});
			// uni.navigateTo({
			// 	url: "/pages/register/register?country=" + this.userInfo.country + "&&change=true"
			// })
		}, 1000),
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
		}
	},
	onShareAppMessage: function(res) {
		return {
			title: '微巴士',
			path: ''
		};
	}
};
</script>

<style scoped lang="scss">
.indexBox {
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background-color: #f0f1f4;
}

/deep/ .u-countdown-item {
	margin-right: 10rpx;
	background-color: transparent !important;
}

.head {
	display: flex;
	flex-direction: column;

	.account_disabled {
		margin: 0rpx 16rpx;
		padding: 12rpx 20rpx;
		background-color: #fff9e0;

		&_txt {
			@include fs(24rpx, 400, #ea5d12, 33rpx);
		}

		&_txt2 {
			margin-top: 6rpx;
			@include fs(24rpx, 400, #777777, 33rpx);
		}
	}
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

	.index-item {
		margin: 20rpx 0rpx;
		background: #ffffff;
		border-radius: 12rpx;
		padding: 21rpx 20rpx;


		.flex-row {
			display: flex;
			margin: 5rpx 0rpx;
			align-items: center;	
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

		&_title {
			margin-bottom: 10rpx;
			@include fs(32rpx, 600, #272727, 45rpx);
		}

		&_state {
			margin-bottom: 10rpx;
			@include fs(32rpx, 400, #ff8800, 45rpx);
		}

		&_text {
			margin-bottom: 10rpx;
			@include fs(32rpx, 400, #555, 45rpx);
		}

		&_img {
			width: 20rpx;
			height: 20rpx;
			margin-right: 16rpx;
		}

		&_offer {
			height: 80rpx;
			text-align: center;
			background-color: #ffcc00;
			margin: 18rpx 14rpx;
			border-radius: 12rpx;
			margin-bottom: 10rpx;
			@include fs(28rpx, 600, #272727, 80rpx);
		}
	}
}

.customer-service-img {
	width: 100rpx;
	height: 100rpx;
	position: fixed;
	right: 0;
	bottom: 200rpx;
}
</style>
