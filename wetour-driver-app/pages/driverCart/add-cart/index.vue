<template>
	<view class="driver-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed :title="requstParams.id ? '修改车辆' : '添加车辆'" color="#272727">
			<image @click="onBack" slot="left" src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;"></image>
		</uni-nav-bar>
		<view class="driver-content" :style="{ 'max-height': `calc(100vh - ${statusBarHeight})`, height: `calc(100vh - ${statusBarHeight})` }">
			<!--顶部内容-->
			<view class="content-head">
				<!-- 车牌：-->
				<view class="item-head" style="min-height: 90rpx;">
					<text v-if="!requstParams.id" class="star-txt">*</text>
					<text class="label-txt">车牌：</text>
					<text v-if="requstParams.id">{{ requstParams.number }}</text>
					<u-input v-else  v-model="requstParams.number" clearable maxlength="20" placeholder="请输入车牌" @input="changeNumber($event)"></u-input>
				</view>
				<!-- 品牌：-->
				<view class="item-head" style="min-height: 90rpx;">
					<text class="star-txt">*</text>
					<text class="label-txt">品牌：</text>
					<u-input v-model="requstParams.brand" maxlength="20" clearable placeholder="请输入品牌" @input="changeBrand($event)"></u-input>
				</view>
				<!-- 车型：-->
				<view class="item-head" style="min-height: 90rpx;">
					<text class="star-txt">*</text>
					<text class="label-txt">车型：</text>
					<u-input @click="clickItem(1)" :value="getbusTypestatusList(requstParams.busType)" disabled placeholder="请选择车型"></u-input>
					<image src="@/static/img/right.png" style="width: 12rpx;height: 24rpx;"></image>
				</view>
				<!-- 保险有效期-->
				<view v-if="mIsChina != 0" class="item-head" style="min-height: 90rpx;">
					<text class="star-txt">*</text>
					<text class="label-txt">保险：</text>
					<u-input @click="clickItem(2)" v-model="requstParams.insuranceExpired" disabled placeholder="请选择保险有效期"></u-input>
					<image src="@/static/img/right.png" style="width: 12rpx;height: 24rpx;"></image>
				</view>
				<!-- 车辆照片-->
				<view class="item-head-other">
					<view class="item-head" style="height: 72rpx; border: none;padding:0rpx"><text class="label-txt">车辆照片：</text></view>
					<text class="remark-txt">上传图片小于1MB，建议比例16:9，格式png/jpg</text>
					<!-- 车头-->
					<view @click="clickItem(3)" class="choose-content choose-image-person">
						<image
							v-if="requstParams.busImageDTO.headImage"
							@click.stop="requstParams.busImageDTO.headImage = ''"
							src="@/static/img/close_icon.png"
							class="choose-image-remove"
						></image>
						<image
							class="choose-image-person"
							v-if="requstParams.busImageDTO.headImage"
							mode="aspectFit"
							:src="requstParams.busImageDTO.headImage"
							@click="previewImage(requstParams.busImageDTO.headImage)"
						></image>
						<view class="choose-identity-content" v-else>
							<text class="choose-identity-add">+</text>
							<view class="flex-center">
								<text class="choose-star-txt">*</text>
								<text class="choose-identity-txt">车头</text>
							</view>
						</view>
					</view>
					<view class="flex-between-align">
						<!-- 右侧-->
						<view @click="clickItem(4)" class="choose-content choose-image-drive">
							<image
								v-if="requstParams.busImageDTO.sideTwoImage"
								@click.stop="requstParams.busImageDTO.sideTwoImage = ''"
								src="@/static/img/close_icon.png"
								class="choose-image-remove"
							></image>
							<image
								class="choose-image-drive"
								v-if="requstParams.busImageDTO.sideTwoImage"
								mode="aspectFit"
								:src="requstParams.busImageDTO.sideTwoImage"
								@click="previewImage(requstParams.busImageDTO.sideTwoImage)"
							></image>
							<view class="choose-identity-content" v-else>
								<text class="choose-identity-add">+</text>
								<text class="choose-identity-txt">右侧</text>
							</view>
						</view>
						<!-- 车尾-->
						<view @click="clickItem(5)" class="choose-content choose-image-drive">
							<image
								v-if="requstParams.busImageDTO.tailImage"
								@click.stop="requstParams.busImageDTO.tailImage = ''"
								src="@/static/img/close_icon.png"
								class="choose-image-remove"
							></image>
							<image
								class="choose-image-drive"
								v-if="requstParams.busImageDTO.tailImage"
								mode="aspectFit"
								:src="requstParams.busImageDTO.tailImage"
								@click="previewImage(requstParams.busImageDTO.tailImage)"
							></image>
							<view class="choose-identity-content" v-else>
								<text class="choose-identity-add">+</text>
								<text class="choose-identity-txt">车尾</text>
							</view>
						</view>
						<!-- 左侧-->
						<view @click="clickItem(6)" class="choose-content choose-image-drive">
							<image
								v-if="requstParams.busImageDTO.sideOneImage"
								@click="requstParams.busImageDTO.sideOneImage = ''"
								src="@/static/img/close_icon.png"
								class="choose-image-remove"
							></image>
							<image
								class="choose-image-drive"
								v-if="requstParams.busImageDTO.sideOneImage"
								mode="aspectFit"
								:src="requstParams.busImageDTO.sideOneImage"
								@click="previewImage(requstParams.busImageDTO.sideOneImage)"
							></image>
							<view class="choose-identity-content" v-else>
								<text class="choose-identity-add">+</text>
								<text class="choose-identity-txt">左侧</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 行驶证照片-->
				<view v-if="mIsChina == 0" class="item-head-other">
					<view class="item-head" style="height: 72rpx; border: none;padding:0rpx">
						<text class="star-txt">*</text>
						<text class="label-txt ">行驶证照片：</text>
					</view>
					<text class="remark-txt">上传图片小于1MB，建议比例16:9，格式png/jpg</text>
					<view @click="clickItem(7)" class="choose-content choose-image-drive">
						<image
							v-if="requstParams.drivingLicense"
							@click.stop="requstParams.drivingLicense = ''"
							src="@/static/img/close_icon.png"
							class="choose-image-remove"
						></image>
						<image
							class="choose-image-drive"
							v-if="requstParams.drivingLicense"
							mode="aspectFit"
							:src="requstParams.drivingLicense"
							@click="previewImage(requstParams.drivingLicense)"
						></image>
						<text v-else class="choose-add">+</text>
					</view>
				</view>
				<!-- 注册文件-->
				<view v-if="mIsChina == 1" class="item-head-other">
					<view class="item-head" style="height: 72rpx; border: none;padding:0rpx">
						<text class="star-txt">*</text>
						<text class="label-txt ">注册文件：</text>
					</view>
					<text class="remark-txt">上传图片小于1MB，建议比例16:9，格式png/jpg</text>
					<view @click="clickItem(8)" class="choose-content choose-image-drive">
						<image v-if="requstParams.registerFile" @click.stop="requstParams.registerFile = ''" src="@/static/img/close_icon.png" class="choose-image-remove"></image>
						<image
							class="choose-image-drive"
							v-if="requstParams.registerFile"
							mode="aspectFit"
							:src="requstParams.registerFile"
							@click="previewImage(requstParams.registerFile)"
						></image>
						<text v-else class="choose-add">+</text>
					</view>
				</view>
				<!-- 保险照片-->
				<view v-if="mIsChina == 1" class="item-head-other">
					<view class="item-head" style="height: 72rpx; border: none;padding:0rpx">
						<text class="star-txt">*</text>
						<text class="label-txt ">保险照片：</text>
					</view>
					<text class="remark-txt">上传图片小于1MB，建议比例16:9，格式png/jpg</text>
					<view @click="clickItem(9)" class="choose-content choose-image-drive">
						<image
							v-if="requstParams.insuranceImage"
							@click.stop="requstParams.insuranceImage = ''"
							src="@/static/img/close_icon.png"
							class="choose-image-remove"
						></image>
						<image
							class="choose-image-drive"
							v-if="requstParams.insuranceImage"
							mode="aspectFit"
							:src="requstParams.insuranceImage"
							@click="previewImage(requstParams.insuranceImage)"
						></image>
						<text v-else class="choose-add">+</text>
					</view>
				</view>
				<view class="remark-content">
					<text>注：</text>
					<view style="display: flex;flex-direction: column;">
						<text>手机号请使用{{ userInfo.country }}的号码</text>
						<text>照片支持jpg，jpeg，png格式，且需要小于1MB</text>
						<text>在没有添加任何司机车辆的情况下，无法接到用车订单</text>
						<text>请保证您填写信息的真实性，这样可以提高审核通过率</text>
						<text>请保证您上传图片的清晰度，这样也可以提高审核通过率</text>
					</view>
				</view>
			</view>
			<!--底部按钮-->
			<view class="content-bottom"><text @click="onSubmit" class="submit-audit" :class="disabledClass">提交审核</text></view>
		</view>
		<!--车型弹窗-->
		<u-select v-model="showCartmodel" value-name="id" label-name="typeTitle" mode="single-column" :list="busTypeList" @confirm="confirm(1, $event)"></u-select>
		<!--行驶证有效期弹窗-->
		<u-picker mode="time" v-model="showDriverlicense" :params="dateParams" :safe-area-inset-bottom="true" @confirm="confirm(2, $event)"></u-picker>
	</view>
