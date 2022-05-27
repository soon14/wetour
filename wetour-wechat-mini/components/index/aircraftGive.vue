<template>
	<view class="appointmentFrom">
		<view class="appointmentView flex-start">
			
			<view class="w50">
				<view class="appointmentView-label ">
					出发地
				</view>
				<view class="flex-between" @click="selectAddress">
					<view class="appointmentView-value">
						<input type="text" class="appointmentView-value-input" :value="from.address"  disabled="" placeholder="请选择出发地" placeholder-style="color:#999999;" />
					</view>
				</view>
			</view>
			
			<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" mode="" style="width: 12rpx;height: 24rpx;margin:38rpx 30rpx 0rpx"></image>
			<view class="w50 flex-start" style="align-items: flex-end;">
				<view class="" style="flex: 1;">
					<view class="appointmentView-label ">
						送机机场
					</view>
					<view class="flex-between">
						<view class="appointmentView-value" @click="ChoseAircraft">
							<input type="text" class="appointmentView-value-input" :value="from.aircraft.airportName"  disabled="" placeholder="请选择机场" placeholder-style="color:#999999;" />
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
					<input type="text" class="appointmentView-value-input" :value="from.time.label"  disabled="" placeholder="请选择用车时间" placeholder-style="color:#999999;" />
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
			:timeZone="addressData.timeZone"
		></select-time>
	</view>
</template>

<script>
	import bus from '@/utils/bus'
	import moment from "moment"
	import { userBindPhone } from "@/api/user"
	import { parseTime, throttle } from "@/utils/common"
	import selectTime from "@/components/selectTime.vue"
	import {mapGetters} from 'vuex'
	export default {
		computed:{
			...mapGetters([
				'userInfo',
			]),
		},
		name:"aircraftGive",
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
					aircraft:{
						airportName:''
					}
				},
				addressData:{},
				city:'杭州',
				addressType:'give'
			};
		},
		methods:{
			ChoseAircraft:throttle(function(){
				let cityName = ''
				if(this.from.aircraft.cityCnName){
					cityName = `&city=${this.from.aircraft.cityCnName}`
				}else{
					cityName = this.addressData.city?`&city=${this.addressData.city}`:''
				}
				
				uni.navigateTo({
					url: `/subPages/selectAirport/selectAirport?type=${this.addressType}${cityName}`,
					// url: '/subPages/selectAirport/selectAirport',
				})
			},1500),
			setCharterAirport(data){
				console.log(data,'----')
				if(data.type === this.addressType){
					this.from.aircraft = data
				}
			},
			showTime(){
				if(!this.from.address){
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
			
			selectAddress:throttle(function(){
				console.log(this,3333)
				if(this.from.address){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${this.addressType}&city=${this.addressData.city}&timeZone=${this.addressData.timeZone}&code=${this.addressData.departureCityCode}`
					})
				}else if(this.from.aircraft.cityCnName){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${this.addressType}&city=${this.from.aircraft.cityCnName}`
					})
				}else{
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${this.addressType}`
					})
				}
				// uni.navigateTo({
				// 	url:`/subPages/selectAddress/selectAddress?type=${this.addressType}`
				// })
			},1500),
			setCharterAddress(data){
				console.log(data,'-----------',this.addressType,data.type === this.addressType)
				if(this.addressData.timeZone && this.addressData.timeZone != data.timeZone){
					this.from.time.label = ''
					this.from.time.value = ''
				}
				if(data.type === this.addressType){
					this.addressData = data
					this.from.address = data.label.content
					console.log(data.label.content,data,'data.label.content')
				}
			},
			submitBtn:throttle(function(){
				if(!this.addressData.city){
					return uni.showToast({
						title: '请先选择出发地',
						duration: 2000,
						icon: "none"
					})
				}
				if(!this.from.aircraft.airportName){
					return uni.showToast({
						title: '请先选择机场',
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
					departureAddress:this.addressData.label.content,  //出发地址
					departure:this.addressData.label.address,  //出发地址具体地址
					departureCity:this.addressData.city,   //出发城市	
					departureCityCode:this.addressData.code,   //出发城市代码对应城市表里的ID
					departureLongitude:this.addressData.longitude,   // 经度
					departureLatitude:this.addressData.latitude,   //纬度
					charteredCarType:3,   //包车类型 1日租 2接机 3 送机 4单车
					
					isForeign:(this.addressData.telephoneCode == '86' || this.addressData.telephoneCode == '+86')?'0':'1',
					
					destinationLongitude:this.from.aircraft.longitude,   // 经度
					destinationLatitude:this.from.aircraft.latitude,   //纬度
					destinationAddress:this.from.aircraft.airportName,  //目的地地址
					destinationCity:this.from.aircraft.cityCnName,  //目的地城市
					destinationCityCode:this.from.aircraft.cityCnId,  //目的地城市代码对应城市表里的ID
					flightCode:this.from.aircraft.threeCharactersCode,
					
					
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
			
			bus.$on('setCharterAirport', this.setCharterAirport ) 
			bus.$on('setCharterAddress', this.setCharterAddress )
		},
		mounted() {
			
			// this.show = true 
		},
		beforDestory () {
		　　
		},
		destroyed() {
			console.log('destroyed-------------')
			bus.$off('setCharterAirport',this.setCharterAirport )
				bus.$off('setCharterAddress',this.setCharterAddress )
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/appointment.scss";
	// .appointmentView-value{
	// 	overflow: hidden;
	// 	text-overflow:ellipsis;
	// 	white-space: nowrap;
	// }
	button::after{ border: none; }
</style>
