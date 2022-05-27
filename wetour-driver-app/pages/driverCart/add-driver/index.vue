<!-- 添加司机 -->
<template>
	<view class="driver-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed color="#272727" :title="requstParams.id ? '修改司机' : '添加司机'">
			<view v-if="isSkip == 0" @click="onSkip" class="title-right" slot="right">跳过</view>
			<image @click="onBack" slot="left" src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;"></image>
		</uni-nav-bar>
		<view class="driver-content" :style="{ 'max-height': `calc(100vh - ${statusBarHeight})`, height: `calc(100vh - ${statusBarHeight})` }">
			<view class="content-head">
				<!-- 手机-->
				<view class="item-head" style="min-height: 90rpx;">
					<text class="star-txt">*</text>
					<text class="label-txt">手机：</text>
					<text v-if="requstParams.id">{{ requstParams.mobile }}</text>
					<u-input v-else v-model="requstParams.mobile" clearable placeholder="请输入手机号" maxlength="20" type="number"></u-input>
				</view>
				<!-- 姓名-->
				<view class="item-head" style="min-height: 90rpx;">
					<text class="star-txt">*</text>
					<text class="label-txt ">姓名：</text>
					<u-input v-model.trim="requstParams.driverName" maxlength="20" clearable placeholder="请输入姓名" @input="handeChangeName($event)"></u-input>
				</view>
				<!-- 性别-->
				<view class="item-head" style="min-height: 90rpx;">
					<text class="star-txt">*</text>
					<text class="label-txt ">性别：</text>
					<text v-if="requstParams.id">{{ requstParams.gender | genderstatusFil }}</text>
					<u-input v-else :value="requstParams.gender | genderstatusFil" clearable placeholder="请选择性别" disabled @click="clickItem(1)"></u-input>

					<image v-if="!requstParams.id" src="@/static/img/right.png" style="width: 12rpx;height: 24rpx;"></image>
				</view>
				<!-- 驾照-->
				<view class="item-head" style="min-height: 90rpx;padding: 0rpx 16rpx 0rpx 16rpx;">
					<text class="star-txt">*</text>
					<text class="label-txt ">驾照：</text>
					<u-input :disabled="true" v-model="requstParams.driverLicenseExpired" clearable placeholder="请选择驾照过期时间" disabled @click="clickItem(2)"></u-input>
					<image src="@/static/img/right.png" mode="aspectFit" style="width: 12rpx;height: 24rpx;"></image>
					<u-checkbox @change="onChageLicenseExpired" v-model="longcheck">长期</u-checkbox>
				</view>
				<!-- 微信-->
				<view class="item-head" style="min-height: 90rpx;">
					<text class="star-txt" style="visibility: hidden;">*</text>
					<text class="label-txt ">微信：</text>
					<u-input v-model="requstParams.weixin" clearable maxlength="20" placeholder="请输入微信号"></u-input>
				</view>
				<!-- 个人照片-->
				<view class="item-head-other">
					<view class="item-head" style="height: 72rpx; border: none;padding:0rpx">
						<text class="star-txt">*</text>
						<text class="label-txt ">个人照片：</text>
					</view>
					<text class="remark-txt">上传图片小于1MB，建议比例1:1，格式png/jpg</text>
					<view @click="clickItem(3)" class="choose-content choose-image-person">
						<image v-if="requstParams.driverImage" @click.stop="requstParams.driverImage = ''" src="@/static/img/close_icon.png" class="choose-image-remove"></image>

						<image
							class="choose-image-person"
							mode="aspectFit"
							v-if="requstParams.driverImage"
							:src="requstParams.driverImage"
							@click="previewImage(requstParams.driverImage)"
						></image>
						<text v-else class="choose-add">+</text>
					</view>
				</view>

				<!-- 身份证照片-->
				<view v-if="mIsChina == 0" class="item-head-other">
					<view class="item-head" style="height: 72rpx; border: none;padding:0rpx">
						<text class="star-txt">*</text>
						<text class="label-txt ">身份证照片：</text>
					</view>
					<text class="remark-txt">上传图片小于1MB，建议比例16:9，格式png/jpg</text>
					<view class="flex-start">
						<view @click="clickItem(4)" class="choose-content choose-image-drive">
							<image
								v-if="requstParams.frontIdentificationImage"
								@click.stop="requstParams.frontIdentificationImage = ''"
								src="@/static/img/close_icon.png"
								class="choose-image-remove"
							></image>
							<image
								class="choose-image-drive"
								v-if="requstParams.frontIdentificationImage"
								mode="aspectFit"
								:src="requstParams.frontIdentificationImage"
								@click="previewImage(requstParams.frontIdentificationImage)"
							></image>

							<view class="choose-identity-content" v-else>
								<text class="choose-identity-add">+</text>
								<text class="choose-identity-txt">身份证正面</text>
							</view>
						</view>
						<view @click="clickItem(5)" style="margin-left: 23rpx;" class="choose-content choose-image-drive">
							<image
								v-if="requstParams.backIdentificationImage"
								@click.stop="requstParams.backIdentificationImage = ''"
								src="@/static/img/close_icon.png"
								class="choose-image-remove"
							></image>
							<image
								class="choose-image-drive"
								v-if="requstParams.backIdentificationImage"
								mode="aspectFit"
								:src="requstParams.backIdentificationImage"
								@click="previewImage(requstParams.backIdentificationImage)"
							></image>
							<view class="choose-identity-content" v-else>
								<text class="choose-identity-add">+</text>
								<text class="choose-identity-txt">身份证反面</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 驾驶证照片-->
				<view class="item-head-other" style="margin-bottom: 20rpx;">
					<view class="item-head" style="height: 72rpx; border: none;padding:0rpx">
						<text class="star-txt">*</text>
						<text class="label-txt ">驾驶证照片：</text>
					</view>
					<text class="remark-txt">上传图片小于1MB，建议比例16:9，格式png/jpg</text>
					<view @click="clickItem(6)" class="choose-content choose-image-drive">
						<image
							v-if="requstParams.driverLicenseImage"
							@click.stop="requstParams.driverLicenseImage = ''"
							src="@/static/img/close_icon.png"
							class="choose-image-remove"
						></image>
						<image
							class="choose-image-drive"
							v-if="requstParams.driverLicenseImage"
							:src="requstParams.driverLicenseImage"
							mode="aspectFit"
							@click="previewImage(requstParams.driverLicenseImage)"
						></image>
						<text v-else class="choose-add">+</text>
					</view>
				</view>
				<view class="remark-content">
					<text>注：</text>
					<view style="display: flex;flex-direction: column;">
						<text>在没有添加任何司机车辆的情况下，无法接到用车订单</text>
						<text>请保证您填写信息的真实性，这样可以提高审核通过率</text>
						<text>请保证您上传图片的清晰度，这样也可以提高审核通过率</text>
						<text>手机号请使用{{ userInfo.country }}的号码</text>
						<text>照片支持jpg，jpeg，png格式，且需要小于1MB</text>
						<text>信息仅用于支持微途伙伴服务用户，不对外展示</text>
					</view>
				</view>
			</view>

			<view class="content-bottom"><text @click="onSubmit" class="submit-audit" :class="disabledClass">提交审核</text></view>
		</view>
		<u-select v-model="showGender" mode="single-column" :list="list" @confirm="confirm(1, $event)"></u-select>
		<u-picker mode="time" v-model="showDate" :params="dateParams" :safe-area-inset-bottom="true" @confirm="confirm(2, $event)"></u-picker>
	</view>
