<template>
	<view class="appointmentFrom">
		<view class="appointmentView flex-start">
			<view class="w50">
				<view class="appointmentView-label ">
					出发地
				</view>
				<view class="flex-between" @click="selectAddress('depart')">
					<view class="appointmentView-value">
						<input type="text" class="appointmentView-value-input"  :value="from.departAddress"  disabled="" placeholder="请选择出发地" placeholder-style="color:#999999;" />
					</view>
				</view>
			</view>
			
			<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" mode="" style="width: 12rpx;height: 24rpx;margin:38rpx 30rpx 0rpx"></image>
			<view class="w50 flex-start" style="align-items: flex-end;">
				<view class="" style="flex: 1;">
					<view class="appointmentView-label ">
						目的地
					</view>
					<view class="flex-between" @click="selectAddress('destination')">
						<view class="appointmentView-value">
							<input type="text" class="appointmentView-value-input"  :value="from.destinationAddress"  disabled="" placeholder="请选择目的地" placeholder-style="color:#999999;" />
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="appointmentView" style="border-bottom:none;">
			<view class="appointmentView-label">
				用车时间(当地)
			</view>
			<view class="flex-between">
				<view class="appointmentView-value" @click="showTime">
					<input type="text" class="appointmentView-value-input"  :value="from.time.label"  disabled="" placeholder="请选择用车时间" placeholder-style="color:#999999;" />
				</view>
			</view>
		</view>
		
		<!-- <view class="appointmentBtn" @click="submitBtn">
			立即查询
		</view> -->
		
		<view class="appointmentBtn" @click="submitBtn" v-if="userInfo.mobile">
			立即查询
		</view>
		<button class="appointmentBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"  v-if="!userInfo.mobile">立即查询</button>
		<select-time
			v-if="dialogVisible"
		    :dialogVisible.sync="dialogVisible"
			:defaultValue="defaultValue"
			@confirm="confirm"
			 :timeZone="departAddressData.timeZone" 
		></select-time>
		<!-- :timeZone="departAddressData.timeZone" -->
	</view>
</template>

<script>
	import bus from '@/utils/bus'
	import moment from "moment"
	import { parseTime, throttle } from "@/utils/common"
	import selectTime from "@/components/selectTime.vue"
	import {mapGetters} from 'vuex'
	import { userBindPhone } from "@/api/user"
	export default {
		computed:{
			...mapGetters([
				'userInfo',
			]),
		},
		name:"oneWay",
		components:{
			selectTime,
		},
		data() {
			return {
				dialogVisible:false,
				defaultValue:[0,0,0],
				list:[],
				from:{
					city:'',
					time:
						{
							label:'',
							value:''
						}
					,
					departAddress:'',
					destinationAddress:'',
				},
				departAddressData:{},
				destinationAddressData:{},
				city:'杭州',
			};
		},
		methods:{
			showTime(){
				if(!this.from.departAddress){
					return uni.showToast({
						title: '请先选择出发地',
						duration: 2000,
						icon: "none"
					})
				}
				this.dialogVisible = true
			},
			confirm(data){
				console.log(data,33333)
				
				this.from.time.label = parseTime(data.time,'{m}月{d}日 {a} {h}:{i}')
				this.from.time.value = data.time
				this.defaultValue = data.default
			},
			selectAddress:throttle(function(addressType){
				
				if(this.from.departAddress && addressType == 'depart'){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${addressType}&city=${this.departAddressData.city}&timeZone=${this.departAddressData.timeZone}&code=${this.departAddressData.departureCityCode}`
					})
				}else if(this.from.destinationAddress && addressType == 'depart'){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${addressType}&city=${this.destinationAddressData.city}&timeZone=${this.destinationAddressData.timeZone}&code=${this.destinationAddressData.departureCityCode}`
					})
				}else if(this.from.destinationAddress && addressType == 'destination'){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${addressType}&city=${this.destinationAddressData.city}&timeZone=${this.destinationAddressData.timeZone}&code=${this.destinationAddressData.departureCityCode}`
					})
				}else if(this.from.departAddress && addressType == 'destination'){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${addressType}&city=${this.departAddressData.city}&timeZone=${this.departAddressData.timeZone}&code=${this.departAddressData.departureCityCode}`
					})
				}else{
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${addressType}`
					})
				}
				
			},1500),
			setCharterAddress(data){
				console.log(data,'-----------',this.addressType,data.type === this.addressType)
				if(data.type === 'depart'){
					if(this.departAddressData.timeZone && this.departAddressData.timeZone != data.timeZone){
						this.from.time.label = ''
						this.from.time.value = ''
					}
					this.departAddressData = data
					this.from.departAddress = data.label.content
				}
				if(data.type === 'destination'){
					this.destinationAddressData = data
					this.from.destinationAddress = data.label.content
				}
				
			},
			submitBtn:throttle(function(){
				if(!this.departAddressData.city){
					return uni.showToast({
						title: '请先选择出发地',
						duration: 2000,
						icon: "none"
					})
				}
				if(!this.destinationAddressData.city){
					return uni.showToast({
						title: '请先选择目的地',
						duration: 2000,
						icon: "none"
					})
				}
				
				if(!this.from.time.value){
					return uni.showToast({
						title: '请先选择用车时间',
						duration: 2000,
						icon: "none"
					})
				}
				
				let data = {
					departureStartTime:this.from.time.value, //出发时间（用车时间）
					departureAddress:this.departAddressData.label.content,  //出发地址
					departure:this.departAddressData.label.address,  //出发地址具体地址
					departureCity:this.departAddressData.city,   //出发城市	
					departureCityCode:this.departAddressData.code,   //出发城市代码对应城市表里的ID
					departureLongitude:this.departAddressData.longitude,   // 经度
					departureLatitude:this.departAddressData.latitude,   //纬度
					charteredCarType:4,   //包车类型 1日租 2接机 3 送机 4单车
					isForeign:(this.departAddressData.telephoneCode == '86' || this.departAddressData.telephoneCode == '+86')?'0':'1',
					destinationLongitude:this.destinationAddressData.longitude,   // 经度
					destinationLatitude:this.destinationAddressData.latitude,   //纬度
					destinationAddress:this.destinationAddressData.label.content,  //目的地地址
					destination:this.destinationAddressData.label.address,  //出发地址具体地址
					destinationCity:this.destinationAddressData.city,  //目的地城市
					destinationCityCode:this.destinationAddressData.code,  //目的地城市代码对应城市表里的ID
				}
				console.log(data)
				this.$store.dispatch('user/setOrderInfo',data)
				// return false
				uni.navigateTo({
					url: `/subPages/selectBus/selectBus`,
				})
			},1500),
			getPhoneNumber({ detail }) {
				console.log(detail,3333333)
				if (detail.errMsg === 'getPhoneNumber:ok') {
					console.log(detail)
					userBindPhone(detail.code).then(res=>{
						console.log(res,'----------------------------')
						if(res.code == 0 ){
							this.$store.dispatch('user/getUserInfo')
							// this.$store.dispatch('user/setLogin', true)
						}
					})
				} else {
					uni.showToast({
						title: '您取消了授权',
						icon: 'none'
					})
				}
			},
		},
		created () {
			bus.$on('setCharterAddress', this.setCharterAddress )
		},
		beforDestory () {
		},
		destroyed() {
			console.log('destroyed-------------')
			bus.$off('setCharterAddress',this.setCharterAddress )
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/appointment.scss";
	button::after{ border: none; }
</style>
