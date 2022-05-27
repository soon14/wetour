<template>
	<view class="account-box">
		<view class="head">
			<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="结算信息" color="#272727">
				<navigator open-type="navigateBack" slot="left" hover-class="none">
					<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;"></image>
				</navigator>
			</uni-nav-bar>
			<view class="head-title flex-between">
				<text class="txt-des" >订单数：{{ applyList.length }}个</text>
				<text class="txt-des2">
					结算金额：<text style="font-weight: bold;">{{ applyList[0].currency }}{{ parseFloat(price).toFixed(2) }} </text>
				</text>
			</view>
		</view>

		<view class="main">
			<view class="main-container">
				<view class="head-item" style="margin-top: 16rpx;">
					<text class="txt-des" style="margin-left: 16rpx;">方式：</text>
					<view class="flex-start">
						<view class="flex-start" style="margin: 0rpx 8rpx;" @click="onPayType(1)">
							<image :src="settleRecordRequest.settleType == 1 ? '/static/img/select-active.png' : '/static/img/select.png'" class="img-check"></image>
							<text class="pay-txt">大陆银行卡</text>
						</view>
						<view class="flex-start" style="margin: 0rpx 32rpx;" @click="onPayType(2)">
							<image :src="settleRecordRequest.settleType == 2 ? '/static/img/select-active.png' : '/static/img/select.png'" class="img-check"></image>
							<text class="pay-txt">Zelle</text>
						</view>
					</view>
				</view>
				<view class="head-item" v-show="settleRecordRequest.settleType == 1">
					<text class="star-txt">*</text>
					<text class="txt-des">持卡人姓名：</text>
					<u-input
						type="text"
						v-model="settleRecordRequest.bankOwnerName"
						clearable
						placeholder="请输入持卡人姓名"
						maxlength="20"
						@input="inputNameChange(1, $event)"
					></u-input>
				</view>
				<view class="head-item" v-show="settleRecordRequest.settleType == 1">
					<text class="star-txt">*</text>
					<text class="txt-des">开户行：</text>
					<u-input maxlength="30" v-model="settleRecordRequest.bankName" clearable @input="inputBankNameChange" placeholder="请输入开户银行"></u-input>
				</view>
				<view class="head-item" v-show="settleRecordRequest.settleType == 1">
					<text class="star-txt">*</text>
					<text class="txt-des">银行卡号：</text>
					<u-input type="number" placeholder="请输入银行卡卡号" maxlength="19" v-model="settleRecordRequest.settleAccount" clearable></u-input>
				</view>

				<view class="head-item" v-show="settleRecordRequest.settleType == 2">
					<text class="star-txt">*</text>
					<text class="txt-des">姓名：</text>
					<u-input
						type="text"
						v-model="settleRecordRequest.zelleName"
						maxlength="20"
						clearable
						placeholder="请输入Zelle姓名"
						@input="inputNameChange(2, $event)"
					></u-input>
				</view>

				<view class="head-item" v-show="settleRecordRequest.settleType == 2">
					<text class="star-txt">*</text>
					<text class="txt-des">Zelle账号：</text>
					<u-input maxlength="20" placeholder="请输入Zelle账号" v-model="settleRecordRequest.settleAccount" clearable></u-input>
				</view>

				<view class="head-image">
					<view class="flex-start">
						<text class="star-txt">*</text>
						<text class="label-txt">上传发票</text>
					</view>
					<text class="txt-remark">上传图片小于1MB，建议比例16:9，格式png/jpg/pdf</text>
					<u-upload
						ref="uUpload"
						:width="statusImageWv"
						height="126"
						max-count="5"
						:size-type="['compressed']"
						:custom-btn="true"
						style="margin-top: 20rpx;"
						:max-size="1 * 1024 * 1024"
						:auto-upload="false"
						@on-remove="onChooseRemove"
						@on-choose-complete="onChooseComplete"
					>
						<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150"><text class="slot-btn-add">+</text></view>
					</u-upload>
				</view>
				<view class="remark-content">
					<text>注：</text>
					<view class="remark-content-right">
	<!-- 					<text>1.请使用大陆支付宝账号</text> -->
						<text>1.发票最多上传5张</text>
						<text>2.申请结算后，预计处理时间为最多5个工作日</text>
						<text>3.每周只能结算一次，请谨慎操作</text>
						<text>4.发票金额及订单数请于选中后的金额与订单数对应</text>
						<text>5.发票文字及对应照片请保持清晰准确</text>
						<text>6.发票仅支持jpg、png、pdf格式，且大小不超过1Mb</text>
					</view>
				</view>
			</view>
		</view>
		<view class="content-bottom">
			<text @click="onStep" class="btn-step">上一步</text>
			<text @click="onApply" class="btn-submit">提交申请</text>
		</view>
		<tipView :dialogVisible.sync="tipVisible" v-if="tipVisible" @close="popClose" @confirm="popConfirm" :dialogData="dialogData" />
	</view>
