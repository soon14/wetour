<template>
	<view class="index-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed color="#272727" :title="detailData.inquiryStatusShow + '详情'">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>

		<view class="index-content" :style="{ 'max-height': `calc(100vh - ${statusBarHeight})`, height: `calc(100vh - ${statusBarHeight})` }">
			<view class="content-head">
				<!--行程报价-->
				<view class="head-item" style="padding-bottom: 0rpx;">
					<view class="flex-between">
						<view class="head-item_txt_title">{{ detailData.charteredCarType | busStatusFil }}</view>
						<view class="head-item_txt_state">{{ detailData.inquiryStatusShow }}</view>
					</view>
					<view class="head-item_txt_des">用车时间：{{ detailData.departureStartTime }}</view>
					<view class="flex-col">
						<view class="flex-start" @click="gomapApp(1)">
							<image class="head-item_nav_img" src="@/static/newImg/navigation_icon.png"></image>
							<view class="head-item_txt_des">{{ detailData.departureCity }}{{ detailData.departureAddress }}</view>
						</view>

						<view v-if="detailData.charteredCarType != 1" class="flex-start" @click="gomapApp(2)">
							<image class="head-item_nav_img" src="@/static/newImg/navigation_icon.png"></image>
							<view class="head-item_txt_des">{{ detailData.destinationCity }}{{ detailData.destinationAddress }}</view>
						</view>
					</view>
					<view class="head-item_txt_des">乘车人数：{{ detailData.passengerNumber + detailData.childNumber }} 人</view>
					<view @click="copys(detailData.orderNo)" class="head-item_txt_des flex-start">
						订单号：{{ detailData.orderNo }}
						<image src="@/static/newImg/copy.png" class="navigation-icon3"></image>
					</view>

					<view v-if="detailData.inquiryStatus == 4 || detailData.inquiryStatus == 5" class="head-item_txt_des">开始服务：{{ detailData.serviceStartTime }}</view>
					<view v-if="detailData.inquiryStatus == 5" class="head-item_txt_des">结束服务：{{ detailData.serviceEndTime }}</view>
					<view class="head-item_txt_price flex-between">
						<view class="flex-start">
							<text style="font-weight: 600;">指导价：{{ detailData.currency }}{{ detailData.guideRealAmount }}</text>
						</view>
						<view v-if="detailData.inquiryStatus != 0 && detailData.inquiryStatus != 1 && detailData.inquiryStatus != 7" class="flex-start">
							<text style="font-weight: 600;">我的报价：{{ detailData.currency }}{{ detailData.quoteRealAmount }}</text>
						</view>
					</view>
				</view>

				<!--行程信息  待报价||已报价-->
				<view v-if="detailData.inquiryStatus == 1 || detailData.inquiryStatus == 2" class="head-item">
					<view class="head-item_txt_title">行程信息</view>

					<view class="head-item_txt_des" v-for="(bus, index) in detailData.busTypeInfoVOList" :key="index">
						<text>{{ bus.busTypeTitle }}({{ bus.number }}辆)</text>
					</view>
					<view v-if="detailData.inquiryStatus == 1" class="head-item_input flex-start">
						<view>我的报价：{{detailData.currency}}</view>
						<u-input type="text" maxlength="10" v-model="orderInquiryQuote.quoteAmount" clearable placeholder="请输入报价金额" @input="inputChange">
							<!-- @input="checkNumber" -->
						</u-input>
					</view>
				</view>

				<!--行程信息  待服务-->
				<view v-else-if="detailData.inquiryStatus == 3" class="head-item" style="padding-bottom: 16rpx;">
					<view class="head-item_txt_title">行程信息</view>
					<view class="head-item_txt_des">联系人：{{ detailData.contactName }}</view>
					<view class="flex-start">
						<view @click="onCall(detailData.contactMobile)" class="head-item_txt_des">联系号码：{{ detailData.contactMobile }}</view>
						<image class="head-item_phone_img" src="@/static/newImg/phone_icon.png"></image>
					</view>
					<view class="flex-between" v-for="(bus, index) in detailData.busDriverVoList" :key="index">
						<view class="flex-start">
							<text style="margin-right: 12rpx;color: #272727" class="head-item_txt_des">{{ bus.busTypeTitle }}</text>
							<!-- 	<text v-if="bus.busDriverId" class="head-item_txt_des">
								{{bus.driverName}}{{bus.number}}</text> -->
							<div v-if="bus.busDriverId" class="flex-start">
								<text class="head-item_txt_des" style="overflow: hidden;text-overflow: ellipsis;">{{ bus.driverName }}</text>
								<text class="head-item_txt_des" style="margin-left: 10rpx;">{{ bus.number }}</text>
							</div>
						</view>
						<view class="flex-start" @click="open(index)">
							<image class="head-item_edit_img" src="@/static/img/edit.png"></image>
							<text class="head-item_txt_update">{{ bus.busDriverId ? '修改' : '绑定司机车辆' }}</text>
						</view>
					</view>
				</view>

				<!--行程信息  服务中||已服务||停止派单-->
				<view v-else-if="detailData.inquiryStatus == 4 || detailData.inquiryStatus == 5 || detailData.inquiryStatus == 6" class="head-item" style="padding-bottom: 16rpx;">
					<view class="head-item_txt_title">行程信息</view>
					<view class="head-item_txt_des">联系人：{{ detailData.contactName }}</view>
					<view class="flex-start">
						<view @click="onCall(detailData.contactMobile)" class="head-item_txt_des">联系号码：{{ detailData.contactMobile }}</view>
						<image class="head-item_phone_img" src="@/static/newImg/phone_icon.png"></image>
					</view>
					<view class="flex-between" v-for="(bus, index) in detailData.busDriverVoList" :key="index">
						<view class="flex-start">
							<text style="margin-right: 12rpx;color: #272727;font-weight: 600;" class="head-item_txt_des">{{ bus.busTypeTitle }}</text>
							<div class="flex-start">
								<text class="head-item_txt_des">{{ bus.driverName }}</text>
								<text class="head-item_txt_des" style="margin-left: 10rpx;">{{ bus.number }}</text>
							</div>
							<!-- <text class="head-item_txt_des">{{bus.driverName}}
								<text style="margin-: 10rpx;">{{bus.number}}</text> </text> -->
						</view>
					</view>
				</view>

				<view v-else class="head-item" style="padding-bottom: 16rpx;">
					<view class="head-item_txt_title">行程信息</view>
					<view class="head-item_txt_des">联系人：{{ detailData.contactName }}</view>
					<view class="flex-start">
						<view @click="onCall(detailData.contactMobile)" class="head-item_txt_des">联系号码：{{ detailData.contactMobile }}</view>
						<image class="head-item_phone_img" src="@/static/newImg/phone_icon.png"></image>
					</view>
					<view class="flex-between" v-for="(bus, index) in detailData.busTypeInfoVOList" :key="index">
						<text style="margin-right: 12rpx;color: #272727" class="head-item_txt_des">{{ bus.busTypeTitle }}({{ bus.number }}辆)</text>
					</view>
				</view>

				<!--行程备注-->
				<view v-if="detailData.orderRemark" class="head-item">
					<view class="head-item_txt_title">行程备注</view>
					<view class="head-item_txt_des" style="margin-bottom: 22rpx;">{{ detailData.orderRemark }}</view>
				</view>
			</view>

			<view class="content-bottom">
				<view class="flex-between" v-if="detailData.inquiryStatus == 1">
					<view class="content-bottom_btn content-bottom_txt1" @click="onQuote(1)">不接此单</view>
					<view class="content-bottom_btn content-bottom_txt2" @click="onQuote(2)">立即报价</view>
				</view>
				<view v-if="detailData.inquiryStatus == 1" class="content-bottom_offer" @click="onQuote(3)">按指导价报价</view>
				<!-- #FFCC00 -->
				<view
					v-if="detailData.inquiryStatus == 3"
					class="content-bottom_offer"
					:style="{ background: detailData.bindStatus == 0 ? '#EEEEEE' : '#FFCC00' }"
					@click="onStart"
				>
					立即出行
				</view>
				<view v-if="detailData.inquiryStatus == 4" class="content-bottom_offer" @click="onStop">结束服务</view>
			</view>
		</view>
		<!--不接此单-->
		<u-popup v-model="visible" mode="center" border-radius="16" @close="close">
			<view class="tipView">
				<view class="pop-title">不接此单</view>
				<!-- 	<u-input v-model="orderInquiryQuote.rejectQuoteReason" type="textarea" :border="true" :height="212"
					:auto-height="true" /> -->
				<view class="tipQuote">
					<textarea class="border-quote" v-model="orderInquiryQuote.rejectQuoteReason" placeholder="请输入拒绝接单的原因" maxlength="50"></textarea>
					<text class="txt-quote">{{ orderInquiryQuote.rejectQuoteReason ? orderInquiryQuote.rejectQuoteReason.length : 0 }}/50</text>
				</view>

				<view class="flex-between" style="margin-top: 20rpx;">
					<view class="cancelBtn" @click="close">取消</view>
					<view class="confirmBtn" @click="confirm(1, $event)">确定</view>
				</view>
			</view>
		</u-popup>

		<u-select value-name="id" label-name="label" mode="mutil-column" v-model="selectShow" :list="selectlist" @confirm="confirm(2, $event)" @cancel="close"></u-select>

		<tipView :dialogVisible.sync="tipVisible" v-if="tipVisible" @close="popClose" @confirm="popConfirm" :dialogData="dialogData" />
	</view>
