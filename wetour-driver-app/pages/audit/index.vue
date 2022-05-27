<template>
	<view class="audit-box">
		<view class="head">
			<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="我的审核" color="#272727">
				<image @click="onBack" src="@/static/img/lefts.png" slot="left"
					style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</uni-nav-bar>
			<view style="width: 100%;z-index: 999;">
				<u-tabs :list="tabs" :current="current" @change="tabsChange" :is-scroll="false" font-size="32"
					inactive-color="#555" active-color="#FF8800" lineWidth="40rpx" lineHeight="5rpx" lineColor="#FF8800"
					class="myTabs">
				</u-tabs>
			</view>
		</view>
		<view class="main">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" top="0" @down="downCallback"
				@up="upCallback" :down="downOption" :up="upOption" class="main-container">
				<view class="audit-item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
					<view class="item-state flex-between">
						<text>提交时间：{{item.applyTime}}</text>
						<text
							style="color: #FF8800;">{{ item.applyStatus==0?"待审核":( item.applyStatus==1 ? "审核通过":"审核驳回")}}</text>
					</view>
					<view class="flex-between">
						<view v-if="current==0" class="item-des">
							<text>姓名：{{item.driverName}}</text>
							<text>手机号：{{ item.mobile}}</text>
							<text>性别：{{ item.gender | genderstatusFil }}</text>
							<text>驾驶证有效期：{{ get(item.driverLicenseExpired) }}</text>
						</view>
						<view class="item-des" v-else>
							<text>车牌：{{item.number}}</text>
							<text>车型：{{item.busTypeTitle}}</text>
							<text v-if="item.countryType==1">保险有效期：{{item.insuranceExpired}}</text>

							<view class="flex-row">
								<view style="min-width: 100rpx;">品牌： </view>
								<view class="des-brand">{{item.brand}}</view>
							</view>

						</view>
						<image v-if="current==0"
							:src="item.driverImage?item.driverImage:'../../static/newImg/driverImg.png'"
							class="item-image"></image>
						<image v-else
							:src="item.busImageDTO?item.busImageDTO.headImage:'../../static/newImg/cartImg.png'"
							class="item-image"></image>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>
<script>
	import {
		driverApplyPage,
		busApplyPage
	} from "@/api/drivercart.js"
	import {
		throttle
	} from "@/utils/common"
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	import {
		loadList
	} from '@/mixins'
	import {
		driverLicense,
		genderstatusList
	} from '@/utils/helper.js'

	import noDataView from "@/components/noDataView.vue"
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				upOption: {
					empty: {
						fixed: true,
						top: "300rpx",
						icon: "/static/img/no_order.png", // 图标路径
					}
				},
				queryParams: {
					current: 1,
					size: 10,
				},
				list: [],
				current: 0,
				tabs: [{
					name: '司机'
				}, {
					name: '车辆',
				}],
				statusBarHeight: statusBarHeight,
			}
		},
		filters: {
			genderstatusFil(val) {
				return genderstatusList[val]
			},
			filters: {
				genderstatusFil(val) {
					let map = {
						1: '男',
						2: '女',
					}
					return map[val]
				},
			},
		},
		onShow() {
			this.tabsChange(this.current);
		},
		methods: {
			upCallback(page) {
				this.queryParams.current = page.num;
				if (this.current == 0) {
					driverApplyPage(this.queryParams).then(res => {
						if (res.code == 0) {
							this.mescroll.endSuccess(res.data.records.length);
							if (page.num == 1) this.list = [];
							this.list = this.list.concat(res.data.records);
						} else {
							this.mescroll.endErr();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(() => {
						this.mescroll.endErr();
					})
				} else {
					busApplyPage(this.queryParams).then(res => {
						if (res.code == 0) {
							this.mescroll.endSuccess(res.data.records.length);
							if (page.num == 1) this.list = [];
							this.list = this.list.concat(res.data.records);
						} else {
							this.mescroll.endErr();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(() => {
						self.mescroll.endErr();
					})
				}
			},
			tabsChange(index) {
				this.$nextTick(() => {
					this.current = index;
					this.mescroll.optUp.empty.tip = `啊噢~您还没${index==0?'司机':'车辆'}审批记录哟~`
					this.mescroll.resetUpScroll();
				});
			},
			get(mtime) {
				return driverLicense(mtime)
			},
			onBack() {
				uni.switchTab({
					url: "/pages/driverCart/index"
				})
			},
			goDetail: throttle(function(item) {
				if (this.current == 0) {
					uni.navigateTo({
						url: "audit-driver/index?id=" + item.id +
							"&isChina=" + item.countryType
					})
				} else {
					uni.navigateTo({
						url: "audit-cart/index?id=" + item.id +
							"&isChina=" + item.countryType
					})
				}
			}, 1000),
		}
	}
</script>

<style scoped lang="scss">
	.audit-box {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.title-right {
		@include fs(28rpx, 400, #272727, 40rpx);
	}

	.flex-row {
		display: flex;
		flex-wrap: wrap;
		max-width: 550rpx;
		flex-direction: row;
		word-wrap: break-word;
		word-break: normal;
		justify-content: flex-start;
	}
	
	.des-brand{
		width: 414rpx;
		word-wrap: break-word;
		word-break: normal;
	}

	.head {
		display: flex;
		flex-direction: column;
	}

	.main {
		flex: 1;
		z-index: 88;
		position: relative;
		
		background-color: #F5F5F5;
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

		.audit-item {
			margin: 20rpx 0rpx;
			border-radius: 12rpx;
			background-color: #fff;
			padding: 0rpx 20rpx 12rpx 20rpx;

			.item-state {
				height: 90rpx;
				border-bottom: 1rpx solid #EEEEEE;
				@include fs(28rpx, 400, #272727, 40rpx);
			}

			.item-des {
				max-width: 550rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				@include fs(32rpx, 400, #272727, 48rpx);

				text {
					flex: 1;
					word-wrap: break-word;
					word-break: normal;
				}
			}

			.item-image {
				width: 140rpx;
				height: 140rpx;
				min-width: 140rpx;
				border-radius: 50%;
				margin: 24rpx 24rpx 24rpx 0rpx;
			}
		}
	}
</style>
