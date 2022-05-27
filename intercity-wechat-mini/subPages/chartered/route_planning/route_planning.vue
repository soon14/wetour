<template>
	<view style="height: 100vh;">
		<view class="search">
		  <input type="text" v-model="input_value_" placeholder="请输入地点名称" @input="onBindInput" placeholder-class="placeholder" class="search-input" maxlength="50"></input>
		</view>
		<scroll-view class="search-list" v-if="search">
		  <view v-for="(item,index) in list" :key="index" @tap="search_select(item)" >{{item.name}}</view>
		</scroll-view>
		
		<view style="width:100%; height: 45%; position: relative;" >
		  <map id="map" style="width: 100%; height: 100%" show-location="true" show-compass="true" enable-rotate="true" :longitude="_longitude" :latitude="_latitude" :polygons="polygons_" @regionchange="regionchange"></map>
		  <cover-image src="@/static/map/touzhen.png" class="touzhen" :animation="animationData"></cover-image>
		  <cover-image src="@/static/map/dingwei.png" class="dingwei" @tap="dingwei"></cover-image>
		</view>
		<scroll-view class="box" scroll-y="true" v-if="!search" style="height: 45%;">
		  <view class="content" v-for="(item,index) in locale" :key="index" @tap="where(item,index)" >
		   
		    <view class="detail">
		      <scroll-view scroll-x="true">{{item.title}}</scroll-view>
		      <scroll-view scroll-x="true">{{item.address}}</scroll-view>
		    </view>
		    <image src="@/static/map/sel.png" class="sel" v-if="item.sel"></image>
		   
		  </view>
		</scroll-view>
	</view>
</template>

