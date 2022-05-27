<template>
	<view class="discounts">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="我的优惠券" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>

		<view class="content" :style="{ 'padding-top': current == 0 ? '92rpx' : '72rpx' }">
			<view class="discounts-menu" :style="{ top: `${statusBarHeight}` }">
				<view
					v-for="(item, index) in menu"
					@click="menuchoose(index)"
					:key="index"
					:class="[index === current ? 'discounts-menu-li-choose discounts-menu-li' : 'discounts-menu-li']"
				>
					<view>{{ item.name }}</view>
					<view class="discounts-menu-li-te"></view>
				</view>
			</view>

			<view class="discounts-list">
				<view v-if="current == 0" class="discounts-convert flex-start">
					<u-input v-model="exchangeKey" class="discounts-convert-input" input-align="center"></u-input>
					<button :disabled="exchangeKey ? false : true" @click="onConvert" class="discounts-convert-btn">兑</button>
				</view>

				<view class="discounts-item" @click="goDetail(item)" v-for="(item, index) in list" :key="index">
					<view v-if="current == 1" class="mask"></view>

					<image
						v-if="current == 1"
						class="img-des"
						:src="
							item.couponStatus == 2
								? 'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/use_icon.png'
								: 'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/exceed_icon.png'
						"
					></image>

					<view class="flex-start">
						<text class="txt-des1">{{ item.templateTitle }}</text>
						<text class="txt-des2">满{{ item.withAmount }}可用</text>
					</view>
					<view class="flex-row" style="margin: 8rpx 0rpx;">
						<view style="flex: 1;">
							<view class="txt-des3">{{ parseTime(item.couponStartTime, '{y}/{m}/{d}') }}-{{ parseTime(item.couponEndTime, '{y}/{m}/{d}') }}</view>
							<view class="txt-des4">最大可优惠金额：{{ item.couponType == 2 ? item.maxDiscountAmount + '元' : '不限' }}</view>
						</view>
						<view v-if="current == 0" class="flex-row">
							<text class="txt-des5">{{ item.couponType == 1 ? item.reduceAmount : item.discount }}</text>
							<text class="txt-des6">{{ item.couponType == 1 ? '元' : '折' }}</text>
						</view>
					</view>
					<view class="line-centent">
						<view class="left"></view>
						<view class="line"></view>
						<view class="right"></view>
					</view>
					<view class="flex-start">
						<text v-if="item.charteredTypeConfigStr || item.cityConfigStr || item.busTypeConfigStr" class="txt-des7">
							可用限制：{{ item.charteredTypeConfigStr ? '部分包车业务、' : '' }}{{ item.cityConfigStr ? '部分城市、' : ''
							}}{{ item.busTypeConfigStr ? '部分车型' : '' }}
						</text>
						<text v-else class="txt-des7">可用限制：不限</text>
						<image style="width: 24rpx;height: 24rpx;" src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/right2.png"></image>
					</view>
				</view>

				<uni-load-more :status="more" color="#333" @click="manualLoad" :style="{ padding: '40rpx 0' }" v-if="list.length > 0" />
				<noDataView :top="top" v-if="!list.length" text="暂无优惠券记录"></noDataView>
			</view>
		</view>
	</view>
</template>

<script>
import { loadList } from '@/mixins';
import moment from '../../utils/moment.js';
import { parseTime, throttle } from '@/utils/common';
import noDataView from '@/components/noDataView.vue';
import { couponList, couponExchange } from '@/api/discounts.js';
var top = uni.getSystemInfoSync().windowHeight / 2;
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
export default {
	mixins: [loadList],
	components: {
		noDataView
	},
	data() {
		return {
			menu: [
				{
					name: '可使用'
				},
				{
					name: '已失效'
				}
			],
			top: top,
			current: 0,
			exchangeKey: '',
			listKey: {
				status: 1,
				businessType: 0
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
		menuchoose(index) {
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

						this.menuchoose(0);
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
				this.exchangeKey = '';
			}
		},
		parseTime(time, cFormat) {
			if (!time) return '';
			return parseTime(moment(time).valueOf(), cFormat);
		},
		goDetail: throttle(function(item) {
			uni.navigateTo({
				url: '/subPages/discounts/detail?couponId=' + item.id
			});
		}, 1000)
	},
	onReachBottom() {
		console.log('到底了');
		// if(this.userInfo.mobile){
		this.timer && clearTimeout(this.timer);
		this.timer = setTimeout(this.loadList, 400);
		// }
	}
};
</script>

<style scoped lang="scss">
.discounts {
	height: 100vh;
	background-color: #f8f8f8;
}

.flex-row {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	//align-items: flex-start;
	//justify-content: flex-start;
}

.content {
	width: 100%;
	position: relative;
	overflow-y: scroll;

	.discounts-list {
		padding: 10rpx 32rpx 0;

		.discounts-item {
			position: relative;
			margin: 18rpx 0rpx;
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
				font-weight: 400;
				font-size: 20rpx;
				margin-left: 12rpx;
				padding: 4rpx 8rpx;
				border-radius: 4rpx;
				background-color: #cba56a;
				//@include fs(20rpx, 400, #fff, 20rpx);
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

		.discounts-convert {
			height: 88rpx;
			border-radius: 45rpx;
			margin-bottom: 20rpx;
			padding: 8rpx 11rpx;
			background-color: #fff;

			&-input {
				flex: 1;
				margin: 0rpx 10rpx;
				text-align: center;
				@include fs(30rpx, 400, #999999, 40rpx);
			}

			/deep/ .u-input__right-icon {
				padding-top: 10rpx;
			}

			&-btn {
				width: 110rpx;
				height: 72rpx;
				padding: 0rpx;
				border-radius: 42rpx;
				background-color: #111111;
				@include fs(30rpx, 400, #fff, 68rpx);
			}

			&-btn::after {
				border: none;
			}

			&-btn[disabled] {
				background-color: #dfdfdf;
				@include fs(30rpx, 400, #fff, 68rpx);
			}
		}
	}
}

.discounts-menu {
	width: 100%;
	display: flex;
	justify-content: space-around;
	position: fixed;
	top: 0;
	left: 0;
	background-color: #fff;
	z-index: 50;
	border-bottom: 1rpx solid #dfdfdf;

	.discounts-menu-li {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 70rpx;
		color: #111111;
		display: flex;
		flex-direction: column;
		align-items: center;

		.discounts-menu-li-te {
			width: 96rpx;
			height: 6rpx;
			background-color: #fff;
			// background: red;
			// margin-top: 1rpx;
		}
	}

	.discounts-menu-li.discounts-menu-li-choose {
		color: #111111;
		font-weight: 500;

		.discounts-menu-li-te {
			background: #111111;
		}
	}
}
</style>
