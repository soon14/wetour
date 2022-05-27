<template>
	<view class="content">
		<uni-nav-bar
		  :backgroundColor="'transparent'"
		  fixed
		  statusBar
			title=""
			:color="'transparent'"
			class="navbar"
			transition
			:navbaractive="2"
			>
			<!-- <view @click="toPages('/order/orderList/orderList')" slot="left"  hover-class="none">
			  <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourdex/userImg.png" style="height: 88rpx;width: 88rpx;vertical-align: text-bottom;"></image>
			</view> -->
		</uni-nav-bar>
		
		<banner :list="bannerList" />
		<!-- <view class="" style="backdrop-filter:blur(20px);">
			
		</view> -->
		<appointmentView   ref='appointmentView'></appointmentView>
		<!-- <button class="appointmentBtn" open-type="contact"  >客服测试</button> -->
		<view class="order-list">
			<swiper class="swiper" :indicator-dots="recentList.length>1?false:true"  indicator-color="#FFEFD3" indicator-active-color="#E8CEA1">
				<swiper-item  v-for="item in recentList" :key="item.orderNo" @click="toPages('/order/orderDetail/orderDetail?orderNo='+item.orderNo)">
					<view class="item-content"  >
						<view class="order-header flex-between">
							<view class="order-count">
								{{showTitle(item)}}
							</view>
							<view class="order-time flex-start">
								<view class="order-time-text">
									{{item.charteredCarType | charteredCarTypeFil }}
								</view>
								{{dateChange(item.departureStartTime)}}
							</view>
						</view>
						<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/user/bg.png" class="recentBg"></image> -->
						<view class="order-item">
							
							<view class="order-address" :class="{'flex-center':!item.destinationAddress,'flex-between':item.destinationAddress}">
								<view class="flex-start">
									<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/index/location.png" class="locationImg"></image> -->
									<view class="order-address-text">
										{{item.departureAddress}}
									</view>
								</view>
								
								<view class="flex-start" style="margin-top: 12rpx;" v-if="item.destinationAddress">
									<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/index/location.png" class="locationImg"></image> -->
									<view class="order-address-text">
										{{item.destinationAddress}}
									</view>
								</view>
							</view>
							<view class="flex-between" style="margin-top: 12rpx;">
								<view class="order-prople">
									乘客：{{item.passengerNumber}}成人 
									<template v-if="item.childNumber">{{item.childNumber}}儿童</template>
									<template v-if="item.baggageNumber">{{item.baggageNumber}}行李</template>
								</view>
								<view class="order-detail flex-start" >
									<view class="">
										订单详情  
									</view>
									<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/image/index/rightImg.png" class="rightImg"></image>
								</view>
							</view>
						
						</view>
										
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import banner from "@/components/index/banner.vue"  //banner图
	import appointmentView from "@/components/index/appointment" //推荐
	import bus from '@/utils/bus'
	import {mapGetters} from 'vuex'
	import {
		parseTime,
		throttle
	} from "@/utils/common"
	import moment from "moment"
	import { gerRecentOrder } from "@/api/order.js"
	export default {
		options: { styleIsolation: 'shared' },
		data() {
			return {
				navbaractive:false,
				bannerList:[
					// {
					// 	image: require('http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/banner.png'),
						
					// },
					{
						image: 'https://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/banner1.png',
						
					}
				],
				recentList:[]
			}
		},
		components:{
			banner,
			// ticketView,
			// recommendView,
			appointmentView
		},
		computed:{
			...mapGetters([
				'city_id',
				'userInfo',
				'access_token'
			]),
			mobile:function(){
				return this.userInfo.mobile
			}
		},
	    filters:{
			 charteredCarTypeFil(val) {
			   let map = {
			     1: "包车",
			     2: "接机",
			     3: "送机",
			     4: "单程",
			   };
			   return map[val];
			 },
		},
		onLoad() {
			
		},
		watch:{
			mobile:{
				handler(val){
					this.$refs.appointmentView.getOrderList()
					this.gerRecentOrder()
				}
			},
		},
		onShow() {
			if(this.userInfo.mobile){
				this.$refs.appointmentView.getOrderList()
				this.gerRecentOrder()
			}
			// this.gerRecentOrder()
			// IT4aMOApiKuEghER7mMKAxGii3v2FqME   //百度地图
			
		},
		onHide() {
			bus.$emit('clearTime')
		},
		methods: {
			showTitle(item){
				// let myTime  = moment(item.departureStartTime,'YYYY/MM/DD HH:mm:ss').valueOf()
				let myTime  = moment(moment(item.departureStartTime,'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD'),'YYYY-MM-DD').valueOf()
				// let myTime  = moment('2022-05-01 10:22:33','YYYY/MM/DD HH:mm:ss').valueOf()
				let time = moment(moment().format('YYYY-MM-DD'),'YYYY-MM-DD').valueOf()
				let newTime = (myTime - time) / (1000 * 60 * 60 * 24)
				// console.log(myTime)
				if(newTime < 0){
					return '行程已开始'
				}else if(newTime == 0){
					return '今天有行程'
				}else{
					
					return `${newTime}天后有行程`
				}
			},
			toPages:throttle(function(url){
				uni.navigateTo({
					url
				})
			},1500),
			setStationsData(data){
				bus.$emit('stationsData', {
					type:data.type,
					key:data.key,
					stations:data.stations
				});
			},
			ChoseTimeSelect(time){
				bus.$emit('setCharterTime', {
					time
				})
			},
			ChoseDaySelect(data){
				console.log('ChoseDaySelect')
				bus.$emit('setCharterDay', data)
			},
			ChoseAirportSelect(data){
				bus.$emit('setCharterAirport', data)
			},
			
			ChoseFlightSelect(data){
				// console.log(data,'ChoseFlightSelect')
				bus.$emit('setCharterFlight', data)
			},
			ChoseAddressSelect(data){
				// console.log(data,'ChoseFlightSelect')
				bus.$emit('setCharterAddress', data)
			},
			gerRecentOrder(){
				gerRecentOrder().then(res=>{
					this.recentList = res.data
				})
			},
			dateChange(date){
				// var time1 = new Date(date.replace(/-/g,"/")).format("yyyy-MM-dd hh:mm:ss");
				
				return parseTime(date.replace(/-/g,"/"),'{m}月{d}日 {h}:{i}')
			},
		},
		onShareAppMessage: function(res) {
			return {
				title: '',
				path: ''
			}
		},
		onPageScroll(e) {
			// if (e.scrollTop > 100) {
			// 	this.navbaractive = true
			// } else if (e.scrollTop < 100) {
			// 	this.navbaractive = false
			// }
		},
	}
