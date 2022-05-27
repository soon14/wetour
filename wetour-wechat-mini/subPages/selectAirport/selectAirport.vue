<template>
	<view class="selectCity-box">
		<uni-nav-bar
		  backgroundColor="fff"
		  statusBar
			fixed
			title="机场列表"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
			  <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="selectCity-container">
			<view class="search-city flex-between">
				<view class="search-box flex-start">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/searchImg.png" style="height:36rpx;width: 36rpx;"></image>
					<u-input type="text" maxlength="25" class="search-input" v-model="search" placeholder="请输入机场搜索" placeholder-style="color:#999999;" />
					<!-- @focus="setShow" -->
				</view>
			</view>
			<template v-if="!show">
				<view class="city-list">
					<view class="city-item flex-start" v-for="(item,index) in list" :key="index" @click="setCity(item)">
						<view class="city">
							{{item.cityCnName}}
						</view>
						<view class="airport">
							{{item.airportName}}
						</view>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="city-list">
					<view class="city-item flex-start" v-for="(item,index) in newList" :key="index" @click="setCity(item)">
						<view class="city">
							{{item.cityCnName}}
						</view>
						<view class="airport">
							{{item.airportName}}
						</view>
					</view>
				</view>
				<noDataView v-if="!newList.length" text="该机场未开通业务" imgType="2"></noDataView>
			</template>
		</view>
	</view>
</template>

<script>
	import pyjs from 'js-pinyin'
	import { getSelectAirport } from "@/api/order.js"
	import noDataView from "@/components/noDataView.vue"
	export default {
		data() {
			return {
				search:'',
				// mockList:['阿勒泰','安康','鞍山','安庆','包头','毕节','北京','巴中','长春'],
				mockList:[
					// {city:'埃克塞特',content:'埃克塞特机场'},
					// {city:'杭州',content:'萧山机场'},
					// {city:'上海',content:'虹桥机场'},
					// {city:'上海',content:'虹口机场'},
					// {city:'阿布扎比',content:'阿布扎比国际机场'},
					// {
					// 	city:'杭州',
					// 	code:'20',
					// 	content:'杭州萧山机场',
					// 	longitude:'111',
					// 	latitude:'30'
					// },
					
					
					
					
					// departureAddress:this.departAddressData.label.content,  //出发地址
					// departureCity:this.departAddressData.city,   //出发城市	
					// departureCityCode:this.departAddressData.code,   //出发城市代码对应城市表里的ID
					// departureLongitude:this.departAddressData.longitude,   // 经度
					// departureLatitude:this.departAddressData.latitude,   //纬度
				],
				list:[],
	
				type:'',
			}
		},
		components:{
			noDataView,
		},
		computed:{
			show() {
				return this.search=='' ? false : true;
			},
			newList(){
				let arr = this.list
				let newList = []
				let search = this.search.toUpperCase()
				if(!this.search){
					return arr
				}else{
					arr.forEach(element=>{
						if(element.airportName.indexOf(search) !=-1 || element.py.indexOf(search) !=-1 || element.cityCnName.indexOf(search) !=-1) newList.push(element)
					})
					console.log(newList)
					return newList
				}
			},
		},
		onLoad(options) {
			if(options.type) this.type = options.type
			this.getSelectAirport()
			if(options.city){
				this.search = options.city
			}
		},
		onShow() {
			
		},
		methods:{
			// setShow(){
			// 	this.show = true
			// },
			setCity(item){
				
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2];
				// #ifdef MP-WEIXIN
					prevPage.$vm.ChoseAirportSelect({...item,type:this.type})
				// #endif
				// #ifdef H5
					prevPage.ChoseAirportSelect({...item,type:this.type})
				// #endif
				uni.navigateBack({})
			},
			getSelectAirport(){
				getSelectAirport().then(res=>{
					let arr = []
					res.data.forEach(element=>{
						arr.push({
							...element,
							py:pyjs.getFullChars(element.cityCnName).toUpperCase()
						})
					})
					arr.sort(function(a,b){
					    return a.py.localeCompare(b.py);})
					this.list = arr
				})
			},
		}
	}
</script>

<style lang="scss">
	.selectCity-box{
		background-color: #fff;
		min-height: 100vh;
	}
	.selectCity-container{
		padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
	}
	.search-city{
		margin:40rpx 32rpx;
		.search-box{
			flex: 1;
			height: 88rpx;
			padding: 0rpx 32rpx;
			background-color: #F5F5F5;
			border-radius: 44rpx;
			
			.search-input{
				text-align: center;
				margin-left: 21rpx;
				flex: 1;
				@include fs(30rpx,400,#000000,35rpx);
				
			}
		}
		.close{
			@include fs(28rpx,400,#555555,28rpx);
			margin-left: 28rpx;
		}
	}
	.current-box{
		margin-bottom: 29rpx;
		.current-label{
			@include fs(28rpx,400,#999999,28rpx);
			margin-bottom: 16rpx;
		}
		.current-value{
			display: inline-block;
			min-width: 206rpx;
			padding: 12rpx 30rpx;
			text-align: center;
			background: #FFFFFF;
			border: 1rpx solid #DBDBDB;
			border-radius: 32rpx;
			margin-right: 30rpx;
			@include fs(28rpx,400,#272727,40rpx);
		}
	}
	.city-list{
		.city-item{
			padding: 26rpx 32rpx;
			border-bottom: 1rpx solid #DFDFDF;
			@include fs(28rpx,400,#111111,28rpx);
			.city{
				width: 200rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
