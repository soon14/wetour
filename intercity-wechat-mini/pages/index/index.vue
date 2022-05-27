<template>
	<view class="indexBox">
	
		<uni-nav-bar
			backgroundColor="#FFCC00"
			statusBar
			fixed
			title="出行线路"
			color="#272727"
			>
			<view class="flex-start" slot="left">
				<image  src="@/static/image/index/userImg.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"  @click="goUserDetail"></image>
				<!-- <image  src="@/static/image/common/change.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;margin-left: 40rpx;"  @click="getChange" v-if="options"></image> -->
			</view>
		</uni-nav-bar>
		<view class="index-container">
			<view class="index-list" :class="{'pb300':latelyStatus}">
				<view class="index-item" v-for="(item,index) in list" :key="index" @click="goOrderDetail(item)" >
					<view class="index-item_title flex-between">
						<!-- <image src="@/static/image/index/indexImgs.png" class="index-item_imgs"></image> -->
						<view class="index-item_left">
							{{item.lineName}}
						</view>
						<view class="index-item_right">{{item.operationsMode|modeFil}}
							<image src="@/static/image/index/toRight.png" class="toRight" ></image>
							{{item.operationsMode|modeFil2}}
						</view>
					</view>
					<view class="index-item_text index-item_text2 flex-start">
						<view class="spot green"></view>
						<view class="" style="flex:1;">
							{{item.station[0].siteName}}
						</view>
					</view>
					<view class="index-item_text index-item_text2 flex-start">
						<view class="spot blue"></view>
						<view class="" style="flex:1;">
							{{item.station[item.station.length-1].siteName}}
						</view>
					</view>
					<view class="index-item_text index-item_bottom flex-between ft18">
						<view class="">
							服务时间 {{timeFormat(item.startTime)}}-{{timeFormat(item.endTime)}}
						</view>
						<view class="">
							约{{maxTime(item.station)}}分钟
						</view>
					</view>
					<view class="index-item_spec">
						￥<span style="font-size:37rpx ;margin: 0 3rpx;">{{item.price}}</span>起
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
			<noDataView v-if="!list.length" text="啊噢~暂无线路哟~"></noDataView>
			<view class="lately-trip" v-if="latelyStatus">
				<view class="lately-container lately">
					<view class="flex-between lately-title">
						<view>最近行程</view>
						<view style="width: 80rpx;height: 100%;text-align: right;" @click="closeLately">
							<image src="@/static/image/common/close.png" class="close"></image>
						</view>
						
					</view>
					<view class="" @click="goPage('/subPages/order/orderDetail?orderNo='+newOrder.orderNo)">
						<view class="flex-between lately-time">
							<view>{{parseTime(newOrder.departureStartTime,'{m}月{d}日 {h}:{i}')}}-{{parseTime(newOrder.departureEndTime,'{h}:{i}')}}</view>
							<view class="lately-time-number">人数 {{newOrder.orderNumber}}人</view>
						</view>
						<view class="flex-start lately-site">
							<view class="spot green"></view>
							<view>{{newOrder.upName || ''}}</view>
						</view>
						<view class="flex-start lately-site">
							<view class="spot blue"></view>
							<view>{{newOrder.downName || ''}}</view>
						</view>
					</view>
				</view>
			</view>
			<button class="customer-service" open-type="contact">
					<!-- <image src="@/static/image/user/robot.png" class="user-view-img"></image> -->
					<image src="@/static/image/common/customer-service.png" class="customer-service-img"></image>
			</button>
			<!-- <image src="@/static/image/common/customer-service.png" class="customer-service-img" @click="goPage('/subPages/charterRule/index')"></image> -->
		</view>
	</view>
</template>