</template>
<script>
import { upload } from '@/utils/updataoss.js';
import tipView from '@/components/tipView.vue';
import { mapGetters } from 'vuex';
import { insertSettleRecord } from '@/api/account.js';
import { cardBank } from '@/utils/regular';
var statusImageWv = (uni.getSystemInfoSync().windowWidth - 70) / 3 + 'px';
export default {
	components: {
		tipView
	},
	computed: {
		...mapGetters(['skipData', 'accountData'])
	},
	data() {
		return {
			price: 0,
			imagewv: 218,
			applyList: [],
			uploadList: [],
			tipVisible: false,
			statusImageWv: statusImageWv,
			settleRecordRequest: {
				bankName: '', //开户行
				bankOwnerName: '', //持卡人姓名
				settleAccount: '', //结算账号
				invoiceImage: '', //发票图片，多张以逗号隔开
				requestDTOList: [], //申请结算的订单信息
				settleType: 1, //结算方式，1=大陆银行卡，2=zelle，3=支付宝，4=微信
				zelleName: '' //Zelle认证的姓名
			},
			dialogData: {
				btns: true,
				type: 'success',
				content: '提交成功',
				cancelButtonText: '返回首页',
				confirmButtonText: '查看记录'
			}
		};
	},
	onLoad(options) {
		console.log('statusImageWv', statusImageWv);
		if (this.accountData.bankName != undefined) {
			this.settleRecordRequest = {
				bankName: this.accountData.bankName, //开户行
				bankOwnerName: this.accountData.bankOwnerName, //持卡人姓名
				settleAccount: this.accountData.settleAccount, //结算账号
				invoiceImage: '', //发票图片，多张以逗号隔开
				requestDTOList: [], //申请结算的订单信息
				settleType: 1, //结算方式，1=大陆银行卡，2=zelle，3=支付宝，4=微信
				zelleName: '' //Zelle认证的姓名
			};
		}
		if (this.skipData[0].id != undefined) {
			this.applyList = this.skipData;
			var requestList = [];
			this.applyList.forEach(item => {
				requestList.push({
					inquiryId: item.id,
					orderNo: item.orderNo
				});
				this.price += item.quoteRealAmount;
			});
			this.settleRecordRequest.requestDTOList = requestList;
		}
	},
	methods: {
		inputNameChange(type, e) {
			console.log('type', type);
			console.log('e', e);
			var that = this;
			this.$nextTick(() => {
				if (type == 1) {
					that.settleRecordRequest.bankOwnerName = e.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, '');
				} else {
					that.settleRecordRequest.zelleName = e.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, '');
				}
			});
		},
		inputBankNameChange(e) {
			var that = this;
			this.$nextTick(() => {
				that.settleRecordRequest.bankName = e.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, '');
			});
		},
		onWarn() {
			uni.navigateTo({
				url: '/pages/account/account_warn/index'
			});
		},
		onChooseRemove(index, lists, name){
			this.uploadList.splice(index, 1)
		},
		onChooseComplete(lists) {
			//console.log("lists", lists)
			// upload(lists[lists.length - 1].url).then(url => {
			// 	this.uploadList.push(url)
			// }).catch((err) => {
			// 	this.$refs.uUpload.uploadError(lists.length - 1, err);
			// })
			console.log('lists', lists);
			this.uploadList = [];
			lists.forEach(list => {
				upload(list.url)
					.then(url => {
						this.uploadList.push(url);
					})
					.catch(err => {
						this.$refs.uUpload.uploadError(lists.length - 1, err);
					});
			});
		},
		popClose() {
			this.tipVisible = false;
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		popConfirm() {
			this.tipVisible = false;
			uni.navigateTo({
				url: '/pages/account/record-account/index'
			});
		},
		onPayType(type) {
			this.settleRecordRequest.settleType = type;
		},
		onStep() {
			uni.navigateBack();
		},
		onApply() {
			console.log('settleRecordRequest', this.settleRecordRequest);
			if (this.settleRecordRequest.settleType == 1) {
				if (!this.settleRecordRequest.bankOwnerName) {
					this.$u.toast('请输入持卡人姓名');
					return;
				}
				if (!this.settleRecordRequest.bankName) {
					this.$u.toast('请输入开户银行');
					return;
				}
				if (!this.settleRecordRequest.settleAccount) {
					this.$u.toast('请输入银行卡卡号');
					return;
				}
				if (this.settleRecordRequest.settleAccount.length < 15) {
					this.$u.toast('请输入正确的银行卡卡号');
					return;
				}
			} else {
				if (!this.settleRecordRequest.zelleName) {
					this.$u.toast('请输入Zelle姓名');
					return;
				}
				if (!this.settleRecordRequest.settleAccount) {
					this.$u.toast('请输入Zelle账号');
					return;
				}
			}
			if (this.uploadList.length == 0) {
				this.$u.toast('请上传发票');
				return;
			}
			var imStr = '';
			this.uploadList.forEach(item => {
				imStr += item + ',';
			});
			this.settleRecordRequest.invoiceImage = imStr.substring(0, imStr.length - 1);
			console.log("settleRecordRequest",this.settleRecordRequest);
			insertSettleRecord(this.settleRecordRequest).then(res => {
				this.$store.dispatch('user/setAccountData', {
					bankName: this.settleRecordRequest.bankName, //开户行
					bankOwnerName: this.settleRecordRequest.bankOwnerName, //持卡人姓名
					settleAccount: this.settleRecordRequest.settleAccount //结算账号
				});
				if (res.code === 0) {
					this.tipVisible = true;
				} else {
					this.$u.toast(res.msg);
				}
			});
		}
	},
	onUnload() {
		this.$store.dispatch('user/setSkipData', {});
	}
};
</script>