<script>
	import amapFile from "@/libs/amap-wx.js"
	import {requestPost} from "@/utils/request.js"
	var myAmapFun = new amapFile.AMapWX({ key: 'cee8960a500b38563efb7e69e4459ef2' });
	export default {
		data(){
			return {
				index: '',
				input_value: '',
				locale: [],
				locale_name: '',
				_local_name: '',
				_latitude: '30.290998',
				_longitude: '120.213116',
				stations: [],
				type_: '',
				polygons: [],
				polygons_: [],
				first: {}, // 逆地址解析获得的准确中心点信息
				input_value_: '',
				search: false,
				list: [], // 输入框提示语搜索列表
				_lat: '', // 当点击定位图片时回到定位点使用
				_lng: '',
				add: 0, // 途经点是替换还是增加
				zhuanxian: false,
				city_id: '',
				city_name: '',
				district:"",
				city_id:"",
				city_name:"",
				animation:null,
				animationData: {},
			}
		},
		onShow:function(){
			uni.setNavigationBarTitle({
			　　title:"地图选点"
			})
		},
		onLoad (options) {
			var that = this; 
			myAmapFun.getRegeo({
				success (data) {
					console.log("=====>")
					console.log(data)
					this.city_name = data[0].regeocodeData.addressComponent.city
					this.city_id = data[0].regeocodeData.addressComponent.adcode-0
					this.district = data[0].regeocodeData.addressComponent.district
				},
				fail (info) {
					console.log(info)
				}
			});
			// if (options.transfer) {
			// 	this.transfer = options.transfer
			// 	this.type_ = options.type_
			// 	this._latitude = options.start_latitude
			// 	this._longitude = options.start_longitude
			// } else if (options.zhuanxian) {
			// 	this.zhuanxian = true
			// 	this.index = options.index
			// } else {
				this.stations = JSON.parse(options.stations)
				console.log(1111)
				console.log(22222)
				this.index = options.index
				this._latitude = options.start_latitude
				this._longitude = options.start_longitude
				this.add = options.add
				this.type = options.type ? options.type : ''
				console.log(44444)
				if (options.limit) {
					this.limit = options.limit
				};
			// };
			var x = that.longitude;
			var y = that.latitude;
			// 包车途经点和终点没有区域限制
			if (that.limit == undefined) {
				// 获取可选区域的坐标组
				var data = {};
				data.city_id = uni.getStorageSync('city_id')-0;
				requestPost('/index/chartered/city_area', data, function (res) {
					console.log(res,23333)
					var polygons = res.area;
					that.polygons = polygons
				})
			};
			console.log('444445566')
			myAmapFun.getRegeo({
				success (data) {
					console.log(data,'datasssssssssss')
					that._latitude = data[0].latitude,
					that._lat = data[0].latitude,
					that._longitude = data[0].longitude,
					that._lng = data[0].longitude,
					that.input_value = data[0].desc,
					that.city_id = data[0].regeocodeData.addressComponent.adcode-0,
					that.city_name = data[0].regeocodeData.addressComponent.city
					that.searchFun(that._latitude, that._longitude)
				},
				fail (info) {
					console.log(info,3333333)
				}
			});
		},
		onReady () {
			this.animation = uni.createAnimation({
				duration: 100, // 动画持续时间，单位 ms
				timingFunction: 'linear', // 动画的效果
				delay: 0, // 动画延迟时间，单位 ms
				transformOrigin: '50% 50%' // 动画的中心点
			});
			console.log(this.animation,'this.animation')
		},
		
		methods:{
			search_select (item) {
				var that = this;
				this.search = false
				this.input_value_ = item.name
				this.input_value = item.name
				this._latitude = item.latitude
				this._longitude = item.longitude
				var e = {};
				e.type = 'end';
				that.regionchange(e)
			},
			regionchange(e){
				console.log(e,'eeeeeeeeeeeee')
				var that = this;
				if (e.type != 'end') return;
				var vs = that.polygons ? that.polygons : [];
				that.mapCtx = uni.createMapContext("map");
				that.mapCtx.getCenterLocation({
					type: 'gcj02',
					success (res) {
						var x = res.longitude, y = res.latitude;
						var inside = false;
						if (that.limit == undefined) {
							console.log(vs)
							for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
								var xi = vs[i][0], yi = vs[i][1];
								var xj = vs[j][0], yj = vs[j][1];
								var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
								if (intersect) {
									inside = !inside
								}
							}
						} else {
							inside = true
						};
						// if (!inside) {
						//   uni.showToast({
						//     title: '您所选择的点不在运营区域',
						//     icon: 'none'
						//   })
						// } else {
							myAmapFun.getRegeo({
								location: x + ',' + y,
								success (data) {
									var item = {};
									item.title = data[0].regeocodeData.formatted_address;
									item.location = {};
									item.location.lat = data[0].latitude;
									item.location.lng = data[0].longitude;
									that.search = false
									that.input_value = data[0].desc
									that.first = item
									that.city_id = data[0].regeocodeData.addressComponent.adcode-0
									that.city_name = (data[0].regeocodeData.addressComponent.city && data[0].regeocodeData.addressComponent.city.length) ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province
									var z = 1;
									that.searchFun(x, y, z)
								},
								fail (info) {
									//失败回调
									console.log(info)
								}
							});
						// }
					}
				})
				this.animation.translateX(-10).scale(1.1).step();
				this.animation.translateY(0).scale(1).step();
				this.animationData = this.animation.export()
			},
			
			onBindInput (e) {
				var that = this;
				var list = [];
				if (that.input_value_ == '' || that.input_value_.indexOf(' ') != -1) {
					this.search = false
					return
				};
				var citycode = uni.getStorageSync('city_id')-0;
				myAmapFun.getInputtips({
					keywords: that.input_value_,
					// location: location,
					city: citycode,
					// citylimit: true,
					// type: '05|0603|0604|0703|08|09|10|11|12|13|14|15|16|17|18|19|99',
					success (data) {
						if (data) {
							var data = data.tips;
							console.log(data);
							for (var i in data) {
								var item = {};
								item.name = data[i].name;
								var location = data[i].location + '';
								location = location.split(',');
								item.latitude = location[1];
								item.longitude = location[0];
								// if (parseInt(data[i].adcode / 100) * 100 == citycode) {
									list.push(item)
								// }
							};
							that.search = true
							that.list = list
						}
					},
					fail(res) {
						console.log(res)
					}
				})
	
			},
			input (e) {
				console.log(1)
			},
			searchFun (x, y, z) {
				console.log('searchFun')
				var that = this;
				if (that.search) {
					var keyword = that.input_value_;
					var location = ''
				} else {
					var keyword = that.input_value;
					var location = y + ',' + x
				};
				myAmapFun.getPoiAround({
					keyword: keyword,
					location: location,
					querytypes: '05|0603|0604|0703|08|09|10|11|12|13|14|15|16|17|18|19|99',
					success (res) {
						var locale = [];
						var res = res.poisData;
						for (var i in res) {
							var item = {};
							item.sel = false;
							item.title = res[i].name;
							var latlng = res[i].location;
							latlng = latlng.split(',');
							item.location = {};
							item.location.lat = latlng[1];
							item.location.lng = latlng[0];
							item.address = res[i].address;
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
					},
					fail (res) {
						console.log(res)
					}
				})
			},
			where (item,index) {
				// 变对勾
				var that = this;
				// var idx = e.currentTarget.dataset.index;
				// var locale = that.locale;
				var that = this;
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //当前页面的父页面
				// if (that.transfer) {
				// 	var type_ = Number(that.type_);
				// 	var station = {};
				// 	station.station_name = e.currentTarget.dataset.item.title; //改
				// 	station.longitude = Number(e.currentTarget.dataset.item.location.lng) * 1000000;
				// 	station.latitude = Number(e.currentTarget.dataset.item.location.lat) * 1000000;
					
					
				// 	switch (type_) {
				// 		case 0:
				// 			prevPage.selectComponent('#transfer').setData({
				// 				stations0_e: station
				// 			});
				// 			break
				// 		case 1:
				// 			prevPage.selectComponent('#transfer').setData({
				// 				stations1_s: station
				// 			});
				// 			break
				// 		case 2:
				// 			prevPage.selectComponent('#transfer').setData({
				// 				stations2_e: station
				// 			});
				// 			break
				// 		default:
				// 			prevPage.selectComponent('#transfer').setData({
				// 				stations3_s: station
				// 			});
				// 			break
				// 	}
				// } else if (that.zhuanxian) {
				// 	var station = {};
				// 	station.station_name = e.currentTarget.dataset.item.title; //改
				// 	station.longitude = Number(e.currentTarget.dataset.item.location.lng);
				// 	station.latitude = Number(e.currentTarget.dataset.item.location.lat);
				// 	var index = Number(that.index);
				// 	if (index) {
				// 		uni.setStorageSync('end_station', station)
				// 	} else {
				// 		uni.setStorageSync('start_station', station)
				// 	}
				// } else {
					var station = {};
					station.station_name =item.title; //改
					station.longitude = item.location.lng * 1000000;
					station.latitude = item.location.lat * 1000000;
					station.city_id = that.city_id-0;
					station.city_name = that.city_name;
					let data = {
						type:that.type,
						key:that.index,
						stations:station
					}
					// #ifdef MP-WEIXIN
						prevPage.$vm.setStationsData(data)
					// #endif
					// #ifdef H5
						prevPage.setStationsData(data)
					// #endif
				// };
				uni.navigateBack({})
			},
		
			dingwei () {
				// this.setData({
				// 	_latitude: this._lat,
				// 	_longitude: this._lng
				// })
				this._latitude = this._lat
				this._longitude = this._lng
				this.mapCtx.moveToLocation(this._lat,this._lng)
				// this.searchFun(this._lat,this._lng)
			},
		},
		// onUnload(){
		  
		// },
	}
