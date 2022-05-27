<template>
	<view class="multiCharter-box">
		<uni-nav-bar backgroundColor="fff" statusBar fixed title="多日包车" color="#272727">
			<view @click="goBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</view>
		</uni-nav-bar>
		<view class="multiCharter-container">
			<view class="from-data">
				<view class="showTime flex-between">
					<view class="startTime">
						<view class="time-label">开始时间</view>
						<view class="time-value" :class="selectOne">{{ showMd(orderInfo.departureStartTime) }}</view>
					</view>
					<view class="andTime">共{{ totalDay }}日</view>
					<view class="endTime">
						<view class="time-label">结束时间</view>
						<view class="time-value " :class="selectTwo">{{ showMd(orderInfo.departureEndTime) }}</view>
					</view>
				</view>
				<view class="from-item flex-between">
					<view class="from-label">成人</view>
					<view class="from-value"><u-number-box v-model="from.passengerNumber" class="numberBox" min="1" max="50"></u-number-box></view>
				</view>
				<view class="from-item flex-between">
					<view class="from-label">儿童</view>
					<view class="from-value"><u-number-box v-model="from.childNumber" class="numberBox" min="0" max="50"></u-number-box></view>
				</view>
				<view class="from-item flex-between">
					<view class="from-label">行李</view>
					<view class="from-value"><u-number-box v-model="from.baggageNumber" class="numberBox" min="0" max="50"></u-number-box></view>
				</view>
			</view>
			<view class="user-data">
				<view class="user-title">联系人信息</view>
				<view class="user-item flex-start">
					<view class="user-label">真实姓名</view>
					<view class="user-value"><input type="text" v-model="from.contactName" placeholder="请输入姓名" placeholder-style="color:#AAAAAA" maxlength="20" /></view>
				</view>
				<view class="user-item flex-start">
					<view class="user-label">手机号码</view>
					<view class="user-value flex-start">
						<view class="AreaCode">+86</view>
						<input type="text" v-model="from.contactMobile" placeholder="请输入手机号" placeholder-style="color:#AAAAAA" maxlength="20" />
					</view>
				</view>
				<view class="user-item flex-start">
					<view class="user-label">微信号</view>
					<view class="user-value flex-start">
						<input type="text" v-model="from.weixin" placeholder="请输入微信号" placeholder-style="color:#AAAAAA" maxlength="30" />
						<view class="identicalPhone" @click="copyPhone">手机同号</view>
					</view>
				</view>
			</view>

			<view class="flex-start agreement" @click="selectNum = !selectNum">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select.png" style="width: 36rpx;height: 36rpx;" v-if="!selectNum"></image>
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select-active.png" style="width: 36rpx;height: 36rpx;" v-if="selectNum"></image>
				<view class="agreement-text flex-start" style="color: #999999;">
					我已阅读并同意
					<view class="" style="color: #666666;" @click.stop="toPages('/subPages/user/other?url=wetour/serviceAgreement.html')">《服务协议》</view>
					<view class="" style="color: #666666;" @click.stop="toPages('/subPages/user/other?url=wetour/privacyPolicy.html')">《隐私协议》</view>
				</view>
			</view>
			<view class="footerView"><view class="form-btn" @click="submitBtn">免费定制</view></view>
		</view>
		<tipView :dialogVisible.sync="tipVisible" v-if="tipVisible" @confirm="confirm" :dialogData="dialogData" />
	</view>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { parseTime, throttle } from '@/utils/common';
