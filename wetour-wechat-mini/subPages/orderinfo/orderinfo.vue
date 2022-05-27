<template>
	<view class="orderInfo-box">
		<uni-nav-bar backgroundColor="fff" statusBar fixed title="订单填写" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="orderInfo-container">
			<!-- -->
			<view v-if="orderData.length > 0 && orderData[0].serverTime" class="order-box flex-start" @click="goOrderDetail">您有一个订单将在{{ countDown }}后关闭，点击查看</view>
			<view class="form-data">
				<view class="order-data">
					<!-- charteredCarType  包车类型 1日租 2接机 3 送机 4单车 -->
					<!-- charteredCarRange 1市内包车 2周边包车-->
					<view class="order-title flex-start">
						<!-- 东京市内包车 -->
						<view style="font-weight: 600;">{{ orderTitle }}</view>
						<view v-if="orderInfo.flightNumber" class="flex-start flightNumber">
							<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/aircraftImg2.png" style="width: 32rpx;height: 32rpx;"></image>
							<view class="flightNumber-text">{{ orderInfo.flightNumber }}</view>
						</view>
					</view>
					<view class="order-time flex-start">
						<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/orderTime.png" class="order-icon"></image> -->
						<view class="order-time-text">{{ parseTime(orderInfo.departureStartTime, '{m}月{d}日 {h}:{i}') }}</view>
						<view class="order-time-tip" style="line-height: 36rpx;">{{ orderInfo.charteredCarType != 2 ? '当地时间' : '落地时间' }}</view>
					</view>
					<view class="order-address flex-start">
						<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/orderAddress.png" class="order-icon"></image> -->
						<view class="order-address-text">{{ orderInfo.departureAddress }}</view>
					</view>
					<view class="order-address flex-start" v-if="orderInfo.charteredCarType != 1">
						<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/orderAddress.png" class="order-icon"></image> -->
						<view class="order-address-text">{{ orderInfo.destinationAddress }}</view>
					</view>
				</view>
				<view class="form-item flex-between mrn15" style="border-bottom: 1rpx solid #DFDFDF;">
					<view class="form-label">成人</view>
					<view class="form-value"><u-number-box v-model="form.passengerNumber" class="numberBox" min="1" max="50"></u-number-box></view>
				</view>
				<view class="form-item flex-between mrn15" style="border-bottom: 1rpx solid #DFDFDF;">
					<view class="form-label">儿童</view>
					<view class="form-value"><u-number-box v-model="form.childNumber" class="numberBox" min="0" max="50"></u-number-box></view>
				</view>
				<view class="form-item flex-between mrn15">
					<view class="form-label">行李</view>
					<view class="form-value"><u-number-box v-model="form.baggageNumber" class="numberBox" min="0" max="50"></u-number-box></view>
				</view>
			</view>

			<view class="tip-data">
				<view class="flex-between tip-data-advantage">
					<view class="flex-start">
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/tipImg.png" class="tipImg"></image>
						专属客服
					</view>
					<view class="flex-start">
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/tipImg.png" class="tipImg"></image>
						自营司机
					</view>
					<view class="flex-start">
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/tipImg.png" class="tipImg"></image>
						全程服务
					</view>
				</view>
				<view class="flex-between tip-data-example">
					<view class="flex-start tip-data-example-fabulous">
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/fabulousImg.png" class="fabulousImg"></image>
						超赞！人气好产品
					</view>
					<!-- <view class="">
						张** 刚刚完成了下单
					</view> -->
					<swiper
						class="swiper"
						:indicator-dots="false"
						:autoplay="true"
						:interval="3000"
						:duration="2000"
						:circular="true"
						:vertical="true"
						:display-multiple-items="1"
						easing-function="linear"
					>
						<swiper-item class="swiper-item" v-for="(item, index) in familyNames" :key="index">{{ item }}** 刚刚完成了下单</swiper-item>
					</swiper>
				</view>
			</view>

			<view class="user-data">
				<view class="user-title">联系人信息</view>
				<view class="user-item flex-start">
					<view class="user-label require">真实姓名</view>
					<view class="user-value"><input type="text" v-model="form.contactName" placeholder="请输入姓名" placeholder-style="color:#AAAAAA" maxlength="20" /></view>
				</view>
				<view class="user-item flex-start">
					<view class="user-label require">手机号码</view>
					<view class="user-value flex-start">
						<view class="AreaCode">+86</view>
						<input type="number" v-model="form.contactMobile" placeholder="请输入手机号" placeholder-style="color:#AAAAAA" maxlength="20" />
					</view>
				</view>
				<view class="user-item flex-start">
					<view class="user-label">微信号</view>
					<view class="user-value flex-start">
						<input type="text" v-model="form.weixin" placeholder="请输入微信号" placeholder-style="color:#AAAAAA" maxlength="20" />
						<view class="identicalPhone" @click="copyPhone">手机同号</view>
					</view>
				</view>
				<view class="user-item flex-start" style="border: none;">
					<view class="user-label">订单备注</view>
					<!-- -->
					<view v-if="!orderRemarkStatus" class="user-value flex-start" @click="orderRemarkStatus = true">
						<!-- orderRemark -->
						<input type="text" disabled placeholder="请填写备注" placeholder-style="color:#AAAAAA" maxlength="30" />
					</view>

					<!-- v-model="form.orderRemark" -->
				</view>
				<!--  -->
				<view v-if="orderRemarkStatus" class="" style="padding-bottom: 18rpx;position: relative;">
					<textarea
						v-model="form.orderRemark"
						maxlength="200"
						placeholder="请填写备注"
						style="line-height: 48rpx;padding: 12rpx 16rpx;height: 240rpx;background: #F5F5F5;border-radius: 20rpx;width: 600rpx;"
					></textarea>
					<view style="position: absolute;bottom: 30rpx;right: 10rpx;font-size: 24rpx;color: #999999;">
						{{ form.orderRemark.length > 200 ? 200 : form.orderRemark.length }}/200
					</view>
				</view>
			</view>

			<view class="form-data" v-if="Number(orderInfo.busData.busType) < 19">
				<view class="user-title">附加服务</view>
				<view class="form-item flex-between mrn15">
					<view class="form-label">
						儿童座椅
						<text style="color: #CBA56A;margin-left: 20rpx;">￥100/个</text>
					</view>
					<view class="form-value"><u-number-box v-model="form.additionalService.childSeat" class="numberBox" min="0" max="50"></u-number-box></view>
				</view>
				<view class="form-tip">1个座椅占1.5个座位(首个免费)</view>
			</view>

			<view class="user-data">
				<view class="user-title">已选车型</view>

				<view class="">
					<view class="bus-number flex-start">
						<view class="bus-name">{{ orderInfo.busData.name }}</view>
						<view class="bus-view flex-start">
							<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/userImg.png" class="bus-img"></image> -->
							<view class="">可乘 {{ orderInfo.busData.prople }}人</view>
						</view>
						<view class="bus-line"></view>
						<view class="bus-view flex-start" v-if="orderInfo.busData.trunk">
							<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/busImg/trunkImg.png" class="bus-img"></image> -->
							<view class="">可载 {{ orderInfo.busData.trunk }}件</view>
						</view>
					</view>
				</view>
			</view>

			<view class="user-data">
				<view class="user-title">价格明细</view>
				<view class="form-item flex-between" style="margin: 24rpx 0rpx 12rpx;">
					<view class="form-label">包车费用</view>
					<view class="discounts-value">￥{{ orderInfo.price }}</view>
				</view>
				<view @click="showDiscounts" class="form-item flex-between " style="margin: 12rpx 0rpx;">
					<view class="form-label">优惠券</view>
					<view class="form-discounts">
						<text>
							{{
								selectDiscounts.index == -1
									? '暂无可用'
									: `已选优惠券，满${selectDiscounts.item.withAmount}${selectDiscounts.item.couponType == 1 ? '减' : '打'}${
											selectDiscounts.item.couponType == 1 ? selectDiscounts.item.reduceAmount : selectDiscounts.item.discount
									  }${selectDiscounts.item.couponType == 1 ? '元' : '折'}`
							}}
						</text>
						<u-icon name="arrow-right" color="#ffffff" size="22"></u-icon>
					</view>
				</view>
				<view class="form-item flex-between " style="margin: 12rpx 0rpx;">
					<view class="form-label">优惠金额</view>
					<view class="discounts-value">￥{{ selectDiscounts.index == -1 ? 0 : discountPrice }}</view>
				</view>
				<view class="form-item flex-between " style="margin: 12rpx 0rpx 24rpx">
					<view class="form-label">附加服务</view>
					<!-- this.form.additionalService.childSeat - 1 : 0) * 100  ? 0 : 10 -->
					<view class="discounts-value">￥{{ form.additionalService.childSeat <= 0 ? 0 : (form.additionalService.childSeat - 1) * 100 }}</view>
				</view>

				<view class="line"></view>

				<view class="form-item flex-between" style="padding: 24rpx 0rpx 12rpx;border-top: 1rpx solid #dfdfdf;">
					<view class="form-label">订单实付</view>
					<view class="discounts-value">￥{{ newPrice }}</view>
				</view>
			</view>

			<view class="form-data">
				<view class="user-title">订单须知</view>
				<view class="tip-view">
					<view class="tip-title flex-between" @click="setCostStatus(1)">
						<view class="">费用说明</view>
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/down.png" class="downImg" :class="{ upImg: costStatus == 1 }"></image>
					</view>
					<view class="tip-text" v-if="costStatus == 1">
						<view class="">费用包含</view>
						<view class="">1.每日10小时车辆使用费（接机免费等待90分钟、送机免费等待30分钟）</view>
						<view class="">2.司兼导服务费，司导餐费，司导住宿补助，司导小费</view>
						<view class="mb24">3.燃油费、高速费、路桥费、空驶费</view>

						<view class="">费用不包含：</view>
						<view class="">1.景点门票费用、下车陪同产生的费用</view>
						<view class="">2.超时费、超公里费、停车费</view>
						<view class="">3.因变更订单类型、行程、出行时间等产生的差价费用</view>
						<view class="">4.客人餐饮等个人消费及其他未提及费用</view>
					</view>
				</view>

				<view class="tip-view">
					<view class="tip-title flex-between" @click="setCostStatus(2)">
						<view class="">退改说明</view>
						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/down.png" class="downImg" :class="{ upImg: costStatus == 2 }"></image>
					</view>
					<view class="tip-text" v-if="costStatus == 2">
						<view class="">费用不包含：</view>
						<view class="">1、出发前7日（不含）以上买家通知取消，全额退款；</view>
						<view class="">2、出发前7日至4日买家通知取消，收取订单50%的费用；</view>
						<view class="">3、出发前3日至2日买家通知取消，收取订单80%的费用；</view>
						<view class="">4、出发前1日以内买家通知取消，收取订单100%的费用。</view>
					</view>
				</view>

				<view class="tip-view mb24">
					<view class="tip-title flex-between" @click="setCostStatus(3)">
						<view class="">行李说明</view>

						<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/down.png" class="downImg" :class="{ upImg: costStatus == 3 }"></image>
					</view>
					<view class="tip-text" v-if="costStatus == 3">
						<view class="">1、行李大小计算标准为24寸行李箱</view>

						<view class="">2、超过24寸的大行李箱，计件为2件</view>
						<view class="">3、一个空座可增加1件24寸行李箱</view>
					</view>
				</view>

				<view class="tip-text">
					<view class="mb24">
						注：根据实际出行人数，为您匹配合适车型，携带行李进制超过容量限制，以免车辆空间不足无法服务，如发生类似情况，司机可以拒绝服务，由乘客自行承担后果
					</view>

					<view class="">平台保障： 订单款项将由平台保障，服务完成后才会支付给司导，24小时客服帮助您解决服务过程中的纠纷</view>
				</view>
			</view>

			<view class="flex-start agreement" @click="selectNum = !selectNum">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select.png" style="width: 36rpx;height: 36rpx;" v-if="!selectNum"></image>
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/select-active.png" style="width: 36rpx;height: 36rpx;" v-if="selectNum"></image>
				<view class="agreement-text flex-start" style="color: #999999;">
					我已阅读并同意
					<view class="" style="color: #666666;" @click.stop="toPages('/subPages/user/other?url=wetour/serviceAgreement.html')">《服务协议》</view>
					<view class="" style="color: #666666;" @click.stop="toPages('/subPages/user/other?url=wetour/privacyPolicy.html')">《隐私协议》</view>
				</view>
			</view>
			<view class="footer-form flex-between">
				<view class="footer-price flex-start">
					<view class="price-text" style="font-size: 32rpx;">价格</view>
					<view class="price-number flex-start">
						<!-- <view class=""> -->
						￥{{ newPrice }}
						<!-- </view> -->
						<!-- 	<view class="number" > -->

						<!-- </view> -->
					</view>
				</view>
				<view class="footer-btn" @click="submit">确认支付</view>
			</view>
		</view>
		<popupDiscounts
			v-if="discountsDialog.isDiscounts"
			:popVisible.sync="discountsDialog.isDiscounts"
			:listData="discountsDialog.listData"
			:selectIndex="selectDiscounts.index"
			@onReuslt="discountsReuslt"
		></popupDiscounts>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { parseTime, throttle, addition, subtraction } from '@/utils/common';
