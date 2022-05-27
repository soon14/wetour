<template>
	<view class="selectAddress-box">
		<uni-nav-bar backgroundColor="fff" statusBar fixed title="选择地址" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="selectAddress-container">
			<view class="search-city flex-between">
				<view class="select-city flex-between" @click="ChoseDay">
					<view class="overflowEllipsis">{{ city }}</view>
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/downImg.png" style="width: 28rpx;height: 28rpx;"></image>
				</view>
				<view class="search-box flex-start">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/searchImg.png" style="height: 36rpx;width: 36rpx;"></image>
					<u-input
						type="text"
						class="search-input"
						maxlength="30"
						@input="searchFun"
						v-model="search"
						placeholder="请输入地址"
						placeholder-style="color:#999999;"
					/>
				</view>
				<!-- <view
					class="close"
					v-if="show"
					@click="
						show = false;
						search = '';
					"
				>
					取消
				</view> -->
			</view>
			<view class="historicalSearch" v-if="!show">
				<view class="historical-title">历史搜索</view>
				<view class="historical-list flex-start" style="flex-wrap: wrap;">
					<view class="historical-item" v-for="(item, index) in Historical" :key="index" @click="clickAddress(item, 1)">{{ item.label.content }}</view>
				</view>
			</view>
			<view class="address-list" v-if="show">
				<view class="select-item" v-for="(item, index) in list" :key="index" @click="clickAddress(item, 2)">
					<view class="select-item-label">{{ item.label.content }}</view>
					<view class="select-item-address">{{ item.label.address }}</view>
				</view>
				<noDataView v-if="!list.length && search.length > 0" text="啊噢~找不到地址信息哦~" imgType="2"></noDataView>
			</view>
		</view>
		<select-city-modal v-if="dialogVisible" :dialogVisible.sync="dialogVisible" @confirm="confirm"></select-city-modal>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import selectCityModal from '../components/selectCityModal.vue';
import noDataView from '@/components/noDataView.vue';
import { getSelectCity, commonMap, commonGmap, gmapPlace } from '@/api/order.js';
import { parseTime, throttle } from '@/utils/common';