</script>

<style scoped lang="scss">
	.content {
		min-height: 100vh;
		background-color: #F8F8F8;
		// .navbar{
		// 	opacity: 0;
		// 	transition: all .3s linear;
		// }
		// .navbar.active{
		// 	opacity: 1;
		// }
		.index-type{
			margin-bottom: 40rpx;
			padding: 0 16rpx;
		}
		.type-item{
			width: 33.333333%;
			text-align: center;
			&-img{
				text-align: center;
				margin: auto;
				/deep/ .u-image{
					margin: auto;
				}
			}
			&-text{
				margin-top: 10rpx;
				@include fs(28rpx,400,#555555,36rpx);
			}
		}
		.advertisement{
			padding: 0 16rpx;
			margin-bottom: 40rpx;
		}
	}
	.order-list{
		padding: 0 24rpx;
		margin-top: 20rpx;
	}
	.recentBg{
		height: 300rpx;
		width: 702rpx;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #FF7F00;
	}
	
	.item-content{
		position: relative;
		background: #CBA56A;
		border-radius: 20rpx ;
		box-shadow: 0rpx 4rpx 20rpx 1rpx rgba(32, 32, 32, 0.03);

	}
	
	.order-header {
		padding: 20rpx 32rpx;
		@include fs(32rpx,500,#ffffff,45rpx);
	
		
		.order-time-text{
			padding: 2rpx 8rpx ;
			background: #F8F2EB;
			border-radius: 6rpx;
			@include fs(20rpx,600,#CBA56A,28rpx);
			margin-right: 12rpx;
		}
		
		.order-time {
			@include fs(24rpx,400,#FFFFFF,34rpx);
		}
		
	}
	.order-item{
		// border: 8rpx solid #ffffff;
		border-radius: 20rpx;
		background: #FFFFFF;
		// background: linear-gradient(180deg, #FFF6E9 0%, #FFFFFF 100%);
		//box-shadow: 0px 0px 20rpx rgba(224, 213, 179, 0.4);
		// padding: 20rpx 16rpx;
		padding: 20rpx 32rpx;
		box-sizing: border-box;
		position: relative;
		
	
		
		.order-address{
			box-sizing: border-box;
			flex-direction: column;
			align-items: initial;
			.locationImg{
				width: 17rpx;
				height: 20rpx;
				margin-right: 13rpx;
			}
			.order-address-text{
				flex: 1;
				@include fs(28rpx,400,#666666,39rpx);
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			
		}
		.order-prople{
			@include fs(28rpx,400,#666666,39rpx);
		}
		.order-detail{
			@include fs(28rpx,400,#999999,39rpx);
		}
		.rightImg{
			margin-left: 8rpx;
			width: 10rpx;
			height: 22rpx;
		}
	}
	.swiper{
		height: 266rpx;
		padding: 0rpx 8rpx;
	}
</style>
