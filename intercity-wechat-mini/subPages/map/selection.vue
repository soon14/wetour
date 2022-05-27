<template>
	<view class="selection-box">
		<uni-nav-bar
			backgroundColor="#FFFFFF"
			statusBar
			fixed
			title="地图选点"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
				<image  src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="selection-container" >
			<map id="map" style="width: 100vw;" class="maps" :style="{ 'height': `calc(100vh - ${statusBarHeight} - 300rpx)` }" :latitude="mylatitude||latitude" :longitude="mylongitude||longitude" :markers="markers" :polygons="polygons" @regionchange="regionchange" @markertap="markerClick" @labeltap="markerClick" :scale="scale" :max-scale="18" :min-scale="3">
				<!-- :animation="animationData" -->
				 <cover-image src="@/static/image/common/coreImg.png" class="coreImg" :animation="animationData" v-if="!showStatus"></cover-image>
			</map>
		</view>
		
		
		<view class="footer" >
			<!-- <view class="region">
				服务区域
			</view> -->
			<image src="@/static/image/common/region.png" @click="goOldAddress" class="region2"></image>
			<view   v-if="mapType === 1" class="footer-tip" >
				若未看到{{mapStatus==1?'上车':'下车'}}点，请尝试放大地图后，选择站点！
			</view>
			<view   v-else class="footer-tip" >
				服务区域范围内都可以{{mapStatus==1?'上车':'下车'}}，请选择您的{{mapStatus==1?'上车':'下车'}}点
			</view>
			<view class="footer-content" >
				<view class="input-box flex-start">
					<image src="@/static/image/common/search.png" class="searchImg"></image>
					<input type="text" disabled @click="showList" :placeholder="`请搜索${mapStatus==1?'上车':'下车'}点`" class="searchInput" placeholder-style='color:#999999'>
					<!-- <input type="text"  placeholder="测试" > -->
					<!-- <input type="text" class='inp' :focus='inputFocus' placeholder="测试" v-if="showStatus"> -->
				</view>
				<view class="footer-Sites" v-if="siteData.label&&mapType === 1">
					<view class="sites-label">
						{{mapStatus==1?'上车':'下车'}}点：{{siteData.label.content}}
					</view>
					<view class="sites-address">
						{{siteData.label.address}}
					</view>
				</view>
				<template v-else-if="mapType === 2">
					<view class="poi-list" v-if="locale.length>0">
						<scroll-view scroll-y="true" :style="{ 'height': `420rpx`}">
							<view class="poi-item" v-for="(item,index) in locale" :key="index" @click="neClickAddree(item)">
								<view class="poi-item-label">
									{{item.label}}
								</view>
								<view class="poi-item-address">
									{{item.address}}
								</view>
							</view>
						</scroll-view>
					</view>
					
				</template>
			</view>
			
			<view class="footer-btns" v-if="mapType === 1">
				<view class="common-btn" @click="selectAddress">
					确定站点
				</view>
			</view>
			<!-- <template v-if="mapType === 1">
				
				<view class="footer-Sites" v-if="siteData.label">
					<view class="sites-label">
						{{mapStatus==1?'上车':'下车'}}点：{{siteData.label.content}}
					</view>
					<view class="sites-address">
						{{siteData.label.address}}
					</view>
				</view>
				<view class="footer-btns">
					<view class="common-btn" @click="selectAddress">
						确定站点
					</view>
				</view>
			</template> -->
			
			
		</view>
		<view class="select-box" v-if="showStatus" :style="{ 'height': `calc(100vh - ${statusBarHeight}) `,'top':statusBarHeight }">
			<view class="flex-between" style="margin-bottom: 20rpx;padding: 0 16rpx;">
				<view class="flex-start input-box">
					<image src="@/static/image/common/search.png" class="searchImg"></image>
					<input type="text"  :focus='inputFocus' :placeholder="`请搜索${mapStatus==1?'上车':'下车'}点`" placeholder-style='color:#999999' v-model="searchAddress" @input="onBindInput" class="searchInput">
				</view>
				<view class="cancel" @click="cancel">
					取消
				</view>
			</view>
			<view class="select-list">
				<scroll-view scroll-y="true" :style="{ 'height': `calc(100vh - ${statusBarHeight} - 116rpx) `}">
					<view class="select-item" v-for="(item,index) in list" :key="index" @click="clickAddress(item)">
						<image src="@/static/image/common/address.png" class="addressImg"></image>
						<view class="" style="width: 660rpx;">
							<view class="select-item-label">
								{{item.label.content}}
							</view>
							<view class="select-item-address">
								{{item.label.address}}
							</view>
						</view>
					</view>
					<view class="" v-if="list.length == 0" style="text-align: center;">
						<image src="@/static/img/no_order.png" style="height: 300rpx;margin-top: 150rpx;" mode="heightFix"></image>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	import coordinateImg from '@/static/image/common/coordinateImg.png'
	import amapFile from "@/libs/amap-wx.js"
	var myAmapFun = new amapFile.AMapWX({ key: 'cee8960a500b38563efb7e69e4459ef2' });
	import {mapGetters} from 'vuex'
	import {subtraction} from '@/utils/common.js'
	export default {
		data(){
			return {
				statusBarHeight:statusBarHeight,
				mapType:0, //1：选点  2：区域
				mapStatus:0, // 1:上车  2；下车
	
				mylatitude:0,
				mylongitude:0,
			
				latitude: 0,
				longitude:0,
				oldlatitude:0,
				oldlongitude: 0,
				siteData:{
					
				},
				animation:null,
				animationData: {},
				mapCtx:null,
				showStatus:false,
				inputFocus:false,
				searchAddress:'',
				scale:13, //缩放级别
				locale:[],
				list:[],
				citycode:0,
				
			}
		},
		computed:{
			...mapGetters([
				'lineDetail',
			]),
			// lineDetail
			polygons(){
				let polygons = [
					
				]
				if(this.mapType ==2){
					let { arr } = this.lineDetail
					
					let points = []
					// {"latitude":"39.973877","longitude":"116.287406"}
					arr.forEach(element=>{
						points.push({
							"latitude":element[1] + '',"longitude":element[0] + ''
						})
					})
					polygons.push(
						{
							strokeWidth: 1,
							strokeColor: '#2E89FF',
							fillColor: '#2E89FF19',
							points: points
						}
					)
				}
				console.log(polygons,'polygons----------------------')
				return polygons
			},
			markers() {
				if(this.mapType ==1) {
					let { arr } = this.lineDetail
					console.log(arr,33333)
					
					
					
					return arr
					
				}else{
					return []
				}
				
			},
		},
		onLoad(options) {
			
			if(options.type) {
				this.mapType = Number(options.type)
				if(this.mapType == 2) {
					// this.list = this.lineDetail.arr
					this.citycode = this.lineDetail.town || this.lineDetail.city
					let {center} = this.lineDetail
					console.log(center,this.citycode,this.lineDetail,'-333--3-3-3-3-3-3')
					this.latitude = center[1]
					this.oldlatitude = center[1]
					this.longitude = center[0]
					this.oldlongitude = center[0]
					
					console.log(this.list,this.citycode,333333)
					if(options.latitude){ //如果拿到了自己的定位
						var vs = this.polygons[0] ? this.polygons[0].points : [];
						let inside = this.IsPtInPoly(options.longitude,options.latitude,vs)
						if (inside) { //如果自己的定位在可服务区域内
							this.mylatitude = Number(options.latitude)
							this.mylongitude = Number(options.longitude)
							this.searchFun(this.mylatitude, this.mylongitude)
						}else{
							this.searchFun(this.latitude, this.longitude)
						}
					}else{
						this.searchFun(this.latitude, this.longitude)
					}
					
				}else{
					let {center,arr} = this.lineDetail
					console.log(center,arr,'-333--3-3-3-3-3-3',this.lineDetail)
					if(arr.length=1){ //只有一个定位到那一个
						this.latitude = arr[0].latitude
						this.oldlatitude = arr[0].latitude
						this.longitude = arr[0].longitude
						this.oldlongitude = arr[0].longitude
					}else{
						this.latitude = center[1]
						this.oldlatitude = center[1]
						this.longitude = center[0]
						this.oldlongitude = center[0]
					}
					
					
					if(options.latitude){
						let list = [...arr]
						list.forEach(res=>{ //计算距离用来排序
							let distance =this.GetDistance(res.latitude,res.longitude,options.latitude,options.longitude)
							res.distance = distance>0?distance:-distance
							
						})
						list.sort((a,b)=>{
							return a.distance-b.distance
						})
						this.list = list
						// this.latitude = options.latitude
						// this.longitude = options.longitude
					}else{
						this.list =  [...arr]
					}
					
					// if(!this.mapCtx){
					// 	this.mapCtx = uni.createMapContext("map");
					// }
					// setTimeout(()=>{
					// 	let points = []
					// 	arr.forEach(element=>{
					// 		points.push({
					// 			latitude: element.latitude,
					// 			longitude: element.longitude,
					// 		})
					// 	})
					// 	console.log(points)
					// 	this.mapCtx.includePoints({
					// 		padding: [ 70,],
					// 		points: [...points]
					// 	})
					// },2000)
					
				}
				// var e = {};
				// e.type = 'end';
				// that.regionchange(e)
			}
			if(options.status) this.mapStatus = Number(options.status)
			// myAmapFun.setFitView()
			
		},
		onShow() {
			// if(this.mapType === 1) {
			// 	this.list =  [...this.markers]
			// }
		},
		onHide() {
			this.$store.dispatch('line/setLineDetail',null)
		},
		onReady () {
			// this.animation = uni.createAnimation({
			// 	duration: 100, // 动画持续时间，单位 ms
			// 	timingFunction: 'linear', // 动画的效果
			// 	delay: 0, // 动画延迟时间，单位 ms
			// 	transformOrigin: '50% 50%' // 动画的中心点
			// });
		},
		methods:{
			onBindInput(){
				if(this.mapType === 1){
					if(!this.searchAddress){
						this.list =  [...this.markers]
					}else{
						let arr = []
						this.markers.forEach(item=>{
							if(item.label.content.indexOf(this.searchAddress)!=-1 || item.label.address.indexOf(this.searchAddress)!=-1){
								arr.push(item)
							}
						})
						this.list =  arr
					}
				}else if(this.mapType === 2){
					let arr = []
					if(!this.searchAddress){
						this.list = arr
					}else{
						var that = this;
						var list = [];
						myAmapFun.getInputtips({
							keywords: that.searchAddress,
							city: that.citycode + '',
							citylimit:true,
							location:that.longitude+','+that.latitude,
							success (data) {
								if (data) {
									var data = data.tips;
									console.log(data,'data---------------------------');
									for (var i in data) {
										var item = {};
										item.label = {}
										item.label.content = data[i].name;
										item.label.address = data[i].district+data[i].address;
										var location = data[i].location + '';
										location = location.split(',');
										item.latitude = location[1];
										item.longitude = location[0];
										// if (parseInt(data[i].adcode / 100) * 100 == citycode) {
										list.push(item)
										// }
										that.list = list
									};
								}
							},
							fail(res) {
								console.log(res)
							}
						})
						
					}
				}
			},   
			cancel(){
				this.showStatus = false
				this.searchAddress = ''
			},
			regionchange(e){
				console.log(e,'3================')
				// return false
				if(!this.mapCtx){
					this.mapCtx = uni.createMapContext("map");
				}
				
				// return false
				let that = this
				if (e.type != 'end') return;
				that.mapCtx.getCenterLocation({
					type: 'gcj02',
					success (res) {
						var x = res.longitude, y = res.latitude;
						if(y == that.latitude && x == that.longitude) return false
						console.log(55555)
						that.latitude = y
						that.longitude = x
						
						console.log(x,y)
						if(that.mapType !=2){
							return false
						}
						var vs = that.polygons[0] ? that.polygons[0].points : [];
						let inside = that.IsPtInPoly(x,y,vs)
						let z = 1
						that.searchFun(x, y, z)
						 if (!inside) {
							uni.showToast({
								title: '您所选择的点不在运营区域',
								icon: 'none'
							})
							return false
						}
					}
				})
				
			},
			searchFun (x, y, z) {
				console.log('searchFun')
				var that = this;
				
					var location = y + ',' + x
					console.log(location,3333333)
				myAmapFun.getPoiAround({
					// keyword: keyword,
					location: location,
					querytypes: '05|0603|0604|0703|08|09|10|11|12|13|14|15|16|17|18|19|99',
					success (res) {
						var locale = [];
						var res = res.poisData;
						console.log(res,333333)
						for (var i in res) {
							var item = {};
							item.sel = false;
							item.label = res[i].name;
							var latlng = res[i].location;
							latlng = latlng.split(',');
							item.latitude = latlng[1];
							item.longitude = latlng[0];
							item.address = res[i].cityname + res[i].adname + res[i].address;
							locale.push(item)
						};
						if (!locale.length) {
							uni.showToast({
								title: '所选点无效，请重新选点',
								icon: 'none'
							})
						} else {
							locale[0]['sel'] = true;
							that.locale = locale
						}
						// console.log(locale,'locale')
					},
					fail (res) {
						console.log(res,'getPoiArounderror')
					}
				})
			},
			IsPtInPoly: function (ALon, ALat, APoints) {
					var iSum = 0,
							iCount;
					var dLon1, dLon2, dLat1, dLat2, dLon;
					if (APoints.length < 3) return false;
					iCount = APoints.length;
					for (var i = 0; i < iCount; i++) {
							if (i+1 == iCount) {
									dLon1 = APoints[i].longitude;
									dLat1 = APoints[i].latitude;
									dLon2 = APoints[0].longitude;
									dLat2 = APoints[0].latitude;
							} else {
									dLon1 = APoints[i].longitude;
									dLat1 = APoints[i].latitude;
									dLon2 = APoints[i + 1].longitude;
									dLat2 = APoints[i + 1].latitude;
							}
							//以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
							if (((ALat >= dLat1) && (ALat < dLat2)) || ((ALat >= dLat2) && (ALat < dLat1))) {
									if (Math.abs(dLat1 - dLat2) > 0) {
											//得到 A点向左射线与边的交点的x坐标：
											dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - ALat)) / (dLat1 - dLat2);
											if (dLon < ALon)
													iSum++;
									}
							}
					}
					if (iSum % 2 != 0)
							return true;
					return false;
			},
			showList(){
				let _this = this
				this.showStatus = true
				
				
				this.$nextTick(function(){
					// console.log(uni.createSelectorQuery().select(".inp"))
					this.inputFocus = true
				})
			},
			selectAddress(){
				if(!this.siteData.label){
					uni.showToast({
						title: '请选择站点',
						icon: 'none'
					})
					return false
					// 请选择站点
				}
				
				var that = this;
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //当前页面的父页面
				
				console.log(this.siteData,this.lineDetail,',this.lineDetail,this.lineDetail,this.lineDetail')
				let data = {
					// ...this.siteData,
					label:this.siteData.label.content,
					address:this.siteData.label.address,
					latitude:this.siteData.latitude,
					longitude:this.siteData.longitude,
					id:this.siteData.id,
					myStatus:this.mapStatus,
				}
				// #ifdef MP-WEIXIN
					prevPage.$vm.setStationsData(data)
				// #endif
				// #ifdef H5
					prevPage.setStationsData(data)
				// #endif
				
				
				uni.navigateBack({})
			},
			neClickAddree(item){
				
				let inside = this.IsPtInPoly(this.longitude,this.latitude,this.polygons[0].points)
				if (!inside) {
					uni.showToast({
						title: '您所选择的点不在运营区域',
						icon: 'none'
					})
					return false
				}
				
				var that = this;
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //当前页面的父页面
				
				console.log(this.siteData,this.lineDetail)
				let data = {
					...item,
					myStatus:this.mapStatus,
					id:this.lineDetail.id
				}
				// #ifdef MP-WEIXIN
					prevPage.$vm.setStationsData(data)
				// #endif
				// #ifdef H5
					prevPage.setStationsData(data)
				// #endif
				uni.navigateBack({})
				// label:data.label,
				// address:data.address,
				// latitude:data.latitude,
				// longitude:data.longitude,
			},
			markerClick(e){
				if(!this.mapCtx){
					this.mapCtx = uni.createMapContext("map");
				}
				// console.log(e.marketId)
				this.selectAddressFun(e.markerId)
				
			},
			selectAddressFun(id){
				let _this = this
				this.markers.forEach(item=>{
					// console.log(item)
					if(item.id === id) {
						this.siteData = item
						this.latitude = item.latitude
						this.longitude = item.longitude
						this.scale = 16
						// this.mapCtx.getScale({
						// 	success:function(res){
						// 		console.log(res,3333,_this.scale)
						// 	}
						// })
						// this.mapCtx.moveToLocation(this.latitude,this.longitude)
					}
				})
			},
			clickAddress(item){
				if(!this.mapCtx){
					this.mapCtx = uni.createMapContext("map");
				}
				this.cancel()
				this.siteData = item
				this.latitude = item.latitude
				this.longitude = item.longitude
				this.scale = 16
				// if(this.mapType === 2){
				// 	this.searchFun(this.latitude, this.longitude)
				// }
				// this.mapCtx.moveToLocation(this.latitude,this.longitude)
			},
			goOldAddress(){
				console.dir(this.latitude)
				console.dir(this.longitude)
				console.log(this.latitude,this.longitude,this.oldlatitude,this.oldlongitude)
				this.latitude = this.oldlatitude
				this.longitude = this.oldlongitude
				this.scale = 16
				// if(this.mapType === 2){
				// 	this.searchFun(this.latitude, this.longitude)
				// }
			},
			//计算距离
			GetDistance(lat1, lng1, lat2, lng2) {
			        var radLat1 = lat1 * Math.PI / 180.0;
			        var radLat2 = lat2 * Math.PI / 180.0;
			        var a = radLat1 - radLat2;
			        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
			        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
			            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
			        s = s * 6378.137; // EARTH_RADIUS;
			        s = Math.round(s * 10000) / 10000;
			        return s;
					 // 调用 return的距离单位为km
			    }
			    
			  
		}
	}
