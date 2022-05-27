<template>
	<view class="confirm-container" >
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="行程确认" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>

		<view class="confirm-title">
			<view class="title">
				{{line.lineName || ''}}
			</view>
			<view class="flex-start">
				<image src="@/static/img/warning2.png" class="warringImg"></image>
				<text class="warringText">温馨提醒</text>
			</view>
			<view class="flex-start" style="align-items: center;margin-bottom: 12rpx; font-weight: 400;"
				v-for="(item,index) in ['乘车时间为预估时间，请以司机联系为准。','儿童(1.2米以下，含婴儿)需购买全票。']" :key="index">
				<view class="title-label"></view>
				<text class="title-text">{{item}}</text>
			</view>
		</view>



		<view class="confirm-content">
			<view class="confirm-label flex-start">
				<image src="@/static/image/index/label.png" class="labelImg"></image>
				<text>专业司机、优质服务，放心出行！</text>
			</view>
			<view class="form-data form">
				<view class="form-title">
					行程信息
				</view>
				<view class="form-item flex-between" @click="setTime(false)">
					<!-- <image src="@/static/image/common/time.png" class="timeImg"></image> -->
					<view style="margin-right: 60rpx;">出发时间</view>
					<view class="form-item-value" style="font-weight: 600;" v-if="form.time.label">{{form.time.label}}
					</view>
					<view class="form-item-value" style='color:#AAAAAA' v-else>
						请选择上车时间
					</view>
					<image src="@/static/img/right-big.png" class="timeImg"></image>
				</view>
				<view class="form-item flex-start">
					<view class="form-item-label"></view>
					<view class="form-item-value" @click="selectAddress(1)">
						<input type="text" :value="form.on.label?form.on.label:''" disabled placeholder="请选择上车点"
							class="contacts-item-input" placeholder-style='color:#AAAAAA' />
					</view>
					<image src="@/static/img/right-big.png" class="timeImg"></image>
				</view>
				<view class="form-item flex-start">
					<view class="form-item-label"></view>
					<view class="form-item-value" @click="selectAddress(2)">
						<input type="text" :value="form.off.label?form.off.label:''" disabled placeholder="请选择下车点"
							class="contacts-item-input" placeholder-style='color:#AAAAAA' />
					</view>
					<image src="@/static/img/right-big.png" class="timeImg"></image>
				</view>
				<view class="form-item flex-between" @click="setShow(true)">
					<view class="form-item-labels ">乘车人数</view>
					<view class="form-item-value flex-between" style="flex-direction:row-reverse">
						<view class="form-item-right flex-between">
							<image src="@/static/img/minus2.png" @click="changeNum(false)" class="numImg"></image>
							<text>{{form.number}} 人</text>
							<image src="@/static/img/add2.png" @click="changeNum(true)" class="numImg"></image>
						</view>
					</view>
					<!-- <image  src="@/static/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;transform:rotate(-90deg)"></image> -->
				</view>
				<!-- <u-picker v-model="show" mode="selector" range-key="label" :range="columns" :default-selector="[form.number-1]" @confirm="handelConfirm"></u-picker> -->
				<!-- <u-select v-model="show" :list="columns" :default-value="[form.number-1]" @confirm="handelConfirm"></u-select> -->
				<!-- <view class="tip-text">
					注：乘车时间为预估时间,请以司机联系为准。儿童(1.2米以下,含婴儿)需购买全票。
				</view> -->
			</view>
			<view class="contacts-data contacts" style="padding: 7rpx 30rpx 8rpx;margin-bottom: 20rpx;" v-if="!driverId">
				<view class="contacts-item flex-start">
					<view class="contacts-item-label">
						优惠券
					</view>
					<view class="contacts-item-value flex-start" @click="coupon.length?tipShow4=true:''">
						<!-- <input type="text" v-model="form.contacts" placeholder="请输入姓名" class="contacts-item-input" 
						 placeholder-style='color:#AAAAAA' maxlength="10" /> -->
						 
						  <!-- <view class="card havsCard" v-show="coupon.length&chooseCoupon.id">-￥{{couponPrice}}</view> -->
						 <view class="card havsCard" v-if="coupon.length">{{couponPrice?(price-couponPrice)<0?('-￥'+ price):('-￥'+couponPrice):'可用'}}</view>
						<view class="card" v-else-if="!coupon.length">不可用</view>
						<image src="@/static/img/right-big.png" class="timeImg"></image>
					</view>
				</view>
			</view>
			<view class="contacts-data contacts">
				<view class="contacts-title">
					联系人信息
				</view>
				<view class="contacts-item flex-start">
					<view class="contacts-item-label">
						联系人
					</view>
					<image src="@/static/img/must.png" style="margin-right: 78rpx;" class="mustImg"></image>
					<view class="contacts-item-value">
						<input type="text" v-model="form.contacts" placeholder="请输入姓名" class="contacts-item-input"
							placeholder-style='color:#AAAAAA' maxlength="10" />
					</view>
				</view>
				<view class="contacts-item flex-start">
					<view class="contacts-item-label">
						联系电话
					</view>
					<image src="@/static/img/must.png" class="mustImg"></image>
					<view class="contacts-item-value">
						<input type="number" v-model="form.contactsMobile" placeholder="请输入手机号"
							class="contacts-item-input" placeholder-style='color:#AAAAAA' maxlength="11" />
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="tipShow" mode="center" z-index="30000" border-radius="20" :mask-close-able="false">
			<view class="tipPopup">
				<view class="tipTitle flex-center">
					<image src="@/static/image/common/tipImg.png" class="tipImgs"></image>
					乘车须知
				</view>
				<view class="tipText">
					1.儿童需全价购票，否则司机有权拒载
				</view>
				<view class="tipText">
					2.不带宠物乘车，否则司机有权拒载
				</view>
				<view class="tipText">
					3.每位乘客免费携带一个24寸以下行李
				</view>
				<view class="tipText">
					4.禁止携带易燃易爆违禁物品上车
				</view>
				<view class="flex-center">
					<view class="tipBtn" @click="goOrderDetail">
						我知道了
					</view>
				</view>

			</view>
		</u-popup>
		<view class="footer flex-between">
			<view class="flex-start">
				<view class="total-text">
					总额
				</view>
				<view class="total-number">
					<text class="ft28">￥</text>
					{{(price-couponPrice)>0?subtraction(price,couponPrice):0}}
				</view>
				<image src="@/static/img/warning.png" @click="tipShow2=true" class="warringImg"></image>
			</view>
			<!--  -->
			<view class="flex-start">
				<view class="flex-start downView" @click="tipShow3 = !tipShow3">
					<view>明细</view>
					<image src="@/static/img/downImg.png" class="downImg"></image>
				</view>
				<button class="form-btn" v-if="!userInfo.mobile" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber">下单支付</button>
				<button class="form-btn" @click="formSub" v-else>
					下单支付
				</button>
				<!-- <button class="form-btn" @click="formSub" >
					下单支付
				</button> -->
			</view>




		</view>
		<!-- 退票规则 -->
		<u-popup v-model="tipShow2" mode="center" z-index="30000" border-radius="20" closeable>
			<view class="tipPopup">
				<view class="tipTitle flex-start">
					退票规则
				</view>
				<image src="@/static/image/index/rules.png" class="rulesImgs"></image>

			</view>
		</u-popup>
		<!-- 金额明细 -->
		<u-popup v-model="tipShow3" mode="bottom" border-radius="20" closeable>
			<view class="tipPopup" style="width: auto;margin-bottom: 104rpx;padding:25rpx 25rpx 40rpx;">
				<view class="tipTitle" style="text-align: center;">
					金额明细
				</view>
				<view class="flex-between" style="margin-bottom: 30rpx;">
					<view class="tip3-left">票价</view>
					<view class="tip3-right">{{price}}<span class="tip3-spec">元</span></view>
				</view>
				<view class="flex-between" style="margin-bottom: 30rpx;">
					<view class="tip3-left">优惠券</view>
					<view class="tip3-right">-{{(price-couponPrice)<0?price:couponPrice}}<span class="tip3-spec">元</span></view>
				</view>
			</view>
		</u-popup>

		<!-- 选择优惠券 -->
		<u-popup v-model="tipShow4" mode="bottom" bgColor="#F5F5F5"  z-index="30000" border-radius="20" closeable>
			<view class="tipPopup tipPopup4" v-if="coupon.length">
				<view class="tipTitle" style="text-align: center;margin-bottom: 25rpx;">
					选择优惠券
				</view>
				<u-radio-group v-model="radiovalue1" 
				activeColor="#FFCC00" 
				:iconColor="'#272727'" 
				size="60" 
				iconSize="35" 
				iconPlacement="right"  
				placement="row">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" style="max-height: 750rpx;"
				 >
				<!-- <view style="max-height: 750rpx;overflow-y: scroll;padding-right: 25rpx;"  > -->
				<view class="card-item" v-for="(item, index) in coupon"   :key="index"   @click="chooseRadio(item)">
						
					<u-radio :customStyle="{color: '#272727'}" disabled="true" class="uradio"
						:label="item.id" :name="item.id" @change="radioChange(item)">
					</u-radio>
					<view class="card-item-center">
						<view class="center-top">
							<view class="view1">{{item.couponType===1?'满减券':'满折券'}}</view>
							<view class="view2">{{item.templateTitle}}</view>
						</view>
						<view class="center-bottom">
							有效期至{{item.couponEndTime.substring(0, item.couponEndTime.indexOf(' '))}}
						</view>
					</view>
					<view class="card-item-left"  @click="chooseRadio(item)">
						<view class="left-top">
							{{item.couponType===1?item.reduceAmount:item.discount}}<text class="text1">{{item.couponType===1?'元':'折'}}</text>
						</view>
						<view class="left-bottom">
							满{{item.withAmount}}可用
						</view>
					</view>
				</view>
				<!-- </view> -->
				</scroll-view>
				</u-radio-group>
				<view class="card-button-view">
				<button @click="checkCoupon(radiovalue1)" class="card-button">确定</button>
				</view>
			</view>
		</u-popup>
		<u-select v-model="timeShow" mode="mutil-column-auto" z-index="30000" :list="timeList" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	import {
		phoneYz
	} from "@/utils/regular.js"
	import {
		getLineDetail
	} from "@/api/index.js"
	import {
		userBindPhone,
		getUserInfo,
		createOrder
	} from "@/api/user.js"
	import {
		couponChoose
	} from '@/api/activity.js'
	import {
		mapGetters
	} from 'vuex'
	import {
		accMul,//乘法
		subtraction,//减法
		addition//加法
	} from "@/utils/common.js"
	import {
		parseTime,
		throttle
	} from "@/utils/common"
	import moment from "@/utils/moment.js"
	export default {
		data() {
			return {
				subtraction,
				accMul,
				addition,
				form: {
					contacts: "",
					contactsMobile: "",
					number: 1,
					on: {

					},
					off: {

					},
					time: {
						// label:'03-02 周三 12:00-12:30',
						label: '',
					},
				},
				show: false,
				tipShow: false, //乘车须知
				tipShow2: false, //退票规则
				tipShow3: false, //金额明细
				tipShow4: false, //选择优惠券
				columns: [{
						label: '1人',
						value: 1
					},
					{
						label: '2人',
						value: 2
					},
					{
						label: '3人',
						value: 3
					},
					{
						label: '4人',
						value: 4
					},
					{
						label: '5人',
						value: 5
					},
					{
						label: '6人',
						value: 6
					},
					// {label:'7人',value:7},
					// {label:'8人',value:8},
				],
				timeList: [],
				timeShow: false,
				Id: 0,
				driverId: '',
				line: {},
				station: [],
				bus: [],
				subStatus: false,
				orderNo: '',
				orderId: "",
				requestLocked: false,
				latitude: '', //定位获取的经纬度
				longitude: '',
				// 优惠券列表
				coupon: [
					// {id:0,
					// reduceAmount:0,
					// couponEndTime:''
					// }
				],
				first:true, //第一次进入页面
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue1: 0,
				chooseCoupon:'',
				scrollTop: 0, //滚动相关
			}
		},
		computed: {
			...mapGetters([
				'access_token',
				'userInfo',
				'orderUser'
			]),
			price() {
				if (this.line.price && this.form.number) {
					return accMul(this.line.price, this.form.number)
				}
				return '0'
			},
			couponPrice(){ //优惠券右边的折扣金额
				if(this.chooseCoupon&&this.chooseCoupon.couponType===1){ //满减
					return this.chooseCoupon.reduceAmount
				}else if(this.chooseCoupon&&this.chooseCoupon.couponType===2){//满折
				const nowDiscountAmount = accMul(this.price,subtraction(1,accMul(0.1,this.chooseCoupon.discount)))
					if(nowDiscountAmount>this.chooseCoupon.maxDiscountAmount){//超过最大可优惠金额
					console.log('超过最大可优惠金额')
						return this.chooseCoupon.maxDiscountAmount
					}else{//没超过最大
					console.log('没超过最大')
					// price*(1-0.1*a)
						return nowDiscountAmount
					}
					
				}else{
					return 0
				}
				
			}
		},
		watch:{
			price(val){
				this.$u.debounce(this.couponList,500)
			}
		},
		onLoad(options) {
			if (options.id) {
				this.Id = options.id
				this.getDetail()
			}
			if (options.driverId) {
				this.driverId = options.driverId
			}
			if (options.lineName) {
				this.line.lineName = options.lineName
			}
			if (this.orderUser.contacts) {
				this.form.contacts = this.orderUser.contacts
				this.form.contactsMobile = this.orderUser.contactsMobile
			}
			const that = this
			uni.getLocation({
				success(res) {
					console.log('地址', res)
					that.latitude = res.latitude
					that.longitude = res.longitude
				}
			})
		},
		onShow() {
			if(!this.first){
				this.couponList()
			}else{
				this.first = false
			}
			
			// console.log(this.userInfo,'this.userInfo---------------',this.access_token)

		},
		methods: {
			getPhoneNumber(res) {
				console.log(res)
				let {
					detail
				} = res
				if (detail.errMsg === 'getPhoneNumber:ok') {
					// console.log(detail)
					userBindPhone(detail.code).then(res2 => {
						if (res2.code == 0) {
							this.$store.dispatch('user/getWxCode').then(() => {
								getUserInfo().then(res3 => {
									this.$store.dispatch('user/setUserInfo', res3.data)
									this.formSub()
								})

							})


						}
					})
				} else {
					uni.showToast({
						title: '您取消了授权',
						icon: 'none'
					})
				}
			},
			async getDetail() {
				uni.showLoading({
					title: '加载中',
				})
				let {
					data
				} = await getLineDetail({
					id: this.Id
				})
				uni.hideLoading()
				data.startTime = data.startTime.slice(0, 6) + '00'
				data.endTime = data.endTime.slice(0, 6) + '00'
				this.line = data
				this.station = data.station
				this.bus = data.bus
				if (this.driverId) {
					let newData = this.setTime(true)
					this.form.time.label = newData.label + ' ' + newData.children[0].label
					this.form.time.value = newData.children[0].value
				}

			},
			setTime(bol) {
				// serverTime
				let date = new Date(this.line.serverTime * 1000)
				let formatObj = {
					y: date.getFullYear(),
					m: date.getMonth() + 1,
					d: date.getDate(),
					h: format(date.getHours()),
					i: format(date.getMinutes()),
					// s: format(date.getSeconds()),
					a: date.getDay()
				}

				function format(value) {
					if (value < 10) {
						value = '0' + value
					}
					return value
				}

				function zhou(value) {
					let num = value % 7
					let map = {
						1: '一',
						2: '二',
						3: '三',
						4: '四',
						5: '五',
						6: '六',
						0: '日',
					}
					return '周' + map[num]
				}
				// console.log(date,formatObj,'-----------');
				let list = []
				let startTimeNum = this.line.startTime.split(':').join('') - 0
				let endTimeNum = this.line.endTime.split(':').join('') - 0
				let newTimeNum = Number(formatObj.h + '' + formatObj.i + '00')

				for (var k = 1; k <= this.line.preSaleDay; k++) {
					let myStartTime = this.line.startTime.split(':')
					let ymd = parseTime(date.getTime() + (k - 1) * 24 * 60 * 60 * 1000, '{y}-{m}-{d}')
					let obj = {},
						arr = []
					let startTime = startTimeNum
					obj.label = parseTime(date.getTime() + (k - 1) * 24 * 60 * 60 * 1000, '{m}-{d} {a}')
					if (k == 1) {
						if (newTimeNum - startTimeNum >= 0) {
							startTime = formatObj.h + '' + formatObj.i + '00' - 0
							myStartTime = (formatObj.h + ':' + formatObj.i + ':00').split(':')
						}
					} else {
						formatObj.h = this.line.startTime.split(':')[0]
						formatObj.i = this.line.startTime.split(':')[1]
					}
					if (startTime - endTimeNum < 0) {
						let time = startTime + 10000 - endTimeNum
						if (time < 0) {
							let num = Math.ceil((endTimeNum - startTime) / 10000)
							for (var i = 0; i < num; i++) {
								if (endTimeNum - i * 10000 - startTime >= 10000) {
									if (i == num - 1) {
										arr.push({
											label: format(Number(myStartTime[0]) + i) + ':' + myStartTime[1] +
												' - ' + this.line.endTime.split(':').splice(0, 2).join(':'),
											value: moment(`${ymd}` + ' ' + format(Number(myStartTime[0]) + i) +
												':' + myStartTime[1] + ':00').valueOf() + '-' + moment(
												`${ymd}` + ' ' + this.line.endTime).valueOf()
										})
									} else {
										arr.push({
											label: format(Number(myStartTime[0]) + i) + ':' + myStartTime[1] +
												' - ' + format(Number(myStartTime[0]) + i + 1) + ':' + myStartTime[
													1],
											value: moment(`${ymd}` + ' ' + format(Number(myStartTime[0]) + i) +
												':' + myStartTime[1] + ':00').valueOf() + '-' + moment(
												`${ymd}` + ' ' + format(Number(myStartTime[0]) + i + 1) + ':' +
												myStartTime[1] + ':00').valueOf()
										})
									}
								}

							}
						} else {
							console.log('aaaa-----')
							if (endTimeNum - startTime >= 10000) {
								arr.push({
									label: format(Number(myStartTime[0])) + ':' + myStartTime[1] + ' - ' + this
										.line.endTime.split(':').splice(0, 2).join(':'),
									value: moment(`${ymd}` + ' ' + format(Number(myStartTime[0])) + ':' +
										myStartTime[1] + ':00').valueOf() + '-' + moment(`${ymd}` + ' ' + this
										.line.endTime).valueOf()
								})
							}

						}
					}
					if (arr.length > 0) {
						obj.children = arr
						list.push(obj)
					}

				}
				console.log(!bol, bol, 44444444)
				if (!bol) {
					this.timeList = list
					if (list.length > 0) {
						this.timeShow = true
					} else {
						uni.showToast({
							title: '没有可选的时间段',
							icon: 'none'
						})
					}
				} else {
					console.log(list, 3333333)
					return list[0]
				}

			},
			couponList(){
				if(this.driverId) return
				console.log(111)
				couponChoose(
				{
					orderAmount:this.price,
					couponStatus:1,
					 lineId:this.line.id,
					 fromCity:this.line.fromCity
				}
				).then(res=>{
					if(res.code===0){
						
							this.coupon = res.data
							if(res.data.some(val=>val.id===this.radiovalue1)){//如果变化金额后该优惠券还是可用
								
							}else{
								this.radiovalue1= 0,
								this.chooseCoupon=''
							}
							
						
						
					}
				})
			},
			checkCoupon(radiovalue1){
				const that = this
				const chooseCoupon = this.coupon.filter(res=>{
					return res.id==radiovalue1
					})
				console.log(chooseCoupon,'this.coupon.filter(res=>res.id===this.radiovalue1)')
					
				this.chooseCoupon = chooseCoupon.length?chooseCoupon[0] :{}
				this.tipShow4 = false
			},
			changeNum(type) {
				if (type && this.form.number < 6) {
					this.form.number++
				} else if (!type && this.form.number > 1) {
					this.form.number--
				}
			},
			confirm(e) {
				console.log(e, '----------------------------')
				this.form.time.label = e[0].label + ' ' + e[1].label
				this.form.time.value = e[1].value
			},
			moveHandle(e){
				console.log(e)
				return
			},
			setStationsData(data) {
				if (data.myStatus === 1) {
					this.form.on = {
						label: data.label,
						address: data.address,
						latitude: data.latitude,
						longitude: data.longitude,
						id: data.id,
					}
				} else {
					this.form.off = {
						label: data.label,
						address: data.address,
						latitude: data.latitude,
						longitude: data.longitude,
						id: data.id,
					}
				}

			},
			groupChange(n) {
				console.log('groupChange', n);
			},
			radioChange(n) {
				console.log('radioChange', n);
			},
			chooseRadio(val){
				console.log(this.radiovalue1,val)
				
					if(this.radiovalue1 ===val.id){
						this.radiovalue1 = 0
					}else{
						this.radiovalue1 = val.id
					}
				
				
				
			},
			setShow(bol) {
				this.show = bol
			},
			// handelConfirm(e) {
			// 	this.form.number = e[0].value
			// },
			formSub() {
				console.log(this.form, 333333)
				if (this.requestLocked) return false
				let {
					form
				} = this

				if (this.line.lineStatus != 1) {
					uni.showToast({
						title: '当前线路已暂停',
						icon: 'none'
					})
					return false
				}
				if (!form.time.value) {
					uni.showToast({
						title: '请选择出发时间',
						icon: 'none'
					})
					return false
				}
				if (!form.on.longitude) {
					uni.showToast({
						title: '请选择上车点',
						icon: 'none'
					})
					return false
				}
				if (!form.off.longitude) {
					uni.showToast({
						title: '请选择下车点',
						icon: 'none'
					})
					return false
				}
				if (!form.contacts) {
					uni.showToast({
						title: '请输入联系姓名',
						icon: 'none'
					})
					return false
				}
				if (!form.contactsMobile) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					})
					return false
				}
				if (!phoneYz(form.contactsMobile)) {
					uni.showToast({
						title: '联系电话不规范，请输入手机号码',
						icon: 'none'
					})
					return false
				}
				let time = form.time.value.split('-')
				// console.log(time,'time-----------------')
				let data = {
					contactsMobile: form.contactsMobile,
					contacts: form.contacts,
					lineId: this.Id,
					orderNumber: this.form.number,
					downAddress: this.form.off.address,
					downName: this.form.off.label,
					downId: this.form.off.id,
					downPoint: JSON.stringify([this.form.off.longitude - 0, this.form.off.latitude - 0]),
					upAddress: this.form.on.address,
					upName: this.form.on.label,
					upId: this.form.on.id,
					upPoint: JSON.stringify([this.form.on.longitude - 0, this.form.on.latitude - 0]),
					departureStartTime: parseTime(time[0] / 1000, '{y}-{m}-{d} {h}:{i}:{s}'),
					departureEndTime: parseTime(time[1] / 1000, '{y}-{m}-{d} {h}:{i}:{s}'),
					// ticketType:1,
					driverId: this.driverId,
					couponId: this.chooseCoupon.id ,//优惠券id
					fromCity: this.line.fromCity
				}
				uni.showLoading({
					title: '加载中',
				})
				this.requestLocked = true
				createOrder(data).then(res => {
					uni.hideLoading()
					console.log(res, '------------------res')
					if (res.code == 0) {
						this.orderId = res.data.id
						this.orderNo = res.data.orderNo
						// this.tipShow = true
						let payResult = res.data.payResult

						this.$store.dispatch('user/orderUser', {
							contacts: this.form.contacts,
							contactsMobile: this.form.contactsMobile,
						})
						if(res.data.payAmount===0){ //用完优惠券为0直接成功
							this.requestLocked = false
							this.tipShow = true
							return
						}
						let _this = this
						let myData = {
							timeStamp: payResult.timeStamp,
							nonceStr: payResult.nonceStr,
							package: payResult.packageValue,
							"packageValue": payResult.packageValue,
							signType: payResult.signType,
							paySign: payResult.paySign,
						}
						// console.log(myData,'myData-----------------------')



						uni.requestPayment({
							...myData,
							success: function(res) {
								_this.requestLocked = false
								// uni.hideLoading()
								// wx.setStorageSync('orderdatalist', false)
								// console.log(res,'res')
								_this.tipShow = true
								// wx.navigateTo({
								// 	url: '/pages/chartered/offerDetails/chartedpaySuccess/index?order_id=' + that.data.order_no,
								// })
							},
							fail: function(res) {
								_this.requestLocked = false
								// uni.hideLoading()
								console.log(res)
								uni.navigateTo({
									url: `/subPages/order/orderDetail?orderNo=${_this.orderNo}`
								})
							}
						})
					} else {
						_this.requestLocked = false
					}

				}).catch(() => {
					console.log(6666666666)
					this.requestLocked = false
					uni.hideLoading()
				})
				console.log(data, 'data-------------------')
				// this.form.on = {
				// 	label:data.label,
				// 	address:data.address,
				// 	latitude:data.latitude,
				// 	longitude:data.longitude,
				// }
			},
			goOrderDetail: throttle(function(item) {
				this.tipShow = false
				uni.navigateTo({
					url: `/subPages/order/orderDetail?orderNo=${this.orderNo}`
				})
			}, 1000),
			selectAddress: throttle(function(status) {
				// status 1:上车  2:下车
				// type  1:站点  2:区域
				let map = {
					'1': {
						'1': '1',
						'2': '1',
						'3': '2',
						'4': '2',
					},
					'2': {
						'1': '2',
						'2': '1',
						'3': '2',
						'4': '1',
					}
				}
				let type = map[status][this.line.operationsMode]
				let newObj = {

				}
				if (type == 1) {
					newObj.arr = []
					let {
						station
					} = this
					for (var i = 0; i < station.length; i++) {
						let element = station[i]
						let obj = {}
						if (element.type == status) {

							obj = {
								label: {
									content: element.siteName,
									address: element.address,
									anchorX: -element.siteName.length * 14 / 2 - 4,
									anchorY: '-58',
									padding: '4px',
									borderRadius: '3px',
									borderWidth: '1px',
									borderColor: '#BDBDBD',
									bgColor: '#fff',
									fontSize: '14px',
									color: '#555555',
								},
								id: element.stationId,
								latitude: JSON.parse(element.stationPoint)[1],
								longitude: JSON.parse(element.stationPoint)[0],

								iconPath: '../../static/image/common/coordinateImg.png',
								width: '22px',
								height: '31px',
								city: element.city,
								town: element.town,
								id: element.stationId
							}
							newObj.arr.push(obj)
							newObj.center = JSON.parse(element.centerPoint)
							newObj.city = element.city
							newObj.town = element.town

						}
					}
				} else if (type == 2) {
					newObj.arr = []
					let {
						station
					} = this
					for (var i = 0; i < station.length; i++) {
						let element = station[i]
						// console.log(element.type , status,element.type == status)
						if (element.type == status) {
							newObj.arr = JSON.parse(element.stationLocation)
							newObj.center = JSON.parse(element.centerPoint)
							newObj.city = element.city
							newObj.town = element.town
							newObj.siteName = element.siteName
							newObj.id = element.stationId

						}
					}
				}
				// console.log(newObj,33333)
				this.$store.dispatch('line/setLineDetail', newObj)
				uni.navigateTo({
					url: `/subPages/map/selection?type=${type}&status=${status}&latitude=${this.latitude}&longitude=${this.longitude}`
				})
			}, 1000),
		}
	}