import amapFile from '@/libs/amap-wx.js';
var myAmapFun = new amapFile.AMapWX({ key: 'cee8960a500b38563efb7e69e4459ef2' });
export default {
	data() {
		return {
			city: '杭州',
			code: null,
			timeZone: 8,
			telephoneCode: '86',
			search: '',
			list: [],
			type: '',
			dialogVisible: false,
			lat: 0,
			lng: 0,
			countryCode: 'CN'
		};
	},
	components: {
		selectCityModal,
		noDataView
	},
	onLoad(options) {
		if (options.city) this.city = options.city;
		if (options.code) this.code = options.code;
		if (options.type) this.type = options.type;
		if (options.timeZone) this.timeZone = options.timeZone;
		console.log(options, 'options[======]');
		this.getSelectCity();
	},
	onShow() {
		console.log(this.Historical);
	},
	computed: {
		show() {
			return this.search=='' ? false : true;
		},
		...mapGetters(['Historical'])
	},
	methods: {
		ChoseDaySelect(data) {
			this.timeZone = data.timeZone;
			this.code = data.id;
			this.city = data.city;
			this.telephoneCode = data.telephoneCode;
			this.lng = data.lng;
			this.lat = data.lat;
			this.countryCode = data.countryCode;

			// this.cityData = data
			// this.city = data.city
		},
		ChoseDay: throttle(function() {
			uni.navigateTo({
				url: '/subPages/selectCity/selectCity'
			});
		}, 1500),
		getSelectCity() {
			getSelectCity()
				.then(res => {
					res.data.forEach(element => {
						if (element.city == this.city) {
							this.city = element.city;
							this.code = element.id;
							this.timeZone = element.timeZone;
							this.telephoneCode = element.telephoneCode;
							this.lng = element.lng;
							this.lat = element.lat;
							this.countryCode = element.countryCode;
						}
					});

					console.log(this.city, 'this.city');
					console.log(this.code, 'this.code');
					console.log(this.timeZone, 'this.timeZone');
					console.log(this.telephoneCode, 'this.telephoneCode');

					if (!this.code) {
						this.city = res.data[0].city;
						this.code = res.data[0].id;
						this.timeZone = res.data[0].timeZone;
						this.telephoneCode = res.data[0].telephoneCode;
						this.lng = res.data[0].lng;
						this.lat = res.data[0].lat;
						this.countryCode = res.data[0].countryCode;
					}
					console.log(this.city, 'this.city');
					console.log(this.code, 'this.code');
					console.log(this.timeZone, 'this.timeZone');
					console.log(this.telephoneCode, 'this.telephoneCode');
				})
				.catch(e => {
					setTimeout(() => {
						this.getSelectCity();
					}, 1500);
				});
		},
		searchFun() {
			if (!this.search) {
				this.list = [];
				return false;
			}
			var that = this;
			let data = {
				query: that.search,
				region: that.city,
				city_limit: 'true',
				output: 'json'
			};
			console.log(this.telephoneCode);
			if (this.telephoneCode == '86' || this.telephoneCode == '+86') {
				var list = [];
				myAmapFun.getInputtips({
					keywords: that.search,
					city: that.city,
					citylimit: true,
					type: '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19',
					success(data) {
						if (data) {
							var data = data.tips;
							console.log(data, 'data---------------------------');
							for (var i in data) {
								var item = {};
								item.label = {};
								item.label.content = data[i].name;
								item.label.address = data[i].district + data[i].address;
								var location = data[i].location + '';
								location = location.split(',');
								item.latitude = data[i].location ? location[1] : undefined;
								item.longitude = data[i].location ? location[0] : undefined;
								// item.latitude = data[i].location.lat;
								// item.longitude = data[i].location.lng;
								item.telephoneCode = that.telephoneCode;
								list.push(item);

								// item.label = {}
								// item.label.content = data[i].name;
								// item.label.address = data[i].district+data[i].address;

								// // if (parseInt(data[i].adcode / 100) * 100 == citycode) {
								// list.push(item)
								// }
							}
							that.list = list;
						}
					},
					fail(res) {
						console.log(res);
					}
				});
			} else {
				let data = {
					keyword: that.search
				};
				if (this.lng && this.lat && this.lng != 0 && this.lat != 0) {
					data.lng = this.lng;
					data.lat = this.lat;
				} else {
					data.countryCode = this.countryCode;
				}
				gmapPlace(data).then(res => {
					if (res.code == 0) {
						console.log(res, 333333);
						var data = res.data;
						var list = [];
						for (var i in data) {
							var item = {};
							item.label = {};
							item.label.content = data[i].name;
							item.label.address = data[i].formattedAddress;

							item.latitude = data[i].geometry.location.lat;
							item.longitude = data[i].geometry.location.lng;
							item.telephoneCode = that.telephoneCode;
							list.push(item);
						}
						that.list = list;
					}
				});
				// commonGmap(that.search).then(res=>{
				// 	if(res.code == 0){
				// 		console.log(res,333333)
				// 		var data = res.data
				// 		var list = [];
				// 		  for (var i in data) {
				// 				var item = {};
				// 				item.label = {}
				// 				item.label.content = data[i].name;
				// 				item.label.address = data[i].formattedAddress;

				// 				item.latitude = data[i].geometry.location.lat;
				// 				item.longitude = data[i].geometry.location.lng;
				// 				item.telephoneCode = that.telephoneCode
				// 				list.push(item)
				// 		  };
				// 		  that.list = list
				// 	}
				// })
			}

			// myAmapFun.getInputtips({
			// 	keywords: that.search,
			// 	city:  that.city,
			// 	citylimit:true,
			// 	// location:that.longitude+','+that.latitude,
			// 	success (data) {
			// 		console.log(22222,data)
			// 		if (data) {
			// 			var data = data.tips;
			// 			console.log(data,'data---------------------------');
			// 			for (var i in data) {
			// 				var item = {};
			// 				item.label = {}
			// 				item.label.content = data[i].name;
			// 				item.label.address = data[i].district+data[i].address;
			// 				var location = data[i].location + '';
			// 				location = location.split(',');
			// 				item.latitude = location[1];
			// 				item.longitude = location[0];
			// 				list.push(item)
			// 				that.list = list
			// 			};
			// 		}
			// 	},
			// 	fail(res) {
			// 		console.log(11111111)
			// 	}
			// })
		},
		clickAddress(item, type) {
			console.log(item, 33333);
			if (!item.latitude) {
				return uni.showToast({
					title: '当前地址无效，请重新选择正确的地址',
					duration: 2000,
					icon: 'none'
				});
			}
			let data = {
				...item
				// telephoneCode : this.telephoneCode
			};
			if (type == 2) {
				data.city = this.city;
				data.code = this.code;
				data.timeZone = this.timeZone;
				// data.telephoneCode =  this.telephoneCode
			}
			this.$store.dispatch('user/setHistorical', data).then(() => {
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2];
				// #ifdef MP-WEIXIN
				prevPage.$vm.ChoseAddressSelect({ ...data, type: this.type });
				// #endif
				// #ifdef H5
				prevPage.ChoseAddressSelect({ ...data, type: this.type });
				// #endif
				uni.navigateBack({});
			});
		},
		confirm(data) {
			console.log(data);
			this.timeZone = data.value.split('_')[1];
			this.code = data.value.split('_')[0];
			this.city = data.label;
			this.telephoneCode = data.value.split('_')[2];
		}
	}
};
</script>