</script>

<style scoped lang="scss">
	.placeholder{
	  color: gray;
	  font-size: 28rpx;
	}
	.search{
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  width: 100%;
	  height: 7%;
	  background: #fff;
	}
	.search-input{
	  width: 91%;
	  border-radius: 5px;
	  padding-left: 20rpx;
	  font-size: 28rpx;
	  color: #999999;
	  line-height: 60rpx;
	  height: 60rpx;
	  background: #f5f5f5;
	}
	.search-list{
	  width: 94%;
	  padding: 0 3%;
	  height: 93%;
	  background: #fff;
	  z-index: 100;
	}
	.search-list view{
	  width: 100%;
	  min-height: 80rpx;
	  line-height: 80rpx;
	  font-size: 28rpx;
	  color: #272727;
	  border-bottom: 1rpx solid #dbdbdb;
	}
	.box{
	  width: 96%;
	  height: 50%;
	  padding: 10rpx 2%;
	  background: #fff;
	}
	.touzhen{
	  position: absolute;
	  bottom: 50%;
	  left: 48%;
	  width: 30rpx;
	  height: 60rpx;
	}
	.dingwei{
	  position: absolute;
	  bottom: 2%;
	  right: 2%;
	  width: 70rpx;
	  height: 70rpx;
	}
	.content{
	  position: relative;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 20rpx 10rpx;
	  border-bottom: 1rpx solid #f0f0f0;
	}
	.content:last-child {
	  border: none;
	}
	.detail{
	  width: 80%;
	}
	.detail scroll-view{
	  display: block;
	  width: 100%;
	  line-height: 38rpx;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	.detail scroll-view:nth-child(1) {
	  font-size: 30rpx;
	  color: #272727;
	}
	.detail scroll-view:nth-child(2) {
	  font-size: 26rpx;
	  color: #ccc;
	}
	.content .sel{
	  width: 43rpx;
	  height: 28rpx;
	}

</style>
