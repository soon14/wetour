<template>
	<view class="login">
		<view class="title">您好，欢迎登录！</view>
		<view class="title2">
			注册须知
			<br />
			1.必须使用国家对应的手机号注册
			<br />
			2.国家选中后，只能在国家内服务
			<br />
			3.国家选中后，无法更改
			<br />
			4.需要服务多个国家时，请使用对应的手机号注册
		</view>
		<view class="title_phone">登录账号</view>
		<view class="phone" :class="focusinputs === 'phone' ? 'bottominput' : ''">
			<image src="@/static/login/user.png" class="img_user"></image>
			<picker class="click_country" @change="bindPickerChange" :value="index" :range="array" range-key="country">
				<text class="text_country">{{ array[index].country }}</text>
				<image src="@/static/login/bottom.png" class="img_bottom"></image>
				</view>
			</picker>
			<!-- <view class="click_country">
				<text class="text_country">中国</text>
				<image src="@/static/login/bottom.png" class="img_bottom"></image>
			</view> -->
			<text class="text_spec">|</text>
			<input v-model="phone" class="input_phone" placeholder="请输入手机号" maxlength="20" @focus="focusinput(1)" @blur="blurinput(1)" type="number" />
			<view class="img_false" @click="deletephone"><image src="@/static/login/false.png"></image></view>
		</view>

		<view class="title_phone">验证码</view>
		<view class="code" :class="focusinputs === 'code' ? 'bottominput' : ''">
			<image src="@/static/login/password.png" class="img_password"></image>
			<input v-model="code" maxlength="4" class="input_code" placeholder="请输入验证码" @focus="focusinput(2)" @blur="blurinput(2)" type="number" />
			<button v-if="!codeallow" class="button_code" @click="getcode">{{ codebuttontext }}</button>
			<view class="button_code button_code_false" v-else>{{ codebuttontext }}</view>
			<!-- <el-button
			            :disabled="codeallow"
			            style="width: 100px; padding: 12px 0; color: #FF8822; border: none;background: white !important;"
			            @click="getcode"
			          >{{ codebuttontext }}</el-button> -->
		</view>
		<view class="agreement">
			<image :src="choose ? '../../static/img/select-active.png' : '../../static/img/select.png'" @click="choose = !choose" class="choose_agreement"></image>
			<text class="text_agreement">登录即同意</text>
			<view class="view_agreement" @click="towebview(1)">《平台服务协议》</view>
			<view class="view_agreement" @click="towebview(2)">《隐私政策》</view>
		</view>
		<button @click="login" :disabled="!phone || !code" class="button">登录/注册</button>
	</view>
</template>

