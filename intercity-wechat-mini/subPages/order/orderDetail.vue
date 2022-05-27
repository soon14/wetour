<template>
	<view class="orderDetail-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="订单详情" color="#272727">
			<navigator open-type="switchTab" url="/pages/order/index" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>
		<view class="order-container" :style="{ 'min-height': `calc(100vh - ${statusBarHeight} - 500rpx)` }">

			<map id="map" style="width: 100vw;" :style="{ 'height': `calc(100vh - ${statusBarHeight} - 500rpx)` }"
				:latitude="latitude" :longitude="longitude" :markers="markers" :polyline="polyline" :scale="10"
				:max-scale="18" :min-scale="3">
				<!-- :animation="animationData" -->
				<!-- <cover-image src="@/static/map/touzhen.png" class="touzhen" ></cover-image> -->
			</map>
		</view>
		<!-- <view class="flex-row">
			<view class="footer-help flex-between" @click="calls" v-if="(orderDetail.orderStatus == 3 
				|| orderDetail.orderStatus == 4 
				|| orderDetail.orderStatus == 5) && orderDetail.driverInfo ">
				<text class="txt">{{orderDetail.busNumber || ''}}</text>
				<view class="customer-service-two flex-start">
					<view>{{orderDetail.driverInfo?orderDetail.driverInfo.split('-')[0]:''}}</view>
					<image src="@/static/image/common/phone.png" class="imgs"></image>
				</view>
			</view>
			<view v-else></view>
		</view> -->
		<view class="footer-side footer">
			<view class="flex-start order-tip" v-if="orderDetail.orderStatus == 2">
				发车前30分可查看车辆位置、车牌
			</view>
			<view class="flex-between order-tip" v-if="(orderDetail.orderStatus == 3 
				|| orderDetail.orderStatus == 4 
				|| orderDetail.orderStatus == 5) && orderDetail.driverInfo ">
				<text class="txt">{{orderDetail.busNumber || ''}}</text>
				<view class="customer-service-two flex-start" @click="calls">
					<view>{{orderDetail.driverInfo?orderDetail.driverInfo.split('-')[0]:''}}</view>
					<image src="@/static/image/common/phone.png" class="imgs"></image>
				</view>
			</view>
			<view class="footer-title">专业的司机，优质的服务，让你出行无忧！</view>
			<view class="">
				<!-- <view class="flex-start" @click="calls"
					v-if="orderDetail.orderStatus == 3 || orderDetail.orderStatus == 4">
					<view class="cart-address">{{orderDetail.busNumber || ''}}
						{{orderDetail.driverInfo?orderDetail.driverInfo.split('-')[0]:''}}
					</view>
					<image src="@/static/image/common/phone.png" class="phongImgs"></image>
				</view> -->
				
				
			
				<view class="footer-data">
					<view class="flex-between order-title">
						<view class="overflowEllipsis">{{orderDetail.lineName}}</view>
						<view class="order-status">{{orderDetail.orderStatus | orderStatusFil}}</view>
					</view>
					<view class="flex-start  order-time">
						<!-- <image src="@/static/image/common/time.png" class="timeImg"></image> -->
						<view class="flex-between" style="flex:1;">
							<view>
								{{parseTime(orderDetail.departureStartTime,'{m}月{d}日 {h}:{i}')}}-{{parseTime(orderDetail.departureEndTime,'{h}:{i}')}}
							</view>
							<!-- <view class="propleNum">
								<template v-if="orderDetail.orderNumber">
									人数 {{orderDetail.orderNumber}}人
								</template>
							</view> -->
						</view>
					</view>
					<view class="order-item-content">
						<view class="flex-start order-site">
							<view class="spot"></view>
							<view class="overflowEllipsis">{{orderDetail.upName || ''}}</view>
						</view>
									
									
						<view class="flex-start order-site">
							<view class="spot"></view>
							<view class="flex-between" style="flex:1;">
								<view class="overflowEllipsis">
									{{orderDetail.downName || ''}}
								</view>
								<!-- <view class="price flex-start">
									￥{{orderDetail.payAmount || ''}}
									<image src="@/static/image/common/tip.png" class="tipImgs" @click="handelTips"
										v-if="orderDetail.orderStatus == 3"></image>
								</view> -->
							</view>
						</view>
					</view>
					
					<view class="flex-between">
						<view class="price">
							<text class="priceMoney">{{orderDetail.payAmount|| 0}}</text>元
							<image src="@/static/image/common/tip.png" class="tipImgs"  @click="tipShow2=true"
								v-if="orderDetail.orderStatus == 2||orderDetail.orderStatus == 3||orderDetail.orderStatus == 4"></image>
						</view>
						<view class="propleNum">
							<template v-if="orderDetail.orderNumber">
								人数 {{orderDetail.orderNumber}}人
							</template>
						</view>
					</view>
					<view class="flex-between order-site-list">
						<view class="flex-start order-site" style="margin-top: 10rpx;" v-if="orderDetail.discountAmount">
							订单价格： {{orderDetail.orderAmount || 0}}元
						</view>
						<view class="flex-start order-site" style="margin-top: 10rpx;" v-if="orderDetail.discountAmount">
							优惠券： -{{orderDetail.discountRealAmount || 0}}元
						</view>
						
					</view>
					<view class="flex-start order-site" style="margin-top: 5rpx;" v-if="orderDetail.orderStatus == 6">
						退款金额： {{orderDetail.refundAmount || 0}}元
					</view>
					
					
					<view class="order-item-bottom">
						<!-- <view class="footer-item" 
							@click="goPage('/subPages/charterRule/index')">
							<image class="img" src="@/static/img/service_call_icon.png"></image>
							<text class="txt">在线客服</text>
						</view> -->
						<button class="footer-item" open-type="contact">
								<!-- <image src="@/static/image/user/robot.png" class="user-view-img"></image> -->
								<image class="img" src="@/static/img/service_call_icon.png"></image>
								<text class="txt">在线客服</text>
						</button>
						<view class="footer-item-center">|</view>
						<view class="footer-item" @click="call('4000-91-8484')">
							<image class="img" src="@/static/img/service_phone_icon.png"></image>
							<text class="txt">客服电话</text>
						</view>
					</view>
				</view>
				
				
				
				
			</view>
			<view class="flex-between countDownBox" v-if="orderDetail.orderStatus == 1">
				<view class="paymentBtn" @click="paymentBtn">
					{{countDown + ' '}}
					立即支付
				</view>
			</view>
			
		</view>
		<u-popup v-model="tipShow2" mode="center" border-radius="20" closeable>
			<view class="tipPopup">
				<view class="tipTitle flex-start">
					退票规则
				</view>
				<image src="@/static/image/index/rules.png" class="rulesImgs"></image>
				
			</view>
		</u-popup>
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	import startImg from '@/static/image/common/startImg.png'
	import endImg from '@/static/image/common/endImg.png'
	import cartImg from '@/static/image/common/cartImg.png'
	import {
		getOrderDetail,
		getWxPay
	} from "@/api/user.js"
	import {
		parseTime,
		throttle
	} from "@/utils/common"
	import moment from "../../utils/moment.js"

	import mqtt from "../../utils/mqtt.js"
	import CryptoJS from "../../utils/cryoto-js.js"
	import config from "@/config.js"
	// import mqtt from "mqtt"

	// const mqtt = require('mqtt/dist/mqtt.js')
	export default {
		data() {
			return {
				statusBarHeight: statusBarHeight,
				latitude: (23.043594 + 23.036344) / 2,
				longitude: (113.160704 + 113.160704) / 2,
				polyline: [{
					color: "#50A6FF",
					width: 2,
					dottedLine: true,
					points: [{
							latitude: 23.043594,
							longitude: 113.160704,
						},
						{
							latitude: 23.036344,
							longitude: 113.160704,
						}
					]
				}],
				orderNo: 0,
				orderDetail: {

				},
				time: null,
				time2:null,
				countDown: '',
				paymentData: {},
				client: null,
				logs: [],
				cartPoint: [],
				requestLocked: false,
				tipShow2:false //退票规则
			}
		},
		computed: {
			markers() {
				// return ''
				let arr = []
				if (this.orderDetail.downPoint && this.orderDetail.upPoint) {
					let downPoint = JSON.parse(this.orderDetail.downPoint)
					let upPoint = JSON.parse(this.orderDetail.upPoint)
					arr.push({
						id: 1,
						latitude: upPoint[1],
						longitude: upPoint[0],
						iconPath: '../../static/image/common/startImg.png',
						width: '30px',
						height: '42px',
					})
					arr.push({
						id: 2,
						latitude: downPoint[1],
						longitude: downPoint[0],
						iconPath: '../../static/image/common/endImg.png',
						width: '30px',
						height: '42px',
					})
				}
				if (this.cartPoint.length > 0) {
					arr[2] = {
						id: 3,
						latitude: this.cartPoint[1] - 0,
						longitude: this.cartPoint[0] - 0,
						iconPath: '../../static/image/common/cartImg.png',
						width: '34px',
						height: '34px',
					}
				}
				return arr
			},
		},
		filters: {
			orderStatusFil(val) {
				let map = {
					1: '待支付',
					2: '派车中',
					3: '待出行',
					4: '出行中',
					5: '已完成',
					6: '已退款',
					0: '已取消',
				}
				return map[val]
			},
		},
		onShow() {
			this.getOrderDetail()
		},
		onLoad(options) {
			if (options.orderNo) {
				this.orderNo = options.orderNo

				// this.orderNo = '2022032110384718065635'
			}

		},
		onUnload() {
			if (this.time) {
				clearInterval(this.time)
				this.time = null
			}
			if(this.time2){
				
				clearInterval(this.time2)
				this.time2  = null
			}
			if (this.client) {
				// client.unsubscribe('topic/test');
				this.client.end()
				this.client = null
			}
			console.log('-----------------1')
		},
		onHide() {
			if (this.time) {
				clearInterval(this.time)
				this.time = null
			}
			if (this.client) {
				// client.unsubscribe('topic/test');
				this.client.end()
				this.client = null
			}
		},
		methods: {
			connectMqtt: function() {
				let _this = this
				if (this.client) return false


				// let accessKey = 'LTAI5tPBttDUEc3Km4zzSWEr';//账号的 AccessKey，在阿里云控制台查看
				// let secretKey = '4r1TXAwb8tZLYRe5DPS5eb74mGYNbo';//账号的的 SecretKey，在阿里云控制台查看
				// let clientId =  'GID_WxMqtt@@@'+this.orderDetail.id
				// const connectUrl = 'wxs://mqtt-cn-2r42m1y4k01.mqtt.aliyuncs.com'


				let configMqtt = config.mqtt
				console.log(configMqtt, 'mqtt--------')
				let accessKey = 'LTAI5tJWHRDEF574ZWuXkQG9'; //账号的 AccessKey，在阿里云控制台查看
				let secretKey = 'l8JmLVZI9ClrdvmdkD83x270wgl7E9'; //账号的的 SecretKey，在阿里云控制台查看
				let clientId = `GID_${configMqtt}_wx@@@` + this.orderDetail.id
				// let clientId =  'GID_intercity_android@@@'+'17606515466'
				const connectUrl = 'wxs://post-cn-7mz2m0i8p04.mqtt.aliyuncs.com'


				const options = {
					connectTimeout: 4000, // 超时时间
					// 认证信息
					clientId: clientId,
					port: 443,
					// username: `Signature|${accessKey}|mqtt-cn-2r42m1y4k01`,
					username: `Signature|${accessKey}|post-cn-7mz2m0i8p04`,
					password: CryptoJS.HmacSHA1(clientId, secretKey).toString(CryptoJS.enc.Base64)
				}


				const client = mqtt.connect(connectUrl, options)
				let url = `${configMqtt}-intercity/${this.orderDetail.driverId}`
				// let url = `wx_1/10`
				client.on('connect', function(res) {
					console.log('连接成功', res, new Date())
					// 订阅   
					console.log(666666)
					client.subscribe(url, function(err) {
						console.log(url, err, 'err------', new Date())
						console.log('订阅成功/')
						// if (!err) {
						// client.publish(url, '120.43288606569172, 30.005004618112985')
						// }
					});


				})

				client.on('reconnect', (error) => {
					console.log('正在重连:', error)
				})

				client.on('error', (error) => {
					console.log('连接失败:', error)
				})

				client.on('message', (topic, message) => {
					console.log('收到消息：', topic, message.toString())
					if (topic === url) {
						let str = message.toString()
						// // str = '120.43288606569172,30.005004618112985'
						_this.cartPoint = str ? str.split(',') : []
						// console.log(_this.cartPoint)
					}

				})
				this.client = client
			},
			paymentBtn() {
				if (this.requestLocked) return false
				this.requestLocked = true
				// paymentData
				let payResult = this.paymentData
				let _this = this
				uni.requestPayment({
					// appId: res.data.appid,
					timeStamp: payResult.timeStamp,
					nonceStr: payResult.nonceStr,
					package: payResult.packageValue,
					"packageValue": payResult.packageValue,
					signType: payResult.signType,
					paySign: payResult.paySign,
					success: function(res) {
						_this.requestLocked = false
						_this.getOrderDetail()
						// wx.setStorageSync('orderdatalist', false)
						console.log(res, 'res')
						// wx.navigateTo({
						// 	url: '/pages/chartered/offerDetails/chartedpaySuccess/index?order_id=' + that.data.order_no,
						// })
					},
					fail: function(res) {
						_this.requestLocked = false
						console.log(res)

					}
				})
			},
			parseTime(time, cFormat) {
				if (!time) return ''
				return parseTime(moment(time).valueOf(), cFormat)
			},
			showtime(bol) {
				let nowtime = this.orderDetail.serverTime
				let endtime = this.orderDetail.expired
				console.log(nowtime, endtime, endtime - nowtime)
				let lefttime = endtime - nowtime
				if (lefttime > 0) {
					let leftm = Math.floor(lefttime / (60) % 60)
					let lefts = Math.floor(lefttime % 60)
					this.countDown = (leftm < 10 ? ('0' + leftm) : leftm) + ":" + (lefts < 10 ? ('0' + lefts) : lefts)
				} else {
					this.countDown = '00:00'
					clearInterval(this.time)
					this.time = null

					this.time2 = setTimeout(() => {
						this.getOrderDetail()
					}, bol ? 1500 : 0)

					console.log(2222222222, '倒计时结束 按道理要重新回调接口，获取新的数据')
				}

			},
			getWxPay() {
				getWxPay(this.orderNo).then(res => {
					if (res.code == 0) {
						this.paymentData = res.data
					}
				})
			},
			getOrderDetail() {
				uni.showLoading({
					title: '加载中',
				})
				console.log('-------')
				getOrderDetail(this.orderNo).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						this.orderDetail = res.data
						let downPoint = JSON.parse(res.data.downPoint)
						let upPoint = JSON.parse(res.data.upPoint)
						if (res.data.orderStatus == 1) {
							this.getWxPay()

							if (res.data.expired - this.orderDetail.serverTime > 0) {

								this.showtime()
								this.time = setInterval(() => {
									this.orderDetail.serverTime = Number(this.orderDetail.serverTime) + 1
									this.showtime()
								}, 1000)
							} else {
								this.countDown = '00:00'
								this.showtime(true)
							}

						}

						if (res.data.orderStatus == 3 && moment(this.orderDetail.departureStartTime).valueOf() -
							this.orderDetail.serverTime * 1000 <= 1000 * 60 * 30) {
							// 定时获取司机端的定位系统
							console.log('我要看車輛位置')
							console.log(this.orderDetail.departureStartTime,
								'----------------------------------------------')
							this.connectMqtt();
						}
						if (res.data.orderStatus == 4) {
							console.log('我要看車輛位置')
							console.log(this.orderDetail.departureStartTime,
								'----------------------------------------------')
							this.connectMqtt();
						}

						this.latitude = (Number(downPoint[1]) + Number(upPoint[1])) / 2
						this.longitude = (Number(downPoint[0]) + Number(upPoint[0])) / 2
						let points  = []
						
						
						
						let latitude = upPoint[1] - downPoint[1]
						let longitude = upPoint[0] - downPoint[0]
						let content1 = (Number(upPoint[1])+Number(downPoint[1]))/2 - longitude /4
						let centent2=(Number(upPoint[0])+Number(downPoint[0]))/2 + latitude /4
						
						
						
						for (var i = 0; i <= 40; i++) {
							let num = i * 2.5
							let stion = this.twoBezier(num/100,[Number(upPoint[1]),Number(upPoint[0])],[Number(content1),Number(centent2)],[Number(downPoint[1]),Number(downPoint[0])])	
							points.push({
								latitude: stion[0]+'',
								longitude: stion[1]+'',
							})
						}
						this.polyline = [{
							color: "#50A6FF",
							width: 2,
							dottedLine: true,
							points: points
						}]
						var mapCtx = uni.createMapContext("map");
						mapCtx.includePoints({
							padding: [70, ],
							points: [{
								latitude: upPoint[1],
								longitude: upPoint[0]
							}, {
								latitude: downPoint[1],
								longitude: downPoint[0]
							}]
						})
					} else if (res.code === 1001) {
						this.getOrderDetail()
					}

				}).catch(() => {
					uni.hideLoading()
				})
			},
			twoBezier(t, p1, cp, p2) {
				const [x1, y1] = p1;
				const [cx, cy] = cp;
				const [x2, y2] = p2;
				let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
				let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
				return [x, y];
			},
			calls() {
				let phone = this.orderDetail.driverInfo.split('-')[1]
				this.call(phone)
			},
			call(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			handelTips() {
				let that = this
				uni.showModal({
					content: '需要退款请联系客服处理',
					showCancel: false,
					confirmText: "知道了",
					confirmColor: "#FF8800",
					success: function(res) {

					}
				})
			},
			goPage(url) {
				uni.navigateTo({
					url
				})
			},
		},
	}
