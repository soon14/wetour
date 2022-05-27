<template>
	<view class="appointmentFrom">
		<view class="appointmentView flex-start" >
			<!-- <view class="w50"> -->
				
				
			<view class="w50 flex-start" style="align-items: flex-end;">
				<view class="" >
					<view class="appointmentView-label ">
						接机机场
					</view>
					<view class="flex-between">
						<view class="appointmentView-value" @click="ChoseAircraft">
							<input type="text" class="appointmentView-value-input"  :value="from.aircraft.airportName"  disabled="" placeholder="请选择机场" placeholder-style="color:#999999;" />
						</view>
					</view>
				</view>
			</view>
			<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" mode="" style="width: 12rpx;height: 24rpx;margin:38rpx 30rpx 0rpx"></image>
			<view class="w50">
				<view class="appointmentView-label ">
					目的地
				</view>
				<view class="flex-between" @click="selectAddress">
					<view class="appointmentView-value">
						<input type="text" class="appointmentView-value-input"  :value="from.address"  disabled="" placeholder="请选择目的地" placeholder-style="color:#999999;" />
					</view>
				</view>
				
			</view>
				
				
		</view>
		<view class="appointmentView flex-start" style="border-bottom:none;">
			
			<view class="w50 flex-start" style="align-items: flex-end;">
				<view class="" >
					<view class="appointmentView-label ">
						航班落地时间
					</view>
					<view class="flex-between">
						<view class="appointmentView-value" @click="showTime">
							<input type="text" class="appointmentView-value-input"  :value="from.time.label"  disabled="" placeholder="请选择时间" placeholder-style="color:#999999;" />
						</view>
					</view>
				</view>
			</view>
			<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/rightImg.png" mode="" style="width: 12rpx;height: 24rpx;margin:38rpx 30rpx 0rpx"></image>
			<view class="w50">
				<view class="appointmentView-label ">
					航班号
				</view>
				<view class="flex-between" >
					<view class="appointmentView-value">
						<input type="text" class="appointmentView-value-input"  v-model="from.flightNumber" maxlength="8"  placeholder="请填写航班号" placeholder-style="color:#999999;" />
					</view>
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
			:timeZone="from.aircraft.timeZone"
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
		name:"airportPickup",
		data() {
			return {
				dialogVisible:false,
				defaultValue:[0,0,0],
				from:{
					flightNumber:'',
					time:
						{
							label:'',
							value:''
						}
					,
					address:'',
					aircraft:{
						airportName:'',
					}
				},
				city:'杭州',
				addressType:'pickup',
				flightNumberData:{},
				aircraftData:{},
				addressData:{}
			};
		},
		components:{
			selectTime
		},
		methods:{
			ChoseAircraft:throttle(function(){
				if(this.aircraftData.cityCnName){
					uni.navigateTo({
						url: `/subPages/selectAirport/selectAirport?type=${this.addressType}&city=${this.aircraftData.cityCnName}`,
					})
				}else if(this.addressData.city){
					uni.navigateTo({
						url: `/subPages/selectAirport/selectAirport?type=${this.addressType}&city=${this.addressData.city}`,
					})
				}else{
					uni.navigateTo({
						url: `/subPages/selectAirport/selectAirport?type=${this.addressType}`,
					})
				}
				
			},1500),
			setCharterAirport(data){
				console.log(data,33333)
				if(this.aircraftData.threeCharactersCode && this.aircraftData.threeCharactersCode != data.threeCharactersCode){
					this.from.time.label = ''
					this.from.time.value = ''
				}
				if(data.type === this.addressType){
					this.from.aircraft = data
					this.aircraftData = data
				}
				
			},
			
			
			
			showTime(){
				if(!this.from.aircraft.airportName){
					return uni.showToast({
						title: '请先选择接机机场',
						duration: 2000,
						icon: "none"
					})
				}
				this.dialogVisible = true
			},
			confirm(data){
				console.log(data,33333)
				
				this.from.time.label = parseTime(data.time,'{m}月{d}日 {h}:{i}')
				this.from.time.value = data.time
				this.defaultValue = data.default
			},
			
			
			// selectFlight:throttle(function(){
			// 	uni.navigateTo({
			// 		url:"/subPages/selectFlight/selectFlight",
			// 	})
			// },1500),
			// setCharterFlight(data){
			// 	this.flightNumberData = data
			// 	console.log(data,33333)
			// 	let myTime  = moment(data.time,'YYYY/MM/DD HH:mm:ss').valueOf()
			// 	this.from.time.label = parseTime(myTime,'{m}月{d}日 {h}:{i}')
			// 	this.from.time.value = myTime
			// 	this.from.flightNumber = data.name
			// },
			
			
			selectAddress:throttle(function(){
				console.log(this,3333)
				if(this.from.address){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${this.addressType}&city=${this.addressData.city}&timeZone=${this.addressData.timeZone}&code=${this.addressData.departureCityCode}`
					})
				}else if(this.aircraftData.cityCnName){
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${this.addressType}&city=${this.aircraftData.cityCnName}`
					})
				}else{
					let city = ''
					if(this.aircraftData.cityCnName){
						 city =`&city=${this.aircraftData.cityCnName}`
					}
					// cityCnName
					uni.navigateTo({
						url:`/subPages/selectAddress/selectAddress?type=${this.addressType}${city}`
					})
				}
				
				
			},1500),
			
			
			setCharterAddress(data){
				console.log(data,'-----------',this.addressType,data.type === this.addressType)
				if(data.type === this.addressType){
					this.addressData = data
					this.from.address = data.label.content
					console.log(data.label.content,'data.label.content')
				}
			},
			submitBtn:throttle(function(){
				if(!this.from.aircraft.airportName){
					return uni.showToast({
						title: '请先选择接机机场',
						duration: 2000,
						icon: "none"
					})
				}
				
				if(!this.from.address){
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
					
					
					departureAddress:this.from.aircraft.airportName,  //出发地址
					departureCity:this.from.aircraft.cityCnName,   //出发城市	
					departureCityCode:this.from.aircraft.cityCnId,   //出发城市代码对应城市表里的ID
					departureLongitude:this.from.aircraft.longitude,   // 经度
					departureLatitude:this.from.aircraft.latitude,   //纬度
					flightCode:this.from.aircraft.threeCharactersCode,
					charteredCarType:2,   //包车类型 1日租 2接机 3 送机 4单车
					flightNumber:this.from.flightNumber,
					
					isForeign:this.aircraftData.countryName=='中国'?0:1,
					
					destinationLongitude:this.addressData.longitude,   // 经度
					destinationLatitude:this.addressData.latitude,   //纬度
					destinationAddress:this.addressData.label.content,  //目的地地址
					destinationCity:this.addressData.city,  //目的地城市
					destinationCityCode:this.addressData.code,  //目的地城市代码对应城市表里的ID
					destination:this.addressData.label.address,  //目的地城市代码对应城市表里的ID
					
					

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
			// bus.$on('setCharterFlight', this.setCharterFlight ) 
			bus.$on('setCharterAirport', this.setCharterAirport )
			bus.$on('setCharterAddress', this.setCharterAddress ) 
			
			
		},
		beforDestory () {
		// 　　this.$off('setCharterFlight',this.setCharterFlight )
			
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
