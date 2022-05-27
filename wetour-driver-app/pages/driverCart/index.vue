<template>
	<view class="order-box">
		<view class="head">
			<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="司机车辆" color="#272727">
				<view @click="onApply" class="examineBtn" slot="right">
					我的审核
				</view>
			</uni-nav-bar>
			<view style="width: 100%; background-color: #fff;
			padding-bottom: 15rpx;z-index: 999;">
				<u-tabs :list="tabs" :current="current" @change="tabsChange" :is-scroll="false" font-size="32"
					inactive-color="#555" active-color="#FF8800" lineWidth="40rpx" lineHeight="5rpx" lineColor="#FF8800"
					class="myTabs">
				</u-tabs>
				<view class="addBtn" @click="onDriverCart(current)">
					{{current == 0 ? '添加司机' : '添加车辆'}}

				</view>
			</view>
		</view>

		<view class="main">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
				:down="downOption" :up="upOption" top="0" bottom="0" class="main-container">
				<view class="order-item flex-between-align" v-for="(item,index) in list" :key="index"
					@click="goDetail(item)">
					<view>
						<view class="flex-start">
							<view class="order-test">
								{{current==0?'姓名：'+item.driverName :'车牌：'+item.number }}
							</view>

							<image v-if="current==0" :src="item.driverStatus==0?'../../static/newImg/statusEnd.png'
									:'../../static/newImg/statusStart.png'
							" mode="" class="statusImg" style="padding-bottom: 20rpx;"></image>

							<image v-else :src="item.busStatus==0?'../../static/newImg/statusEnd.png'
									:'../../static/newImg/statusStart.png'
							" mode="" class="statusImg" style="padding-bottom: 20rpx;"></image>

						</view>
						<view class="order-test">
							{{current==0?'性别：':"车型：" }} {{ item.gender | genderstatusFil }} {{item.busTypeTitle }}
						</view>
						<view v-if="current==0" class="order-test">
							{{ "手机号：" + item.mobile  }}
						</view>

						<view v-else-if="current==1 && item.countryType==1" class="order-test">
							{{ "保险有效期：" + item.insuranceExpired }}
						</view>

						<view class="order-test overflowEllipsis" style="max-width: 500rpx;">
							{{ current==0 ?"驾驶证有效期：" + get(item.driverLicenseExpired):"品牌：" + item.brand }}
						</view>
					</view>

					<image v-if="current==0"
						:src="item.driverImage?item.driverImage :'../../static/newImg/driverImg.png'" class="driverImg">
					</image>
					<image v-else :src="item.headImage?item.headImage:'../../static/newImg/cartImg.png'"
						class="driverImg"></image>
				</view>
			</mescroll-uni>
		</view>
		<tipView :dialogVisible.sync="tipVisible" v-if="tipVisible" @confirm="confirm" :dialogData="dialogData" />
		<tabbarView />
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		loadList
	} from '@/mixins'
	import {
		driverPage,
		busPage
	} from "@/api/drivercart.js"
	import {
		throttle
	} from "@/utils/common"

	import {
		driverLicense
	} from "@/utils/helper.js"
	import moment from "@/utils/moment.js"
	import tipView from "@/components/tipView.vue"
	import noDataView from "@/components/noDataView.vue"
	import tabbarView from "@/components/tabbarView.vue"

	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			noDataView,
			tabbarView,
			tipView
		},

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
				tabs: [{
					name: '司机管理'
				}, {
					name: '车辆管理',
				}],
				queryParams: {
					current: 1,
					size: 10,
				},
				dialogData: {
					btns: false,
					time: 10,
					content: '测试',
					type: 'scuuess',
				},
				list: [],
				current: 0,
				tipVisible: false,
				requestLocked: false,
				statusBarHeight: statusBarHeight,
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'access_token',
				'city_id',
			]),
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
		onShow() {
			this.tabsChange(this.current);
		},

		methods: {
			get(mtime) {
				return driverLicense(mtime)
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				var self = this;
				self.queryParams.current = page.num;
				if (self.current == 0) {
					driverPage(self.queryParams).then(res => {
						if (res.code == 0) {
							//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
							self.mescroll.endSuccess(res.data.records.length);
							//设置列表数据
							if (page.num == 1) self.list = []; //如果是第一页需手动制空列表
							self.list = self.list.concat(res.data.records); //追加新数据
						} else {
							//联网失败, 结束加载
							self.mescroll.endErr();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(() => {
						//联网失败, 结束加载
						self.mescroll.endErr();
					})
				} else {
					busPage(self.queryParams).then(res => {
						if (res.code == 0) {
							//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
							self.mescroll.endSuccess(res.data.records.length);
							//设置列表数据
							if (page.num == 1) self.list = []; //如果是第一页需手动制空列表
							self.list = self.list.concat(res.data.records); //追加新数据
						} else {
							//联网失败, 结束加载
							self.mescroll.endErr();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(() => {
						//联网失败, 结束加载
						self.mescroll.endErr();
					})
				}
			},
			confirm(done) {
				done()
			},
			tabsChange(index) {
				this.$nextTick(() => {
					this.current = index;
					this.mescroll.optUp.empty.tip = `啊噢~您还没有${index==0?'司机':'车辆'}哟~`
					this.mescroll.resetUpScroll();
				});
			},
			//点击我的审核
			onApply: throttle(function() {
				uni.navigateTo({
					url: '../audit/index'
				})
			}, 1000),
			//点击添加司机或添加车辆
			onDriverCart: throttle(function(type) {
				if (type == 1) {
					uni.navigateTo({
						url: "add-cart/index"
					})
				} else {
					uni.navigateTo({
						url: "add-driver/index?isSkip=" + 1
					})
				}
			}, 1000),

			goDetail: throttle(function(item) {
				if (this.current == 0) {
					uni.navigateTo({
						url: "detail-driver/index?id=" + item.id +
							"&isChina=" + item.countryType
					})
				} else {
					uni.navigateTo({
						url: "detail-cart/index?id=" + item.id +
							"&isChina=" + item.countryType
					})
				}
			}, 1000),
		}
	}
</script>

<style scoped lang="scss">
	.order-box {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 100vh;
		background-color: #F5F5F5;
	}

	.head {
		display: flex;
		flex-direction: column;

		.addBtn {
			width: 650rpx;
			height: 90rpx;
			background: #FFF9E3;
			border: 1rpx solid #FFCC00;
			opacity: 1;
			border-radius: 20rpx;
			text-align: center;
			@include fs(32rpx, 400, #FF8800, 88rpx);
			margin: 15rpx auto 0;
		}

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



		.order-item {
			margin: 20rpx 0rpx;
			padding: 26rpx 20rpx;
			border-radius: 15rpx;
			border: 10rpx solid #FFFFFF;
			background: linear-gradient(180deg, #FFFFFF 0%, #EFFAFC 100%);
			min-height: 200rpx;

			.driverImg {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
			}

			.order-test {
				@include fs(32rpx, 400, #272727, 32rpx);
				padding-bottom: 20rpx;
			}

			.statusImg {
				width: 64rpx;
				height: 32rpx;
				margin-left: 10rpx;
			}
		}

	}


	.green {
		color: #16D6C9 !important;
		border-color: #16D6C9 !important;
	}

	.orange {
		color: #FF6F00 !important;
		border-color: #FF6F00 !important;
	}

	.s28 {
		font-size: 28rpx;
	}

	.c99 {
		color: #999;
	}

	.overflowEllipsis {
		max-width: 416rpx;
	}

	.myTabs {
		/deep/ .u-tab-bar {
			bottom: -6rpx;
			border-radius: 5rpx;
		}
	}

	.examineBtn {
		@include fs(30rpx, 400, #272727, 40rpx);
	}
</style>
