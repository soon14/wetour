<template>
	<view class="activity">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="活动页" color="#272727">
			<navigator open-type="switchTab" url="/pages/index/index" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>
		<image :src="detail.backgroundImage" class="logoImg"></image>
		<view class="content">
			<view class="card-item" >
				<view class="card-item-center">
					<view class="center-top">
						<view class="view1">{{detail.couponTemplate.couponType===1?'满减券':'满折券'}}</view>
						<view class="view2">{{detail.couponTemplate.templateTitle}}</view>
					</view>
					<view class="center-bottom" v-if="detail.couponTemplate.startTime">
						有效期：
						{{detail.couponTemplate.startTime.substring(0, detail.couponTemplate.startTime.indexOf(' ')).replace(/-/g,"/")}}
						-
						{{detail.couponTemplate.endTime.substring(0, detail.couponTemplate.endTime.indexOf(' ')).replace(/-/g,"/")}}
					</view>
				</view>
				<view class="card-item-left">
					<view class="left-top">
						{{detail.couponTemplate.couponType===1?detail.couponTemplate.reduceAmount:detail.couponTemplate.discount||10}}
						<text class="text1">{{detail.couponTemplate.couponType===1?'元':'折'}}</text>
					</view>
					<view class="left-bottom">
						满{{detail.couponTemplate.withAmount||100}}可用
					</view>
				</view>
			</view>
			<button class="buttons" :disabled="!detail.couponTemplate.surplusQuantity" @click="getcoupon()">立即领取</button>
			<!-- <view class="useRule">使用规则 ></view> -->
			
		</view>
		<view class="rule">
			<image src="@/static/image/common/activity.png" class="tipImgs"></image>
			<view v-html="detail.activityDesc" style="white-space: pre-wrap;"> 
				
			</view>
		</view>
	</view>
</template>

<script>
	import img1 from "@/static/img/logo.png"
	import { throttle } from "@/utils/common"
	import {
		couponActivity,
		couponGet
	} from '@/api/activity.js'
	export default {
		data() {
			return {
				img1,
				id:0,
				detail:{
					backgroundImage:'',
					activityDesc:'',
					couponTemplate:{
						surplusQuantity:0
					}
				}
			};
		},
		onLoad(options) {
			if(options.q){
				let query = decodeURIComponent(options.q)
				const optionsData = this.getQueryVariable(query,'id')
				this.id = optionsData
				couponActivity(optionsData).then(res=>{
					console.log(res)
					if(res.code===0){
						this.detail = res.data
					}
				})
			}
			
			// if(options.id){
			// 	couponActivity(options.id).then(res=>{
			// 		console.log(res)
			// 		if(res.code===0){
			// 			this.detail = res.data
			// 		}
			// 	})
			// }
			
				
				
			
		
		},
		methods:{
			getQueryVariable(query,variable)
				{
					let str = query.slice(query.indexOf('?')+1,query.length)
					 var vars = str.split("&");
					 for (var i=0;i<vars.length;i++) {
									 var pair = vars[i].split("=");
									 if(pair[0] == variable){return pair[1];}
					 }
					 return(false);
				},
				
				getcoupon:throttle(function(item){
					couponGet({templateId:this.detail.couponTemplate.id}).then(res=>{
						if(res.code===0){
							uni.showToast({
								title: '领取成功',
								duration: 2000,
								icon: "none"
							})
						}else{
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: "none"
							})
						}
					})
				},2000),
				goDetail: throttle(function(item) {
					console.log(item, item.orderNo, 'orderNo--------------');
					this.toPage('/subPages/discounts/detail?couponId=' + item.id);
					console.log(56555555);
				}, 1000),
				toPage(url) {
					uni.navigateTo({
						url
					});
				}
		}
	}
</script>

<style lang="scss">
.activity{
	background: #374AF0;
	overflow: hidden;
	min-height: 100vh;
}
.content{
	width: 700rpx;
	height: 400rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	margin-left: 25rpx;
	overflow: hidden;
}
.logoImg{
	width: 100%;
	height: 476rpx;
}
.rule{
	width: 700rpx;
	padding: 84rpx 28rpx 63rpx;
	position: relative;
	margin:100rpx 25rpx 45rpx;
	background: #1D2ECB;
	box-shadow: inset 0px 0px 20rpx 1px rgba(21, 34, 150, 0.4);
	border-radius: 20rpx;
	color: #729EE1;
}
.tipImgs{
	width: 300rpx;
	height: 80rpx;
	position: absolute;
	left: 200rpx;
	top: -40rpx;
	
}


	.card-item{
		 display: flex;
		 flex-direction: row-reverse;
		 justify-content: space-around;
		 align-items: center;
		 width: 100%;
		 height: 200rpx;
		 margin-bottom: 24rpx;
		 background: #fff;
		 padding: 30rpx 40rpx;
		 margin-top: 10rpx;
		 .u-icon_icon{
		 	color: #272727;
		 }
		 .card-item-center{
			 margin-left: 10rpx;
			 .center-top{
				 display: flex;
				 width: 380rpx;
				 margin-top: 25rpx;
				 .view1{
					 width: 80rpx;
					 height: 34rpx;
					 background: #FFCC00;
					 border-radius: 6rpx;
					 @include fs(22rpx, 400, #424036, 34rpx);
					 text-align: center;
					 margin-right: 12rpx;
				 }
				 .view2{
					width: 284rpx;
					@include fs(30rpx, 600, #272727, 35rpx);
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				 }
			 }
			 .center-bottom{
				 @include fs(26rpx, 400, #666, 30rpx);
				 margin-top: 25rpx;
			 }
		 }
		 .card-item-left{
			 .left-top{
				 text-align: center;
				 @include fs(60rpx, 400, #FF8800, 70rpx);
			 }
			 .text1{
				 @include fs(24rpx, 400, #FF8800, 28rpx);
			 }
			 .left-bottom{
				 text-align: center;
				 @include fs(26rpx, 400, #666, 30rpx);
				 margin-top: 16rpx;
			 }
		 }
	}
	.buttons{
		width: 600rpx;
		background:#FFC634;
		background: linear-gradient(180deg, #FFC634 0%, #FF7A00 100%);
		border-radius: 45rpx;
		border: 2px solid #ffffff;
		margin-left: 50rpx;
		@include fs(30rpx, 600, #fff, 90rpx);
	}
	.buttons[disabled]{
		background: #f7f7f7;
		    color: rgba(0,0,0,.3);
			border: 2px solid #f7f7f7;
	}
	.useRule{
		margin-top: 26rpx;
		@include fs(28rpx, 400, #999, 28rpx);
		text-align: center;
	}
</style>