</script>

<style scoped lang="scss">
	.confirm-container {
		min-height: 100vh;
		background-color: #F0F1F4;
	}

	.confirm-title {
		width: 100%;
		background: #fff;
		padding: 13rpx 28rpx;

		.title {
			@include fs(36rpx, 600, #272727, 50rpx);
			margin-bottom: 17rpx;
		}

		.warringImg {
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
			margin-bottom: 17rpx;
		}

		.warringText {
			@include fs(26rpx, 500, #666, 32rpx);
			margin-bottom: 17rpx;
		}

		.title-label {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			margin-left: 12rpx;
			background: #999;
		}

		.title-text {
			@include fs(26rpx, 500, #999, 32rpx);
		}
	}

	.confirm-content {
		padding: 24rpx 24rpx 154rpx;

		.confirm-label {
			padding: 25rpx 28rpx 45rpx;
			height: 110rpx;
			background: #FFF5E2;
			border-radius: 20rpx;
			@include fs(28rpx, 600, #ff8800, 32rpx);
			align-items: center;

			.labelImg {
				width: 40rpx;
				height: 40rpx;
				margin-right: 22rpx;
			}
		}

		.contacts-data {
			padding: 35rpx 30rpx 16rpx;
			background-color: #fff;
			border-radius: 12rpx;
		}

		.form-data {
			padding: 28rpx 24rpx 4rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: -20rpx;
		}

		.form {
			margin-bottom: 20rpx;

			&-title {
				@include fs(30rpx, 500, #272727, 32rpx);
				margin-bottom: 10rpx;
			}

			.tip-text {
				@include fs(24rpx, 400, #999, 29rpx);
				margin: 20rpx 10rpx 0;
			}

			&-item {
				@include fs(28rpx, 400, #272727, 32rpx);
				border-bottom: 1rpx solid #EEEEEE;
				padding: 23rpx 0 22rpx;

				// margin: 0 10rpx;
				&-label {
					width: 12rpx;
					height: 12rpx;
					border-radius: 50%;
					margin-right: 16rpx;
					background: #FF8800;
				}

				&-labels {
					margin-right: 32rpx;
					@include fs(32rpx, 400, #272727, 32rpx);
				}

				&-right {
					width: 200rpx;
				}

				.numImg {
					width: 44rpx;
					height: 44rpx;
				}

				&-value {
					flex: 1;
					@include fs(32rpx, 400, #272727, 32rpx);
				}

				.contacts-item-input {
					@include fs(32rpx, 400, #272727, 32rpx);
					width: 100%;
					// @include fs(32rpx,400,#272727,32rpx);

				}

				&:last-child {
					border-bottom: none;
				}

				.green {
					background-color: #0AC7BB;
				}

				.blue {
					background-color: #50A6FF;
				}
			}
		}

		.timeImg {
			width: 40rpx;
			height: 40rpx;
			// margin-right: 16rpx;
		}

		.contacts {
			&-title {
				@include fs(30rpx, 400, #272727, 32rpx);
				margin-bottom: 10rpx;
			}

			&-item {
				border-bottom: 1rpx solid #EEEEEE;
				padding: 23rpx 0 22rpx;

				&-label {
					// width: 96rpx;
					margin-right: 20rpx;
					@include fs(28rpx, 400, #272727, 32rpx);
				}

				&-value {
					flex: 1;
					@include fs(32rpx, 400, #272727, 32rpx);
				}

				&-input {
					// @include fs(32rpx,400,#272727,32rpx);
				}

				&:last-child {
					border-bottom: none;
				}
			}

			.mustImg {
				width: 14rpx;
				height: 14rpx;
				margin-right: 50rpx;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #FFFFFF;
		border-top: 1rpx solid #DBDBDB;
		padding: 24rpx 20rpx 30rpx;
		z-index: 11000;

		.form-btn {
			width: 320rpx;
			height: 80rpx;
			background-color: #FFCC00;
			border-radius: 40rpx;
			text-align: center;
			@include fs(32rpx, 400, #272727, 80rpx);
			margin: 0;
			border: none;

			&:after {
				border: none;
			}
		}

		.warringImg {
			width: 28rpx;
			height: 28rpx;
			margin-left: 16rpx;
		}

		.downView {
			@include fs(26rpx, 400, #999, 30rpx);
		}

		.downImg {
			width: 32rpx;
			height: 32rpx;
			margin-left: 10rpx;
			margin-right: 20rpx;
		}

		.total-text {
			@include fs(28rpx, 400, #272727, 40rpx);
			margin-right: 10rpx;
		}

		.total-number {
			@include fs(40rpx, 600, #FF8800, 40rpx);
		}

		.ft28 {
			font-size: 28rpx;
		}
	}

	.tipPopup {
		padding: 40rpx 50rpx;
		width: 600rpx;
		box-sizing: border-box;

		.tipImgs {
			width: 32rpx;
			height: 32rpx;
			margin-right: 12rpx;
		}

		.tipTitle {
			@include fs(32rpx, 600, #272727, 45rpx);
			margin-bottom: 40rpx;
		}

		.tipText {
			@include fs(28rpx, 400, #272727, 42rpx);
			margin-bottom: 32rpx;

			&:last-child {
				margin-bottom: 40rpx;
			}
		}

		.tipBtn {
			@include fs(32rpx, 400, #272727, 80rpx);
			text-align: center;
			padding: 0 76rpx;
			// width: 280rpx;
			display: inline-block;
			margin: auto;
			background: #FFCC00;
			border-radius: 46rpx;

		}
	}

	.rulesImgs {
		width: 500rpx;
		height: 290rpx;
	}

	.card {
		text-align: right;
		flex: 1;
		@include fs(26rpx, 400, #999, 30rpx);
		padding-right: 10rpx;
	}

	.havsCard {
		@include fs(26rpx, 400, #FF8800, 30rpx);
	}

	.tip3-left {
		@include fs(30rpx, 400, #272727, 35rpx);
	}

	.tip3-right {
		@include fs(36rpx, 500, #272727, 42rpx);

	}

	.tip3-spec {
		@include fs(26rpx, 400, #272727, 30rpx);
		margin-left: 10rpx;
	}
	.card-item{
		 display: flex;
		 flex-direction: row-reverse;
		 justify-content: space-between;
		 align-items: center;
		 width: 100%;
		 height: 200rpx;
		 border-radius: 20rpx;
		 margin-bottom: 24rpx;
		 background: #fff;
		 padding: 30rpx 0 30rpx 30rpx;
		 .u-icon_icon{
		 	color: #272727;
		 }
		 .card-item-center{
			 margin-left: 10rpx;
			 .center-top{
				 display: flex;
				 width: 380rpx;
				 margin-top: 25rpx;
				 .view1{
					 width: 80rpx;
					 height: 34rpx;
					 background: #FFCC00;
					 border-radius: 6rpx;
					 @include fs(22rpx, 400, #424036, 34rpx);
					 text-align: center;
					 margin-right: 12rpx;
				 }
				 .view2{
					width: 284rpx;
					@include fs(30rpx, 600, #272727, 35rpx);
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				 }
			 }
			 .center-bottom{
				 @include fs(26rpx, 400, #666, 30rpx);
				 margin-top: 25rpx;
			 }
		 }
		 .card-item-left{
			 .left-top{
				 text-align: center;
				 @include fs(60rpx, 400, #FF8800, 70rpx);
			 }
			 .text1{
				 @include fs(24rpx, 400, #FF8800, 28rpx);
			 }
			 .left-bottom{
				 text-align: center;
				 @include fs(26rpx, 400, #666, 30rpx);
				 margin-top: 16rpx;
			 }
		 }
	}
	.tipPopup4{
		 width: auto;
		 padding:25rpx 25rpx 40rpx 25rpx;
		 background: #F5F5F5;
	}
	.card-button-view{
		height: 115rpx;
		padding: 25rpx 25rpx 0 0;
	}
	.card-button{
		
	border-radius: 45rpx;
	height: 90rpx;
	@include fs(32rpx, 400, #272727, 90rpx);
	background: #FFCC00;
	border: none;
	}
	.card-button:after{
		border: none;
	}
	
	.uradio{
		/deep/ .u-radio__icon-wrap--disabled{
			background: #fff;
		}
		/deep/ .u-radio__icon-wrap--disabled--checked{
			background: #FFCC00;
			border-color: #FFCC00;
			
			.uicon-checkbox-mark{
				color: #272727 !important;
			}
		}
	}
</style>