<script>
import { getcode, login, getDetail, getCountry } from '@/api/login.js';
import { phoneYz } from '@/utils/regular.js';
import { throttle } from '@/utils/common.js';
import { formatData } from '@/utils/helper.js';
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters(['userInfo'])
	},
	data() {
		return {
			phone: '',
			code: '',
			choose: false, //同意
			nowFocus: '',
			//倒计时相关
			codebuttontext: '获取验证码',
			codeallow: false,
			timer: null,

			array: [
				{
					country: '中国',
					telephoneCode: '86'
				}
			],
			countryList: [],
			index: 0,
			focusinputs: ''
		};
	},
	onLoad() {
		console.log('userInfo', this.userInfo);
		// if (this.userInfo.partnerName) {
		// 	uni.switchTab({
		// 		url: '../index/index',
		// 		success: () => {
		// 			plus.navigator.closeSplashscreen()
		// 		}
		// 	})
		// } else {
		this.getCountry();
		// 	plus.navigator.closeSplashscreen()
		// }
		// var expire = new Date().getTime() + 3600 * 1000;
		// this.$store.dispatch('user/setTimeNode',expire);
		//expires_in: 431999

		//this.diff()
		//console.log("现在时间", new Date().getTime() + 431999);
	},
	methods: {
		towebview(type) {
			let url = type === 1 ? 'https://h5.ubus.vip/wetour/serviceAgreement.html' : 'https://h5.ubus.vip/wetour/privacyPolicy.html';
			url = encodeURIComponent(url);
			const title = type === 1 ? '微巴士平台服务电子协议' : '隐私协议';
			console.log('去协议');
			uni.navigateTo({
				url: `/pages/webView/webView?url=${url}&&title=${title}`
			});
		},
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.detail.value);
			this.index = e.detail.value;
		},
		focusinput(val) {
			if (val === 1) {
				this.focusinputs = 'phone';
			} else {
				this.focusinputs = 'code';
			}
		},
		blurinput(val) {
			this.focusinputs = '';
		},
		deletephone() {
			this.phone = '';
			this.code = '';
		},
		login: throttle(function() {
			var phone = this.array[this.index].telephoneCode + this.phone;
			const phonecheck = phoneYz(phone, this.array[this.index].country);
			if (!phonecheck) {
				this.$u.toast('请输入正确的手机号');
				return;
			}
			if (this.code.length !== 4) {
				this.$u.toast(!this.code ? '请输入验证码' : '请输入正确的验证码');
				return;
			}
			if (!this.choose) {
				this.$u.toast('请阅读相关协议并选中');
				return;
			}
			if (this.phone == '17794538330') {
				phone = this.phone;
			}
			let data = {
				mobile: 'SMS@' + phone,
				code: this.code,
				grant_type: 'mobile'
			};

			login(data).then(res => {
				if (!res.msg) {
					if (res.access_token) {
						this.$store.dispatch('user/setToken', res).then(val => {
							this.codeallow = false;
							this.codebuttontext = '获取验证码';
							clearInterval(this.timer);
							this.getDetail();
						});
						var expire = new Date().getTime() + 3600 * 1000;
						this.$store.dispatch('user/setTimeNode', expire);
					}
				} else {
					this.$u.toast(res.msg);
				}
			});
		}),
		// 登陆成功获取详情
		getDetail() {
			getDetail().then(res => {
				if (res.code === 0) {
					this.$store.dispatch('user/setPrefixMobile', this.array[this.index].telephoneCode);
					this.$store.dispatch('user/setUserInfo', res.data).then(val => {
						if (!res.data.partnerName) {
							uni.navigateTo({
								url: '/pages/register/register?country=' + this.array[this.index].country
							});
						} else {
							this.$u.toast('登录成功');
							// 去首页
							uni.switchTab({
								url: '../index/index'
							});
						}
					});
				}
			});
		},
		// 获取国家和手机号前缀
		getCountry() {
			getCountry().then(res => {
				if (res.code === 0) {
					res.data.forEach((res2, index2) => {
						if (res2.country === '中国') {
							this.index = index2;
						}
					});
					this.countryList = res.data;
					this.array = res.data;
				}
			});
		},
		// 获取验证码
		getcode: throttle(function() {
			const phone = this.array[this.index].telephoneCode + this.phone;
			const phonecheck = phoneYz(phone, this.array[this.index].country);
			if (!phonecheck) {
				this.$u.toast('请输入正确的手机号');
				return;
			}

			getcode(phone).then(res => {
				if (res.code === 0) {
					this.$u.toast('验证码发送成功');
					console.log(res.msg, 'code');
					this.codeallow = true;
					let i = 60;
					this.timer = setInterval(() => {
						i--;
						this.codebuttontext = i + 'S';
						if (i < 1) {
							this.codeallow = false;
							this.codebuttontext = '获取验证码';
							clearInterval(this.timer);
						}
					}, 1000);
				} else {
					this.$u.toast(res.msg || '验证码发送失败');
				}
			});
			// this.$message.success({
			// 	message: '验证码发送成功'
			// })
		})
	}
};
</script>

<style scoped lang="scss">
.login {
	background: white;
	width: 100vw;
	height: 100vh;
	padding: 120rpx 30rpx;
}

