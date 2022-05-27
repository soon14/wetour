<template>
	<view class="selectBus-box">
		<uni-nav-bar
		  backgroundColor="fff"
		  statusBar
			fixed
			title="选择车型"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
			  <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="selectBus-container">
			<view class="selectBus-list">
				<view  class="selectBus-item" v-for="(item,index) in newBusList" :key="index"  @click="submitBtn(item)">
					<view class="flex-between" style="margin-bottom: 20rpx;">
						<view class="bus-data">
							<view class="bus-name">
								{{item.name}}
							</view>
							<view class="bus-number flex-start">
								<view class="bus-view flex-start">
									<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetoursImg/userImg.png" class="bus-img"></image> -->
									<view class="">
										可乘 {{item.prople}}人
									</view>
								</view>
								<view class="bus-line"></view>
								<view class="bus-view flex-start" v-if="item.trunk">
									<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetoursImg/trunkImg.png" class="bus-img"></image> -->
									<view class="">
										可载 {{item.trunk}}件
									</view>
									
								</view>
							</view>
						</view>
						<image :src="item.img" style="height: 80rpx;" mode="heightFix"></image>
					</view>
					<view class="consult">
						{{item.consult}}
					</view>
					
					<view class="flex-between">
						<view class="flex-start bus-price">
						<!-- 	<view class="Company">
							</view> -->
							<view class="number">
								¥{{item.price}}
							</view>
							<view style="font-weight: 600;">
								/车
							</view>
						</view>
						<view class="bus-btn">
							立即预定
						</view>
					</view>
				</view>
			</view>
			<noDataView v-if="!newBusList.length" text="暂无车型可选"></noDataView>
		</view>
	</view>
</template>

<script>
	import noDataView from "@/components/noDataView.vue"
	import {mapGetters} from 'vuex'
	import { throttle } from "@/utils/common"
	import { getSelectBus } from "@/api/order.js"
	export default {
		components:{
			noDataView,
		},
		onShow() {
			// this.busList = []
			console.log(this.orderInfo,'===orderInfo')
		},
		onLoad(options) {
			// 1 日租  2 接机  3 送机  4 单程
			if(options.type) this.orderType = type
			uni.showLoading({
				title: '加载中',
			})
			this.getSelectBus()
		},
		computed:{
			...mapGetters([
				'orderInfo',
			]),
			newBusList(){
				let arr = []
				this.list.forEach(item=>{
					item.price && this.busList.some(data=>{
						if(data.busType == item.busType  ){
							arr.push({
								...data,
								id:item.id,
								price:item.price,
								name:item.busTypeName
							})
						} 
					})
				})
				console.log(arr,33333)
				return arr
			}
		},
		data() {
			return {
				orderType:'',
				busList:[
					{
						name:'舒适5座',
						prople:'4',
						trunk:'2',
						consult:'丰田卡罗拉、本田雅阁等同级别车型',
						busType:5,
						img:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/bus1.png',
					},
					{
						name:'舒适7座',
						prople:'6',
						trunk:'2',
						consult:'丰田塞纳、本田奥德赛等同级别车型',
						busType:7,
						img:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/bus2.png',
					},{
						name:'商务12座',
						prople:'11',
						trunk:'2',
						consult:'丰田海狮、高顶奔驰等同级别车型',
						busType:12,
						img:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/bus3.png',
					},{
						name:'中巴19座',
						prople:'18',
						// trunk:'2',
						consult:'宇通、金龙、新青年或同级用车',
						busType:19,
						img:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/bus4.png',
					},{
						name:'大巴37座',
						prople:'36',
						// trunk:'2',
						consult:'宇通、金龙、新青年或同级用车',
						busType:37,
						img:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/bus5.png',
					},{
						name:'大巴49座',
						prople:'48',
						// trunk:'2',
						consult:'宇通、金龙、新青年或同级用车',
						busType:49,
						img:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/bus6.png',
					}
				],
				list:[]
			};
		},
		methods:{
			submitBtn:throttle(function(item){
				// orderInfo
				// busType:[],    //车型多个值 格式[{"id":1,"busType":5,"number":3},{"id":2,"busType":7,"number":4} ]
				this.$store.dispatch('user/setOrderInfo',{
					...this.orderInfo,
					busType:JSON.stringify([{"id":item.id,"busType":item.busType,"number":1}]),
					price:item.price,
					"busData":item,
					
				})
				// return false
				uni.navigateTo({
					url: `/subPages/orderinfo/orderinfo`,
				})
			},1500),
			getSelectBus(){
				let data = {
					charteredCarType:this.orderInfo.charteredCarType,   //包车类型 1日租 2接机 3 送机 4单车
					
					cityCode:this.orderInfo.departureCityCode,   //出发城市代码对应城市表里的ID
					isForeign:this.orderInfo.isForeign,   
					// departure:this.orderInfo.departure,
					// destination:this.orderInfo.destination,
					
				}
				
				
					// data.departure = this.orderInfo.departure  //出发地址具体地址
					// data.destination = this.orderInfo.destination  //出发地址具体地址
				// if(this.orderInfo.charteredCarType != 1){
					data.departureLongitude = this.orderInfo.departureLongitude   // 经度
					data.departureLatitude = this.orderInfo.departureLatitude  //纬度
					data.destinationLongitude = this.orderInfo.destinationLongitude?this.orderInfo.destinationLongitude:0 // 经度
					data.destinationLatitude = this.orderInfo.destinationLatitude?this.orderInfo.destinationLatitude:0  //纬度
				
				// }else{
				// 	data.destination = this.orderInfo.departureAddress
				// }
				
				if(this.orderInfo.charteredCarType == 2 || this.orderInfo.charteredCarType == 3){
					data.flightCode = this.orderInfo.flightCode   // 经度
				}
				
				if(this.orderInfo.charteredCarRange){
					data.charteredCarRange= this.orderInfo.charteredCarRange   //1市内包车 2周边包车
				}
				getSelectBus(data).then(res=>{
					uni.hideLoading()
					this.list = res.data
					console.log(res,33333)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.selectBus-box{
		min-height: 100vh;
		background-color: #F5F5F5;
	}
	.selectBus-container{
		padding: 20rpx 32rpx;
	}
	.selectBus-list{
		.selectBus-item{
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 40rpx 32rpx 26rpx 31rpx;
			margin-bottom: 20rpx;
		}
		.bus-data{
			// .bus-number{
			// 	margin-bottom: 14rpx;
			// }
			.bus-name{
				@include fs(32rpx,500,#111111,45rpx);
				margin-bottom: 20rpx;
			}
			.bus-img{
				margin-right: 8rpx;
				width: 28rpx;
				height: 28rpx;
			}
			.bus-line{
				width: 1rpx;
				height: 24rpx;
				margin: 0rpx 14rpx;
				background-color: #dfdfdf;
			}
			.bus-view{
				
				@include fs(24rpx,400,#666666,24rpx);
			}
		}
		.consult{
			@include fs(24rpx,400,#666666,24rpx);
			margin-bottom: 24rpx;
		}
		.bus-price{
			display: flex;
			color: #CBA56A;
			align-items: baseline;
			font-size: 24rpx;
			.number{
				font-size: 44rpx;
			}
		}
		.bus-btn{
			width: 200rpx;
			background: #fff;
			border-radius: 32rpx;
			border: 2rpx solid #111111;
			@include fs(20rpx,500,#272727,48rpx);
			text-align: center;
		}
	}
</style>
