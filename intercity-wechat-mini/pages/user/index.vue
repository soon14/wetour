<template>
	<view class="user-container">
		<uni-nav-bar
			backgroundColor="#FFFFFF"
			statusBar
			fixed
			title="我的"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
				<image  src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="user-content">
			<view class="user-data flex-start">
				<image src="../../static/user/user-img.png" class="user-img"></image>
				<view class="user-info" >
					<view class="user-name">
						Hello，微巴士用户
					</view>
					<!-- <view class="user-phone">
						您还未登录哟~
					</view> -->
				</view>
				<!-- <view class="user-info" v-else>
					<view class="user-name">
						Hello，微巴士用户
					</view>
					<view class="flex-start">
						<image src="../../static/image/common/phoneSmall.png" class="phoneSmall"></image>
						<view class="user-phone">
							{{userInfo.mobile?strReplace(userInfo.mobile):'--'}}
						</view>
					</view>
				</view> -->
			</view>
			<view class="line-box">
				<view class="line-box-item flex-between" @click="toPages('/subPages/discounts/index')">
					<view class="line-box-item-label">优惠券</view>
					<view class="">
						<text class="card-text">{{couponNum}}张</text>
						<u-icon name="arrow-right" color="#999" size="28"></u-icon>
						
					</view>
				</view>
			</view>
			<view class="line-box">
				<view class="line-box-item flex-between" @click="toPages('/subPages/user/other?url=personAgreement.html?t=1646026635229')">
					<view class="line-box-item-label">隐私政策</view>
					<view class="">
						<u-icon name="arrow-right" color="#999" size="28"></u-icon>
					</view>
				</view>
				<view class="line-box-item flex-between" @click="toPages('/subPages/user/other?url=serveAgreement.html?t=1646121452593')">
					<view class="line-box-item-label">微巴士出行平台服务电子协议</view>
					<view class="">
						<u-icon name="arrow-right" color="#999" size="28"></u-icon>
					</view>
				</view>
				<view class="line-box-item flex-between" @click="call('4000-91-8484')">
					<view class="line-box-item-label">客服热线：4000-91-8484</view>
					<view class="flex-start">
						<view class="time">07:00-22:00</view>
						<u-icon name="arrow-right" color="#999" size="28"></u-icon>
					</view>
				</view>
			</view>
			
			<!-- <view class="line-box">
				
				
			</view> -->
			
			<!-- <view class="out-btn" @click="logOut">
				退出登录
			</view> -->
			<view class="Version">
				<view class="">
					Version {{version}}
				</view>
				<view class="">
					微巴士出行 版权所有
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {strReplace} from "@/utils/common.js"
	import {mapGetters} from 'vuex'
	import { base_info } from "@/api/user.js"
	import {
		couponList
	} from '@/api/activity.js'
	export default {
		data(){
			return {
				version:'',
				couponNum:0
			}
		},
		computed:{
			...mapGetters([
				'userInfo',
			]),
		},
		onShow() {
			// this.GetUserInfo()
			const accountInfo = uni.getAccountInfoSync()
			console.log(accountInfo,'accountInfo')
			this.version = accountInfo.miniProgram?.version
			this.getcoupon()
		},
		methods:{
			getcoupon(){
				couponList({couponStatus:1}).then(res=>{
					// [err,{code,data}]
					console.log(res,'res')
					const [err,{code,data}] = res
					if(code===0){
						this.couponNum = data.total 
					}
				})
			},
			
			strReplace(phone){
				return strReplace(phone,1)
			},
			logOut(){
				let that = this
				uni.showModal({
					content: '您确认退出登录吗？',
					showCancel: true,
					cancelText: "取消",
					cancelColor: "#555555",
					confirmText: "确定",
					confirmColor: "#FF8800",
					success: function (res) {
						that.$store.dispatch('user/logOut').then(res=>{
							uni.navigateBack()
						})
					}
				})
				
			},
			toPages(url){
				uni.navigateTo({
					url
				})
			},
			call(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.user-container{
		background: #F0F1F4;
		min-height: 100vh;
		.user-content{
			.user-data{
				margin-bottom: 20rpx;
				background-color: #fff;
				padding: 52rpx 16rpx 48rpx;
				.user-img{
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					margin-right: 28rpx;
				}
				.user-info{
					height: 140rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					.user-name{
						@include fs(40rpx,600,#272727,40rpx);
					}
					.phoneSmall{
						width: 19rpx;
						height: 24rpx;
						margin-right: 8rpx;
					}
					.user-phone{
						@include fs(32rpx,400,#272727,32rpx);
					}
				}
			}
			.line-box{
				background: #FFF;
				margin-bottom: 20rpx;
				@include fs(32rpx,400,#555,36rpx);
				.line-box-item{
					padding: 23rpx 26rpx 22rpx 16rpx;
					border-bottom: 1rpx solid #EEEEEE;
					&:last-child{
						border:none;
					}
					.time{
						@include fs(28rpx,400,#999,36rpx);
						margin-right: 24rpx;
					}
				}
			}
			
			.out-btn{
				text-align: center;
				background-color: #fff;
				padding: 23rpx  22rpx;
				@include fs(32rpx,400,#272727,45rpx);
				font-family: PingFang SC;
			}
		}
		  
	}
	.Version{
		text-align: center;
		@include fs(28rpx,400,#999999,40rpx);
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		margin: auto;
	}
	.card-text{
		@include fs(30rpx,400,#666,30rpx);
	}
</style>