.title {
	@include fs(48rpx, 600, #272727, 48rpx);
	margin-bottom: 66rpx;
}

.title2 {
	width: 100%;
	height: 280rpx;
	background: #f8f8f8;
	opacity: 1;
	border-radius: 16rpx;
	padding: 36rpx 29rpx;
	@include fs(28rpx, 400, #555555, 42rpx);
	margin-bottom: 61rpx;
}

.title_phone {
	@include fs(32rpx, 400, #272727, 32rpx);
	margin-bottom: 27rpx;
}

.phone {
	display: flex;
	align-items: center;
	height: 100rpx;
	border-bottom: 1px solid #dbdbdb;
	padding: 0 5rpx;
	margin-bottom: 40rpx;

	.img_user {
		height: 36rpx;
		width: 36rpx;
		vertical-align: text-bottom;
		margin-right: 28rpx;
	}

	.click_country {
		display: flex;
		align-items: center;
		margin-right: 32rpx;
	}

	.text_country {
		@include fs(32rpx, 400, #272727, 32rpx);
		margin-right: 12rpx;
	}

<<<<<<< HEAD
	.phone {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-bottom: 1px solid #dbdbdb;
		padding: 0 5rpx;
		margin-bottom: 40rpx;

		.img_user {
			height: 36rpx;
			width: 36rpx;
			vertical-align: text-bottom;
			margin-right: 28rpx;
		}

		.click_country {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-right: 32rpx;
		}

		.text_country {
			@include fs(32rpx, 400, #272727, 32rpx);
			margin-right: 12rpx;
		}

		.img_bottom {
			height: 32rpx;
			width: 32rpx;
			vertical-align: text-bottom;
		}

		.text_spec {
			font-size: 40rpx;
			color: #bdbdbd;
			margin-right: 32rpx;
		}

		.input_phone {
			width: 380rpx;
		}
=======
	.img_bottom {
		height: 32rpx;
		width: 32rpx;
		vertical-align: text-bottom;
	}
>>>>>>> 41dd56884275c2eb9e422fba573264eed0ce9113

	.text_spec {
		font-size: 40rpx;
		color: #bdbdbd;
		margin-right: 32rpx;
	}

	.input_phone {
		flex: 1;
		// width: 360rpx;
	}

	.img_false {
		width: 30rpx;
		height: 100%;
		display: flex;
		align-items: center;

		image {
			width: 27rpx;
			height: 27rpx;
		}
	}
}

.code {
	display: flex;
	align-items: center;
	height: 100rpx;
	border-bottom: 1px solid #dbdbdb;
	padding: 0 5rpx;
	margin-bottom: 50rpx;

	.img_password {
		height: 36rpx;
		width: 36rpx;
		vertical-align: text-bottom;
		margin-right: 28rpx;
	}

	.input_code {
		width: 450rpx;
	}

	.button_code {
		width: 152rpx;
		height: 64rpx;
		background: #ffffff;
		border: 1px solid #ff8800;
		opacity: 1;
		border-radius: 8rpx;
		padding: 0;
		@include fs(24rpx, 400, #ff8800, 62rpx);
	}

	.button_code:after {
		border: none;
	}

	.button_code_false {
		background: #dbdbdb;
		@include fs(24rpx, 400, #555, 62rpx);
		border: 1px solid #dbdbdb;
		text-align: center;
	}
}

.bottominput {
	border-bottom: 1px solid #ffcc00;
}

.agreement {
	display: flex;
	align-items: center;
	height: 60rpx;
	margin-bottom: 30rpx;

	.choose_agreement {
		width: 36rpx;
		height: 36rpx;
	}

	.text_agreement {
		@include fs(24rpx, 400, #999999, 24rpx);
		margin-left: 8rpx;
	}

	.view_agreement {
		@include fs(24rpx, 400, #ff8800, 24rpx);
		margin-left: 8rpx;
	}
}

.button {
	width: 100%;
	height: 90rpx;
	background: #ffcc00;
	border: 1px solid #ffffff;
	opacity: 1;
	border-radius: 12rpx;
	@include fs(32rpx, 600, #272727, 90rpx);
}

.button:after {
	border: none;
}
</style>