import { phoneYz } from '@/utils/regular.js';
import tipView from '@/components/tipView.vue';
import { charteredInquiry } from '@/api/order.js';
export default {
	data() {
		return {
			dateArr: [],
			city: '',
			value: 0,
			from: {
				passengerNumber: 1,
				childNumber: 0,
				baggageNumber: 0,
				contactName: '',
				contactMobile: '',
				weixin: ''
			},
			tipVisible: false,
			dialogData: {
				type: 'success',
				content: '专属客服将在最晚12小时内向您致电请保证电话畅通',
				title: '提交成功',
				confirmButtonText: '确定'
			},
			selectNum:false,
		}
	},
	components: {
		tipView
	},
	computed: {
		...mapGetters(['orderInfo', 'orderUser']),
		totalDay() {
			let num = 0;

			let one = this.orderInfo.departureEndTime;
			let two = this.orderInfo.departureStartTime;
			// let two = moment(this.dateArr[0],'YYYY/M/DD').valueOf()
			num = Math.floor((one - two) / 86400000) + 1;
			return num;
		}
	},
	onLoad(options) {
		// options = {
		// 	city: "巴中",
		// 	dateArr: '["2022/4/05","2022/4/15"]'
		// }
		// if(options.dateArr) this.dateArr = JSON.parse(options.dateArr)
		// if(options.city) this.city = options.city

		console.log(this.orderUser);
		if (this.orderUser.contactName) {
			this.from.contactName = this.orderUser.contactName;
			this.from.contactMobile = this.orderUser.contactMobile;
			this.from.weixin = this.orderUser.weixin;
		}
	},
	onShow() {
		// if(phoneYz('en-US','17204238300')){
		// 	console.log('美国通过')
		// }
		// if(phoneYz('en-US','12043742056')){
		// 	console.log('加拿大通过')
		// }
		// if(phoneYz('ja-JP','81332131111')){
		// 	console.log('日本通过')
		// }
		// if(phoneYz('zh-CN','17606515466')){
		// 	console.log('中国通过')
		// }
		// if(phoneYz('en-GB','447717389637')){
		// 	console.log('英国通过')
		// }else{
		// 	console.log('英国没通过')
		// }
	},
	methods: {
		toPages: throttle(function(url) {
			uni.navigateTo({
				url
			});
		}, 1500),
		confirm(donc) {
			donc();
			uni.reLaunch({
				url: '/pages/index/index'
			});
			// console.log(,'----')
		},
		showMd(time) {
			return parseTime(time, '{m}月{d}日');
		},
		copyPhone() {
			if (this.from.contactMobile) this.from.weixin = this.from.contactMobile;
		},
		submitBtn() {
			if (!this.selectNum) {
				return uni.showToast({
					title: '请阅读并同意服务协议和隐私协议',
					duration: 2000,
					icon: 'none'
				});
			}
			if (!this.from.contactName) {
				return uni.showToast({
					title: '请输入姓名',
					duration: 2000,
					icon: 'none'
				});
			}
			if (!this.from.contactMobile) {
				return uni.showToast({
					title: '请输入手机号',
					duration: 2000,
					icon: 'none'
				});
			}
			// console.log(phoneYz,3333333)
			// zh-CN   中国
			// ja-JP   日本
			// en-US   美国/加拿大
			if (!phoneYz('zh-CN', this.from.contactMobile)) {
				return uni.showToast({
					title: '请输入正确的手机号',
					duration: 2000,
					icon: 'none'
				});
			}
			let data = {
				...this.from,
				...this.orderInfo,
				departureStartTime: parseTime(this.orderInfo.departureStartTime),
				departureEndTime: parseTime(this.orderInfo.departureEndTime)
			};
			charteredInquiry(data).then(res => {
				if (res.code == 0) {
					this.$store.dispatch('user/orderUser', { contactName: this.from.contactName, contactMobile: this.from.contactMobile, weixin: this.from.weixin });
					this.tipVisible = true;
				}
			});
		},
		goBack() {
			uni.showModal({
				title: '温馨提示', //提示的标题,
				content: '当前价格较优惠,建议您及早预订哦', //提示的内容,
				showCancel: true, //是否显示取消按钮,
				cancelText: '返回', //取消按钮的文字，默认为取消，最多 4 个字符,
				cancelColor: '#666666', //取消按钮的文字颜色,
				confirmText: '马上预定', //确定按钮的文字，默认为取消，最多 4 个字符,
				confirmColor: '#CBA56A', //确定按钮的文字颜色,
				success: res => {
					if (res.cancel) {
						console.log(1111);
						uni.navigateBack({});
					} else {
						console.log(22222);
					}
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.multiCharter-box {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.multiCharter-container {
	padding: 20rpx 32rpx;

	.from-data {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 32rpx 24rpx 10rpx;

		.from-item {
			padding: 22rpx 0;
			border-bottom: 1rpx solid #eeeeee;

			.from-label {
				@include fs(28rpx, 400, #999999, 40rpx);
			}

			&:last-child {
				border: none;
			}
		}
	}

	.user-data {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 24rpx;
		padding: 32rpx 24rpx 10rpx;

		.user-title {
			@include fs(36rpx, 600, #111111, 50rpx);
			margin-bottom: 9rpx;
		}

		.user-item {
			padding: 12rpx 6rpx;

			.user-label {
				width: 180rpx;
				@include fs(28rpx, 400, #111111, 40rpx);
			}

			.user-value {
				input {
					@include fs(28rpx, 400, #111111, 40rpx);
					flex: 1;
				}
			}

			.AreaCode {
				@include fs(28rpx, 400, #111111, 40rpx);
				margin-right: 28rpx;
			}

			.identicalPhone {
				padding: 8rpx 18rpx;
				border: 1rpx solid #dbdbdb;
				border-radius: 24rpx;
				text-align: center;
				@include fs(24rpx, 400, #999999, 32rpx);
			}

			&:last-child {
				border: none;
			}
		}
	}

	.footerView {
		left: 0;
		right: 0;
		bottom: 0;
		height: 150rpx;
		position: fixed;
		padding-bottom: calc(constant(safe-area-inset-bottom) + 25rpx);
		padding-bottom: calc(env(safe-area-inset-bottom) + 25rpx);

		.form-btn {
			width: 620rpx;
			background: #111111;
			margin: 0rpx 65rpx 84rpx;
			border-radius: 44rpx;
			text-align: center;
			position: absolute;
			@include fs(28rpx, 600, #fff, 88rpx);
		}
	}

	.showTime {
		background-color: #ffffff;
		// padding: 34rpx 16rpx 29rpx;
		padding-bottom: 29rpx;
		border-bottom: 1rpx solid #eeeeee;

		.andTime {
			padding: 4rpx 18rpx;
			border: 1rpx solid #dbdbdb;
			@include fs(24rpx, 400, #555555, 32rpx);
			text-align: center;
			border-radius: 22rpx;
		}

		.endTime {
			text-align: right;
		}

		.time-label {
			@include fs(28rpx, 400, #666666, 40rpx);
			margin-bottom: 12rpx;
		}

		.time-value {
			@include fs(36rpx, 600, #111111, 50rpx);
		}

		.noText {
			color: #999999;
		}
	}
}
.agreement {
	margin: 20rpx 0 26rpx;
	padding-bottom: 120rpx;
	padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	&-text {
		@include fs(28rpx, 400, #999999, 40rpx);
		margin-left: 20rpx;
	}
}
</style>