<script>
	
	import bus from '@/utils/bus'
	import {mapGetters} from 'vuex'
	import { linePage } from "@/api/index.js"
	import { loadList } from '@/mixins'
	import { parseTime, throttle } from "@/utils/common"
	import noDataView from "@/components/noDataView.vue"
	import moment from "@/utils/moment.js"
	import { getNewOrder } from "@/api/user.js"
	export default {
		options: { styleIsolation: 'shared' },
		mixins: [loadList],
		data() {
			return {
				latelyStatus:false,
				loadListApi: linePage,
				listKey:{
					lineStatus:1,
					driverId:'',
				},
				id:0,
				options:'',
				newOrder:{}
			}
		},
		filters:{
			modeFil(val){
				// 1 站点到区域 2 站点到站点 3 区域到区域 4 区域到站点
				let map = {
					1:'点',
					2:'点',
					3:'面',
					4:'面',
				}
				return map[val]
			},
			modeFil2(val){
				// 1 站点到区域 2 站点到站点 3 区域到区域 4 区域到站点
				let map = {

					1:'面',

					2:'点',

					3:'面',

					4:'点',

				}

				return map[val]

			},
		},
		components:{
			noDataView,
		},
		computed:{
			...mapGetters([
				'isLogin',
			]),
		},
		onLoad(options) {
			// console.log(options,33333)
			if(options.q){
				let query = decodeURIComponent(options.q)
				this.options = this.getQueryVariable(query,'id')
				this.listKey.driverId = this.options
			}
			// this.options = 26
			// this.listKey.driverId = this.options
			// if(options.id) this.id = options.id
			
		},
		onShow() {
			this.queryParams = {
			  current: 1,
			  size: 10,
			}
			this.list = []
			this.more = 'more'
			this.loadList()
			this.getNewOrder()
		},
		methods: {
			getNewOrder(){
				getNewOrder().then(res=>{
					if(res.code == 0 && res.data){
						this.newOrder = res.data
						this.latelyStatus = true
					}else if(res.code === 1001){
						setTimeout(()=>{
							this.getNewOrder()
						},2500)
					}else{
						this.newOrder = {}
						this.latelyStatus = false
					}
				})
				// 
			},
			parseTime(time,cFormat){
				if(!time) return ''
				return parseTime(moment(time).valueOf(),cFormat)
			},
			getChange(){
				if(this.listKey.driverId){
					this.listKey.driverId = ''
					this.queryParams = {
					  current: 1,
					  size: 10,
					}
					this.list = []
					this.more = 'more'
					uni.showToast({
						title: '切换到全部线路',
						duration: 2000,
						icon: "none"
					})
					this.loadList()
				}else{
					this.listKey.driverId = this.options
					this.queryParams = {
					  current: 1,
					  size: 10,
					}
					this.list = []
					this.more = 'more'
					// 切换到司机专属线路
					uni.showToast({
						title: '切换到司机专属线路',
						duration: 2000,
						icon: "none"
					})
					this.loadList()
				}
			},
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
			maxTime(list){
				let time = 0
				list.forEach(element=>{
					if(element.runtime > time ) time = element.runtime
				})
				return time
			},
			timeFormat(time){
				return time.split(':').splice(0,2).join(':')
			},
			linePage(){
				linePage().then(res=>{
					console.log(res,33333)
				})
			},
			goPage(url){
				uni.navigateTo({
					url
				})
			},
			closeLately(){
				this.latelyStatus = false
			},
			selectAddress:throttle(function(item){
				this.goPage('/subPages/map/selection')
			},1000),
			goUserDetail:throttle(function(item){
				// if(this.isLogin){
					this.goPage('/pages/user/index')
				// }else{
					// this.goPage('/subPages/login/quick_logon')
				// }
			},1000),
			goOrderDetail:throttle(function(item){
				if(this.listKey.driverId){
					this.goPage(`/subPages/Travel/confirm?id=${item.id}&lineName=${item.lineName}&driverId=${this.listKey.driverId}`)
				}else{
					this.goPage(`/subPages/Travel/confirm?id=${item.id}&lineName=${item.lineName}`)
				}
			},1000),
		},
		onShareAppMessage: function(res) {
			return {
				title: '微巴士',
				path: ''
			}
		},
		onReachBottom() {
			this.timer && clearTimeout(this.timer)
			this.timer = setTimeout(this.loadList, 400)
		},
	}
</script>

<style scoped lang="scss">
	.indexBox{
		background-color: #F0F1F4;
	}
	.index-container{
		padding:16rpx;
		.index-item{
			margin-bottom: 20rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
			padding: 30rpx 24rpx;
			position: relative;
			&_title{
				@include fs(32rpx,600,#272727,45rpx);
				margin-bottom: 10rpx;
			}
			&_text{
				@include fs(28rpx,400,#272727,40rpx);
				margin-bottom: 14rpx;
				&:last-child{
					margin-bottom: 0;
				}
			}
			&_imgs{
				width: 24rpx;
				height: 24rpx;
				margin-right: 16rpx;
			}
			&_left{
				width: 580rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			&_right{
				width: 92rpx;
				height: 36rpx;
				background: #F4F3EF;
				opacity: 1;
				border-radius: 18rpx;
				@include fs(24rpx,400,#C49C79,36rpx);
				display: flex;
				justify-content: center;
				align-items: center;
			}
			&_bottom{
				width: 100%;
				height: 68rpx;
				background: #F5F6F8;
				border-radius: 12rpx;
				padding: 0 24rpx;
				color: #666;
			}
			.spot{
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				margin-right: 18rpx;
				// background-color: #BDBDBD;
			}
		}
	}
	.ft18{
		font-size: 28rpx !important;
	}
	.pb300{
		padding-bottom: 290rpx;
	}
	.lately-trip{
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		background: linear-gradient(180deg, #DEC7AC 0%, #B7A590 100%);
		padding: 28rpx;
		border-radius: 24rpx;
		.lately-container{
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 21rpx 28rpx ;
		}
		.lately{
			&-title{
				@include fs(28rpx,400,#666,54rpx);
				margin-bottom: 25rpx;
				.close{
					width: 28rpx;
					height: 28rpx;
				}
			}
			&-time{
				@include fs(32rpx,600,#272727,45rpx);
				margin-bottom: 11rpx;
				&-number{
					@include fs(28rpx,400,#272727,45rpx);
				}
			}
			&-site{
				@include fs(28rpx,400,#666,45rpx);
				margin-bottom: 8rpx;
			}
			.spot{
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				margin-right: 16rpx;
			}
			
		}
	}
	.customer-service{
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		right: 0;
		bottom: 370rpx;
		background: none;
		border: none;
	}
	.customer-service:after{
		border: none;
	}
	.customer-service-img{
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		left: 0;
		bottom: 0;
	}
	.green{
		background-color: #0AC7BB;
	}
	.blue{
		background-color: #50A6FF;
	}
	.toRight{
		width: 27rpx;
		height: 8rpx;
		margin: 0 7rpx;
	}
	.index-item_text2{
		width: 550rpx;
	}
	.index-item_spec{
		position: absolute;
		bottom: 114rpx;
		right: 24rpx;
		@include fs(28rpx,400,#FF8800,45rpx);
	}
</style>
