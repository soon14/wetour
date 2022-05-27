<template>
	<view>
		<!-- :default-value="defaultValue" -->
		<u-select v-model="visible"  :list="list" @confirm="confirm" :mask-close-able="false" @cancel="cancel" ></u-select>
	</view>
</template>

<script>
	import { parseTime, throttle, getLocalTime } from "@/utils/common"
	import { getSelectCity } from "@/api/order.js"
	import pyjs from 'js-pinyin'
	export default {
		name:"selectCityModal",
		data() {
			return {
				list:[]
			};
		},
		created() {
			this.getSelectCity()
			// this.list = list
		},
		props:{
			dialogVisible: {
				type: Boolean,
				default: false
			},
			// defaultValue:{
			// 	type:Array,
			// 	default:[0,0,0]
			// },
			
		},
		computed:{
			visible: {
				get() {
				  if(this.list.length){
					  return this.dialogVisible;
				  }else{
					  return false
				  }
				},
				set(val) {
				  this.$emit("update:dialogVisible", val); 
				}
			},
		},
		methods:{
			confirm(e){
				this.$emit('confirm',e[0])
			},
			cancel(){
				this.visible = false
			},
			getSelectCity(){
				
				getSelectCity().then(res=>{
					let arr = []
					res.data.forEach(element=>{
						arr.push({
							...element,
							py:pyjs.getFullChars(element.city).toUpperCase(),
							label:element.city,
							value:element.id+'_'+element.timeZone+'_'+element.telephoneCode,
						})
					})
					arr.sort(function(a,b){
					    return a.py.localeCompare(b.py);})
					
					this.list = arr
				}).catch(e=>{
					this.visible = false
					console.log(666666)
				})
			},
		}
	}
</script>

<style>

</style>
