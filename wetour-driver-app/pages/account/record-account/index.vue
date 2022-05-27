<template>
	<view class="account-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="结算记录" color="#272727">

			<image slot="left" src="@/static/img/lefts.png" @click="onBack"
				style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
			</image>

		</uni-nav-bar>
		<view class="account-content" :style="{  'min-height': `calc(100vh - ${statusBarHeight})`}">
			<view class="account-list">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
					:up="upOption">
					<view @click="getDetail(item)" class="content-item" v-for="(item,index) in listAccount"
						:key="index">
						<view class="item-title flex-between">
							<text class="txt-des">申请时间：{{item.createTime}}</text>
							<text class="txt-des" style="color: #FF8800;">{{item.applyStatus | applyStatus}}</text>
						</view>
						<text class="txt-des" style="margin-top: 8rpx;">结算方式：{{item.settleType | settleTypeFil}}</text>
						<text class="txt-des" style="margin-top: 8rpx;">结算账号：{{item.settleAccount}}</text>
						<view class="flex-between" style="margin-top: 8rpx;">
							<text class="txt-des">结算单数：{{item.totalOrderNumber}}单</text>
							<text class="txt-price"><text
									style="font-size: 24rpx;font-weight: 400;">{{item.currency}}</text>{{item.totalSettleRealAmount}}</text>
						</view>
					</view>
				</mescroll-body>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		listSettleRecord
	} from "@/api/account.js"
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
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
		},
		data() {
			return {
				requstParams: {
					size: 10, //当前页
					current: 1, //司机
				},
				upOption: {
					empty: {
						fixed: true,
						top: "300rpx",
						icon: "/static/img/no_order.png", // 图标路径
						tip: '啊噢~没有结算的记录哦', // 提示
					}
				},
				listAccount: [],
				statusBarHeight: statusBarHeight,
			}
		},
		methods: {
			onBack(){
				console.log("sss");
				uni.switchTab({
					url:'/pages/user/index'
				})
			},
			getDetail(item) {
				uni.navigateTo({
					url: '/pages/account/detail-account/index?id=' + item.id
				})
			},
			upCallback(page) {
				this.requstParams.current = page.num;
				listSettleRecord(this.requstParams).then(res => {
					if (res.code == 0) {
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						this.mescroll.endSuccess(res.data.records.length);
						//设置列表数据
						if (page.num == 1) this.listAccount = []; //如果是第一页需手动制空列表
						this.listAccount = this.listAccount.concat(res.data.records); //追加新数据
					} else {
						//联网失败, 结束加载
						this.mescroll.endErr();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.account-box {
		overflow: hidden;
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.title-right {
		min-height: 40rpx;
		@include fs(28rpx, 400, #272727, 40rpx);
	}

	.txt-des {
		min-height: 45rpx;
		@include fs(32rpx, 400, #272727, 45rpx);
	}

	.txt-price {
		min-height: 50rpx;
		@include fs(36rpx, 600, #272727, 50rpx);
	}

	.account-content {
		background-color: #F5F5F5;

		.account-list {
			padding: 16rpx;
			padding-top: 20rpx;

			.content-item {
				display: flex;
				flex-direction: column;
				background: #FFFFFF;
				margin-bottom: 20rpx;
				border-radius: 16rpx;
				padding: 0rpx 20rpx 22rpx 20rpx;

				.item-title {
					height: 80rpx;
					min-height: 80rpx;
					border-bottom: 1rpx solid #EEEEEE;
				}
			}
		}
	}
</style>
