<template>
	<view class="audit-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="司机详情" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
			<view v-if="driverData.applyStatus==2" @click="onUpdate" class="title-right" slot="right">
				修改
			</view>
		</uni-nav-bar>
		<view class="audit-content" :style="{  'max-height': `calc(100vh - ${statusBarHeight})`,
		'height': `calc(100vh - ${statusBarHeight})`  }">
			<view class="head-content">
				<text>审核状态：<text
						style="color: #FF8800;">{{driverData.applyStatus==0?"待审核":(driverData.applyStatus==1?"审核通过":"审核驳回")}}</text></text>
				<text class="item-label">提交时间：{{driverData.applyTime}}</text>
				<!---->
				<view  v-if="driverData.applyStatus==2"  class="head-des">
					<text style="min-width: 160rpx;">驳回原因：</text>
					<!-- -->
					<text class="reason"> {{driverData.applyReason}}</text>
				</view>
			</view>
			<view class="bottom-content">
				<view class="bottom-person">
					<image class="person-image"
						:src="driverData.driverImage?driverData.driverImage:'../../static/newImg/driverImg.png'"
						mode="aspectFit" @click="previewImage(driverData.driverImage)">
					</image>
					<view class="person-des">
						<text class="item-label">姓名：{{driverData.driverName}}</text>
						<text class="item-label">性别：{{driverData.gender | genderstatusFil}}</text>
						<text class="item-label">手机号：{{driverData.mobile}}</text>
					</view>
				</view>
				<text v-if="driverData.weixin" style="margin-top: 20rpx;">微信号：{{driverData.weixin}}</text>
				<text class="item-label">驾驶证有效期：{{get(driverData.driverLicenseExpired)}}</text>
				<text v-if="mIsChina==0" class="item-label">身份证照片</text>
				<view v-if="mIsChina==0" class="flex-start">
					<view class="choose-content choose-image-drive">
						<image v-if="driverData.frontIdentificationImage" class="choose-image-drive" mode="aspectFit"
							:src="driverData.frontIdentificationImage"
							@click="previewImage(driverData.frontIdentificationImage)"></image>
						<text v-else class="choose-content-label">身份证正面</text>
					</view>
					<view style="margin-left: 23rpx;" class="choose-content choose-image-drive">
						<image v-if="driverData.backIdentificationImage" class="choose-image-drive" mode="aspectFit"
							:src="driverData.backIdentificationImage"
							@click="previewImage(driverData.backIdentificationImage)"></image>
						<text v-else class="choose-content-label">身份证背面</text>
					</view>
				</view>
				<text style="margin-top: 32rpx;">驾驶证照片</text>
				<view class="choose-content choose-image-drive">
					<image v-if="driverData.driverLicenseImage" class="choose-image-drive"
						:src="driverData.driverLicenseImage" @click="previewImage(driverData.driverLicenseImage)">
					</image>
					<text v-else class="choose-content-label">驾驶证照片</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		driverApply,
	} from "@/api/drivercart.js"
	import {
		driverLicense,
		genderstatusList
	} from "@/utils/helper.js"
	import {
		mapGetters
	} from 'vuex'
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	export default {
		computed: {
			...mapGetters([
				'userInfo',
			]),
			mIsChina() {
				return this.userInfo.country == "中国" ? 0 : 1
			}
		},
		data() {
			return {
				driverData: {},
				statusBarHeight: statusBarHeight,
			}
		},
		filters: {
			genderstatusFil(val) {
				return genderstatusList[val]
			},
		},
		onLoad(e) {
			if (e.id != undefined) {
				this.getDriverApply(e.id);
			}
		},
		methods: {
			previewImage(url) {
				console.log("url", url)
				if (!url) return;
				uni.previewImage({
					urls: [url]
				})
			},
			get(mtime) {
				return driverLicense(mtime)
			},
			onUpdate() {

				this.driverData.id = this.driverData.driverId;
				console.log("sss", this.driverData)
				this.$store.dispatch('user/setSkipData', this.driverData).then(val => {
					console.log("val")
					uni.navigateTo({
						url: '/pages/driverCart/add-driver/index?isSkip=' + 1
					})
				})
			},
			getDriverApply(id) {
				var self = this;
				driverApply(id).then(res => {
					if (res.code == 0) {
						self.driverData = res.data;
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
	.audit-box {
		overflow: hidden;
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.title-right {
		@include fs(28rpx, 400, #272727, 40rpx);
	}

	.item-label {
		margin: 3rpx 0rpx;
		word-wrap: break-word;
		word-break: normal;
		@include fs(32rpx, 400, #272727, 45rpx);
	}

	.reason {
		max-width: 550rpx;
		word-wrap: break-word;
		word-break: normal;
	}

	.audit-content {
		display: flex;
		overflow-y: scroll;
		flex-direction: column;
		background-color: #F5F5F5;

		.head-content {
			display: flex;
	
			flex-direction: column;
			padding: 21rpx 16rpx;
			background-color: #FFFFFF;
			@include fs(32rpx, 400, #272727, 45rpx);

			.head-des {
				display: flex;
				margin-top: 7rpx;
				flex-direction: row;
			}
		}

		.title-right {
			@include fs(28rpx, 400, #272727, 40rpx);
		}

		.bottom-content {
			display: flex;
			margin-top: 16rpx;
			padding: 21rpx 16rpx;
			flex-direction: column;
			background-color: #FFFFFF;
			@include fs(32rpx, 400, #272727, 45rpx);

			.bottom-person {
				display: flex;
				flex-direction: row;
				padding-bottom: 21rpx;
				border-bottom: 1rpx solid #EEEEEE;

				.person-image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
				}

				.person-des {
					display: flex;
					margin-left: 24rpx;
					flex-direction: column;
				}
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
		}
	}
</style>
