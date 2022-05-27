<template>
	<view class="order-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="订单详情" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>

		<view class="order-content" :style="{  'max-height': `calc(100vh - ${statusBarHeight})`,
		     'height': `calc(100vh - ${statusBarHeight})`}">

			<view class="content-head">
				<view class="flex-between">
					<text class="txt-title">单程</text>
					<text class="txt-state">已报价</text>
				</view>
				<text class="txt-des">用车时间：02.17 12:45</text>
				<view class="head-address">
					<image style="width: 20rpx; height: 24rpx;" src="@/static/newImg/address_icon.png"></image>
					<text>浙江省杭州市西湖区福鼎家园地铁口秀月家</text>
					<image style="width: 32rpx; height: 32rpx;" src="@/static/newImg/down_icon.png"></image>
				</view>
				<view class="head-address">
					<image style="width: 20rpx; height: 24rpx;" src="@/static/newImg/address_icon.png"></image>
					<text>杭州市仓前街道余杭塘路杭师大仓前学校区</text>
					<image style="width: 32rpx; height: 32rpx;" src="@/static/newImg/down_icon.png"></image>
				</view>
				<text class="txt-des">乘车人数：12人</text>
				<view class="flex-start">
					<text class="txt-des">订单号：202202241245680898790</text>
					<image style="width: 28rpx; height: 28rpx;margin-left: 8rpx;" src="@/static/newImg/order_icon.png">
					</image>
				</view>
				<text class="txt-des">开始服务：2022.02.17 12:45:00</text>
				<text class="txt-des">结束服务：2022.02.17 12:45:00</text>
				<view class="flex-between">
					<text class="txt-des">指导价：￥888.8</text>
					<text class="txt-des">我的报价：<text class="txt-price">￥888.8</text></text>
				</view>
			</view>
			<view class="middle-cart">
				<text class="txt-title">单程</text>
				<text class="txt-des">5座 (1辆)</text>
				<text class="txt-des">7座 (1辆)</text>
			</view>
			<view class="middle-remark">
				<text class="txt-title">行程备注</text>
				<text class="txt-des">
					2022-05-01
					9:00 酒店门口接待
					自由女神像、唐人街、联合广场、帝国大厦、第五大道、百老汇、时代广场…
					19:00 抵达纽约康莱德酒店
				</text>
			</view>

		</view>
	</view>

</template>

<script>
	import {
		orderinquiry
	} from "@/api/index.js"
	
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	export default {
		data() {
			return {
				statusBarHeight: statusBarHeight,
			}
		}
	}
</script>

<style scoped lang="scss">
	.order-box {
		overflow: hidden;
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.title-right {
		@include fs(28rpx, 400, #272727, 40rpx);
	}

	.order-content {
		display: flex;
		flex-direction: column;
		background-color: #F5F5F5;

		.content-head {
			display: flex;
			flex-direction: column;
			padding: 21rpx 16rpx;
			background-color: #FFFFFF;

			.head-address {
				display: flex;
				flex-direction: row;
				align-items: center;

				text {
					flex: 1;
					margin: 0rpx 10rpx;
					@include fs(32rpx, 400, #272727, 45rpx);
				}
			}
		}

		.middle-cart {
			display: flex;
			margin-top: 16rpx;
			padding: 21rpx 16rpx;
			flex-direction: column;
			background-color: #FFFFFF;
		}

		.middle-remark {
			display: flex;
			margin-top: 16rpx;
			padding: 21rpx 16rpx;
			flex-direction: column;
			background-color: #FFFFFF;
		}

		.txt-title {
			@include fs(32rpx, 600, #272727, 45rpx);
		}

		.txt-state {
			@include fs(32rpx, 400, #FF8800, 45rpx);
		}

		.txt-des {
			margin-top: 7rpx;
			@include fs(32rpx, 400, #272727, 45rpx);
		}

		.txt-price {
			margin-top: 7rpx;
			@include fs(36rpx, 600, #FF8800, 45rpx);
		}
	}
</style>