</template>

<script>
import { busApplySave, busApplyUpdateById, busApplylistBusType } from '@/api/drivercart.js';
import { upload } from '@/utils/updataoss.js';
import { mapGetters } from 'vuex';

var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
export default {
	computed: {
		...mapGetters(['skipData', 'userInfo']),
		mIsChina() {
			console.log('sss', this.userInfo);
			return this.userInfo.country == '中国' ? 0 : 1;
		},
		disabledClass(){
			console.log(this.requstParams.id,!this.requstParams.id,'--------------')
			if(!this.requstParams.id){
				return ''
			}
			console.log(11111,this.skipData,this.requstParams)
			// requstParams
			// let arr = ['number','brand','busType','insuranceExpired','busImageDTO.headImage','busImageDTO.sideTwoImage','busImageDTO.tailImage','busImageDTO.sideOneImage','drivingLicense','registerFile','insuranceImage']
			
			let className = 'disabledName'
			if(this.requstParams.number != this.skipData.number) className = ''
			if(this.requstParams.brand != this.skipData.brand) className = ''
			if(this.requstParams.busType != this.skipData.busType) className = ''
			if(this.requstParams.insuranceExpired != this.skipData.insuranceExpired) className = ''
			if(this.requstParams.busImageDTO.headImage != this.skipData.busImageDTO.headImage) className = ''
			
			
			if(this.requstParams.busImageDTO.sideTwoImage != this.skipData.busImageDTO.sideTwoImage) className = ''
			if(this.requstParams.busImageDTO.tailImage != this.skipData.busImageDTO.tailImage) className = ''
			if(this.requstParams.busImageDTO.sideOneImage != this.skipData.busImageDTO.sideOneImage) className = ''
			
			
			if(this.requstParams.drivingLicense != this.skipData.drivingLicense) className = ''
			if(this.requstParams.registerFile != this.skipData.registerFile) className = ''
			if(this.requstParams.insuranceImage != this.skipData.insuranceImage) className = ''
			return className
		},
	},
	data() {
		return {
			dateParams: {
				year: true,
				month: true,
				day: true,
				hour: false,
				minute: false,
				second: false
			},
			requstParams: {
				number: '', //车牌号码
				brand: '', //品牌
				busType: '', //车型
				insuranceExpired: '', //保险过期日期
				busImageDTO: {
					headImage: '', //车头
					sideOneImage: '', //左侧
					sideTwoImage: '', //右侧
					tailImage: '' //车尾
				},
				drivingLicense: '', //行驶证照片
				registerFile: '', //注册文件
				insuranceImage: '' //保险照片
			},
			chooseType: 0,
			busTypeList: [],
			showCartmodel: false,
			showDriverlicense: false,
			statusBarHeight: statusBarHeight
		};
	},
	onLoad(options) {
		if (this.skipData.brand != undefined) {
			this.requstParams = JSON.parse(JSON.stringify(this.skipData))
			this.$set(this.requstParams, 'busId', this.skipData.id);
			console.log('sss', this.requstParams);
		}
		this.busListBusType();
	},
	created() {
		var self = this;
		// 监听从裁剪页发布的事件，获得裁剪结果
		uni.$on('uAvatarCropper', path => {
			upload(path).then(url => {
				console.log('imgurl', url);
				if (this.chooseType == 3) {
					this.requstParams.busImageDTO.headImage = url;
				}
			});
		});
	},
	onUnload() {
		this.$store.dispatch('user/setSkipData', {});
	},
	methods: {
		changeNumber(e){
			let val =  e.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g,'');
			this.$nextTick(() => {
				this.requstParams.number = val;
			});
		},
		changeBrand(e){
			let val =  e.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g,'');
			this.$nextTick(() => {
				this.requstParams.brand = val;
			});
		},
		previewImage(url) {
			if (!url) return;
			uni.previewImage({
				urls: [url]
			});
		},
		onBack() {
			uni.switchTab({
				url: '/pages/driverCart/index'
			});
		},
		getbusTypestatusList(busType) {
			var busTypeStr = '';
			var index = this.busTypeList.findIndex(item => item.id == busType);
			if (index != -1) {
				busTypeStr = this.busTypeList[index].typeTitle;
			}
			return busTypeStr;
		},
		busListBusType() {
			busApplylistBusType().then(res => {
				if (res.code == 0) {
					console.log('res', res);
					this.busTypeList = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		//点击Item
		clickItem(index) {
			if (index == 1) {
				this.showCartmodel = true;
			}
			//行驶证
			if (index == 2) {
				this.showDriverlicense = true;
			} else if (index == 3 && this.requstParams.busImageDTO.headImage == '') {
				this.chooseType = index;
				this.$u.route({
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					params: {
						destWidth: index == 3 ? 160 : 224,
						rectWidth: index == 3 ? 160 : 224,
						fileType: 'jpg'
					}
				});
			} else if (
				(index == 4 && this.requstParams.busImageDTO.sideTwoImage == '') ||
				(index == 5 && this.requstParams.busImageDTO.tailImage == '') ||
				(index == 6 && this.requstParams.busImageDTO.sideOneImage == '') ||
				(index == 7 && this.requstParams.drivingLicense == '') ||
				(index == 8 && this.requstParams.registerFile == '') ||
				(index == 9 && this.requstParams.insuranceImage == '')
			) {
				var self = this;
				self.chooseType = index;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						if (res.tempFiles[0].size > 1 * 1024 * 1024) {
						} else {
							upload(res.tempFilePaths[0]).then(url => {
								if (self.chooseType == 4) {
									self.requstParams.busImageDTO.sideTwoImage = url;
								} else if (self.chooseType == 5) {
									self.requstParams.busImageDTO.tailImage = url;
								} else if (self.chooseType == 6) {
									self.requstParams.busImageDTO.sideOneImage = url;
								} else if (self.chooseType == 7) {
									self.requstParams.drivingLicense = url;
								} else if (self.chooseType == 8) {
									self.requstParams.registerFile = url;
								} else if (self.chooseType == 9) {
									self.requstParams.insuranceImage = url;
								}
							});
						}
					}
				});
			}
		},
		//弹窗确定
		confirm(type, e) {
			if (type == 1) {
				this.requstParams.busType = e[0].value;
			} else {
				this.requstParams.insuranceExpired = e.year + '-' + e.month + '-' + e.day;
			}
		},
		//提交验证
		onSubmit() {
			if(this.disabledClass === 'disabledName') return false
			if (this.requstParams.number == '') {
				return uni.showToast({
					title: '请输入车牌号',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.requstParams.brand == '') {
				return uni.showToast({
					title: '请输入车辆品牌',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.requstParams.busType == '') {
				return uni.showToast({
					title: '请选择车型',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.mIsChina != 0) {
				if (this.requstParams.insuranceExpired == '') {
					return uni.showToast({
						title: '请选择保险有效期',
						duration: 2000,
						icon: 'none'
					});
				}
			}
			if (this.requstParams.busImageDTO.headImage == '') {
				return uni.showToast({
					title: '请选择车头照片',
					duration: 2000,
					icon: 'none'
				});
			}

			if (this.mIsChina == 0) {
				if (this.requstParams.drivingLicense == '') {
					return uni.showToast({
						title: '请选择行驶证照片',
						duration: 2000,
						icon: 'none'
					});
				}
			} else {
				if (this.requstParams.registerFile == '') {
					return uni.showToast({
						title: '请选择注册文件照片',
						duration: 2000,
						icon: 'none'
					});
				}
				if (this.requstParams.insuranceImage == '') {
					return uni.showToast({
						title: '请选择行保险照片',
						duration: 2000,
						icon: 'none'
					});
				}
			}
			//接口调用
			this.submitCart();
		},
		//添加车辆调用
		submitCart() {
			console.log('requstParams', this.requstParams);
			busApplySave(this.requstParams).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: '添加车辆成功!',
						icon: 'none',
						success() {
							uni.reLaunch({
								url: '../add-result/index'
							});
						}
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.driver-box {
	overflow: hidden;
	min-height: 100vh;
	background-color: #ffffff;
}

.title-right {
	@include fs(28rpx, 400, #272727, 40rpx);
}

.driver-content {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;

	.content-head {
		flex: 1;
		display: flex;
		overflow-y: scroll;
		flex-direction: column;
		padding-bottom: 40rpx;

		.item-head {
			display: flex;
			align-items: center;
			flex-direction: row;
			padding: 0rpx 34rpx 0rpx 16rpx;
			border-bottom: 1rpx solid #f5f5f5;

			.star-txt {
				height: 25rpx;
				text-align: center;
				@include fs(32rpx, 400, #d6390a, 30rpx);
			}

			.label-txt {
				margin-left: 4rpx;
				@include fs(32rpx, 400, #272727, 45rpx);
			}

			/deep/ .u-input {
				border: none;
			}
		}

		.item-head-other {
			display: flex;
			flex-shrink: 0;
			flex-direction: column;
			padding: 0rpx 34rpx 0rpx 16rpx;

			.remark-txt {
				@include fs(28rpx, 400, #999999, 40rpx);
			}

			.choose-content {
				margin: 15rpx 0rpx;
				position: relative;
				background: #f5f5f5;
			}

			.choose-image-person {
				width: 160rpx;
				height: 160rpx;
				border-radius: 16rpx;
			}

			.choose-image-remove {
				right: -8rpx;
				top: -8rpx;
				width: 32rpx;
				height: 32rpx;
				z-index: 999;
				position: absolute;
			}

			.choose-image-drive {
				width: 224rpx;
				height: 126rpx;
				border-radius: 16rpx;
			}

			.choose-add {
				top: calc(50% - 26rpx);
				left: calc(50% - 26rpx);
				width: 52rpx;
				height: 52rpx;
				background: #dbdbdb;
				border-radius: 50%;
				position: absolute;
				text-align: center;
				@include fs(35rpx, 600, #ffffff, 48rpx);
			}

			.choose-identity-content {
				top: calc(50% - 46rpx);
				left: calc(50% - 100rpx);
				position: absolute;
				height: 92rpx;
				width: 200rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: space-between;

				.choose-identity-add {
					width: 52rpx;
					height: 52rpx;
					background: #dbdbdb;
					border-radius: 50%;
					text-align: center;
					@include fs(35rpx, 600, #ffffff, 48rpx);
				}

				.choose-identity-txt {
					@include fs(24rpx, 400, #999999, 28rpx);
				}

				.choose-star-txt {
					margin-top: 15rpx;
					@include fs(40rpx, 400, #d6390a, 20rpx);
				}
			}
		}
	}

	.remark-content {
		display: flex;
		flex-direction: row;
		padding: 28rpx 16rpx;
		border-top: 16rpx solid #f5f5f5;
		@include fs(28rpx, 400, #555555, 40rpx);
	}

	.content-bottom {
		height: 140rpx;
		display: flex;
		background: #ffffff;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		box-shadow: 0rpx -2rpx 10rpx rgba(184, 172, 128, 0.3);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.submit-audit {
			height: 90rpx;
			text-align: center;
			line-height: 40rpx;
			border-radius: 12rpx;
			width: calc(100% - 100rpx);
			background-color: #ffcc00;
			@include fs(32rpx, 400, #272727, 90rpx);
		}
	}
}
.disabledName{
	background-color: #999999 !important;
	color: #fff !important;
	opacity: 0.7;
}
</style>