</template>

<script>
import { orderinquiry, quoteInquiry, beginService, bindInquiry, updateBindInquiry, finishService, getDriverSelect, getBusSelect } from '@/api/index.js';

import navTo from '@/utils/navigation.js';
import tipView from '@/components/tipView.vue';

var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
export default {
	components: {
		tipView
	},
	data() {
		return {
			id: '',
			visible: false,
			detailData: {},
			selectindex: 0,
			selectlist: [],
			selectShow: false,
			orderInquiryQuote: {
				id: '', //询价单主键ID
				quoteAmount: '', //报价
				quoteStatus: '', //是否报价，0=拒绝报价，1=提交报价
				rejectQuoteReason: '' //拒绝接单原因
			},
			tipVisible: false,
			dialogData: {
				index: 0,
				btns: true,
				content: '报价成功',
				type: 'success',
				cancelButtonText: '返回', //取消按钮的文本内容
				confirmButtonText: '查看报价' //确定按钮的文本内容
			},
			statusBarHeight: statusBarHeight
		};
	},
	filters: {
		busStatusFil(val) {
			let map = {
				1: '日租',
				2: '接机',
				3: '送机',
				4: '单程'
			};
			return map[val];
		}
	},
	onLoad(e) {
		if (e.id != undefined) {
			this.id = e.id;
			this.getDetail(this.id);
		}
		this.getDriverSelect();
		this.getBusSelect();
	},
	methods: {
		copys(orderno) {
			uni.setClipboardData({
				data: orderno,
				success: () => {
					this.$u.toast('复制成功');
					console.log('success');
				}
			});
		},
		inputChange(e) {
			var that = this;
			let val = that.orderInquiryQuote.quoteAmount;
			val = val.match(/^\d*(\.?\d{0,2})/g)[0] || null;
			this.$nextTick(() => {
				that.orderInquiryQuote.quoteAmount = val;
				console.log(val, that.orderInquiryQuote.quoteAmount);
			});
		},
		// 打开的点击事件，传经纬度和地点名
		gomapApp(type) {
			let url = '';
			let name = '';
			let latitude = '';
			let longitude = '';
			if (type == 1) {
				name = this.detailData.departureAddress;
				latitude = this.detailData.departureLatitude;
				longitude = this.detailData.departureLongitude;
			} else {
				name = this.detailData.destinationAddress;
				latitude = this.detailData.destinationLatitude;
				longitude = this.detailData.destinationLongitude;
			}

			navTo(name, latitude, longitude, this.detailData.country == '中国' ? true : false);
		},

		onCall(phone) {
			uni.makePhoneCall({
				phoneNumber: '+' + phone
			});
		},
		popClose() {
			uni.navigateBack();
		},
		popConfirm() {
			this.getDetail(this.id);
		},
		open(index) {
			this.selectShow = true;
			this.selectindex = index;
		},
		close() {
			this.visible = false;
			this.selectShow = false;
		},
		confirm(type, event) {
			if (type == 1) {
				if (this.orderInquiryQuote.rejectQuoteReason) {
					this.postQuoteInquiry(1);
				} else {
					uni.showToast({
						title: '请输入拒绝原因',
						icon: 'none'
					});
				}
			} else {
				var busDriverVo = this.detailData.busDriverVoList[this.selectindex];
				if (busDriverVo.busDriverId) {
					var data = {
						busId: event[1].value,
						driverId: event[0].value,
						busType: busDriverVo.busType,
						busDriverId: busDriverVo.busDriverId
					};
					this.getUpdateBindInquiry(data);
				} else {
					var data = {
						busId: event[1].value,
						driverId: event[0].value,
						id: this.detailData.id,
						busType: busDriverVo.busType
					};
					this.getBindInquiry(data);
				}
			}
		},
		getDriverSelect() {
			getDriverSelect().then(res => {
				if (res.code == 0) {
					var driverList = [];
					res.data.forEach(item => {
						driverList.push({
							id: item.id,
							value: item.mobile,
							label: item.driverName
						});
					});
					this.selectlist.unshift(driverList);
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		getBusSelect() {
			getBusSelect().then(res => {
				if (res.code == 0) {
					var busList = [];
					res.data.forEach(item => {
						busList.push({
							id: item.id,
							value: item.brand,
							label: item.number
						});
					});
					this.selectlist.push(busList);
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		getBindInquiry(data) {
			var selt = this;
			bindInquiry(data).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: '绑定成功！',
						icon: 'none',
						success() {
							selt.getDetail(selt.id);
						}
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		getUpdateBindInquiry(data) {
			var selt = this;
			updateBindInquiry(data).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: '修改绑定成功！',
						icon: 'none',
						success() {
							selt.getDetail(selt.id);
						}
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		onQuote(type) {
			this.orderInquiryQuote.id = this.detailData.id;
			this.orderInquiryQuote.quoteStatus = type == 1 ? 0 : 1;
			if (type == 1) {
				this.visible = true;
			} else {
				if (type == 3) {
					this.orderInquiryQuote.quoteAmount = this.detailData.guideRealAmount;
				} else {
					if (!this.orderInquiryQuote.quoteAmount) {
						uni.showToast({
							title: '请输入报价金额',
							icon: 'none'
						});
						return;
					}

					if (this.orderInquiryQuote.quoteAmount < 0.01 || this.orderInquiryQuote.quoteAmount > this.detailData.guideRealAmount * 2) {
						uni.showToast({
							title: '报价最小为0.01或最大为' + this.detailData.guideRealAmount * 2,
							icon: 'none'
						});
						return;
					}
				}
				console.log('orderInquiryQuote', this.orderInquiryQuote);
				this.postQuoteInquiry(type);
			}
		},
		//开始服务
		onStart() {
			if (this.detailData.bindStatus == 0) {
				return;
			}
			beginService(this.detailData.id).then(res => {
				if (res.code == 0) {
					this.tipVisible = true;
					this.dialogData = {
						index: 2,
						btns: true,
						content: '服务开始',
						type: 'success',
						cancelButtonText: '返回', //取消按钮的文本内容
						confirmButtonText: '查看详情' //确定按钮的文本内容
					};
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					// setTimeout(() => {
					// 	uni.navigateBack()
					// }, 1000);
				}
			});
		},
		onStop() {
			var data = {
				id: this.detailData.id,
				orderNo: this.detailData.orderNo
			};
			finishService(data).then(res => {
				if (res.code == 0) {
					this.tipVisible = true;
					this.dialogData = {
						index: 3,
						btns: true,
						content: '提交成功',
						type: 'success',
						cancelButtonText: '返回', //取消按钮的文本内容
						confirmButtonText: '查看记录' //确定按钮的文本内容
					};
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					// setTimeout(() => {
					// 	uni.navigateBack()
					// }, 1000);
				}
			});
		},
		postQuoteInquiry(type) {
			quoteInquiry(this.orderInquiryQuote).then(res => {
				if (res.code == 0) {
					this.close();
					this.tipVisible = true;
					if (type == 1) {
						this.dialogData = {
							index: 3,
							btns: true,
							content: '提交成功',
							type: 'success',
							cancelButtonText: '返回', //取消按钮的文本内容
							confirmButtonText: '查看记录' //确定按钮的文本内容
						};
					} else {
						this.dialogData = {
							index: 1,
							btns: true,
							content: '报价成功！',
							type: 'success',
							cancelButtonText: '返回', //取消按钮的文本内容
							confirmButtonText: '查看报价' //确定按钮的文本内容
						};
					}
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 2000);
				}
			}).catch((msg)=>{
					this.close()
					uni.showToast({
						title: msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 2000);
				})
		},
		getDetail(id) {
			orderinquiry(id).then(res => {
				if (res.code == 0) {
					if (res.code == 0) {
						this.detailData = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
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
.tipView {
	width: 600rpx;
	padding: 60rpx 70rpx;
	text-align: center;

	.tipQuote {
		position: relative;
	}

	.txt-quote {
		bottom: 10rpx;
		right: 16rpx;
		position: absolute;
	}

	.border-quote {
		width: auto;
		height: 180rpx;
		text-align: start;
		border-radius: 8rpx;
		padding: 10rpx 16rpx;
		word-wrap: break-word;
		word-break: normal;
		border: 1rpx solid #dbdbdb;
		@include fs(32rpx, 400, #272727, 42rpx);
	}
}

.pop-title {
	margin-bottom: 30rpx;
	@include fs(36rpx, 400, #272727, 42rpx);
}

.navigation-icon3 {
	width: 28rpx;
	height: 28rpx;
	margin-left: 8rpx;
	margin-right: 8rpx;
}

.cancelBtn {
	width: 200rpx;
	height: 80rpx;
	background: #ffffff;
	border: 1rpx solid #bdbdbd;
	opacity: 1;
	border-radius: 16rpx;
	@include fs(28rpx, 400, #555555, 78rpx);
	text-align: center;
}

.confirmBtn {
	width: 200rpx;
	height: 80rpx;
	background: #ffcc00;
	border: 1rpx solid #ffcc00;
	opacity: 1;
	border-radius: 16rpx;
	@include fs(28rpx, 400, #272727, 78rpx);
	text-align: center;
}

.index-box {
	overflow: hidden;
	min-height: 100vh;
	background-color: #ffffff;
}

.title-right {
	@include fs(28rpx, 400, #272727, 40rpx);
}

.uni-nav-bar-text {
	width: 100%;
	text-align: center;
	background-color: #007aff;
}

.index-content {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;

	.content-head {
		flex: 1;
		// display: flex;
		overflow-y: scroll;
		padding: 16rpx 20rpx;
		// flex-direction: column;
		background-color: #f5f5f5;

		.head-item {
			background: #ffffff;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			padding: 17rpx 20rpx 17rpx 20rpx;

			.flex-col {
				display: inline-block;
			}

			&_txt_title {
				margin: 5rpx 0rpx;
				@include fs(32rpx, 600, #272727, 45rpx);
			}

			&_txt_state {
				margin: 5rpx 0rpx;
				@include fs(32rpx, 400, #ff8800, 45rpx);
			}

			&_txt_des {
				margin: 5rpx 0rpx;
				word-wrap: break-word;
				word-break: normal;
				@include fs(32rpx, 400, #555555, 45rpx);
			}

			&_txt_price {
				border-top: 1rpx solid #eeeeee;
				@include fs(32rpx, 400, #555555, 88rpx);
			}

			&_txt_update {
				margin: 5rpx 0rpx 5rpx 12rpx;
				@include fs(32rpx, 400, #999999, 45rpx);
			}

			&_nav_img {
				width: 20rpx;
				height: 24rpx;
				margin-right: 10rpx;
			}

			&_phone_img {
				width: 28rpx;
				height: 28rpx;
				margin-left: 10rpx;
			}

			&_edit_img {
				width: 30rpx;
				height: 30rpx;
			}

			&_input {
				height: 90rpx;
				background: #f5f5f5;
				padding: 0rpx 20rpx;
				border-radius: 12rpx;
				margin: 12rpx 0rpx 24rpx 0rpx;

				input {
					@include fs(32rpx, 400, #999999, 45rpx);
				}
			}

			&_btn {
				width: 150rpx;
				height: 60rpx;
				margin-top: 15rpx;
				margin-right: 20rpx;
				text-align: center;
				border-radius: 12rpx;
				border: 1rpx solid #dbdbdb;
				@include fs(24rpx, 400, #555555, 60rpx);
			}
		}
	}

	.content-bottom {
		width: 100%;
		padding: 6rpx 35rpx;
		background: #ffffff;
		box-shadow: 0rpx -2rpx 10rpx rgba(184, 172, 128, 0.3);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		&_btn {
			flex: 1;
			margin: 15rpx;
			text-align: center;
			border-radius: 8rpx;
			background: #ffffff;
		}

		&_txt1 {
			border: 1rpx solid #dbdbdb;
			@include fs(28rpx, 400, #555555, 80rpx);
		}

		&_txt2 {
			border: 1rpx solid #ff8800;
			@include fs(28rpx, 400, #ff8800, 80rpx);
		}

		&_offer {
			text-align: center;
			background: #ffcc00;
			border-radius: 12rpx;
			margin: 5rpx 15rpx 14rpx 15rpx;
			@include fs(32rpx, 400, #272727, 80rpx);
		}
	}
}
</style>
