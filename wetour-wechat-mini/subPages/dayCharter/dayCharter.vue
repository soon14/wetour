<template>
	<view class="dayCharter-box">
		<uni-nav-bar backgroundColor="fff" statusBar fixed title="单日包车" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="dayCharter-container">
			<map
				id="map"
				style="width: 100vw;"
				class="maps"
				:style="{ height: `calc(100vh - ${statusBarHeight} - 500rpx)` }"
				:latitude="latitude"
				:longitude="longitude"
				:polygons="polygons"
				:scale="scale"
				:max-scale="18"
				:min-scale="3"
				:enable-scroll="false"
			></map>
			<!-- -->
			<view class="footer-form">
				<view class="footer-item" @click="setSelectNum(1)">
					<view class="footer-select flex-between">
						<view class="">
							<view class="footer-title">{{ city }}市内包车</view>
							<view class="footer-date">{{ cityLocation.cityDistance }}公里/{{ cityLocation.cityRuntime }}小时</view>
						</view>
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select.png" style="width: 44rpx;height: 44rpx;" v-if="selectNum != 1"></image>
						<image
							src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select-active.png"
							style="width: 44rpx;height: 44rpx;"
							v-if="selectNum == 1"
						></image>
					</view>
					<template v-if="selectNum == 1">
						<view class="footer-form-view flex-between" @click="showTime">
							<view class="flex-start" style="flex: 1;">
								<view class="footer-form-label">用车时间：</view>
								<view class="footer-form-value"><input type="text" :value="timeName" disabled placeholder="请输入上车时间" /></view>
							</view>
							<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" style="width: 13rpx;height: 23rpx;"></image>
						</view>
						<view class="footer-form-view flex-between" style="padding-bottom: 20rpx;" @click="selectAddress">
							<view class="flex-start" style="flex: 1;">
								<view class="footer-form-label">上车地址：</view>
								<view class="footer-form-value">
									<input type="text" :value="address" disabled placeholder="请输入上车地址" placeholder-style="color:#999999;" />
								</view>
							</view>
							<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" style="width: 13rpx;height: 23rpx;"></image>
						</view>
					</template>
				</view>

				<view class="footer-item" @click="setSelectNum(2)">
					<view class="footer-select flex-between">
						<view class="">
							<view class="footer-title">{{ city }}周边往返包车</view>
							<view class="footer-date">{{ cityLocation.outsideDistance }}公里/{{ cityLocation.outsideRuntime }}小时</view>
						</view>
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select.png" style="width: 44rpx;height: 44rpx;" v-if="selectNum != 2"></image>
						<image
							src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select-active.png"
							style="width: 44rpx;height: 44rpx;"
							v-if="selectNum == 2"
						></image>
					</view>
					<template v-if="selectNum == 2">
						<view class="footer-form-view flex-between" @click="showTime">
							<view class="flex-start">
								<view class="footer-form-label">用车时间：</view>
								<view class="footer-form-value"><input type="text" :value="timeName" disabled placeholder="请输入上车时间" /></view>
							</view>
							<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" style="width: 13rpx;height: 23rpx;"></image>
						</view>
						<view class="footer-form-view flex-between" style="padding-bottom: 20rpx;" @click="selectAddress">
							<view class="flex-start">
								<view class="footer-form-label">上车地址：</view>
								<view class="footer-form-value">
									<input type="text" :value="address" disabled placeholder="请输入上车地址" placeholder-style="color:#999999;" />
								</view>
							</view>
							<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" style="width: 13rpx;height: 23rpx;"></image>
						</view>
					</template>
				</view>

				<view class="footer-btn" @click="submit">下一步</view>
			</view>
			<!-- :defaultValue="defaultValue" -->
			<select-time v-if="dialogVisible" :dialogVisible.sync="dialogVisible" :defaultValue="defaultValue" @confirm="confirm" :timeZone="orderInfo.timeZone"></select-time>
		</view>
	</view>
</template>