import { createOrderInfo, orderList } from '@/api/order.js';
import { phoneYz } from '@/utils/regular.js';
// import popupDiscounts from '@/components/popup-discounts.vue'; //推荐
import popupDiscounts from '@/components/popup-discounts.vue'; //推荐
import { couponChoose } from '@/api/discounts.js';

export default {
	components: {
		popupDiscounts
	},
	data() {
		return {
			type: 1,
			selectDiscounts: {
				item: {},
				index: -1
			},
			discountsDialog: {
				listData: [],
				isDiscounts: false
			},
			orderRemarkStatus: false,
			form: {
				passengerNumber: 1, //成人
				childNumber: 0, //儿童
				baggageNumber: 0,
				weixin: '', //微信
				contactMobile: '',
				contactName: '',
				orderRemark: '', //订单行程备注

				additionalService: {
					//附加服务
					childSeat: 0
				}

				// charteredCarType:0,   //包车类型 1日租 2接机 3 送机 4单车
				// charteredCarRange:0,   //1市内包车 2周边包车

				// busType:[],    //车型多个值 格式[{"id":1,"busType":5,"number":3},{"id":2,"busType":7,"number":4} ]
				// departureAddress:'',  //出发地址
				// departureCity:'',   //出发城市
				// departureCityCode:'',   //出发城市代码对应城市表里的ID
				// departureEndTime:'',   //结束时间
				// departureStartTime:'',  //出发时间（用车时间）
				// destinationAddress:'',  //目的地地址
				// destinationCity:'',  //目的地城市
				// destinationCityCode:'',  //目的地城市代码对应城市表里的ID
				// flightNumber:'',  //航班号
			},
			costStatus: 1,
			retreatStatus: false,
			luggageStatus: false,
			selectNum: true,
			requestLocked: false,
			countDown: '',
			orderData: [],
			time: null,
			familyNames: []
		};
	},
	onShow() {
		console.log(this.orderInfo);
		this.getOrderList();
	},
	onLoad() {
		if (this.orderUser.contactName) {
			this.form.contactName = this.orderUser.contactName;
			this.form.contactMobile = this.orderUser.contactMobile;
			this.form.weixin = this.orderUser.weixin;
		}
		let familyNames = new Array(
			'赵',
			'钱',
			'孙',
			'李',
			'周',
			'吴',
			'郑',
			'王',
			'冯',
			'陈',
			'褚',
			'卫',
			'蒋',
			'沈',
			'韩',
			'杨',
			'朱',
			'秦',
			'尤',
			'许',
			'何',
			'吕',
			'施',
			'张',
			'孔',
			'曹',
			'严',
			'华',
			'金',
			'魏',
			'陶',
			'姜',
			'戚',
			'谢',
			'邹',
			'喻',
			'柏',
			'水',
			'窦',
			'章',
			'云',
			'苏',
			'潘',
			'葛',
			'奚',
			'范',
			'彭',
			'郎',
			'鲁',
			'韦',
			'昌',
			'马',
			'苗',
			'凤',
			'花',
			'方',
			'俞',
			'任',
			'袁',
			'柳',
			'酆',
			'鲍',
			'史',
			'唐',
			'费',
			'廉',
			'岑',
			'薛',
			'雷',
			'贺',
			'倪',
			'汤',
			'滕',
			'殷',
			'罗',
			'毕',
			'郝',
			'邬',
			'安',
			'常',
			'乐',
			'于',
			'时',
			'傅',
			'皮',
			'卞',
			'齐',
			'康',
			'伍',
			'余',
			'元',
			'卜',
			'顾',
			'孟',
			'平',
			'黄',
			'和',
			'穆',
			'萧',
			'尹'
		);
		familyNames.sort(function() {
			return Math.random() - 0.5;
		});
		this.familyNames = familyNames;
	},
	computed: {
		...mapGetters(['orderInfo', 'orderUser']),
		newPrice() {
			console.log('this.orderInfo.price', this.orderInfo.price);
			console.log('this.discountPrice', this.discountPrice);
			var disprice = addition(
				this.orderInfo.price - this.discountPrice,
				(this.form.additionalService.childSeat - 1 >= 0 ? this.form.additionalService.childSeat - 1 : 0) * 100
			);
			console.log('disprice', disprice);
			return disprice >= 0 ? disprice : 0;
		},
		discountPrice() {
			console.log('disprice==>', this.selectDiscounts.item);
			var price = subtraction(
				this.orderInfo.price,
				this.selectDiscounts.index == -1
					? 0
					: this.selectDiscounts.item.couponType == 1
					? this.selectDiscounts.item.reduceAmount
					: parseFloat(this.orderInfo.price * (this.selectDiscounts.item.discount / 10)).toFixed(2)
			);
			var maxprice = this.selectDiscounts.index == -1 ? 0 : this.selectDiscounts.item.maxDiscountAmount;
			return this.selectDiscounts.index == -1 ? 0 : this.selectDiscounts.item.couponType == 1 ? this.selectDiscounts.item.reduceAmount : Math.min(price, maxprice);
		},
		orderTitle() {
			if (this.orderInfo.charteredCarType == 1) {
				if (this.orderInfo.charteredCarRange == 1) return this.orderInfo.departureCity + '市内包车';
				if (this.orderInfo.charteredCarRange == 2) return this.orderInfo.departureCity + '周边包车';
			}
			if (this.orderInfo.charteredCarType == 2) return '接机';
			if (this.orderInfo.charteredCarType == 3) return '送机';
			if (this.orderInfo.charteredCarType == 4) return '单程';
			return '';
			// <!-- charteredCarType  包车类型 1日租 2接机 3 送机 4单车 -->
			// <!-- charteredCarRange 1市内包车 2周边包车-->
		}
	},
	onUnload() {
		if (this.time) {
			clearInterval(this.time);
			this.time = null;
		}
	},
	onHide() {
		if (this.time) {
			clearInterval(this.time);
			this.time = null;
		}
	},
	methods: {
		discountsReuslt(reuslt) {
			this.selectDiscounts = reuslt;
		},
		//选择优惠券
		showDiscounts() {
			console.log('选择优惠券', this.discountsDialog.isDiscounts);
			var popupData = {
				couponStatus: 1,
				orderAmount: this.orderInfo.price,
				busType: this.orderInfo.busData.busType,
				charteredCarType: this.orderInfo.charteredCarType,
				departureCityCode: this.orderInfo.departureCityCode
			};
			this.getCouponChoose(popupData);
		},
		getCouponChoose(popupData) {
			couponChoose(popupData).then(res => {
				if (res.code == 0) {
					if (res.data.length > 0) {
						this.discountsDialog = {
							isDiscounts: true,
							listData: res.data
						};
					} else {
						uni.showToast({
							title: '暂无优惠券',
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
		},
		toPages: throttle(function(url) {
			uni.navigateTo({
				url
			});
		}, 1500),
		getOrderList() {
			let data = {
				current: 1,
				size: 1,
				orderStatusTab: 1
			};
			orderList(data).then(res => {
				this.orderData = res.data.records;
				if (this.orderData[0]?.serverTime) {
					this.showtime();
					this.time = setInterval(() => {
						this.orderData[0].serverTime = Number(this.orderData[0].serverTime) + 1;
						this.showtime();
					}, 1000);
				}
			});
		},
		setCostStatus(num) {
			if (this.costStatus == num && this.costStatus != 0) {
				this.costStatus = 0;
			} else {
				this.costStatus = num;
			}
		},
		showtime(bol) {
			let nowtime = this.orderData[0].serverTime;
			let endtime = this.orderData[0].expired;
			let lefttime = endtime - nowtime;
			if (lefttime > 0) {
				let leftm = Math.floor((lefttime / 60) % 60);
				let lefts = Math.floor(lefttime % 60);
				this.countDown = (leftm < 10 ? '0' + leftm : leftm) + ':' + (lefts < 10 ? '0' + lefts : lefts);
			} else {
				this.orderData = [];
				clearInterval(this.time);
				this.time = null;
			}
		},
		goOrderDetail() {
			// reLaunch
			uni.navigateTo({
				url: `/order/orderDetail/orderDetail?orderNo=${this.orderData[0].orderNo}`
			});
		},
		copyPhone() {
			if (this.form.contactMobile) this.form.weixin = this.form.contactMobile;
		},
		parseTime(time, cFormat) {
			// '{y}-{m}-{d} {h}:{i}:{s}'
			return parseTime(time, cFormat);
		},
		submit() {
			let _this = this;
			if (this.requestLocked) return false;
			if (!this.form.contactName) {
				return uni.showToast({
					title: '请先输入真实姓名',
					duration: 2000,
					icon: 'none'
				});
			}
			if (!this.form.contactMobile) {
				return uni.showToast({
					title: '请先输入手机号码',
					duration: 2000,
					icon: 'none'
				});
			}

			if (!phoneYz('zh-CN', this.form.contactMobile)) {
				return uni.showToast({
					title: '请先输入正确的手机号码',
					duration: 2000,
					icon: 'none'
				});
			}

			if (!this.selectNum) {
				return uni.showToast({
					title: '请阅读并同意服务协议和隐私协议',
					duration: 2000,
					icon: 'none'
				});
			}
			let data = {
				...this.form,
				...this.orderInfo,
				couponId: this.selectDiscounts.index == -1 ? 0 : this.selectDiscounts.item.id,
				additionalService: JSON.stringify(this.form.additionalService),
				departureStartTime: parseTime(this.orderInfo.departureStartTime, '{y}-{m}-{d} {h}:{i}:{s}'),
				contactMobile: '86' + this.form.contactMobile
			};
			this.$delete(data, 'busData');
			console.log(data, 33333);
			console.log(JSON.stringify(data));
			uni.showLoading({
				title: '加载中'
			});
			this.requestLocked = true;
			//创建订单信息
			createOrderInfo(data)
				.then(res => {
					uni.hideLoading();
					// uni.navigateTo({
					// 	url:`/order/orderDetail/orderDetail?orderNo=${res.data.orderNo}`
					// })
					this.$store.dispatch('user/orderUser', { contactName: this.form.contactName, contactMobile: this.form.contactMobile, weixin: this.form.weixin });
					if (res.code == 0) {
						let orderNo = res.data.orderNo;

						if (_this.newPrice > 0) {
							console.log(res, 33333333);

							let payResponse = res.data.payResponse;
							// uni.navigateTo({
							// 	url:`/subPages/orderinfo/success?orderNo=${res.data.orderNo}`
							// })
							let myData = {
								timeStamp: payResponse.timeStamp,
								nonceStr: payResponse.nonceStr,
								package: payResponse.packageValue,
								packageValue: payResponse.packageValue,
								signType: payResponse.signType,
								paySign: payResponse.paySign
							};
							uni.requestPayment({
								...myData,
								success: function(res) {
									_this.requestLocked = false;
									// uni.hideLoading()
									// wx.setStorageSync('orderdatalist', false)
									// console.log(res,'res')
									_this.tipShow = true;
									// wx.navigateTo({
									// 	url: '/pages/chartered/offerDetails/chartedpaySuccess/index?order_id=' + that.data.order_no,
									// })
									uni.reLaunch({
										url: `/subPages/orderinfo/success?orderNo=${orderNo}&newType=1`
									});
								},
								fail: function(res) {
									_this.requestLocked = false;
									// uni.hideLoading()
									uni.reLaunch({
										url: `/order/orderDetail/orderDetail?orderNo=${orderNo}&newType=1`
									});
									console.log(res);
								}
							});
						} else {
							_this.requestLocked = false;
							_this.tipShow = true;
							uni.reLaunch({
								url: `/subPages/orderinfo/success?orderNo=${orderNo}&newType=1`
							});
						}
					} else {
						this.requestLocked = false;
					}

					// uni.navigateTo({
					// 	url:`/order/orderDetail/orderDetail?orderNo=${res.data.orderNo}`
					// })

					console.log(res, 33333);
				})
				.catch(e => {
					console.log(6666666666, e);
					this.requestLocked = false;
					uni.hideLoading();
				});
		}
	}
};
</script>

<style scoped lang="scss">
.orderInfo-box {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.form-discounts {
	padding: 2rpx 16rpx;
	background: #cba56a;
	border-radius: 22rpx;
	@include fs(24rpx, 400, #fff, 40rpx);
}

.discounts-value {
	@include fs(28rpx, 400, #666666, 40rpx);
}

.orderInfo-container {
	padding: 20rpx 32rpx;
	.form-data {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 32rpx 32rpx 10rpx;

		.order-data {
			.order-title {
				@include fs(36rpx, 400, #111111, 32rpx);
				margin-bottom: 24rpx;
				.flightNumber {
					margin-left: 40rpx;
					&-text {
						@include fs(28rpx, 400, #666666, 40rpx);
						margin-left: 5rpx;
					}
				}
			}
			.order-time {
				margin-bottom: 12rpx;
				&-text {
					@include fs(28rpx, 400, #666666, 40rpx);
				}
				&-tip {
					width: 96rpx;
					line-height: 32rpx;
					text-align: center;
					font-weight: 400rpx;
					color: #cba56a;
					font-size: 20rpx;
					margin-left: 12rpx;
					border-radius: 4rpx;
					border: 1rpx solid #cba56a;
					// @include fs(20rpx,400,#CBA56A);
				}
			}
			.order-address {
				margin-bottom: 12rpx;
				&-text {
					flex: 1;
					@include fs(28rpx, 400, #666666, 40rpx);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.order-icon {
				width: 24rpx;
				height: 24rpx;
				margin-right: 17rpx;
			}
		}
		.form-item {
			padding: 21rpx 0;
			// padding-right: 24rpx;
			//border-bottom: 1rpx solid #DFDFDF;
			.form-label {
				@include fs(28rpx, 400, #999999, 40rpx);
			}
			&:last-child {
				border: none;
			}
		}
		.form-tip {
			@include fs(28rpx, 400, #999999, 40rpx);
			margin-bottom: 22rpx;
		}
		.tip-view {
			padding: 24rpx 0 0;
			border-bottom: 1rpx solid #eeeeee;
			.tip-title {
				@include fs(28rpx, 400, #666666, 40rpx);
				margin-bottom: 20rpx;
			}
			.downImg {
				width: 30rpx;
				height: 26rpx;
			}
			.upImg {
				transform: rotate(180deg);
			}

			&:last-child {
				border-bottom: 0;
			}
		}
		.tip-text {
			@include fs(28rpx, 400, #999999, 40rpx);
			padding-bottom: 20rpx;
		}
		.mb24 {
			margin-bottom: 24rpx;
		}
	}
	.tip-data {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 32rpx 32rpx 32rpx;

		&-advantage {
			@include fs(24rpx, 400, #666666, 28rpx);
			padding-bottom: 23rpx;
			border-bottom: 1rpx solid #eeeeee;
			.tipImg {
				width: 24rpx;
				height: 20rpx;
				margin-right: 12rpx;
			}
		}
		&-example {
			margin-top: 23rpx;
			@include fs(28rpx, 400, #999999, 40rpx);
			&-fabulous {
				@include fs(28rpx, 600, #cba56a, 40rpx);
			}
			.fabulousImg {
				width: 48rpx;
				height: 48rpx;
				margin-right: 12rpx;
			}
		}
	}
	.user-title {
		@include fs(36rpx, 600, #111111, 42rpx);
		padding-bottom: 20rpx;
		margin-bottom: 12rpx;
		border-bottom: 1rpx solid #eeeeee;
	}
	.user-data {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 34rpx 32rpx 10rpx;

		.user-item {
			padding: 12rpx 0rpx;
			// border-bottom: 1rpx solid #EEEEEE;
			.user-label {
				width: 180rpx;
				@include fs(28rpx, 400, #111111, 40rpx);
			}
			.user-value {
				input {
					@include fs(28rpx, 400, #111111, 40rpx);
					flex: 1;
				}
			}

			.AreaCode {
				@include fs(28rpx, 400, #111111, 40rpx);
				margin-right: 28rpx;
			}
			.identicalPhone {
				padding: 8rpx 18rpx;
				border: 1rpx solid #dbdbdb;
				border-radius: 24rpx;
				text-align: center;
				@include fs(24rpx, 400, #999999, 32rpx);
			}
			&:last-child {
				border: none;
			}
		}
		.bus-number {
			// margin-bottom: 26rpx;
			padding: 10rpx 0 26rpx;
		}
		.bus-name {
			@include fs(28rpx, 400, #111111, 40rpx);
			margin-right: 32rpx;
		}
		.bus-img {
			margin-right: 8rpx;
			width: 28rpx;
			height: 28rpx;
		}
		.bus-view {
			@include fs(28rpx, 400, #999999, 40rpx);
		}

		.bus-line {
			width: 1rpx;
			height: 30rpx;
			margin: 0rpx 15rpx;
			background-color: #999999;
		}
	}
}
.require {
	position: relative;
	display: flex;
	&::after {
		content: '*';
		color: #d6390a;
		font-size: 32rpx;
		display: block;
		margin-left: 8rpx;
		// position: absolute;
		// right: 0;
		// top: 0;
		// bottom: 0;
		// margin: auto;
	}
}
.agreement {
	margin: 20rpx 0 26rpx;
	padding-bottom: 120rpx;
	padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	&-text {
		@include fs(28rpx, 400, #999999, 40rpx);
		margin-left: 20rpx;
	}
}
.footer-form {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
	width: 100%;
	// height: 534px;
	background: #ffffff;
	padding: 32rpx;
	border-top: 1rpx solid #dfdfdf;
	padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));

	.footer-price {
		color: #666666;
		line-height: 45rpx;

		.price-number {
			color: #111111;
			font-size: 40rpx;
			font-weight: 500;
			// .number{
			// 	font-size: 40rpx;
			// 	font-weight: 600;
			// }
		}
	}
	.footer-btn {
		// height: 90px;
		background: #111111;
		border-radius: 88rpx;
		width: 264rpx;
		@include fs(28rpx, 600, #fff, 88rpx);
		text-align: center;
	}
}
.order-box {
	height: 72rpx;
	text-align: center;
	background-color: #cba56a;
	font-size: 28rpx;
	color: #ffffff;
	justify-content: center !important;
	margin: -16rpx -16rpx 20rpx;
}
.mrn15 {
	margin-right: -10rpx;
}
// .swiper-wrapper {
//   position: relative;
.swiper {
	// width: 100%;
	flex: 1;
	height: 36rpx;
}
.swiper-item {
	height: 36rpx !important;
	text-align: right;
	@include fs(28rpx, 400, #999999, 40rpx);
}
// .mask {
//   position: absolute;
//   pointer-events: false;
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
//   z-index: 99;
// }
// }
</style>
