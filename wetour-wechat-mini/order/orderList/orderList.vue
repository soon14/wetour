<template>
	<view class="order">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="订单列表" color="#272727">
			<view @click="toPages('/pages/user/index')" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</view>
		</uni-nav-bar>
		<view class="content">
			<view class="order-menu" :style="{ top: `${statusBarHeight}` }">
				<view
					v-for="(item, index) in menu"
					@click="menuchoose(item.id)"
					:key="item.id"
					:class="[item.id === listKey.orderStatusTab ? 'order-menu-li-choose order-menu-li' : 'order-menu-li']"
				>
					<view>{{ item.name }}</view>
					<view class="order-menu-li-te"></view>
				</view>
			</view>
			<view class="order-list">
				<view class="order-item" v-for="(item, index) in list" :key="index" @click="goDetail(item.orderNo)">
					<view class="flex-between mb24">
						<text class="txt-title">{{ item.charteredCarType | charteredCarTypeFil }}</text>
						<view class="flex-start">
							<text class="txt-state">{{ item.orderStatusShow }}</text>
							<image style="width: 24rpx;height: 24rpx;margin-left: 8rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/right2.png"></image>
						</view>
					</view>
					<view class="flex-start" style="line-height: 36rpx;">
						<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/time_icon.png" class="navigation-icon2"></image> -->
						<text>{{ dateChange(item.departureStartTime) }}</text>
						<text v-if="item.departureEndTime">-{{ dateChange(item.departureEndTime) }}</text>
						<view class="txt-content2" v-else-if="item.charteredCarType != 2">当地时间</view>
						<view class="txt-content2" v-else>落地时间</view>
					</view>
					<view class="flex-between" style="margin-bottom: 6rpx;">
						<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/address_icon.png" class="navigation-icon"></image> -->
						<text>{{ item.departureAddress }}</text>
						<text v-if="!item.destinationAddress" class="money">￥{{ item.payAmount }}</text>
					</view>
					<view class="flex-between" style="margin-top: 6rpx;" v-if="item.destinationAddress">
						<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/address_icon.png" class="navigation-icon"></image> -->
						<text>{{ item.destinationAddress }}</text>
						<text class="money">￥{{ item.payAmount }}</text>
					</view>
					<!-- <text>用车时间：02.17 12:45 - 02.17 12:45</text>
					<text>用车数：5辆</text> -->
					<view v-if="item.orderStatus === 11" class="flex-end" style="margin-top: 12rpx;">
						<view class="btn-quote">取消</view>
						<view class="btn-quote2" @tap.stop="paymoney(item.orderNo)">支付</view>
					</view>
				</view>
				<uni-load-more :status="more" color="#333" @click="manualLoad" :style="{ padding: '40rpx 0' }" v-if="list.length > 0" />
				<noDataView :top="top" v-if="!list.length" text="暂无订单记录"></noDataView>
			</view>
		</view>
	</view>
</template>