<style scoped lang="scss">
.account-box {
	overflow: hidden;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
}

.img-check {
	width: 36rpx;
	height: 36rpx;
}

.star-txt {
	height: 25rpx;
	text-align: center;
	@include fs(32rpx, 400, #d6390a, 30rpx);
}

.title-right {
	@include fs(28rpx, 400, #272727, 40rpx);
}

.txt-des {
	width: 200rpx;
	@include fs(32rpx, 400, #272727, 45rpx);
}

.txt-des2 {
	@include fs(32rpx, 400, #272727, 45rpx);
}

.star-txt {
	height: 25rpx;
	text-align: center;
	@include fs(40rpx, 400, #d6390a, 30rpx);
}

.label-txt {
	margin-left: 4rpx;
	@include fs(32rpx, 400, #272727, 45rpx);
}

.txt-remark {
	margin-top: 6rpx;
	@include fs(28rpx, 400, #999999, 40rpx);
}

.pay-txt {
	margin-left: 10rpx;
	@include fs(32rpx, 400, #272727, 45rpx);
}

.head {
	display: flex;
	flex-direction: column;

	.head-title {
		height: 90rpx;
		padding: 0rpx 16rpx;
		background: #ffffff;
	}
}

.main {
	flex: 1;
	z-index: 88;
	overflow-y: scroll;
	position: relative;
	background-color: #f5f5f5;
}

.main-container {
	top: 0;
	left: 0;
	right: 0;
	bottom: 10;
	z-index: 666;
	display: flex;

	padding: 0rpx 16rpx;
	position: absolute;
	flex-direction: column;

	.head-item {
		display: flex;
		height: 90rpx;
		padding: 0rpx 16rpx;
		align-items: center;
		flex-direction: row;
		background: #ffffff;
		border-bottom: 1rpx solid #eeeeee;
	}

	.head-image {
		display: flex;
		padding: 21rpx 16rpx;
		flex-direction: column;
		background-color: #ffffff;

		.slot-btn {
			width: 224rpx;
			height: 126rpx;
			position: relative;
			border-radius: 8rpx;
			background: #f5f5f5;
		}

		.slot-btn__hover {
			background: #f5f5f5;
		}

		.slot-btn-add {
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
	}

	.remark-content {
		display: flex;
		margin-top: 16rpx;
		flex-direction: row;
		padding: 28rpx 16rpx;
		background-color: #ffffff;
		@include fs(28rpx, 400, #555555, 40rpx);

		.remark-content-right {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
	}
}

.content-bottom {
	display: flex;
	height: 140rpx;
	min-height: 140rpx;
	background: #ffffff;
	flex-direction: row;
	justify-content: space-between;
	padding: 41rpx 35rpx 19rpx 35rpx;
	box-shadow: 0rpx -2rpx 10rpx rgba(184, 172, 128, 0.3);
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	.btn-step {
		flex: 1;
		height: 80rpx;
		text-align: center;
		background: #ffffff;
		margin-right: 20rpx;
		border-radius: 12rpx;
		border: 1rpx solid #dbdbdb;
		@include fs(28rpx, 400, #555555, 80rpx);
	}

	.btn-submit {
		flex: 1;
		height: 80rpx;
		margin-left: 20rpx;
		text-align: center;
		background: #ffcc00;
		border-radius: 12rpx;
		@include fs(28rpx, 400, #555555, 80rpx);
	}
}

/deep/ .uni-radio-input {
	width: 32rpx;
	height: 32rpx;
	border-color: #f5f5f5 !important;
	background-color: #ffffff !important;
}

/deep/ .uni-radio-input-checked:before {
	width: 42rpx;
	height: 42rpx;
	border-radius: 50%;
	text-align: center;
	line-height: 42rpx;
	color: #272727 !important;
	background-color: #ffcc00 !important;
}
</style>