<script>
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
import { parseTime, throttle } from '@/utils/common';
import moment from 'moment';
import selectTime from '@/components/selectTime.vue';
import { mapGetters } from 'vuex';
import { getCityDayPriceById } from '@/api/order.js';
export default {
	data() {
		return {
			statusBarHeight: statusBarHeight,
			city: '',
			time: '',
			timeName: '',
			longitude: '',
			latitude: '',
			scale: 10, //缩放级别
			polygons: [],
			includePoints: [],
			selectNum: 1,
			dialogVisible: false,
			defaultValue: [0, 0, 0],
			address: '',
			addressData: {},
			orderData: {},
			cityLocation: {}
		};
	},
	components: {
		selectTime
	},
	computed: {
		...mapGetters(['orderInfo'])
	},
	onLoad(options) {
		this.mapCtx = uni.createMapContext('map', this);

		this.orderData = this.orderInfo;
		this.timeName = parseTime(this.orderInfo.departureStartTime, '{m}月{d}日 {a} {h}:{i}');
		this.city = this.orderInfo.departureCity;

		// this.longitude = '-74.0445'
		// this.latitude = '40.689225'
		this.getCityDayPriceById(this.orderInfo.departureCityCode);
		// 40.689225, lng: -74.0445

		// this.latitude = '35.658777'
		// this.longitude = '139.198964'
		// this.scale = 6
		// setTimeout(()=>{
		// 	this.searchFun()
		// },1500)
	},
	methods: {
		// confirm(e){
		// 	this.time = e[0].value
		// },
		showTime() {
			console.log(66666666);
			this.dialogVisible = true;
		},
		confirm(data) {
			console.log(data, 33333);
			this.time = Number(data.time);
			this.timeName = parseTime(this.time, '{m}月{d}日 {a} {h}:{i}');
			// this.from.time.label = parseTime(data.time,'{m}月{d}日 {a} {h}:{i}')
			// this.from.time.value = data.time
			this.defaultValue = data.default;
			this.orderData.departureStartTime = data.time;
		},
		selectAddress: throttle(function() {
			uni.navigateTo({
				url: `/subPages/selectAddress/selectAddress?city=${this.city}&timeZone=${this.orderInfo.timeZone}&code=${this.orderInfo.departureCityCode}`
			});
		}, 1500),
		ChoseAddressSelect(item) {
			this.addressData = item;
			this.address = item.label.content;
			if (this.orderData.timeZone != item.timeZone) {
				this.timeName = '';
				this.time = '';
				this.defaultValue = [0, 0, 0];
				this.orderData.departureStartTime = '';
			}
			// this.orderData.departureStartTime = 1
			this.city = item.city;
			this.orderData.departureAddress = item.label.content;
			this.orderData.departure = item.label.address;
			this.orderData.departureCity = item.city;
			this.orderData.departureCityCode = item.code;
			this.orderData.timeZone = item.timeZone;
			this.orderData.departureLongitude = item.longitude;
			this.orderData.departureLatitude = item.latitude;
			this.orderData.isForeign = this.addressData.telephoneCode == '86' || this.addressData.telephoneCode == '+86' ? '0' : '1';
			this.getCityDayPriceById(item.code);
		},

		submit: throttle(function() {
			if (!this.address) {
				return uni.showToast({
					title: '请先选择上车地址',
					duration: 2000,
					icon: 'none'
				});
			}
			if (!this.timeName) {
				return uni.showToast({
					title: '请先选择用车时间',
					duration: 2000,
					icon: 'none'
				});
			}
			let data = {
				...this.orderData,
				charteredCarType: 1, //包车类型 1日租 2接机 3 送机 4单车
				charteredCarRange: this.selectNum //1市内包车 2周边包车
			};
			console.log(data);
			this.$store.dispatch('user/setOrderInfo', data);
			uni.navigateTo({
				url: `/subPages/selectBus/selectBus`
			});
		}, 1500),
		getCityDayPriceById(code) {
			getCityDayPriceById(code).then(res => {
				this.cityLocation = res.data;
				console.log(this.cityLocation.cityCenterLocation.split(','), 33333);
				this.longitude = this.cityLocation.cityCenterLocation.split(',')[0];
				this.latitude = this.cityLocation.cityCenterLocation.split(',')[1];

				let polygons = [];
				let arr = JSON.parse(this.cityLocation.cityLocation);

				let points = [];
				//this.includePoints = [];
				// {"latitude":"39.973877","longitude":"116.287406"}
				arr.forEach(element => {
					points.push({
						latitude: element[1] + '',
						longitude: element[0] + ''
					});
				});

				this.mapCtx.includePoints({
					padding: [60], // padding类似我们css中的padding，可以有四个值
					points: points
				});

				polygons.push({
					strokeWidth: 3,
					strokeColor: '#FF8800',
					fillColor: '#FF880019',
					points: points
				});
				this.polygons = polygons;
				//this.includePoints = points;
			});
		},
		setSelectNum(num) {
			if (this.selectNum != num) {
				this.selectNum = num;
				let arr = [];
				if (num == 1) {
					this.longitude = this.cityLocation.cityCenterLocation.split(',')[0];
					this.latitude = this.cityLocation.cityCenterLocation.split(',')[1];
					arr = JSON.parse(this.cityLocation.cityLocation);
				} else {
					this.longitude = this.cityLocation.outsideCenterLocation.split(',')[0];
					this.latitude = this.cityLocation.outsideCenterLocation.split(',')[1];
					arr = JSON.parse(this.cityLocation.outsideLocation);
				}
				let polygons = [];

				let points = [];
				// {"latitude":"39.973877","longitude":"116.287406"}
				arr.forEach(element => {
					points.push({
						latitude: element[1] + '',
						longitude: element[0] + ''
					});
				});
				polygons.push({
					strokeWidth: 3,
					strokeColor: '#FF8800',
					fillColor: '#FF880019',
					points: points
				});
				this.polygons = polygons;
			}
		}
	}
};
</script>

<style lang="scss">
.footer-form {
	// width: 750px;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	// height: 534px;
	background: #ffffff;
	// border-radius: 20rpx 20rpx 0px 0px;
	padding: 39rpx 32rpx 16rpx;
	padding-bottom: calc(28rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(28rpx + env(safe-area-inset-bottom));

	.footer-item {
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		background-color: #f5f5f5;
		padding: 0 32rpx 0;
		.footer-select {
			border-bottom: 1rpx solid #dfdfdf;
			padding: 28rpx 0;
			&:last-child {
				border: none;
			}
		}
		.footer-form-view {
			margin-top: 20rpx;
			&:last-child {
				border: none;
			}
			.footer-form-label {
				@include fs(32rpx, 400, #555555, 45rpx);
			}
			.footer-form-value {
				flex: 1;
				input {
					@include fs(32rpx, 400, #272727, 45rpx);
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
		.footer-title {
			@include fs(36rpx, 600, #111111, 50rpx);
			margin-bottom: 8rpx;
		}
		.footer-date {
			@include fs(28rpx, 400, #666666, 40rpx);
		}
	}
	.footer-btn {
		width: 650rpx;
		// height: 90px;
		background: #111111;
		border-radius: 44rpx;
		margin: 65rpx auto 0;
		@include fs(28rpx, 500, #ffffff, 88rpx);
		text-align: center;
	}
}
.flex-start {
	flex: 1;
}
</style>