</script>

<style scoped lang="scss">
	.select-box{
		width: 100%;
		position: fixed;
		// top: 0;
		left: 0;
		background-color: #FFFFFF;
		z-index: 999;
		padding: 24rpx 0;
		.input-box{
			width: 620rpx;
			height: 72rpx;
			background: #F0F0F0;
			border-radius: 8rpx;
			padding: 16rpx 20rpx;
			
			.searchImg{
				width: 28rpx;
				height: 28rpx;
				margin-right: 10rpx;
			}
			.searchInput{
				font-size: 28rpx;
				line-height: 40rpx;
				width: 100%;
				@include fs(28rpx,400,#272727,49rpx);
			}
			
		}
		.cancel{
			@include fs(32rpx,400,#666,45rpx);
		}
		
		.select-list{}
		.select-item{
			display: flex;
			padding: 30rpx 16rpx;
			border-bottom: 1rpx solid #DBDBDB;
			.addressImg{
				width: 22rpx;
				height: 28rpx;
				margin-right: 20rpx;
			}
			&-label{
				@include fs(30rpx,600,#272727,32rpx);
				margin-bottom: 10rpx;
			}
			&-address{
				@include fs(26rpx,400,#666,42rpx);
			}
		}
	}
	.coreImg{
		width: 60rpx;
		height: 112rpx;
		position: absolute;
		bottom: calc(50% - 20rpx);
		left: calc(50% - 30rpx);
	}
	.maps{
		position: relative;
	}
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 1;
		// background-color: #FFFFFF;
		width: 100%;
		background:#F0F1F4;
		// background: linear-gradient(180deg, #FFFFFF 0%, #F0F1F4 100%);
		box-shadow: 0px -5px 16px rgba(92, 94, 100, 0.4);
		opacity: 1;
		margin-top: -24rpx;
		border-radius: 24rpx 24rpx 0px 0px;
		padding: 37rpx 28rpx;
		padding-bottom: 29rpx;
		padding-bottom: calc(29rpx + constant(safe-area-inset-bottom));  
		padding-bottom: calc(29rpx + env(safe-area-inset-bottom));  	
		.region{
			@include fs(28rpx,600,#FF8800,88rpx);
			width: 200rpx;
			height: 88rpx;
			background: #FFFFFF;
			opacity: 1;
			border-radius: 0px 50rpx 50rpx 0px;
			text-align: center;
			position: absolute;
			left: 0;
			top: -116rpx;
		}
		.region2{
			width: 100rpx;
			height: 100rpx;
			position: absolute;
			right: 28rpx;
			top: -136rpx;
		}
		.footer-content{
			background: #FFFFFF;
			padding: 24rpx;
			border-radius: 20rpx;
		}
		.input-box{
			height: 72rpx;
			background: #F0F0F0;
			opacity: 1;
			border-radius: 36rpx;
			padding: 16rpx 20rpx;
			margin-bottom: 16rpx;
			.searchImg{
				width: 28rpx;
				height: 28rpx;
				// margin-right: 10rpx;
				position: relative;
				left: 35%;
				transform: translateX(-50%);
			}
			.searchInput{
				font-size: 28rpx;
				line-height: 40rpx;
				width: 100%;
				text-align: center;
			}
		}
		.footer-tip{
			@include fs(24rpx,400,#999999,32rpx);
			margin-bottom: 20rpx;
		}
		.footer-Sites{
			margin-bottom: 16rpx;
			margin-top: 34rpx;
			.sites-label{
				@include fs(30rpx,600,#272727,45rpx);
				margin-bottom: 12rpx;
			}
			.sites-address{
				@include fs(26rpx,400,#999,45rpx);
			}
		}
		.footer-btns{
			width: 650rpx;
			margin: auto;
			margin-top: 40rpx;
		}
		.poi-item{
			margin: 0 -16rpx;
			padding: 30rpx 16rpx;
			border-bottom: 1rpx solid #DBDBDB;
			&-label{
				@include fs(32rpx,600,#272727,34rpx);
				margin-bottom: 10rpx;
			}
			&-address{
				@include fs(26rpx,400,#999999,42rpx);
			}
		}
	}
	.common-btn{
		border-radius: 45rpx;
	}
	
</style>