<style scoped lang="scss">
.selectAddress-box {
	display: flex;
	flex-direction: column;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.selectAddress-container {
	display: flex;
	flex-direction: column;

	background-color: #fff;
	
	.search-city {
		margin: 0 32rpx;
		background-color: #fff;
		padding: 44rpx 0rpx 46rpx 0rpx;
		.select-city {
			padding: 0rpx 26rpx 0 76rpx;
			background: #f5f5f5;
			border-radius: 45rpx 0rpx 0rpx 45rpx;
			@include fs(30rpx, 400, #111111, 88rpx);
			margin-right: 7rpx;
			width: 226rpx;
			.overflowEllipsis {
				max-width: 130rpx;
			}
		}
		.search-box {
			flex: 1;
			padding: 0 20rpx;
			background: #f5f5f5;
			border-radius: 0rpx 45rpx 45rpx 0rpx;
			height: 88rpx;

			.search-input {
				margin-left: 10rpx;
				flex: 1;
				text-align: center;
				@include fs(30rpx, 400, #999999, 42rpx);
			}
		}
		.close {
			@include fs(28rpx, 400, #555555, 28rpx);
			margin-left: 28rpx;
		}
	}
	.historicalSearch {
		padding: 0 32rpx;
		border-bottom: 1rpx solid #dfdfdf;
		.historical-title {
			@include fs(28rpx, 400, #272727, 40rpx);
			margin-bottom: 16rpx;
		}
		.historical-list {
			padding-bottom: 16rpx;
			.historical-item {
				padding: 10rpx 32rpx;
				margin-right: 20rpx;
				margin-bottom: 12rpx;
				background: #f2f2f2;
				opacity: 1;
				border-radius: 32rpx;
				@include fs(24rpx, 400, #666666, 34rpx);
			}
		}
	}

	.address-list {
		flex: 1;
		background-color: #f8f8f8;
	}
}

.select-item {
	background-color: #fff;
	padding: 24rpx 32rpx;
	border-bottom: 1rpx solid #DFDFDF;
	.addressImg {
		width: 22rpx;
		height: 28rpx;
		margin-right: 20rpx;
	}
	&-label {
		@include fs(32rpx, 400, #272727, 32rpx);
		margin-bottom: 20rpx;
	}
	&-address {
		@include fs(28rpx, 400, #999999, 28rpx);
	}
}
</style>
