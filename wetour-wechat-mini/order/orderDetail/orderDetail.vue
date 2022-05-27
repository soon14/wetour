<template>
	<movable-area class="orderdetail" :class="detail.orderStatusShow === '待支付' ? 'orderdetail-bottom-spec' : 'orderdetail-bottom'">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="订单详情" color="#272727">
			<view @click="goType" slot="left" hover-class="none" v-if="showBack">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</view>
		</uni-nav-bar>
		<!-- 客服 -->
		<!-- <movable-area style="width: 100%;height: 300rpx;background-color: aqua;"> -->
		<movable-view style="z-index: 999;" :x="x" :y="y" direction="all" @change="onChange">
			<!--  <view style="background-color:aqua;width: 60rpx;height: 60rpx;">text</view> -->
			<button class="flex-start user-view" open-type="contact">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/robot1.png" class="user-view-img"></image>
				<text class="user-view-text">客服</text>
			</button>
		</movable-view>
		<!-- </movable-area> -->

		<!-- 车次信息 -->
		<view class="order-item">
			<view class="flex-start" style="position: relative;margin-bottom: 6rpx;">
				<text class="txt-title" v-if="detail.charteredCarType !== 1">{{ detail.charteredCarType | charteredCarTypeFil }}</text>
				<text class="txt-title" v-else>{{ detail.departureCity + (detail.charteredCarRange === 1 ? '市内包车' : '周边包车') }}</text>
				<template v-if="detail.charteredCarType === 2">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/aircraftImg2.png" class="navigation-icon2"></image>
					<text class="txt-title2">{{ detail.flightNumber || '未知航班' + ' ' }}</text>
				</template>

				<text class="txt-state">{{ detail.orderStatusShow }}</text>
			</view>
			<view class="flex-start  txt-content1" style="margin: 6rpx 0rpx;line-height: 36rpx;">
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/time_icon.png" class="navigation-icon2"></image> -->
				<text>{{ dateChange(detail.departureStartTime) }}</text>
				<text v-if="detail.departureEndTime">-{{ dateChange(detail.departureEndTime) }}</text>
				<view class="txt-content2" v-else-if="detail.charteredCarType === 2">落地时间</view>
				<view class="txt-content2" v-else>当地时间</view>
			</view>
			<view class="flex-start" style="margin: 6rpx 0rpx">
				<view class="circle"></view>
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/address_icon.png" class="navigation-icon"></image> -->
				<text class="txt-content1">{{ detail.departureAddress }}</text>
			</view>
			<view class="flex-start " style="margin: 6rpx 0rpx;" v-if="detail.destinationAddress">
				<view class="circle"></view>
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/address_icon.png" class="navigation-icon"></image> -->
				<text class="txt-content1">{{ detail.destinationAddress }}</text>
			</view>

			<view class="line"></view>

			<!-- <view  style="height: 1rpx; width: 100%;background-color: #dfdfdf;"></view> -->

			<view class="flex-between " style="margin: 6rpx 0px 8rpx">
				<text class="txt-label">车型:</text>
				<view v-for="(item, index) in detail.busType" :key="index" class="flex-start" style="text-align: end;">
					<text class="txt-value">{{ busList[item.busType].name }}</text>
					<text class="txt-value" v-if="detail.busType.length != index + 1">、</text>
				</view>
			</view>
			<!--  -->
			<view v-if="detail.additionalService.childSeat" class="flex-between" style="margin: 10rpx 0rpx;">
				<text class="txt-label">儿童座椅:</text>
				<text class="txt-value">{{ detail.additionalService.childSeat }}个</text>
			</view>
			<view class="flex-between " style="margin: 10rpx 0rpx;">
				<text class="txt-label">公里数:</text>
				<text class="txt-value">{{ parseFloat(detail.kilometers).toFixed(2) }}km</text>
			</view>
			<view class="flex-between " style="margin: 10rpx 0rpx;">
				<text class="txt-label">乘客:</text>
				<view class="flex-start">
					<text class="txt-value">{{ detail.passengerNumber + '成人' }}</text>
					<text v-if="detail.childNumber" class="txt-value">{{ detail.childNumber + '儿童' }}</text>
					<text v-if="detail.baggageNumber" class="txt-value">{{ detail.baggageNumber + '行李' }}</text>
				</view>
			</view>

			<view class="line"></view>
			
			<view class="flex-between " style="margin: 10rpx 0rpx;">
				<text class="txt-label">包车费用:</text>
				<text class="txt-value">￥{{ detail.busAmount }}</text>
			</view>
			<view v-if="detail.discountAmount" class="flex-between " style="margin: 10rpx 0rpx;">
				<text class="txt-label">优惠券:</text>
				<text class="txt-value">-￥{{ detail.discountAmount }}</text>
			</view>
			<view class="flex-between " style="margin: 10rpx 0rpx;">
				<text class="txt-label">附加服务:</text>
				<text class="txt-value">￥{{ detail.additionalAmount }}</text>
			</view>

			<view class="line"></view>

			<view class="item-bottom flex-between">
				<view class="flex-start">
					<template v-if="detail.refund">
						<text style="font-size: 32rpx;color: #666666;margin-right: 12rpx;">退款金额</text>
						<view class="txt-des2">￥{{ detail.refund.refundAmount }}</view>
					</template>
				</view>
				<view class="flex-start">
					<text style="font-size: 32rpx;color: #666666;margin-right: 12rpx;">实付</text>
					<view class="txt-des2">￥{{ detail.payAmount }}</view>
				</view>
			</view>
		</view>
		<!-- 行程信息 -->
		<view v-if="detail.orderStatus === 21 || detail.orderStatus === 31 || detail.orderStatus === 32" class="order-item" style="padding: 0rpx 32rpx;">
			<view v-if="item.orderBusDriver.driverName" v-for="(item, index) in detail.busType" :key="index">
				<view :class="{ bottom: detail.busType.length != index + 1 }" class="flex-start" style="padding: 16rpx 0rpx;">
					<image
						:src="
							item.orderBusDriver.driverImage ? item.orderBusDriver.driverImage : 'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/head_profile.png'
						"
						class="img-profile"
					></image>
					<!-- <text>{{item.orderBusDriver.driverImage}}</text> -->
					<view class="flex-middle">
						<text class="text-content1">{{ busList[item.busType].name }}</text>
						<text class="text-content2">{{ item.orderBusDriver.number }}</text>
					</view>
					<view class="flex-start" @click="call(item.orderBusDriver.mobile)">
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/phone.png" class="navigation-icon4"></image>
						<text class="text-content3" style="margin-left: 10rpx;">联系司机</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 联系信息 -->
		<view class="order-item">
			<view class="flex-between mb24 bottom"><text class="txt-title ">联系信息</text></view>
			<view class="flex-between" style="margin-top: 20rpx;">
				<text class="txt-label">联系人：</text>
				<text class="txt-value">{{ detail.contactName }}</text>
			</view>
			<view class="flex-between" style="margin-top: 20rpx;">
				<text class="txt-label">联系电话：</text>
				<text class="txt-value">{{ detail.contactMobile }}</text>
			</view>
			<view class="flex-between" style="margin-top: 20rpx;">
				<text class="txt-label">微信：</text>
				<text class="txt-value">{{ detail.weixin || '-' }}</text>
			</view>
			<view class="flex-between" style="margin-top: 20rpx;"><text class="txt-label">行程备注：</text></view>
			<text class="txt-value" style="word-break:break-all;margin-top: 16rpx;">{{ detail.orderRemark }}</text>
		</view>
		<!-- 订单信息 -->
		<view class="order-item" style="font-size: 28rpx;">
			<view class="flex-between mb24 bottom" style="position: relative;">
				<text class="txt-title">订单信息</text>
				<!-- v-if="detail.orderStatus===11 && type !=1" -->
				<view v-if="detail.orderStatus === 11 && type != 1" class="button-title" @click="cancel(orderNo)">取消</view>
			</view>
			<!-- style="margin-top: 16rpx;" -->
			<view class="flex-between" style="margin-top: 20rpx;" @click="copys(detail.orderNo)">
				<text class="txt-label">订单编号：</text>
				<view class="flex-start txt-value">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/newImg/copy.png" class="navigation-icon3"></image>
					<text>{{ detail.orderNo }}</text>
				</view>
			</view>
			<view class="flex-between " style="margin-top: 20rpx;">
				<text class="txt-label">创建时间：</text>
				<text class="txt-value">{{ detail.createTime }}</text>
			</view>
			<view class="flex-between " style="margin-top: 20rpx;" v-if="detail.payTime">
				<text class="txt-label">支付时间：</text>
				<text class="txt-value">{{ detail.payTime }}</text>
			</view>
			<view class="flex-between " style="margin-top: 20rpx;" v-if="detail.cancelTime">
				<text class="txt-label">取消时间：</text>
				<text class="txt-value">{{ detail.cancelTime }}</text>
			</view>
			<template v-if="detail.refund">
				<view class="flex-between " style="margin-top: 20rpx;">
					<text class="txt-label">退款时间：</text>
					<text class="txt-value">{{ detail.refund.refundTime }}</text>
				</view>
			</template>
		</view>

		<!-- 未支付的支付弹窗 -->
		<view class="detail-flex detail-flex-item" v-if="detail.orderStatus === 11">
			<view class="detail-flex-left">支付</view>
			<view class="detail-flex-money">
				<!-- <view class="detail-flex-money-icon">￥</view> -->
				￥{{ detail.payAmount }}
			</view>
			<view class="detail-flex-time" v-if="type != 1">倒计时{{ countDown }}</view>
			<view class="detail-flex-button" @tap="paymoney()" v-if="userInfo.mobile">立即支付</view>
			<button class="detail-flex-button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!userInfo.mobile">立即支付</button>
		</view>
		<!-- <view class="detail-flex" style="background:none" v-if="detail.orderStatusShow==='待支付'"></view> -->
	</movable-area>