</template>

<script>
import { driverApplySave, driverApplyUpdateById } from '@/api/drivercart.js';
import { mapGetters } from 'vuex';
import { genderList, genderstatusList } from '@/utils/helper.js';
import { upload } from '@/utils/updataoss.js';

var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
import { phoneYz } from '@/utils/regular';
export default {
	computed: {
		...mapGetters(['skipData', 'userInfo', 'prefixMobile']),
		mIsChina() {
			console.log('sss', this.userInfo);
			return this.userInfo.country == '中国' ? 0 : 1;
		},
		disabledClass() {
			console.log(this.requstParams.id, !this.requstParams.id, '--------------');
			if (!this.requstParams.id) {
				return '';
			}

			var prefix = this.skipData.mobile.substring(0, this.prefixMobile.length);
			if (prefix === this.prefixMobile) {
				this.skipData.mobile = this.skipData.mobile.replace(prefix, '');
			}
			
			var date = this.skipData.driverLicenseExpired.split('-');
			if (date[0] > 2099) {
				this.skipData.driverLicenseExpired = '';
			}

			console.log('skipData===', this.skipData);
			console.log('requstParams===', this.requstParams);

			// requstParams
			let arr = [
				'mobile',
				'driverName',
				'gender',
				'driverLicenseExpired',
				'weixin',
				'driverImage',
				'frontIdentificationImage',
				'backIdentificationImage',
				'driverLicenseImage'
			];
			let className = 'disabledName';
			arr.forEach(item => {
				if (this.requstParams[item] != this.skipData[item]) className = '';
			});
			return className;
		}
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
				mobile: '', //司机手机
				weixin: '', //微信号
				gender: '1', //性别 1男 2女
				driverName: '', //司机姓名
				driverImage: '', //个人照片
				driverLicenseImage: '', //驾驶证照片
				driverLicenseExpired: '', //驾照过期日期
				identificationImage: '', // 身份证护照照片(正,反)
				frontIdentificationImage: '', //正
				backIdentificationImage: '' //反
			},
			isSkip: 0,
			chooseImage: 0,
			showDate: false,
			list: genderList,
			longcheck: false,
			showGender: false,
			statusBarHeight: statusBarHeight
		};
	},
	filters: {
		genderstatusFil(val) {
			return genderstatusList[val];
		}
	},
	onLoad(options) {
		if (options.isSkip != undefined) {
			this.isSkip = options.isSkip;
		}
		if (this.skipData.driverLicenseExpired != undefined) {
			var date = this.skipData.driverLicenseExpired.split('-');
			// this.requstParams = Object.assign({},this.skipData)

			this.requstParams = JSON.parse(JSON.stringify(this.skipData));
			var prefix = this.requstParams.mobile.substring(0, this.prefixMobile.length);
			if (prefix === this.prefixMobile) {
				this.requstParams.mobile = this.requstParams.mobile.replace(prefix, '');
			}
			this.$set(this.requstParams, 'driverId', this.skipData.id);

			console.log('sss==>', this.requstParams);

			if (date[0] > 2099) {
				this.longcheck = true;
				this.requstParams.driverLicenseExpired = '';
			}
		}
	},
	created() {
		var self = this;
		// 监听从裁剪页发布的事件，获得裁剪结果
		uni.$on('uAvatarCropper', path => {
			console.log('path===>', path);
			upload(path).then(url => {
				if (this.chooseImage == 3) {
					self.requstParams.driverImage = url; //个人照片
				}
			});
		});
	},
	onUnload() {
		this.$store.dispatch('user/setSkipData', {});
	},
	methods: {
		handeChangeName(e) {
			console.log(e, '-------');
			// let name = e.target.value
			// let val =  e.target.value.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g,'');
			let val = e.replace(/[^A-Za-z\u4e00-\u9fa5 ]/g, '');
			this.$nextTick(() => {
				// this.requstParams.driverName = e.replace(/^[\u4e00-\u9fa5a-zA-Z ]$/g,'');
				this.requstParams.driverName = val;
			});
		},
		previewImage(url) {
			console.log('url', url);
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
		//长期
		onChageLicenseExpired(value) {
			this.requstParams.driverLicenseExpired = '';
		},
		//点击Item
		clickItem(index) {
			//选择性别
			if (index == 1) {
				this.showGender = true;
			}
			//请选择驾照过期时间
			else if (index == 2 && !this.longcheck) {
				this.showDate = true;
			}
			//个人照片||驾驶证照片
			else if (index == 3 && this.requstParams.driverImage == '') {
				this.chooseImage = index;
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: index == 3 ? 160 : 224,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: index == 3 ? 160 : 224,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg'
					}
				});
			} else if (
				(index == 4 && this.requstParams.frontIdentificationImage == '') ||
				(index == 5 && this.requstParams.backIdentificationImage == '') ||
				(index == 6 && this.requstParams.driverLicenseImage == '')
			) {
				var self = this;
				self.chooseImage = index;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						console.log('path===>', res);
						console.log('path===>大小', res.tempFiles[0].size / 1024 / 1024);
						if (res.tempFiles[0].size > 1 * 1024 * 1024) {
							uni.showToast({
								title: '上传的图片大小不超过1M',
								icon: 'none'
							});
						} else {
							upload(res.tempFilePaths[0]).then(url => {
								if (self.chooseImage == 4) {
									self.requstParams.frontIdentificationImage = url; //身份照正
								} else if (self.chooseImage == 5) {
									self.requstParams.backIdentificationImage = url; //身份照反
								} else if (self.chooseImage == 6) {
									self.requstParams.driverLicenseImage = url; //驾驶证照
								}
							});
						}
					}
				});
			}
		},
		//点击跳转
		onSkip() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		//点击确定
		confirm(type, e) {
			if (type == 1) {
				this.requstParams.gender = e[0].value;
			} else {
				this.requstParams.driverLicenseExpired = e.year + '-' + e.month + '-' + e.day;
			}
		},
		//点击提交
		onSubmit() {
			if (this.disabledClass === 'disabledName') return false;
			if (this.requstParams.mobile == '') {
				return uni.showToast({
					title: '请输入手机号',
					duration: 2000,
					icon: 'none'
				});
			}

			if (!phoneYz(this.prefixMobile + this.requstParams.mobile, this.userInfo.country)) {
				return uni.showToast({
					title: '请输入正确手机号',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.requstParams.driverName == '') {
				return uni.showToast({
					title: '请输入名字',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.requstParams.gender == '') {
				return uni.showToast({
					title: '请选择性别',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.requstParams.driverLicenseExpired == '' && !this.longcheck) {
				return uni.showToast({
					title: '请选择驾照过期时间',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.requstParams.driverImage == '') {
				return uni.showToast({
					title: '请选择个人照片',
					duration: 2000,
					icon: 'none'
				});
			}
			if (this.mIsChina == 0) {
				if (this.requstParams.frontIdentificationImage == '') {
					return uni.showToast({
						title: '请选择身份证正面照片',
						duration: 2000,
						icon: 'none'
					});
				}
				if (this.requstParams.backIdentificationImage == '') {
					return uni.showToast({
						title: '请选择身份证反面照片',
						duration: 2000,
						icon: 'none'
					});
				}
			}
			if (this.requstParams.driverLicenseImage == '') {
				return uni.showToast({
					title: '请选择驾驶证照片',
					duration: 2000,
					icon: 'none'
				});
			}
			this.submitSave();
		},
		//新增司机
		submitSave() {
			console.log('submitSave');
			if (this.longcheck) {
				var date = new Date();
				var month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() : date.getMonth();
				var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				this.requstParams.driverLicenseExpired = date.getFullYear() + 100 + '-' + month + '-' + day;
			}
			let obj = Object.assign({}, this.requstParams);
			obj.mobile = this.prefixMobile + this.requstParams.mobile;
			obj.identificationImage = this.requstParams.frontIdentificationImage + ',' + this.requstParams.backIdentificationImage; // 身份证护照照片(正,反)
			driverApplySave(obj)
				.then(res => {
					console.log('ss==', res);
					if (res.code == 0) {
						uni.showToast({
							title: '添加司机成功',
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
				})
				.catch(e => {
					console.log('e==', e);
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

	.content-head {
		flex: 1;
		display: flex;
		overflow-y: scroll;
		flex-direction: column;
		background-color: #ffffff;

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

			/deep/ .u-checkbox__icon-wrap {
				margin-left: 16rpx;
				border-radius: 50% !important;
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

			.choose-image-remove {
				right: -8rpx;
				top: -8rpx;
				width: 32rpx;
				height: 32rpx;
				z-index: 999;
				position: absolute;
			}

			.choose-image-person {
				width: 160rpx;
				height: 160rpx;
				min-height: 160rpx;
				border-radius: 16rpx;
			}

			.choose-image-drive {
				width: 224rpx;
				height: 126rpx;
				min-height: 126rpx;
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
			}
		}

		.remark-content {
			display: flex;
			flex-direction: row;
			padding: 28rpx 16rpx;
			border-top: 16rpx solid #f5f5f5;
			@include fs(28rpx, 400, #555555, 40rpx);
		}
	}
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
.disabledName {
	background-color: #999999 !important;
	color: #fff !important;
	opacity: 0.7;
}
</style>
