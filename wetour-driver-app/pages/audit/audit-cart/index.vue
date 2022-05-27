<template>
	<view class="audit-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="车辆详情" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
			<view v-if="cartData.applyStatus==2" @click="onUpdate" class="title-right" slot="right">
				修改
			</view>
		</uni-nav-bar>

		<view class="audit-content" :style="{  'max-height': `calc(100vh - ${statusBarHeight})`,
		'height': `calc(100vh - ${statusBarHeight})`  }">

			<view class="head-content">
				<text>审核状态：<text
						style="color: #FF8800;">{{cartData.applyStatus==0?"待审核":(cartData.applyStatus==1?"审核通过":"审核驳回")}}</text></text>
				<text class="item-label">提交时间：{{cartData.applyTime}}</text>
				<view v-if="cartData.applyStatus==2" class="head-des">
					<text style="min-width: 160rpx;">驳回原因：</text>
					<text class="reason">{{cartData.applyReason}}</text>
				</view>
			</view>

			<view class="bottom-content">

				<text>车牌：{{cartData.number}}</text>
				<text class="item-label">品牌：{{cartData.brand}}</text>
				<text class="item-label">
					车型：{{cartData.busTypeTitle}}</text>
				<text v-if="mIsChina==1" class="item-label">保险有效期：{{cartData.insuranceExpired}}</text>
				<text class="item-label">车辆照片</text>
				<view v-if="cartData.busImageDTO && cartData.busImageDTO.headImage"
					class="choose-content choose-image-person">
					<image class="choose-image-person" :src="cartData.busImageDTO.headImage" mode="aspectFit"
						@click="previewImage(cartData.busImageDTO.headImage)">
					</image>
				</view>
				<view class="flex-between">
					<view v-if="cartData.busImageDTO && cartData.busImageDTO.sideTwoImage"
						class="choose-content choose-image-drive">
						<image class="choose-image-drive" :src="cartData.busImageDTO.sideTwoImage" mode="aspectFit"
							@click="previewImage(cartData.busImageDTO.sideTwoImage)"></image>
					</view>
					<view v-if="cartData.busImageDTO && cartData.busImageDTO.tailImage"
						class="choose-content choose-image-drive">
						<image class="choose-image-drive" :src="cartData.busImageDTO.tailImage" mode="aspectFit"
							@click="previewImage(cartData.busImageDTO.tailImage)">
						</image>
					</view>
					<view v-if="cartData.busImageDTO && cartData.busImageDTO.sideOneImage"
						class="choose-content choose-image-drive">
						<image class="choose-image-drive" :src="cartData.busImageDTO.sideOneImage" mode="aspectFit"
							@click="previewImage(cartData.busImageDTO.sideOneImage)"></image>
					</view>
				</view>
				<!-- 行驶证照片 -->
				<text v-if="mIsChina==0" style="margin-top: 32rpx;">行驶证照片</text>
				<view v-if="mIsChina==0" class="choose-content choose-image-person">
					<image v-if="cartData.drivingLicense" class="choose-image-drive" :src="cartData.drivingLicense"
						mode="aspectFit" @click="previewImage(cartData.drivingLicense)">
					</image>
					<text v-else class="choose-content-label">行驶证照片</text>
				</view>
				<!-- 注册文件 -->
				<text v-if="mIsChina==1" style="margin-top: 32rpx;">注册文件</text>
				<view v-if="mIsChina==1" class="choose-content choose-image-person">
					<image v-if="cartData.registerFile" class="choose-image-drive" :src="cartData.registerFile"
						mode="aspectFit" @click="previewImage(cartData.registerFile)">
					</image>
					<text v-else class="choose-content-label">注册文件</text>
				</view>
				<!-- 保险照片 -->
				<text v-if="mIsChina==1" style="margin-top: 32rpx;">保险照片</text>
				<view v-if="mIsChina==1" class="choose-content choose-image-person">
					<image v-if="cartData.insuranceImage" class="choose-image-drive" :src="cartData.insuranceImage"
						mode="aspectFit" @click="previewImage(cartData.insuranceImage)">
					</image>
					<text v-else class="choose-content-label">保险照片</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		busApply
	} from "@/api/drivercart.js"
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
				cartData: {},
				statusBarHeight: statusBarHeight,
			}
		},
		onLoad(e) {
			if (e.id != undefined) {
				this.getbusApply(e.id);
			}
		},
		methods: {
			previewImage(url) {
				if (!url) return;
				uni.previewImage({
					urls: [url]
				})
			},
			onUpdate() {
				this.cartData.id = this.cartData.busId;
				console.log("sss", this.cartData)
				this.$store.dispatch('user/setSkipData', this.cartData).then(val => {
					uni.navigateTo({
						url: '/pages/driverCart/add-cart/index'
					})
				});
			},
			getbusApply(id) {
				var self = this;
				busApply(id).then(res => {
					if (res.code == 0) {
						self.cartData = res.data;
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
		}

		.bottom-content {
			display: flex;
			margin-top: 16rpx;
			padding: 21rpx 16rpx;
			flex-direction: column;
			background-color: #FFFFFF;
			@include fs(32rpx, 400, #272727, 45rpx);

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
