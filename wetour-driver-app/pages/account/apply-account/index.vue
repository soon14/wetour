<template>
	<view class="account-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="申请结算" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>

		<view class="main">
			<mescroll-uni class="main-container" :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" :up="upOption" :down="downOption">
				<view class="head-item" v-for="(item, index) in listAccount" :key="index">
					<image @click="onCheck(item)" class="img-check" :src="item.check ? '/static/img/select-active.png' : '/static/img/select.png'"></image>
					<view class="item-right">
						<view class="flex-between">
							<text class="txt-title">{{ item.charteredCarType | busStatusFil }}</text>
							<text class="txt-price">
								<text style="font-size: 24rpx;">{{ item.currency }}</text>
								{{ parseFloat(item.quoteRealAmount).toFixed(2) }}
							</text>
						</view>
						<text class="txt-des">用车时间：{{ item.departureStartTime }}</text>
						<view class="flex-start">
							<image style="width: 20rpx; height: 24rpx;margin-right: 10rpx;" src="@/static/newImg/address_icon.png"></image>
							<text class="txt-des">{{ item.departureCity }}{{ item.departureAddress }}</text>
						</view>
						<view v-if="item.charteredCarType != 1" class="flex-start">
							<image style="width: 20rpx; height: 24rpx;margin-right: 10rpx;" src="@/static/newImg/address_icon.png"></image>
							<text class="txt-des">{{ item.destinationCity }}{{ item.destinationAddress }}</text>
						</view>
						<text class="txt-des">车辆数：{{ item.busCnt }}辆</text>
					</view>
				</view>
			</mescroll-uni>
			<mescroll-empty v-if="listAccount.length==0" :option="emptyOption" ></mescroll-empty>
		</view>

		<view class="content-bottom">
			<view class="bottom-des">
				<text class="txt-des">{{ count }}个订单，共{{ currency }}{{ parseFloat(price).toFixed(2) }}</text>
				<view class="flex-start">
					<image :src="allCheck ? '/static/img/select-active.png' : '/static/img/select.png'" @click="onAllCheck" class="img-check"></image>
					<text class="txt-check">全选</text>
				</view>
			</view>
			<text class="btn-next" @click="onNext">下一步</text>
		</view>
	</view>
</template>

<script>
import { listWaitSettle } from '@/api/account.js';
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
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
			count: 0,
			price: 0,
			currency: '￥',
			allCheck: false,
			listAccount: [],
			statusBarHeight: statusBarHeight,
			downOption: {
				auto: true, //是否在初始化后,自动执行downCallback; 默认true
				empty: {
					fixed: true,
					top: '300rpx',
					icon: '/static/img/no_order.png', // 图标路径
					tip: '啊噢~还没有可以结算的订单哦' // 提示
				}
			},
			upOption: {
				use: false, // 是否启用上拉加载; 默认true
				empty: {
					fixed: true,
					top: '300rpx',
					icon: '/static/img/no_order.png', // 图标路径
					tip: '啊噢~还没有可以结算的订单哦' // 提示
				}
			},
			emptyOption: {
				fixed: true,
				top: '300rpx',
				icon: '/static/img/no_order.png', // 图标路径
				tip: '啊噢~还没有可以结算的订单哦' // 提示
			}
		};
	},
	onShow() {
		this.count = 0;
		this.price = 0;
		this.currency = '￥';
		this.allCheck = false;
		this.downCallback();
	},
	methods: {
		downCallback() {
			console.log('this.queryParams==>');
			listWaitSettle()
				.then(res => {
					if (res.code == 0) {
						res.data.forEach(item => {
							this.$set(item, 'check', false);
						});
						this.count = 0;
						this.price = 0;
						this.allCheck = false;
						this.currency = res.data.length > 0 ? res.data[0].currency : '￥';
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						this.mescroll.endSuccess(res.data.length);
						//设置列表数据
						this.listAccount = res.data; //追加新数据
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
		onCheck(item) {
			item.check = !item.check;
			this.account();
			if (this.count == this.listAccount.length) {
				this.allCheck = true;
			} else {
				this.allCheck = false;
			}
		},
		onAllCheck() {
			this.allCheck = !this.allCheck;
			this.listAccount.forEach(item => {
				item.check = this.allCheck;
			});
			this.account();
		},
		account() {
			var mCount = 0,
				mPrice = 0;
			this.listAccount.forEach(item => {
				if (item.check) {
					console.log('item', item);
					mCount++;
					mPrice += item.quoteRealAmount;
				}
			});

			this.count = mCount;
			this.price = mPrice;
		},
		onNext() {
			if (this.count > 0) {
				var list = [];
				this.listAccount.forEach(item => {
					if (item.check) {
						list.push(item);
					}
				});
				this.$store.dispatch('user/setSkipData', list).then(val => {
					uni.navigateTo({
						url: '/pages/account/msg-account/index'
					});
				});
			} else {
				this.$u.toast('请选择申请订单');
			}
		}
	}
};
</script>

<style scoped lang="scss">
.account-box {
	overflow: hidden;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
}

.title-right {
	@include fs(28rpx, 400, #272727, 40rpx);
}

/deep/ .uni-radio-input {
	width: 32rpx;
	height: 32rpx;
	border-color: #f5f5f5 !important;
	background-color: #ffcc00 !important;
}

/deep/ .uni-radio-input-checked:before {
	color: #272727 !important;
}

.img-check {
	width: 36rpx;
	height: 36rpx;
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

	.head-item {
		display: flex;
		align-items: center;
		flex-direction: row;
		border-radius: 16rpx;
		margin: 20rpx 0rpx;
		padding: 28rpx 20rpx;
		background-color: #ffffff;

		.item-right {
			flex: 1;
			display: flex;
			margin-left: 14rpx;
			flex-direction: column;
		}
	}
}

.content-bottom {
	z-index: 9900;
	display: flex;
	padding: 20rpx;
	height: 120rpx;
	min-height: 120rpx;
	background: #ffffff;
	flex-direction: row;
	justify-content: space-between;
	box-shadow: 0rpx -2rpx 10rpx rgba(184, 172, 128, 0.3);
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	.bottom-des {
		display: flex;
		flex-direction: column;
	}

	.txt-des {
		@include fs(28rpx, 400, #999999, 40rpx);
	}

	.txt-check {
		margin-left: 10rpx;
		@include fs(30rpx, 400, #272727, 45rpx);
	}

	.btn-next {
		width: 160rpx;
		height: 72rpx;
		text-align: center;
		background: #ffcc00;
		border-radius: 12px;
		@include fs(28rpx, 400, #272727, 72rpx);
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

	.txt-price {
		@include fs(36rpx, 600, #272727, 45rpx);
	}

	.navigation-icon {
		width: 20rpx;
		height: 24rpx;
		margin-right: 10rpx;
	}
}
</style>
