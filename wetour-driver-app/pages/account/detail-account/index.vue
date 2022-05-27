<template>
	<view class="account-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="结算详情" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>
		<view class="account-content" :style="{ 
		'height': `calc(100vh - ${statusBarHeight})`  }">
			<view class="content-head">
				<view class="head-state">
					<text class="txt-des">审核状态：<text
							style="color: #FF8800;">{{detailAccount.applyStatus|applyStatus}}</text></text>
					<text class="txt-des">申请时间：{{detailAccount.createTime}}</text>

					<view v-if="detailAccount.applyStatus==2" class="head-reson">
						<text style="min-width: 160rpx;">驳回原因：</text>
						<text class="reason">{{detailAccount.applyReason}} </text>
					</view>

				</view>
				<view class="head-des">
					<view class="flex-between-align" style="margin-top: 17rpx;padding: 0rpx 16rpx;">
						<text class="txt-des" style="width: 50%;">结算方式：{{detailAccount.settleType|settleTypeFil}}</text>
						<view class="txt-content" style="width: 50%;">账号：<text
								class="txt-des2">{{detailAccount.settleAccount}}</text>
						</view>
					</view>
					<view class="flex-between-align" style="margin-top: 7rpx;padding: 0rpx 16rpx;">
						<text class="txt-des" style="width: 50%;">结算单数：{{detailAccount.totalOrderNumber}}单</text>
						<text class="txt-des"
							style="width: 50%;">结算金额：{{detailAccount.currency}}{{parseFloat(detailAccount.totalRealAmount).toFixed(2)}}</text>
					</view>
					<text style="padding: 0rpx 16rpx;"
						class="txt-des">实际结算金额：{{detailAccount.currency}}{{parseFloat(detailAccount.totalSettleRealAmount).toFixed(2)}}</text>
					<text v-if="listImage.length>0" class="txt-des"
						style="margin-top: 7rpx;padding: 0rpx 16rpx;">发票照片</text>
					<view class="head-image">
						<image v-for="(item,index) in listImage" :key="index" mode="aspectFit" class="invoice-image"
							:src="item" @click="previewImage(item)"></image>
					</view>
				</view>
			</view>
			<view class="content-bottom">
				<view class="account-item" v-for="(item,index) in detailAccount.detailAppVOList" :key="index">
					<text class="txt-title" style="font-weight: bold;">{{item.charteredCarType | busStatusFil}}</text>
					<text class="txt-des" style="margin-top: 7rpx;">用车时间：{{item.departureStartTime}}</text>
					<view class="flex-start" style="margin-top: 7rpx;">
						<image style="width: 20rpx; height: 24rpx;margin-right: 10rpx;"
							src="@/static/newImg/address_icon.png"></image>
						<text class="txt-des">{{item.departureCity}}{{item.departureAddress}}</text>
					</view>
					<view v-if="item.charteredCarType!=1" class="flex-start" style="margin-top: 7rpx;">
						<image style="width: 20rpx; height: 24rpx;margin-right: 10rpx;"
							src="@/static/newImg/address_icon.png"></image>
						<text class="txt-des">{{item.destinationCity}}{{item.destinationAddress}}</text>
					</view>
					<view class="flex-between" style="margin-top: 7rpx;">
						<text class="txt-des">车辆数：{{item.busCnt}}辆</text>
						<text class="txt-des">待结算金额：{{item.currency}}
							<text style="font-weight: 600;">
								{{parseFloat(item.waitSettleRealAmount).toFixed(2) }}</text></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getSettleRecordById
	} from "@/api/account.js"
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	export default {
		filters: {
			applyStatus(val) {
				let map = {
					0: '待审核',
					1: '审核通过',
					2: '审核驳回',
				}
				return map[val]
			},
			settleTypeFil(val) {
				let map = {
					1: '大陆银行卡',
					2: 'zelle',
					3: '支付宝',
					4: '微信',
				}
				return map[val]
			},
			busStatusFil(val) {
				let map = {
					1: '日租',
					2: '接机',
					3: '送机',
					4: '单程',
				}
				return map[val]
			},
		},
		data() {
			return {
				listImage: [],
				detailAccount: {},
				statusBarHeight: statusBarHeight,
			}
		},
		onLoad(e) {
			if (e.id != undefined) {
				this.getRecordDetail(e.id);
			}
		},
		methods: {
			previewImage(url) {
				if (!url) return;
				uni.previewImage({
					urls: [url]
				})
			},
			getRecordDetail(id) {
				getSettleRecordById(id).then(res => {
					if (res.code == 0) {
						if (res.data.invoiceImage) {
							this.listImage = res.data.invoiceImage.split(",")
						}
						this.detailAccount = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.account-box {
		overflow: hidden;
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.reason {
		max-width: 550rpx;
		word-wrap: break-word;
		word-break: normal;
		@include fs(32rpx, 400, #272727, 45rpx);
	}

	.title-right {
		@include fs(28rpx, 400, #272727, 40rpx);
	}

	.txt-des {
		word-wrap: break-word;
		word-break: normal;
		@include fs(32rpx, 400, #272727, 45rpx);
	}

	.txt-des2 {
		max-width: 270rpx;
		word-wrap: break-word;
		word-break: normal;
		@include fs(32rpx, 400, #272727, 45rpx);
	}

	.txt-content {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.txt-title {
		@include fs(32rpx, 600, #272727, 45rpx);
	}

	.account-content {
		display: flex;
		overflow-y: scroll;
		flex-direction: column;
		background-color: #F5F5F5;

		.content-head {
			display: flex;
			flex-direction: column;
			background-color: #FFFFFF;

			.head-state {
				display: flex;
				padding: 17rpx 16rpx;
				flex-direction: column;
				border-bottom: 1rpx solid #EEEEEE;
			}

			.head-reson {
				display: flex;
				flex-direction: row;
			}
			
			
			.head-des {
				display: flex;
				flex-direction: column;
			}

			.head-image {
				display: flex;
				padding: 5rpx;
				flex-flow: row wrap;
				align-items: center;
				flex-direction: row;

				.invoice-image {
					width: 224rpx;
					height: 126rpx;
					margin: 11rpx;
					background: #F5F5F5;
					border-radius: 8rpx;
				}
			}
		}

		.content-bottom {
			flex: 1;
			display: flex;
			padding: 16rpx;
	
			flex-direction: column;
			// background-color: #F5F5F5;
			//background-color: firebrick;

			.account-item {
				display: flex;
				flex-shrink: 0;
				padding: 21rpx 20rpx;
				margin-bottom: 16rpx;
				border-radius: 16rpx;
				flex-direction: column;
				background-color: #FFFFFF;
			}
		}
	}
</style>
