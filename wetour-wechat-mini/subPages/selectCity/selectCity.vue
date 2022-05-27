<template>
	<view class="selectCity-box">
		<uni-nav-bar backgroundColor="fff" statusBar fixed title="城市" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="selectCity-container">
			<view class="search-city flex-between">
				<view class="search-box flex-start">
					<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/searchImg.png" style="height: 36rpx;width: 36rpx;"></image>
					<u-input
						type="text"
						input-align="center"
						class="search-input"
						v-model="search"
						placeholder="请输入城市搜索"
						maxlength="20"
						placeholder-style="color:#999999;"
					/>
				</view>
			
			</view>
			<template v-if="!show">
				
				<view class="city-list">
					<view class="city-item" v-for="(item, index) in newList" :key="index" @click="setCity(item)">{{ item.city }}</view>
					<noDataView v-if="!newList.length" text="该城市未开通业务" imgType="2"></noDataView>
				</view>
			</template>
			<template v-else>
				<view class="city-list">
					<view class="city-item" v-for="(item, index) in newList" :key="index" @click="setCity(item)">{{ item.city }}</view>
				</view>
				<noDataView v-if="!newList.length" text="该城市未开通业务" imgType="2"></noDataView>
			</template>
		</view>
	</view>
</template>

<script>
import pyjs from 'js-pinyin';
import noDataView from '@/components/noDataView.vue';
import { getSelectCity } from '@/api/order.js';
export default {
	data() {
		return {
			search: '',
			mockList: [
				// {name:'杭州',code:'20',},
				// {name:'安康',code:'1',},
				// {name:'鞍山',code:'2',},
				// {name:'巴中',code:'3',},
				// {name:'安庆',code:'4',},
				// {name:'包头',code:'5',},
				// {name:'长春',code:'6',},
				// {name:'毕节',code:'7',},
				// {name:'北京',code:'8',},
				// {name:'阿勒泰',code:'7',},
			],
			list: []
		};
	},
	components: {
		noDataView
	},
	computed: {
		show() {
			return this.search=='' ? false : true;
		},
		newList() {
			let arr = this.list;
			let newList = [];
			let search = this.search.toUpperCase();
			if (!this.search) {
				return arr;
			} else {
				arr.forEach(element => {
					if (element.city.indexOf(search) != -1 || element.py.indexOf(search) != -1) newList.push(element);
				});
				console.log(newList);
				return newList;
			}
		}
	},
	onShow() {},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		});
		this.getSelectCity();
	},
	methods: {
		setCity(item) {
			var pages = getCurrentPages();
			var prevPage = pages[pages.length - 2];
			// #ifdef MP-WEIXIN
			prevPage.$vm.ChoseDaySelect(item);
			// #endif
			// #ifdef H5
			prevPage.ChoseDaySelect(item);
			// #endif
			uni.navigateBack({});
		},
		getSelectCity() {
			getSelectCity()
				.then(res => {
					console.log(res, 'data44444');
					this.mockList = res.data;
					let arr = [];
					this.mockList.forEach(element => {
						arr.push({
							...element,
							py: pyjs.getFullChars(element.city).toUpperCase()
						});
					});
					arr.sort(function(a, b) {
						return a.py.localeCompare(b.py);
					});
					console.log(arr, '3333');
					this.list = arr;

					uni.hideLoading();
				})
				.catch(e => {
					console.log(666666);
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss">
.selectCity-box {
	background-color: #fff;
	min-height: 100vh;
}
.selectCity-container {
	padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
}
.search-city {
	margin: 40rpx 32rpx;
	.search-box {
		flex: 1;
		height: 88rpx;
		padding: 0rpx 32rpx;
		background-color: #f5f5f5;
		border-radius: 44rpx;

		.search-input {
			text-align: center;
			margin-left: 21rpx;
			flex: 1;
			@include fs(30rpx, 400, #000000, 35rpx);
		}
	}
	.close {
		@include fs(28rpx, 400, #555555, 28rpx);
		margin-left: 28rpx;
	}
}
.current-box {
	margin-bottom: 29rpx;
	.current-label {
		@include fs(28rpx, 400, #999999, 28rpx);
		margin-bottom: 16rpx;
	}
	.current-value {
		display: inline-block;
		min-width: 206rpx;
		padding: 12rpx 30rpx;
		text-align: center;
		background: #ffffff;
		border: 1rpx solid #dbdbdb;
		border-radius: 32rpx;
		margin-right: 30rpx;
		@include fs(28rpx, 400, #272727, 40rpx);
	}
}
.city-list {
	.city-item {
		padding: 26rpx 32rpx;
		border-bottom: 1rpx solid #dfdfdf;
		@include fs(28rpx, 400, #111111, 33rpx);
	}
}
</style>