<script>
var top = uni.getSystemInfoSync().windowHeight / 2;
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
import { orderList, orderDetail } from '@/api/order.js';
import { loadList } from '@/mixins';
import { orderState } from '@/mixins/order.js';
import { parseTime, throttle } from '@/utils/common';
import noDataView from '@/components/noDataView.vue';
export default {
	mixins: [loadList, orderState],
	components: {
		noDataView
	},
	data() {
		return {
			loadListApi: orderList,
			statusBarHeight: statusBarHeight,
			menu: [
				{
					name: '全部',
					id: 0
				},
				{
					name: '待支付',
					id: 1
				},
				{
					name: '已支付',
					id: 2
				},
				{
					name: '已失效',
					id: 3
				}
			],
			listKey: {
				orderStatusTab: 0
			},
			top: top,
			// list: [1, 2, 3, 4],
			nowmenu: 0, //当前选择的菜单
			isload: false, //第一次进入页面
			requestLocked: false
		};
	},
	filters: {
		charteredCarTypeFil(val) {
			let map = {
				1: '包车',
				2: '接机',
				3: '送机',
				4: '单程'
			};
			return map[val];
		}
	},
	onLoad(options) {
		if (options.current) {
			console.log('options.current', options.current);
			// this.$nextTick(() => {
			this.listKey.orderStatusTab = parseInt(options.current);

			console.log('options.current', this.listKey.orderStatusTab);
			// });
		}
		console.log('到底了', this.top);
		// this.loadList()
	},
	onShow(options) {
		///console.log("options",options)
		this.reset();
		console.log('options.current', this.listKey.orderStatusTab);
	},
	methods: {
		reset() {
			this.queryParams = {
				current: 1,
				size: 10
			};
			this.list = [];
			this.more = 'more';
			this.loadList();
		},
		menuchoose(id) {
			//点击切换标签

			if (this.listKey.orderStatusTab === id) {
				return false;
			}
			this.listKey.orderStatusTab = id;
			this.queryParams.current = 1;
			this.list = [];
			this.more = 'more';
			this.loadList();
		},
		goDetail: throttle(function(orderno) {
			uni.navigateTo({
				url: '/order/orderDetail/orderDetail?orderNo=' + orderno
			});
		}, 1500),
		toPages: throttle(function(url) {
			console.log('我是列表页');
			uni.reLaunch({
				url
			});
		}, 1500),
		async paymoney(orderNo) {
			if (this.requestLocked) return false;
			let res = await orderDetail(orderNo);
			if (res.data.orderStatus !== 11) {
				this.$u.toast('订单状态已变更');
				this.reset();
				return false;
			}
			let payResponse = res.data.payResponse;
			let _this = this;

			// uni.navigateTo({
			// 	url:`/subPages/orderinfo/success?orderNo=${res.data.orderNo}`
			// })
			let myData = {
				timeStamp: payResponse.timeStamp,
				nonceStr: payResponse.nonceStr,
				package: payResponse.packageValue,
				packageValue: payResponse.packageValue,
				signType: payResponse.signType,
				paySign: payResponse.paySign
			};
			// console.log(myData,'myData-----------------------')

			this.requestLocked = true;
			uni.requestPayment({
				...myData,
				success: function(res) {
					_this.requestLocked = false;
					// uni.hideLoading()
					// wx.setStorageSync('orderdatalist', false)
					// console.log(res,'res')
					// wx.navigateTo({
					// 	url: '/pages/chartered/offerDetails/chartedpaySuccess/index?order_id=' + that.data.order_no,
					// })
					_this.reset();
				},
				fail: function(res) {
					_this.requestLocked = false;
				}
			});
		},
		onReachBottom() {
			console.log('到底了');
			// if(this.userInfo.mobile){
			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(this.loadList, 400);
			// }
		}
	}
};
</script>

<style scoped lang="scss">
.order {
	height: 100vh;
	background-color: #f8f8f8;
}
.content {
	width: 100%;
	position: relative;
	overflow-y: scroll;
	padding-top: 92rpx;
}

.order-menu {
	width: 100%;
	display: flex;
	justify-content: space-around;
	position: fixed;
	top: 0;
	left: 0;
	background-color: #fff;
	z-index: 50;
	border-bottom: 1rpx solid #dfdfdf;

	.order-menu-li {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 70rpx;
		color: #111111;
		display: flex;
		flex-direction: column;
		align-items: center;

		.order-menu-li-te {
			width: 96rpx;
			height: 6rpx;
			background: #ffffff;
			margin-top: 6rpx;
		}
	}

	.order-menu-li.order-menu-li-choose {
		color: #111111;
		font-weight: 500;

		.order-menu-li-te {
			background: #111111;
		}
	}
}

.order-list {
	padding: 10rpx 32rpx 0;
}
.order-item {
	display: flex;
	flex-direction: column;
	margin-bottom: 20rpx;
	padding: 24rpx 32rpx;
	border-radius: 20rpx;
	background-color: #fff;
	@include fs(28rpx, 400, #666666, 40rpx);

	.txt-title {
		margin-top: 8rpx;
		@include fs(36rpx, 500, #111111, 42rpx);
	}

	.txt-state {
		@include fs(24rpx, 400, #666666, 42rpx);
	}

	.navigation-icon {
		width: 20rpx;
		height: 24rpx;
		margin-right: 10rpx;
	}

	.navigation-icon2 {
		width: 22rpx;
		height: 22rpx;
		margin-right: 10rpx;
	}
}

.mb24 {
	margin-bottom: 24rpx;
}

.flex-start {
	margin-bottom: 16rpx;
	position: relative;
}

.money {
	@include fs(36rpx, 500, #111111, 42rpx);
}

.flex-end {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.btn-quote {
	text-align: center;
	width: 124rpx;
	background: #ffffff;
	border: 2rpx solid #bbb;
	opacity: 1;
	border-radius: 36rpx;
	margin-right: 20rpx;
	border: 2rpx solid #111111;
	@include fs(24rpx, 500, #111111, 58rpx);
}

.btn-quote2 {
	text-align: center;
	width: 124rpx;
	background: #111111;
	opacity: 1;
	border-radius: 36rpx;
	@include fs(24rpx, 600, #fff, 60rpx);
}

.txt-content2 {
	width: 96rpx;
	margin: 0rpx 12rpx;
	text-align: center;
	border-radius: 4rpx;
	border: 1rpx solid #cba56a;
	@include fs(20rpx, 400, #cba56a, 32rpx);
}
</style>
