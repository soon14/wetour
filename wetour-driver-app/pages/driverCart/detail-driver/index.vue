<template>
	<view class="driver-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="司机详情" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
			<view @click="onUpdate" class="title-right" slot="right">
				修改
			</view>
		</uni-nav-bar>
		<view class="driver-content"
			:style="{  'max-height': `calc(100vh - ${statusBarHeight})`,'height': `calc(100vh - ${statusBarHeight})`  }">
			<!--顶部内容-->
			<view class="content-head">
				<view class="flex-start" style="padding: 16rpx 20rpx;">
					<image :src="driverData.driverImage?driverData.driverImage:'../../static/newImg/driverImg.png'"
						class="head-image" mode="heightFix" @click="previewImage(driverData.driverImage)"></image>
					<view class="head-right">
						<view class="item-label flex-between">
							<text>姓名:{{driverData.driverName}}</text>
							<view class="flex-start">
								<text style="margin-right: 10rpx;">{{driverCheck ?'禁用':'启用'}} </text>
								<u-switch size="35" inactive-color="#FF8800 " active-color="#FFFFFF"
									v-model="driverCheck" @change="changeState">
								</u-switch>
							</view>
						</view>
						<text class="item-label">性别：{{ driverData.gender | genderstatusFil }}</text>
						<text class="item-label">手机号：{{driverData.mobile}}</text>
					</view>
				</view>
				<view class="bottom-content">
					<view v-if="driverData.weixin" class="item-label">微信号：{{driverData.weixin}}</view>
					<view class="item-label">驾驶证有效期：{{ get(driverData.driverLicenseExpired) }}</view>
					<text v-if="isChina==0" class="item-label">身份证照片</text>
					<view v-if="isChina==0" class="flex-start" style="margin-bottom: 14rpx;">
						<view class="choose-content choose-image-drive"
							@click="previewImage(driverData.frontIdentificationImage)">
							<image mode="aspectFit" v-if="driverData.frontIdentificationImage" class="choose-image-drive"
								:src="driverData.frontIdentificationImage" ></image>
							<text v-else class="choose-content-label">身份证正面</text>
						</view>
						<view style="margin-left: 23rpx;" class="choose-content choose-image-drive"
							@click="previewImage(driverData.backIdentificationImage)">
							<image mode="aspectFit" v-if="driverData.backIdentificationImage" class="choose-image-drive"
								:src="driverData.backIdentificationImage"></image>
							<text v-else class="choose-content-label">身份证反面</text>
						</view>
					</view>
					<text style="margin-top: 7rpx;" class="item-label">驾驶证照片</text>
					<view class="choose-content choose-image-drive"
						@click="previewImage(driverData.driverLicenseImage)">
						<image mode="aspectFit" v-if="driverData.driverLicenseImage" class="choose-image-drive"
							:src="driverData.driverLicenseImage"></image>
						<text v-else class="choose-content-label">驾驶证照片</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		driver,
		driverUpdateStatusById
	} from "@/api/drivercart.js"

	import {
		driverLicense
	} from "@/utils/helper.js"

	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	export default {
		data() {
			return {
				driverData: {},
				requstParams: {
					id: "",
					driverStatus: 0, // 司机状态0禁用1启用
				},
				isChina: 0,
				driverCheck: false,
				statusBarHeight: statusBarHeight,
			}
		},
		filters: {
			genderstatusFil(val) {
				let map = {
					1: '男',
					2: '女',
				}
				return map[val]
			},
		},
		onLoad(e) {
			if (e.id != undefined) {
				this.isChina = e.isChina;
				this.requstParams.id = e.id;
			}
			this.getDriver();
		},

		methods: {
			previewImage(url) {
				if (!url) return;
				uni.previewImage({
					urls: [url]
				})
			},
			get(mtime) {
				return driverLicense(mtime)
			},
			//点击修改
			onUpdate() {
				this.$store.dispatch('user/setSkipData', this.driverData).then(val => {
					uni.navigateTo({
						url: '../add-driver/index?isSkip=' + 1
					})
				})
			},
			//状态变更
			changeState(value) {
				var self = this;
				this.requstParams.driverStatus = value ? 1 : 0;
				driverUpdateStatusById(this.requstParams).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: value ? "启用成功！" : " 禁用成功",
							icon: 'none'
						})
						self.getDriver();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						self.driverCheck = !value;
					}
				})
			},
			//获取司机信息
			getDriver() {
				var self = this;
				driver(this.requstParams.id).then(res => {
					if (res.code == 0) {
						self.driverData = res.data;
						self.driverCheck = (res.data.driverStatus == 1);

						if (self.driverData.identificationImage) {
							var identificationImageArray = self.driverData.identificationImage.split(",");
							this.$set(self.driverData, "frontIdentificationImage",
								identificationImageArray[0]);

							this.$set(self.driverData, "backIdentificationImage",
								identificationImageArray[1]);
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	.driver-box {
		overflow: hidden;
		min-height: 100vh;
	}
	.title-right {
		@include fs(28rpx, 400, #272727, 40rpx);
	}
	.driver-content {
		display: flex;
		flex-direction: column;
		background-color: #F5F5F5;
		.content-head {
			display: flex;
			overflow-y: scroll;
			flex-direction: column;
			background-color: #FFFFFF;
			.head-image {
				width: 140rpx;
				height: 140rpx;
				background: #F5F5F5;
				border-radius: 16rpx;
			}
			.head-right {
				flex: 1;
				display: flex;
				margin-left: 24rpx;
				flex-direction: column;
			}
			.item-label {
				margin: 3rpx 0rpx;
				word-wrap: break-word;
				word-break: normal;
				@include fs(30rpx, 400, #272727, 45rpx);
			}
			.choose-content {
				margin: 15rpx 0rpx;
				position: relative;
				background: #F5F5F5;
			}
			.choose-image-person {
				width: 160rpx;
				height: 160rpx;
				border-radius: 16rpx;
			}
			.choose-image-drive {
				width: 224rpx;
				height: 126rpx;
				border-radius: 16rpx;
			}
			.choose-content-label {
				width: 120rpx;
				height: 34rpx;
				position: absolute;
				text-align: center;
				top: calc(50% - 17rpx);
				left: calc(50% - 60rpx);
				@include fs(24rpx, 600, #5B5F6A, 34rpx);
			}
			.bottom-content {
				display: flex;
				padding: 16rpx 28rpx;
				flex-direction: column;
				border-top: 16rpx solid #F5F5F5;
			}
		}
	}
</style>
