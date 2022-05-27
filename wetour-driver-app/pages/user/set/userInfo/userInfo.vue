<template>
	<view class="register">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="基础信息" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
			<view slot="right" @click="tochange" style="color: #272727;font-size: 28rpx;vertical-align: text-bottom;">
				修改
			</view>
		</uni-nav-bar>
		<view class="list_li">
			<view class="li_left">伙伴名称：{{ userInfo.partnerName }}</view>
		</view>
		<view class="list_li">
			<view class="li_left">登录账号：{{ userInfo.mobile }}</view>
		</view>
		<view class="list_li">
			<view class="li_left">服务国家：{{ userInfo.country }}</view>
		</view>
		<view class="list_li" style="padding-top: 36rpx;">
			<view class="li_left">服务城市：</view>
			<!-- <button :plain='true' class="button_code" @click="toAddCity">添加</button> -->
		</view>
		<view class="content">
			<view class="li_choose" v-for="(value, index) in city" :key="index">
				<!-- <view class="li_cha"></view> -->
				<text class="li_text">{{ value.city }}</text>
			</view>
		</view>

	</view>
</template>

<script>
import {
	mapGetters
} from 'vuex'
import {
	getDetail,
	getCity
} from '@/api/login.js'
export default {
	data() {
		return {
			name: '',
			city: [],
			tipVisible: false,
			country: '',
			detail: {}
		};
	},
	onShow(option) {
		this.getCity(this.userInfo.country)
	},
	computed: {
		...mapGetters([
			'userInfo',
		]),
	},
	methods: {
		toAddCity() {
			console.log('toaddcity')
			const that = this
			uni.navigateTo({
				url: `/pages/addCity/addCity?country=${this.country}`,
				events: {
					// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
					acceptDataFromOpenedPage: function (data) {
						//选择城市后传回来的数据
						console.log(data, 'acceptDataFromOpenedPage', 'register')
						that.city = data.data
					}
					// someEvent: function(data) {
					//   console.log(data,'someEvent')
					// }
				},
				success: function (res) {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit('acceptDataFromOpenerPage', {
						data: that.city
					})
				}
			})
		},
		getCity(country) {
			this.city = []
			getCity({ country: country }).then(res => {
				console.log(res, this.userInfo.cityIds, 'getDetail')
				if (res.code === 0) {
					res.data.records.forEach(val => {
						this.userInfo.cityIds.split(',').forEach(val2 => {
							if (val.id == val2) {
								this.city.push(val)
							}
						})
					})
				}
			})
		},
		tochange() {
			uni.navigateTo({
				url: "/pages/register/register?country=" + this.userInfo.country + "&&change=true"
			})
		}
	}
}
</script>

<style scoped lang="scss">
.register {
	width: 100vw;
	// padding: 0 16rpx;
	height: 100vh;
	// background: #FFFFFF;
}

.list_li {
	width: 100%;
	padding: 23rpx 16rpx;
	display: flex;
	align-items: center;
	// margin-bottom: 10rpx;
	background: #ffffff;
}

.li_left {
	font-family: PingFang SC;
	@include fs(32rpx, 400, #272727, 32rpx);
}

.input_name {
	width: 520rpx;
	height: 90rpx;
	padding: 0 20rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	@include fs(32rpx, 400, #272727, 32rpx);
}

.input_name_te {
	@include fs(32rpx, 400, #999, 32rpx);
}

.button_code {
	margin-left: 5rpx;
	width: 148rpx;
	height: 64rpx;
	background: #ffffff;
	border: 1px solid #ff8800;
	opacity: 1;
	border-radius: 12rpx;
	@include fs(28rpx, 400, #ff8800, 62rpx);
}

.content {
	display: flex;
	flex-wrap: wrap;
	background-color: #ffffff;
	padding: 30rpx 16rpx;

	.li_choose {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #dbdbdb;
	}

	// .li_choose:last-child {
	// 	width: 100%;
	// }

	.li_cha {
		width: 32rpx;
		height: 32rpx;
		margin-right: 16rpx;
	}

	.li_text {
		@include fs(28rpx, 400, #272727, 28rpx);
	}
}

.bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 140rpx;
	background-color: #ffffff;
	box-shadow: 0px -2px 10px rgba(184, 172, 128, 0.3);

	.bottom_button {
		width: 650rpx;
		height: 90rpx;
		background: #ffcc00;
		border-radius: 12rpx;
		margin: 36rpx 0 0 50rpx;
		@include fs(32rpx, 400, #272727, 90rpx);
		border: 1px solid #ffffff;
	}

	.bottom_button_false {
		background-color: #eeeeee;
		color: #999999;
	}
}

.rules {
	width: 100%;
	height: 224rpx;
	padding: 24rpx 16rpx;
	background: #ffffff;
	margin-top: 16rpx;
	@include fs(28rpx, 400, #555555, 42rpx);
}

.bottom2 {
	width: 100%;
	height: 140rpx;
}
button:after {
	border: none;
}
</style>
