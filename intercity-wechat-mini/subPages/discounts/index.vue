<template>
	<view class="discounts-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="我的优惠券" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>

		<view class="discounts-container" :style="{ 'min-height': `calc(100vh - ${statusBarHeight})` }">
			<view style="position: fixed;width: 100%;z-index: 999;" :style="{ top: statusBarHeight }">
				<u-tabs
					:list="tabs"
					:current="current"
					@change="tabsChange"
					:is-scroll="false"
					font-size="32"
					inactive-color="#666666"
					active-color="#000000"
					lineWidth="40rpx"
					lineHeight="5rpx"
					lineColor="#FFCC00"
					class="myTabs"
				></u-tabs>
			</view>
			<view class="discounts-list" :style="{ 'padding-top': current == 0 ? '104rpx' : '84rpx' }">
				<view v-if="current == 0" class="flex-start">
					<u-input class="convert-input" v-model="exchangeKey" maxlength="10" placeholder="输入兑换码" clearable />
					<button @click="onConvert" class="convert-btn">兑换</button>
				</view>

				<view class="discounts-item flex-start" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
					<view class="discounts-item-left">
						<view class="flex-start">
							<text class="txt-des1" :style="{ background: current == 0 ? '#ffcc00' : '#DBDBDB' }">{{ item.couponType == 1 ? '满减劵' : '满折券' }}</text>
							<text class="txt-des2">{{ item.templateTitle }}</text>
						</view>
						<view class="txt-des3" :style="{ color: current == 0 ? '#666666' : '#999999' }">
							有效期：{{ parseTime(item.couponStartTime, '{y}.{m}.{d}') }}-{{ parseTime(item.couponEndTime, '{y}.{m}.{d}') }}
						</view>
						<view class="flex-start">
							<text class="txt-des4" :style="{ color: current == 0 ? '#FF8800' : '#999999' }">使用规则</text>
							<u-icon :color="current == 0 ? '#FF8800' : '#999999'" size="26" name="arrow-right"></u-icon>
						</view>
						<image v-if="current == 1" class="img-des" :src="item.couponStatus == 2 ? '../../static/img/used_icon.png' : '../../static/img/exceed_icon.png'"></image>
					</view>
					<view class="discounts-item-right">
						<view class="discounts-item-right-des flex-start" :style="{ color: current == 0 ? '#FF8800' : '#999999' }">
							<text style="font-size: 60rpx; font-weight: 500;">{{ item.couponType === 1 ? item.reduceAmount : item.discount }}</text>
							<text style="margin: 10rpx 5rpx;">{{ item.couponType === 1 ? '元' : '折' }}</text>
						</view>
						<text :style="{ color: current == 0 ? '#666666' : '#999999' }">满{{ item.withAmount }}可用</text>
					</view>
				</view>

				<!-- <uni-load-more v-if="list.length > 0" :status="more" color="#333" @click="manualLoad" :style="{ padding: '40rpx 0' }" /> -->
			</view>
			<noDataView v-if="!list.length" text="啊噢~您还没优惠券哟~"></noDataView>
		</view>
	</view>
</template>

<script>
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
import { couponList, couponExchange } from '@/api/activity.js';
import { loadList } from '@/mixins';
import { parseTime, throttle } from '@/utils/common';
import moment from '../../utils/moment.js';
import noDataView from '@/components/noDataView.vue';

export default {
	mixins: [loadList],
	components: {
		noDataView
	},
	data() {
		return {
			exchangeKey: '',
			current: 0,
			tabs: [
				{
					name: '可用券'
				},
				{
					name: '不可用'
				}
			],
			listKey: {
				businessType: 1,
				status: 1
			},
			loadListApi: couponList,
			statusBarHeight: statusBarHeight
		};
	},
	onShow() {
		this.list = [];
		this.load();
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		});
		console.log('sss==>', this.list);
	},
	methods: {
		onConvert() {
			if (!this.exchangeKey) {
				uni.showToast({
					title: '请输入兑换码',
					icon: 'none'
				});
			} else {
				couponExchange(this.exchangeKey).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '兑换成功！',
							icon: 'none'
						});

						this.tabsChange(0);
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}
		},
		tabsChange(index) {
			this.current = index;
			this.list = [];
			this.load();
		},
		load() {
			this.listKey.status = this.current == 0 ? '1' : '2,3';
			this.queryParams.current = 1;
			this.more = 'more';
			console.log(444444);
			this.loadList();
		},
		parseTime(time, cFormat) {
			if (!time) return '';
			return parseTime(moment(time).valueOf(), cFormat);
		},
		goDetail: throttle(function(item) {
			console.log(item, item.orderNo, 'orderNo--------------');
			this.toPage('/subPages/discounts/detail?couponId=' + item.id);
			console.log(56555555);
		}, 1000),
		toPage(url) {
			uni.navigateTo({
				url
			});
		}
		
	},
		onReachBottom() {
			this.timer && clearTimeout(this.timer)
			this.timer = setTimeout(this.loadList, 400)
		},
};
</script>

<style scoped lang="scss">
@import '@/styles/data.scss';

.discounts-box {
	min-height: 100vh;
	background-color: #f0f1f4;
}

.myTabs {
	z-index: 999;
	background-color: #ff8800;

	/deep/ .u-tab-bar {
		bottom: -6rpx;
		border-radius: 5rpx;
	}
}

.discounts-list {
	padding-left: 24rpx;
	padding-right: 24rpx;
	padding-bottom: 24rpx;

	.convert-input {
		flex: 1;
		color: 30rpx;
		font-size: 30rpx;
		padding: 12rpx 24rpx;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.convert-btn {
		width: 160rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin-left: 20rpx;
		background: #ffcc00;
		@include fs(30rpx, 400, #272727, 88rpx);
		border-radius: 16rpx 16rpx 16rpx 16rpx;
	}

	.convert-btn::after {
		border: none;
	}

	.discounts-item {
		height: 240rpx;
		margin-top: 24rpx;
		background: #ffffff;
		border-radius: 20rpx;
		position: relative;
		padding: 10rpx 0rpx 10rpx 28rpx;

		&-left {
			flex: 1;
		}

		.txt-des1 {
			padding: 2rpx 8rpx;
			margin-right: 12rpx;
			background: #ffcc00;
			border-radius: 6rpx;
			@include fs(22rpx, 400, #424036, 32rpx);
		}

		.txt-des2 {
			@include fs(30rpx, 600, #424036, 42rpx);
		}

		.txt-des3 {
			margin: 20rpx 0rpx;
			@include fs(26rpx, 400, #666666, 36rpx);
		}

		.txt-des4 {
			margin-right: 10rpx;
			@include fs(24rpx, 400, #ff8800, 34rpx);
		}

		.img-des {
			bottom: 20rpx;
			right: 217rpx;
			width: 90rpx;
			height: 90rpx;
			position: absolute;
			border-radius: 50%;
		}

		&-right {
			height: 100%;
			width: 200rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			border-left: 1rpx dashed #dbdbdb;
		}

		&-right-des {
			color: #ff8800;
			font-size: 24rpx;
			margin-bottom: 20rpx;
			align-items: flex-end;
			justify-content: center;
		}
	}
}
/deep/ .u-input_right-icon_clear{
	
			width: 60rpx;
			height: 60rpx;
	
	
}
</style>