</script>

<style scoped lang="scss">
	@import "@/styles/data.scss";

	.footer {
		position: fixed;

		bottom: 0;
		width: 100%;
		// min-height: 350rpx;
		left: 0;

		&-help {
			// width: 360rpx;
			height: 88rpx;
			background: #FFFFFF;
			border-radius: 0px 50rpx 50rpx 0px;
			padding: 24rpx 32rpx 24rpx 24rpx;
			@include fs(28rpx, 400, #555, 40rpx);
			margin-bottom: 20rpx;

			
		}

		&-service {
			height: 120rpx;
			width: 120rpx;
			margin-right: 20rpx;

			// margin-bottom: 20rpx;
			display: flex;
			flex-direction: column;
			border-radius: 50%;
			align-items: center;
			justify-content: center;
			background-color: #FFFFFF;

			.img {
				width: 48rpx;
				height: 48rpx;
			}

			.txt {
				margin-top: 4rpx;
				@include fs(24rpx, 400, #999999, 32rpx);
			}

		}



		&-data {
			background: #FFFFFF;
			padding: 32rpx 16rpx 32rpx;
			padding-bottom: 32rpx;
			padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(16rpx + env(safe-area-inset-bottom));

			.phongImgs {
				width: 28rpx;
				height: 28rpx;
				margin-left: 4rpx;
			}

			.tipImgs {
				width: 28rpx;
				height: 28rpx;
				margin-left: 8rpx;
			}
		}
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}

	.overflowEllipsis {
		max-width: 550rpx;
	}
	.order-site-list{
		flex-wrap: wrap;
	}
	.order-time,
	.order-site {
		color: #272727;
	}
	
	.order-tip {
		@include fs(32rpx, 600, #272727, 40rpx);
		margin-bottom: 14rpx;
	}

	.propleNum {
		@include fs(32rpx, 400, #666, 32rpx);
	}

	.countDownBox {
		margin-top: 32rpx;
	}



	.paymentBtn {
		width: 100%;
		height: 90rpx;
		
		background: #FFCC00;
		border-radius: 45rpx;
		@include fs(32rpx, 600, #272727, 90rpx);
		text-align: center;
	}

	.countDown {
		@include fs(28rpx, 600, #FF8800, 40rpx);
	}

	.cart-address {
		@include fs(32rpx, 400, #272727, 32rpx);
	}
	.footer-side{
		width: 100%;
		padding: 37rpx 24rpx;
		background: #F0F1F4;
		background: linear-gradient(180deg, #FFFFFF 0%, #F0F1F4 100%);
		box-shadow: 0rpx -5rpx 16rpx rgba(92, 94, 100, 0.4);
		opacity: 1;
		border-radius: 24rpx 24rpx 0px 0px;
		.footer-title{
			@include fs(24rpx, 400, #999, 32rpx);
			margin-bottom: 20rpx;
		}
		.footer-data{
			padding: 32rpx 24rpx;
			border-radius: 20rpx;
		}
		.price{
			@include fs(26rpx,400,#272727,40rpx);
		}
		.priceMoney{
			@include fs(40rpx,600,#272727,40rpx);
			margin-right: 5rpx
		}
		.order-site{
			@include fs(32rpx,400,#666,45rpx);
			margin-bottom: 8rpx;
		}
		.spot{
			background: #999;
		}
	}
	.order-item-content{
		background: #f5f6f8;
		border-radius: 16rpx;
		padding: 20rpx 24rpx;
		margin-bottom: 25rpx;
	}
	.order-item-bottom{
		border-top: 1px solid #DBDBDB;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.footer-item{
			width: 300rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 32rpx 0 0;
			@include fs(28rpx,400,#666,32rpx);
			background: none;
			border: none;
			.img{
				width: 36rpx;
				height: 36rpx;
				margin-right: 16rpx;
			}
		}
		.footer-item::after{
			border: none;
		}
		.footer-item-center{
			padding-top: 32rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			@include fs(28rpx,400,#dbdbdb,28rpx);
		}
	}
	.imgs {
		width: 32rpx;
		height: 32rpx;
		margin-left: 8rpx;
	}
	
	.customer-service-two {
		
		// margin-right: 28rpx;
		@include fs(27rpx, 400, #666, 32rpx);
	}
	.tipPopup{
		padding: 40rpx 50rpx;
		width: 600rpx;
		box-sizing: border-box;
		.tipImgs{
			width: 32rpx;
			height: 32rpx;
			margin-right: 12rpx;
		}
		.tipTitle{
			@include fs(32rpx,600,#272727,45rpx);
			margin-bottom: 40rpx;
		}
		.tipText{
			@include fs(28rpx,400,#272727,42rpx);
			margin-bottom: 32rpx;
			&:last-child{
				margin-bottom: 40rpx;
			}
		}
		.tipBtn{
			@include fs(32rpx,400,#272727,80rpx);
			text-align: center;
			padding: 0 76rpx;
			// width: 280rpx;
			display: inline-block;
			margin: auto;
			background: #FFCC00;
			border-radius: 46rpx;
			
		}
	}
	.rulesImgs{
		width: 500rpx;
		height: 290rpx;
	}
</style>
