<template>
	<view class="appointmentFrom">
		<view class="appointmentView">
			<view class="appointmentView-label">
				出发城市
			</view>
			<view class="flex-between">
				<view class="appointmentView-value" @click="ChoseDay">
					<input type="text" class="appointmentView-value-input"  :value="from.city"  disabled="" placeholder="请选择出发城市" placeholder-style="color:#999999;"/>
				</view>
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/index/location.png" mode="" style="width: 30rpx;height: 36rpx;"></image> -->
			</view>
		</view>
		<view class="appointmentView" style="border-bottom:none;">
			<view class="appointmentView-label">
				用车时间(当地时间)
			</view>
			<view class="flex-between">
				<view class="appointmentView-value" @click="ChoseTime">
					<input type="text" class="appointmentView-value-input"  :value="from.time.label"  disabled="" placeholder="请选择时间" placeholder-style="color:#999999;" />
				</view>
			</view>
		</view>
		<!-- <view class="appointmentBtn" @click="submitBtn" >
			立即查询
		</view> -->
		<view class="appointmentBtn" @click="submitBtn" v-if="userInfo.mobile">
			立即查询
		</view>
		<button class="appointmentBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"  v-if="!userInfo.mobile">立即查询</button>
	</view>
</template>

<script>
	import bus from '@/utils/bus'
	import moment from "moment"
	import { parseTime, throttle } from "@/utils/common"
	import {mapGetters} from 'vuex'
	import { userBindPhone } from "@/api/user"
	export default {
		name:"charter",
		computed:{
			...mapGetters([
				'userInfo',
			]),
		},
		data() {
			return {
				
				from:{
					city:'',
					time:
						{
							label:'',
							value:''
						}
					,
				},
				cityData:{
					
				}
			};
		},
		methods:{
			//选取出发时间
			ChoseTime:throttle(function(){
				if(!this.from.city){
					return uni.showToast({
						title: '请先选择城市',
						duration: 2000,
						icon: "none"
					})
				}
				let date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				day = day < 10 ? '0' + day : day;
				var timestring = year + "" + month + "" + day;
				uni.navigateTo({
					url: '/subPages/selectDay/index?s_day=' + timestring + '&ptype=0&city='+this.from.city+'&timeZone='+this.cityData.timeZone+`&cityCode=${this.cityData.id}`,
				})
			},1500),
			// ChoseTimeSelect(time){
			// 	console.log(time,'-2')
			// },
			ChoseDay:throttle(function(){
				uni.navigateTo({
					url: '/subPages/selectCity/selectCity',
				})
			},1500),
			setCharterDay(data){
				if(this.cityData.timeZone && this.cityData.timeZone != data.timeZone){
					this.from.time.label = ''
					this.from.time.value = ''
				}
				console.log(data,33333,333344444)
				this.cityData = data
				this.from.city = data.city
			},
			setCharterTime(data){
				console.log(data,3333)
				let myTime  = moment(data.time).valueOf()
				console.log(data.time,myTime,'setCharterTime')
				this.from.time.label = parseTime(myTime,'{m}月{d}日 {a} {h}:{i}')
				this.from.time.value = myTime
				console.log(this.from.time)
			},
			submitBtn:throttle(function(){
				if(!this.cityData.city){
					return uni.showToast({
						title: '请先选择出发城市',
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
					departureCity:this.cityData.city,   //出发城市	
					departureCityCode:this.cityData.id,   //出发城市代码对应城市表里的ID
					charteredCarType:1,   //包车类型 1日租 2接机 3 送机 4单车
					timeZone:Number(this.cityData.timeZone),
					isForeign:(this.cityData.telephoneCode == '86' || this.cityData.telephoneCode == '+86')?'0':'1',
				}
				this.$store.dispatch('user/setOrderInfo',data)
				
				
				uni.navigateTo({
					url: `/subPages/dayCharter/dayCharter`,
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
			console.log('created--------')
			bus.$on('setCharterTime', this.setCharterTime ) 
			bus.$on('setCharterDay', this.setCharterDay ) 
		},
		beforDestory () {
			console.log('beforDestory------------')
		　　
		},
		destroyed() {
			console.log('destroyed-------------')
			bus.$off('setCharterTime',this.setCharterTime )
		　　bus.$off('setCharterDay',this.setCharterDay )
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/appointment.scss";
	.appointmentView-value{
		font-size: 36rpx;
	}
	// button::after{ border: none; }
</style>
