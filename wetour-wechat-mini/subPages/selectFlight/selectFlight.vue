<template>
	<view class="selectFlight-box">
		<uni-nav-bar
		  backgroundColor="fff"
		  statusBar
			fixed
			title="航班选择"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
			  <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="selectFlight-container">
			<view class="flight-from">
				<view class="flight-item">
					<view class="flight-label">
						航班号
					</view>
					<view class="flight-value">
						<input type="text" v-model="from.number" placeholder="请填写航班号，如NH930"  placeholder-style="color:#999999;" />
					</view>
				</view>
				
				<view class="flight-item">
					<view class="flight-label">
						起飞日期(当地)
					</view>
					<view class="flight-value" @click="showTime">
						<input type="text" v-model="from.time" disabled placeholder="请选择起飞日期"  placeholder-style="color:#999999;" />
					</view>
				</view>
				<view class="flight-tip">
					如有中转请填写末班航班
				</view>
				<!-- disabeld -->
				<!-- :class="{disabeld: !from.number  || !from.time}" -->
				<view class="flight-btn"  @click="getFlight">
					查询
				</view>
			</view>
			<view class="flight-list" v-if="flightList.length">
				<view class="list-tip">
					为您查到的航班
				</view>
				<view class="flight-list-item flex-between" v-for="(item,index) in flightList" :key="index" @click="ChoseFlightSelect(item)">
					
					<view class="flex-start" style="align-items: end;">
						<view class="flight-list-item-view">
							<view class="flight-list-item-label">
								09:25
							</view>
							<view class="flight-list-item-value">
								杭州萧山机场
							</view>
						</view>
						<view class="aircraft-box flex-start">
							<view class="line">
								
							</view>
							<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/aircraftImg.png" style="width: 28rpx;height: 28rpx;margin: 0 12rpx;"></image>
							<view class="line">
								
							</view>
						</view>
						<view class="flight-list-item-view">
							<view class="flight-list-item-label">
								13:00
							</view>
							<view class="flight-list-item-value">
								首尔仁川机场
							</view>
						</view>
					</view>
					<view class="">
						<view class="flight-list-item-view">
							<view class="flight-list-item-label">
								OZ360
							</view>
							<view class="flight-list-item-value">
								韩亚航空
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-select v-model="show" :list="list" @confirm="confirm" mode="mutil-column-auto" :mask-close-able="false"></u-select>
	</view>
</template>

<script>
	import moment from "moment"
	import { parseTime, throttle } from "@/utils/common"
	export default {
		data() {
			return {
				from:{
					number:'',
					time:'',
				},
				flightList:[
					// 1,2,3,4,5
				],
				show:false,
				list:[],
			}
		},
		onShow() {
			// console.log(moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf())
			// this.showTime()
		},
		methods: {
			showTime(){
				let daysCount = 180   //一共显示多少天
				
				let time = moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf()
				let list = []
				let obj = {}
				for (var i = 0; i < daysCount; i++) {
					let newTime = time + i * 24 * 3600 * 1000
					let arr = parseTime(newTime, "{m}-{d}").split('-')
					let m = arr[0] - 0 +'月'
					let d = arr[1] - 0 +'日'
					if(obj.label !== m){
						if(Object.keys(obj).length) {
							list.push(obj)
							obj = {}
						}
					}
					obj = {
						label:m,
						value:null,
						children:obj.children?obj.children:[]
					}
					
					obj.children.push({
						label:d,
						value:newTime
					})
					
					if(i == daysCount -1){
						list.push(obj)
					}
					
				}
				console.log(list)
				this.list = list
				
				this.show = true
			},
			getFlight(){
				if(!this.from.number){
					return uni.showToast({
						title: '请填写航班号',
						duration: 2000,
						icon: "none"
					})
				}
				
				if(!this.from.time){
					return uni.showToast({
						title: '请选择起飞日期',
						duration: 2000,
						icon: "none"
					})
				}
				
				this.flightList = [
					1,2,3,4,5
				]
			},
			ChoseFlightSelect(item){
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2];
				// #ifdef MP-WEIXIN
					prevPage.$vm.ChoseFlightSelect({
						name:'杭州萧山机场',
						time:this.from.time + ' 09:35:00',
						city:'杭州',
						code:'20',
						longitude:'111',
						latitude:'30'
					})
				// #endif
				// #ifdef H5
					prevPage.ChoseFlightSelect()
				// #endif
				uni.navigateBack({})
			},
			confirm(e){
				this.from.time = parseTime(e[1].value,'{y}/{m}/{d}')
			},
		}
	}
</script>

<style scoped lang="scss">
.selectFlight-box{
	background-color: #F8F8F8;
	min-height: 100vh;
}
.selectFlight-container{
	.flight-from{
		background-color: #FFFFFF;
		padding: 0 16rpx 28rpx;
	}
	.flight-item{
		padding: 31rpx 0 30rpx;
		border-bottom: 1rpx solid #EEEEEE;
		.flight-label{
			margin-bottom: 8rpx;
			@include fs(28rpx,400,#555555,40rpx);
		}
		.flight-value{
			input{
				@include fs(36rpx,600,#272727,50rpx);
			}
		}
	}
	.flight-tip{
		margin: 24rpx auto 20rpx;
		text-align: center;
		@include fs(28rpx,400,#999999,40rpx);
	}
	.flight-btn{
		width: 650rpx;
		background: linear-gradient(90deg, #FFCC00 0%, #FFA700 100%);
		opacity: 1;
		border-radius: 45rpx;
		text-align: center;
		margin: auto;
		@include fs(32rpx,600,#272727,90rpx);
	}
	.disabeld{
		background: #EEEEEE;
		color: #999999;
	}
	.flight-list{
		padding: 0 16rpx;
		.list-tip{
			margin: 28rpx auto 20rpx;
			text-align: center;
			@include fs(24rpx,400,#999999,33rpx);
		}
		&-item{
			// width: 718rpx;
			// height: 160px;
			background: #FFFFFF;
			opacity: 1;
			border-radius: 16rpx;
			padding: 42rpx 31rpx;
			text-align: center;
			margin-bottom: 20rpx;
			&-view{
				
			}
			&-label{
				@include fs(36rpx,600,#272727,36rpx);
				margin-bottom: 24rpx;
			}
			&-value{
				@include fs(24rpx,400,#555555,24rpx);
			}
			.aircraft-box{
				padding: 0 13rpx;
				.line{
					width: 41rpx;
					height: 1rpx;
					border-radius: 1rpx;
					background-color: #DBDBDB;
				}
			}
		}
	}
}

</style>
