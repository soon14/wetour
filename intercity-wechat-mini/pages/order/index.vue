<template>
	<view class="order-box">
		<uni-nav-bar
			backgroundColor="#FFFFFF"
			statusBar
			fixed
			title="订单列表"
			color="#272727"
			>
		</uni-nav-bar>
		<view class="order-container" :style="{ 'min-height': `calc(100vh - ${statusBarHeight})` }">
			<view style="position: fixed;width: 100%;" :style="{ 'top':statusBarHeight }">
				<u-tabs
					:list="tabs" 
					:current="current" 
					@change="tabsChange" 
					:is-scroll="false"
					font-size="32"
					inactive-color="#555"
					active-color="#FF8800"
					lineWidth="40rpx"
					lineHeight="5rpx"
					lineColor="#FF8800"
					class="myTabs"
				>
				</u-tabs>
			</view>
			<view class="order-list">
				<view class="order-item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
					<!-- <view class=" flex-between"> -->
					<view class="flex-between order-title">
						<view class="overflowEllipsis">{{item.lineName}}</view>
						<view class="order-status">{{item.orderStatus | orderStatusFil}}</view>
					</view>
					<view class="flex-between  order-time">
						<!-- <image src="@/static/image/common/time.png" class="timeImg"></image> -->
						<view>{{parseTime(item.departureStartTime,'{m}月{d}日 {h}:{i}')}}-{{parseTime(item.departureEndTime,'{h}:{i}')}}</view>
						<view class="price">
							<text class="priceMoney">{{item.payAmount}}</text>元
						</view>
					</view>
					<view class="order-item-content">
						<view class="flex-start order-site">
							<view class="spot"></view>
							<view class="overflowEllipsis">{{item.upName || ''}}</view>
						</view>
						<view class="flex-start order-site">
							<view class="spot"></view>
							<view class="flex-between" style="flex:1;">
								<view  class="overflowEllipsis">
									{{item.downName || ''}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more
					:status="more"
					color="#333"
					@click="manualLoad"
					:style="{ padding: '40rpx 0' }"
					v-if="list.length>0"
				/>
			</view>
			 <!-- && userInfo.mobile -->
			<noDataView v-if="!list.length"></noDataView>
			<!-- <noDataView v-if="myLoading && !list.length && access_token"></noDataView> -->
			<!-- <view class="no-invoice" v-if="!userInfo.mobile">
			  <image src="@/static/img/no_login.png"></image>
			  <text>登录后查看订单</text>
				<view class="no_login_btn" @click="toPage('/subPages/login/quick_logon')">
					立即登录
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	import {mapGetters} from 'vuex'
	import { loadList } from '@/mixins'
	import { getOrderList } from "@/api/user.js"
	import { parseTime, throttle } from "@/utils/common"
	import {requestPost} from "@/utils/request.js"
	import noDataView from "@/components/noDataView.vue"
	import moment from "../../utils/moment.js"
	export default {
		mixins:[loadList],
		components:{
			noDataView,
		},
		data() {
			return {
				loadListApi: getOrderList,
				statusBarHeight:statusBarHeight,
				listKey:{
					orderStatus:-1,
				},
				current:0,
				tabs: [{
					name: '全部'
				}, {
					name: '待支付',
				}, {
					name: '派车中'
				}, {
					name: '待出行'
				}, {
					name: '已完成'
				}],
				orderdata:[],
				list:[],
				requestLocked:false,
			}
		},
		computed:{
			...mapGetters([
				'userInfo',
				'access_token',
				'city_id',
			]),
		},
		filters:{
			orderStatusFil(val){
				let map = {
					1:'待支付',
					2:'派车中',
					3:'待出行',
					4:'出行中',
					5:'已完成',
					6:'已退款',
					0:'已取消',
				}
				return map[val]
			},
		},
		onLoad() {
			
		},
		onShow() {
			console.log(this.userInfo,3333333)
			// if (this.userInfo.mobile) {
			// 	// uni.setStorageSync('reload', false);
			// 	// this.setData({ reload: true });
			// 	// this.listKey.user_id = this.userInfo.id
			// 	this.list = []
			// 	this.load();
				
			// }else{
			// 	this.list = []
			// }
			
			this.list = []
			this.load();
			
			
			
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300,
			});
		},
		methods: {
			parseTime(time,cFormat){
				if(!time) return ''
				return parseTime(moment(time).valueOf(),cFormat)
			},
			tabsChange(index){
				this.current = index
				// if (!this.userInfo.mobile) return false
				this.list = []
				this.load()
			},
			load(){
				let arr = [-1,1,2,3,5]
				this.listKey.orderStatus = arr[this.current]
				this.queryParams.current = 1
				this.more = 'more' 
				console.log(1111)
				this.loadList()
				console.log(2222)
			},
	
			toPage(url){
				uni.navigateTo({
					url
				})
			},
			goDetail:throttle(function(item){
				console.log(item,item.orderNo,'orderNo--------------')
				this.toPage('/subPages/order/orderDetail?orderNo='+item.orderNo)
				console.log(56555555)
			},1000),
		},
		onReachBottom() {
			// if(this.userInfo.mobile){
				this.timer && clearTimeout(this.timer)
				this.timer = setTimeout(this.loadList, 400)
			// }
		},
	}
</script>

<style scoped lang="scss">
	@import "@/styles/data.scss";
	.order-box{
		min-height: 100vh;
		background-color: #F5F5F5;
	}
	.order-container{
		
		.order-list{
			padding: 16rpx;
			padding-top: 96rpx;
			.order-item{
				margin-bottom: 21rpx;
				padding: 24rpx;
				background-color: #fff;
				border-radius: 20rpx;
				.order-title{
					@include fs(32rpx,600,#272727,40rpx);
				}
				.priceMoney{
					@include fs(40rpx,600,#272727,40rpx);
				}
				.order-site{
					@include fs(32rpx,400,#666,45rpx);
					margin-bottom: 8rpx;
				}
				.spot{
					background: #999;
				}
				// .order-title{
				// 	@include fs(32rpx,600,#272727,32rpx);
				// 	margin-bottom: 24rpx;
					
				// 	.order-status{
				// 		@include fs(28rpx,400,#FF8800,32rpx);
				// 	}
				// }
				// .order-time,.order-site{
				// 	@include fs(32rpx,400,#555555,32rpx);
				// 	margin-bottom: 20rpx;
				// 	.timeImg{
				// 		width: 12rpx;
				// 		height: 12rpx;
				// 		margin-right: 16rpx;
				// 	}
				// }
				
				// .spot{
				// 	width: 12rpx;
				// 	height: 12rpx;
				// 	border-radius: 50%;
				// 	margin-right: 16rpx;
				// }
				// .price{
				// 	@include fs(32rpx,400,#272727,32rpx);
				// }
				// .green{
				// 	background-color: #0AC7BB;
				// }
				// .blue{
				// 	background-color: #50A6FF;
				// }
			}
		}
	}
	.green{
	  color: #16D6C9 !important;
	  border-color: #16D6C9 !important;
	}
	
	.orange{
	  color: #FF6F00 !important;
	  border-color: #FF6F00 !important;
	}
	.s28{
		font-size: 28rpx;
	}
	.c99{
		color: #999;
	}
	.overflowEllipsis{
		max-width: 516rpx;
	}
	.myTabs{
		/deep/ .u-tab-bar{
			bottom: -6rpx;
			border-radius: 5rpx;
		}
	}
	.order-item-content{
		background: #f5f6f8;
		border-radius: 16rpx;
		padding: 20rpx 24rpx;
	}
</style>
