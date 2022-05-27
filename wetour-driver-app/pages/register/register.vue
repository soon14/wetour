<template>
	<view class="register">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed :title="changeInfo?'修改信息':'注册'" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>
		<view class="list_li">
			<view class="li_left">伙伴名称：</view>
			<input v-model="name" class="input_name" placeholder-class="input_name_te" maxlength="20"
				placeholder="请输入伙伴姓名或组织名称" @input="changeName">
		</view>
		<view class="list_li" style="padding-top: 36rpx;">
			<view class="li_left">服务城市：</view>
			<button :plain='true' class="button_code" @click="toAddCity">添加</button>
		</view>
		<view class="content">
			<view class="li_choose" v-for="(value,index) in city" :key="index">
				<image src="@/static/login/close.png" class="li_cha" @click="deleteList(index)"></image>
				<text class="li_text">{{value.name}}</text>
			</view>
		</view>
		<view class="rules">
			城市添加须知：<br>
			1.您填写的服务城市决定您的服务范围<br>
			2.您可以看到符合您服务范围内的用车订单<br>
			3.您不会看到超出您服务范围的订单
		</view>
		<view class="bottom">
			<button class="bottom_button" :class="(!name||!city.length)?'bottom_button_false':''"
				:disabled="!name||!city.length" @click="clickButton">{{changeInfo?'提交':'注册'}}</button>
		</view>
		<tipView :dialogVisible.sync="tipVisible" v-if="tipVisible" @confirm="confirm" :dialogData="dialogData" />
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		changeDetail,
		getDetail,
		getCity
	} from '@/api/login.js'
	import tipView from "@/components/tipView.vue"
	export default {
		components: {
			tipView,
		},
		data() {
			return {
				name: '',
				city: [],
				tipVisible: false,
				dialogData: {
					btns: false,
					time: 3,
					content: '欢迎加入微途伙伴',
					type: 'success',
				},
				country: '',
				changeInfo: false //是否是修改用户信息
			};
		},
		onLoad(option) {
			this.country = option.country
			if (option.change) {
				this.changeInfo = true
				this.name = this.userInfo.partnerName
				this.getCity(option.country)
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
			]),
		},
		methods: {
			changeName(e){
				let val =  e.target.value.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g,'');
				this.$nextTick(() => {
					this.name = val;
				});
			},
			confirm(done) {
				console.log(66666666)

			},
			deleteList(index) {
				this.city.splice(index, 1)
			},
			toAddCity() {
				console.log('toaddcity')
				const that = this
				uni.navigateTo({
					url: `/pages/addCity/addCity?country=${this.country}`,
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						acceptDataFromOpenedPage: function(data) {
							//选择城市后传回来的数据
							console.log(data, 'acceptDataFromOpenedPage', 'register')
							that.city = data.data
						}
						// someEvent: function(data) {
						//   console.log(data,'someEvent')
						// }
					},
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: that.city
						})
					}
				})
			},
			clickButton() {
				const data = {
					cityIds: this.city.map(res => res.id).join(','),
					partnerName: this.name,
					country: this.country
				}
				changeDetail(data).then(res => {
					if (res.data) {
						this.getDetail()
					} else {
						this.$u.toast(res.msg)
					}
				})
			},
			getDetail() {
				getDetail().then(res => {
					if (res.code === 0) {
						this.$store.dispatch('user/setUserInfo', res.data).then(val => {
							console.log(res, 'setUserInfo')
							if (this.changeInfo) {
								this.$u.toast('修改成功')
								setTimeout(() => {
									uni.navigateBack()
								}, 1000)

							} else {
								this.tipVisible = true
								setTimeout(() => {
									//去车辆设置页
									uni.reLaunch({
										url: `/pages/driverCart/add-driver/index?isSkip=0`
									})
								}, this.dialogData.time * 1000)
							}



						})
					}
				})
			},
			getCity(country) {
				getCity({
					country: country
				}).then(res => {
					console.log(res, 'getCity')
					if (res.code === 0) {
						res.data.records.forEach(val => {
							this.userInfo.cityIds.split(',').forEach(val2 => {
								if (val.id == val2) {
									this.city.push({
										id: val.id,
										name: val.city
									})
								}
							})
						})
					}
				})
			},
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
		width: 490rpx;
		height: 90rpx;
		padding: 0 20rpx;
		background: #F5F5F5;
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
		background: #FFFFFF;
		border: 1px solid #FF8800;
		opacity: 1;
		border-radius: 12rpx;
		@include fs(28rpx, 400, #FF8800, 62rpx);
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
			border-bottom: 1px solid #DBDBDB;
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
		background-color: #FFFFFF;
		box-shadow: 0px -2px 10px rgba(184, 172, 128, 0.3);

		.bottom_button {
			width: 650rpx;
			height: 90rpx;
			background: #FFCC00;
			border-radius: 12rpx;
			margin: 36rpx 0 0 50rpx;
			@include fs(32rpx, 400, #272727, 90rpx);
			border: 1px solid #ffffff;
		}

		.bottom_button_false {
			background-color: #EEEEEE;
			color: #999999;
			;
		}
	}

	.rules {
		width: 100%;
		height: 224rpx;
		padding: 24rpx 16rpx;
		background: #FFFFFF;
		margin-top: 16rpx;
		@include fs(28rpx, 400, #555555, 42rpx);
	}

	.bottom2 {
		width: 100%;
		height: 140rpx;
	}

	button:after {
		border: none
	}
</style>