</template>

<script>
import { orderDetail, cancelOrder, bindOrder } from '@/api/order.js';
var x = uni.getSystemInfoSync().windowWidth - 80;
import { parseTime, throttle } from '@/utils/common';
import { orderState } from '@/mixins/order.js';
import { userBindPhone } from '@/api/user';
import { mapGetters } from 'vuex';
export default {
	mixins: [orderState],
	data() {
		return {
			x: x,
			y: 300,
			orderNo: '',
			detail: {
				additionalService: 'string',
				baggageNumber: 0,
				busType: [],
				childNumber: 0,
				contactMobile: 'string',
				contactName: 'string',
				createTime: '2022-04-06T06:45:26.108Z',
				departureAddress: 'string',
				departureCity: 'string',
				departureEndTime: '2022-04-06T06:45:26.108Z',
				departureStartTime: '2022-04-06T06:45:26.108Z',
				destinationAddress: 'string',
				destinationCity: 'string',
				expired: 0,
				kilometers: 0,
				orderAmount: 0,
				orderChannel: 0,
				orderNo: 'string',
				orderRemark: 'string',
				orderStatus: 0,
				orderStatusShow: 'string',
				passengerNumber: 0,
				payAmount: 0,
				payTime: '2022-04-06T06:45:26.108Z',
				serverTime: 0,
				thirdOrderNo: 'string',
				travelTime: 0,
				userId: 0,
				weixin: 'string',
				charteredCarType: 1, //包车类型  1日租 2接机 3 送机 4单车
				// charteredCarRange:0,   //1市内包车 2周边包车
				orderBusDriverList: []
			},
			requestLocked: false,
			orderStatus: {
				11: '待支付',
				21: '待派单'
			},
			busList: {
				5: {
					name: '舒适5座',
					prople: '4',
					trunk: '2',
					consult: '丰田卡罗拉、本田雅阁等同级别车型'
				},
				7: {
					name: '舒适7座',
					prople: '6',
					trunk: '2',
					consult: '丰田塞纳、本田奥德赛等同级别车型'
				},
				12: {
					name: '商务12座',
					prople: '11',
					trunk: '2',
					consult: '丰田海狮、高顶奔驰等同级别车型'
				},
				19: {
					name: '中巴19座',
					prople: '18',
					// trunk:'2',
					consult: '宇通、金龙、新青年或同级用车'
				},
				37: {
					name: '大巴37座',
					prople: '36',
					// trunk:'2',
					consult: '宇通、金龙、新青年或同级用车'
				},
				49: {
					name: '大巴49座',
					prople: '48',
					// trunk:'2',
					consult: '宇通、金龙、新青年或同级用车'
				}
			},
			time: null,
			countDown: '',
			type: 0,
			option: {},
			newType: 0,
			showBack: true
		};
	},
	// onPageScroll(e) {
	// 	this.y = e.scrollTop;
	// 	console.log('e.scrollTop', e.scrollTop);
	// 	console.log('this.y', this.y);
	// 	//console.log("ssss==>",e.scrollTop);
	// },
	onLoad(options) {
		if (options.orderNo) {
			this.orderNo = options.orderNo;
		}
		if (options.newType) {
			this.newType = options.newType;
		}
		if (options.q) {
			let query = decodeURIComponent(options.q);
			// this.option = options.q
			this.orderNo = this.getQueryVariable(query, 'orderNo');
			this.type = this.getQueryVariable(query, 'type');
			this.newType = 1;
			// this.showBack = false;
		}

		// this.orderNo = '2022050916113415009091'
		// this.type = 1
		// this.newType = 1
		// this.showBack = true
	},
	computed: {
		...mapGetters(['access_token', 'userInfo']),
		orderType() {}
	},
	watch: {
		// access_token() {
		// 	this.getDetail()
		// },
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
	onShow() {
		// if (this.access_token) {
		setTimeout(() => {
			this.getDetail();
		}, 500);
		// }
	},
	onUnload() {
		if (this.time) {
			clearInterval(this.time);
			this.time = null;
		}
		console.log('onUnload');
	},
	onHide() {
		if (this.time) {
			clearInterval(this.time);
			this.time = null;
		}
	},
	methods: {
		onChange: function(e) {
			this.x = e.detail.x;
			this.y = e.detail.y;
		},
		goType: throttle(function(orderno) {
			console.log(this.newType, 333333);
			if (this.newType == 1) {
				uni.reLaunch({
					url: '/order/orderList/orderList',
					animationType: 'pop-out',
					animationDuration: 200
				});
			} else {
				uni.navigateBack();
			}
		}, 1500),
		getQueryVariable(query, variable) {
			let str = query.slice(query.indexOf('?') + 1, query.length);
			var vars = str.split('&');
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (pair[0] == variable) {
					return pair[1];
				}
			}
			return false;
		},
		copy(val) {
			var _this = this;
			uni.setClipboardData({
				data: val,
				success() {
					//复制成功
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					});
				}
			});
		},
		getDetail() {
			uni.showLoading({
				title: '加载中'
			});
			orderDetail(this.orderNo)
				.then(res => {
					if (res.code === 0) {
						this.detail = res.data;
						this.detail.busType = JSON.parse(this.detail.busType);
						this.detail.additionalService = JSON.parse(this.detail.additionalService);
						if (res.data.orderStatus === 11 && this.type != 1) {
							if (res.data.expired - this.detail.serverTime > 0) {
								this.showtime();
								this.time = setInterval(() => {
									this.detail.serverTime = Number(this.detail.serverTime) + 1;
									this.showtime();
								}, 1000);
							} else {
								this.countDown = '00:00';
								this.showtime(true);
							}
						}
					} else if (res.code === 1001) {
						this.getDetail();
					}
				})
				.catch(() => {
					uni.hideLoading();
				});
		},
		async paymoney() {
			if (this.requestLocked) return false;
			let payResponse = {};
			if (this.type == 1 && !this.detail.userId) {
				let res = await bindOrder({
					id: this.detail.id,
					orderNo: this.detail.orderNo
				});
				this.showBack = true;
				if (res.code == 0) {
					payResponse = res.data;
				} else {
					uni.showToast({
						title: '订单绑定失败，请联系客服处理',
						icon: 'none'
					});
					return false;
				}
			} else if (this.type == 1 && this.detail.userId) {
				this.showBack = true;
				uni.showToast({
					title: '当前订单已被他人绑定',
					icon: 'none'
				});
				return false;
			} else {
				payResponse = this.detail.payResponse;
			}

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

					_this.getDetail();
					_this.showBack = true;
				},
				fail: function(res) {
					_this.requestLocked = false;
					_this.showBack = true;
				}
			});
		},
		calls(phone) {
			console.log('phone', phone);
			let changePhone = phone.split('-')[1];
			this.call(changePhone);
		},
		call(phone) {
			uni.makePhoneCall({
				phoneNumber: '+' + phone
			});
		},
		showtime(bol) {
			let nowtime = this.detail.serverTime;
			let endtime = this.detail.expired;
			// console.log(nowtime, endtime, endtime - nowtime)
			let lefttime = endtime - nowtime;
			if (lefttime > 0) {
				let leftm = Math.floor((lefttime / 60) % 60);
				let lefts = Math.floor(lefttime % 60);
				this.countDown = (leftm < 10 ? '0' + leftm : leftm) + ':' + (lefts < 10 ? '0' + lefts : lefts);
			} else {
				this.countDown = '00:00';
				clearInterval(this.time);
				this.time = null;

				setTimeout(
					() => {
						this.getDetail();
					},
					bol ? 1500 : 0
				);

				console.log(2222222222, '倒计时结束 按道理要重新回调接口，获取新的数据');
			}
		},
		copys(orderno) {
			uni.setClipboardData({
				data: orderno,
				success: () => {
					this.$u.toast('复制成功');
					console.log('success');
				}
			});
		},
		getPhoneNumber({ detail }) {
			console.log(detail, 3333333);
			let _this = this;
			if (detail.errMsg === 'getPhoneNumber:ok') {
				console.log(detail);
				userBindPhone(detail.code).then(res => {
					console.log(res, '----------------------------');
					if (res.code == 0) {
						_this.$store.dispatch('user/getUserInfo').then(res => {
							_this.paymoney();
						});

						// this.$store.dispatch('user/setLogin', true)
					}
				});
			} else {
				uni.showToast({
					title: '您取消了授权',
					icon: 'none'
				});
			}
		},
		cancel(orderNo) {
			uni.showModal({
				title: '取消订单', //提示的标题,
				content: '您确定要取消订单吗', //提示的内容,
				showCancel: true, //是否显示取消按钮,
				cancelText: '确定', //取消按钮的文字，默认为取消，最多 4 个字符,
				cancelColor: '#666666', //取消按钮的文字颜色,
				confirmText: '再考虑下', //确定按钮的文字，默认为取消，最多 4 个字符,
				confirmColor: '#CBA56A', //确定按钮的文字颜色,
				success: res => {
					if (res.cancel) {
						console.log(1111);
						// uni.navigateBack({

						// })
						cancelOrder(orderNo).then(val => {
							if (val.code === 0 && val.data === true) {
								this.$u.toast('取消成功');
								this.getDetail();
							}
						});
					} else {
						console.log(22222);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.orderdetail {
	height: 100%;
	padding: 0 32rpx;
	width: calc(100% - 64rpx);
	background-color: #f8f8f8;
}

.circle {
	height: 12rpx;
	width: 12rpx;
	background-color: #111111;
	border-radius: 50%;
	margin-right: 10rpx;
}

.user-view {
	top: 150rpx;
	left: 0rpx;
	right: 0rpx;
	bottom: 0rpx;
	// top: 55%;
	width: 80rpx;
	height: 80rpx;
	// right: 44rpx;
	z-index: 999;
	display: flex;
	flex-direction: column;
	border-radius: 50%;
	position: fixed;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	box-shadow: 0rpx 3rpx 8rpx 1rpx rgba(0, 0, 0, 0.25);
}
.user-view-img {
	width: 40rpx;
	height: 40rpx;
}
.user-view-text {
	margin-top: 2rpx;
	min-width: 60rpx;
	@include fs(20rpx, 400, #111111, 23rpx);
}

.order-item {
	display: flex;
	flex-direction: column;
	margin-bottom: 20rpx;
	padding: 20rpx 32rpx;
	border-radius: 20rpx;
	background-color: #fff;
	margin-top: 20rpx;
	@include fs(32rpx, 400, #555, 32rpx);

	.img-profile {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
	}

	.flex-middle {
		flex: 1;
		display: flex;
		margin: 0rpx 24rpx;
		flex-direction: column;
	}

	.txt-title {
		margin-right: 40rpx;
		@include fs(36rpx, 600, #111111, 50rpx);
	}

	.txt-title2 {
		// margin-left: 10rpx;
		@include fs(28rpx, 400, #555, 28rpx);
	}

	.txt-state {
		position: absolute;
		right: 0;
		top: 0;
		@include fs(24rpx, 400, #666666, 50rpx);
	}

	.text-content1 {
		@include fs(28rpx, 400, #000000, 40rpx);
	}
	.text-content2 {
		@include fs(40rpx, 600, #272727, 50rpx);
	}
	.text-content3 {
		@include fs(28rpx, 500, #cba56a, 40rpx);
	}

	.navigation-icon {
		width: 20rpx;
		height: 24rpx;
		margin-right: 18rpx;
	}

	.navigation-icon2 {
		width: 32rpx;
		height: 32rpx;
		margin-right: 4rpx;
	}

	.navigation-icon3 {
		width: 28rpx;
		height: 28rpx;
		margin-left: 8rpx;
		margin-right: 8rpx;
	}

	.navigation-icon4 {
		width: 32rpx;
		height: 32rpx;
		margin-left: 12rpx;
	}

	.mb24 {
		padding-bottom: 20rpx;
	}

	.line {
		width: 100%;
		height: 1rpx;
		margin: 14rpx 0rpx;
		background-color: #dadada;
	}

	.txt-label {
		min-width: 200rpx;
		@include fs(28rpx, 400, #999999, 33rpx);
	}

	.txt-value {
		@include fs(28rpx, 400, #000000, 33rpx);
	}

	.pb20 {
		padding-bottom: 12rpx;
	}

	.bottom {
		border-bottom: 1rpx solid #dbdbdb;
	}

	.item-bottom {
		line-height: 56rpx;
		margin-top: 10rpx;
	}

	.txt-des2 {
		@include fs(40rpx, 600, #111111, 56rpx);
	}

	.button-title {
		top: 0;
		right: 0;
		width: 116rpx;
		text-align: center;
		position: absolute;
		// padding: 15rpx 35rpx;
		background: #ffffff;
		border-radius: 30rpx;
		border: 1rpx solid #666666;
		@include fs(24rpx, 400, #666666, 48rpx);
	}
}
.orderdetail-bottom {
	padding-bottom: 0rpx;
	padding-bottom: calc(0rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(0rpx + env(safe-area-inset-bottom));
}
.orderdetail-bottom-spec {
	padding-bottom: 180rpx;
	padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
}
.detail-flex {
	width: 100%;
	height: 150rpx;
	background: #ffffff;

	.detail-flex-left {
		position: absolute;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #666666;
		top: 46rpx;
		left: 20rpx;
	}

	.detail-flex-money {
		position: absolute;
		font-size: 40rpx;
		font-family: DIN;
		font-weight: bold;
		color: #111111;
		top: 40rpx;
		left: 110rpx;
	}

	.detail-flex-money-icon {
		position: absolute;
		font-size: 28rpx;
		font-family: DIN;
		font-weight: 300;
		color: #272727;
		bottom: 6rpx;
		left: -30rpx;
	}

	.detail-flex-time {
		position: absolute;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #cba56a;
		right: 300rpx;
		top: 50rpx;
	}

	.detail-flex-button {
		position: absolute;
		width: 264rpx;
		height: 88rpx;
		background: #111111;
		border-radius: 88rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 600;
		line-height: 88rpx;
		text-align: center;
		color: #ffffff;
		right: 20rpx;
		top: 24rpx;
	}
}

.detail-flex-item {
	position: fixed;
	bottom: 0;
	left: 0;
	border-top: 1rpx solid #dfdfdf;
}
.txt-content1 {
	@include fs(32rpx, 400, #000000, 45rpx);
}

.txt-content2 {
	width: 96rpx;
	text-align: center;
	margin-left: 12rpx;
	border-radius: 4rpx;
	border: 1rpx solid #cba56a;
	@include fs(20rpx, 400, #cba56a, 32rpx);
}
button::after {
	border: none;
}
</style>
