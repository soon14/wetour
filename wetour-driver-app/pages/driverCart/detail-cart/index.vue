<template>
	<view class="driver-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="车辆详情" color="#272727">
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
				<view class="item-label flex-between">
					<text>车牌：{{cartData.number}}</text>
					<view class="flex-start">
						<text style="margin-right: 10rpx;">{{busCheck ?'禁用':'启用'}}</text>
						<u-switch size="35" inactive-color="#FF8800 " active-color="#FFFFFF" v-model="busCheck"
							@change="changeState">
						</u-switch>
					</view>
				</view>
				<text class="item-label">品牌：{{cartData.brand}}</text>
				<text class="item-label">车型：{{cartData.busTypeTitle}}</text>
				<text v-if="isChina!=0" class="item-label">保险有效期：{{cartData.insuranceExpired}}</text>
				<text class="item-label">车辆照片</text>
				<view v-if="cartData.busImageDTO && cartData.busImageDTO.headImage"
					class="choose-content choose-image-person" @click="previewImage(cartData.busImageDTO.headImage)">
					<image class="choose-image-person" mode="aspectFit"
						:src="cartData.busImageDTO.headImage?cartData.busImageDTO.headImage:'../../static/newImg/cartImg.png'">
					</image>
				</view>
				<view class="flex-between">
					<view v-if="cartData.busImageDTO && cartData.busImageDTO.sideTwoImage"
						class="choose-content choose-image-drive"
						@click="previewImage(cartData.busImageDTO.sideTwoImage)">
						<image class="choose-image-drive" mode="aspectFit" :src="cartData.busImageDTO.sideTwoImage">
						</image>
					</view>
					<view v-if="cartData.busImageDTO && cartData.busImageDTO.tailImage"
						class="choose-content choose-image-drive" @click="previewImage(cartData.busImageDTO.tailImage)">
						<image class="choose-image-drive" mode="aspectFit" :src="cartData.busImageDTO.tailImage">
						</image>
					</view>
					<view v-if="cartData.busImageDTO && cartData.busImageDTO.sideOneImage"
						class="choose-content choose-image-drive"
						@click="previewImage(cartData.busImageDTO.sideOneImage)">
						<image class="choose-image-drive" mode="aspectFit" :src="cartData.busImageDTO.sideOneImage" />
					</view>
				</view>
				<text v-if="isChina==0" class="item-label" style="margin-top: 21rpx;">行驶证照片</text>
				<view v-if="isChina==0" class="choose-content choose-image-person"
					@click="previewImage(cartData.drivingLicense)">
					<image v-if="cartData.drivingLicense" mode="aspectFit" class="choose-image-person" :src="cartData.drivingLicense">
					</image>
					<text v-else class="choose-content-label">行驶证照片</text>
				</view>
				<text v-if="isChina==1" class="item-label" style="margin-top: 21rpx;">注册文件</text>
				<view v-if="isChina==1" class="choose-content choose-image-person"
					@click="previewImage(cartData.registerFile)">
					<image v-if="cartData.registerFile"  mode="aspectFit" class="choose-image-person" :src="cartData.registerFile">
					</image>
					<text class="choose-content-label">注册文件</text>
				</view>
				<text v-if="isChina==1" class="item-label" style="margin-top: 21rpx;">保险照片</text>
				<view v-if="isChina==1" class="choose-content choose-image-person"
					@click="previewImage(cartData.insuranceImage)">
					<image  v-if="cartData.insuranceImage" mode="aspectFit" class="choose-image-person" :src="cartData.insuranceImage">
					</image>
					<text class="choose-content-label">保险照片</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		bus,
		busUpdateStatusById
	} from "@/api/drivercart.js"
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	export default {
		data() {
			return {
				cartData: {},
				requstParams: {
					id: "",
					busStatus: false
				},
				isChina: 0,
				busCheck: false,
				statusBarHeight: statusBarHeight,
			}
		},
		onLoad(e) {
			if (e.id != undefined) {
				this.isChina = e.isChina;
				this.requstParams.id = e.id;
			}
			this.getBus(this.requstParams.id);
		},
		methods: {
			previewImage(url) {
				if (!url) return;
				uni.previewImage({
					urls: [url]
				})
			},
			onUpdate() {
				this.$store.dispatch('user/setSkipData', this.cartData).then(val => {
					uni.navigateTo({
						url: '../add-cart/index'
					})
				});
			},
			//状态变更
			changeState(value) {
				var self = this;
				this.requstParams.busStatus = value ? 1 : 0;
				busUpdateStatusById(this.requstParams).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: value ? "启用成功！" : " 禁用成功",
							icon: 'none'
						})
						self.getBus();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						self.busCheck = !value;
					}
				})
			},
			getBus() {
				var self = this;
				bus(this.requstParams.id).then(res => {
					if (res.code == 0) {
						self.cartData = res.data;
						self.busCheck = (self.cartData.busStatus == 1);
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
			padding: 16rpx 20rpx;
			flex-direction: column;
			background-color: #FFFFFF;
			.item-label {
				margin: 6rpx 0rpx;
				word-wrap: break-word;
				word-break: normal;
				@include fs(32rpx, 400, #272727, 45rpx);
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
