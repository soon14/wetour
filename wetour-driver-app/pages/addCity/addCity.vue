<template>
	<view class="addCity">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="添加城市" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>
		<view class="addCity_top">
			<image src="@/static/login/search.png" class="addCity-img"></image>
			<input class="addCity_input" placeholder-class="addCity_input_te" v-model="search" maxlength="50"
				placeholder="请输入城市搜索" @focus="inputfocus = true"
				 @input="inputChange(search)"/>
			<view class="addCity_false" :class="inputfocus?'addCity_false_focus':''" @click="clickFalse">取消</view>
		</view>
		<view class="list" :style="{ 'height': `calc(100vh - ${statusBarHeight} - 240rpx)`}">
			<view @click="checkboxChange(value,index)" class="list_li" v-for="(value,index) in list">
				<image :src="value.check?'../../static/img/check_select.png':'../../static/img/check_unselect.png'"
					class="choose_agreement"></image>
				<view>{{value.name}}</view>
			</view>
		</view>
		<view class="search" v-show="inputfocus" :style="{ 'height': `calc(100vh - ${statusBarHeight} - 240rpx)`,'top':`calc( ${statusBarHeight} + 88rpx)`}">
			<view @click="chooseSearch(value,index)" class="list_li" v-for="(value,index) in searchlist">
				<view>{{value.name}}</view>
			</view>
			<no-data-view v-show="!searchlist.length&&search" :text="'啊噢~该城市还没有开通~'"></no-data-view>
		</view>
		<view class="bottom2">

		</view>
		<view class="bottom" v-show="!inputfocus">
			<button class="bottom_button" @click="clickButton">确定</button>
		</view>
	</view>
</template>
<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	import {getCity} from '@/api/login.js'
	import pyjs from 'js-pinyin'
	import noDataView from '@/components/noDataView.vue';
	export default {
		components: {
				noDataView
			},
		data() {
			return {
				statusBarHeight: statusBarHeight,
				oldlist:[], //父级选中的数据
				// mockList:['阿勒泰','安康','鞍山','安庆','包头','毕节','北京','巴中','长春'],
				list: [], //排序过的数据
				search: '',  //搜索条件
				searchlist:[], //搜索后的列表
				inputfocus: false, //搜索获得焦点
				choose: false
			};
		},
		onLoad(option) {
			 const eventChannel = this.createEvent()
			  eventChannel.on('acceptDataFromOpenerPage', (data)=> {
			    console.log(data,'acceptDataFromOpenerPage')
				this.oldlist = data.data
				this.getDetail(option.country)
			  })  
		},
		methods: {
			createEvent(){
				// #ifdef APP-NVUE
				 const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
				 // #endif
				 // #ifndef APP-NVUE
				 const eventChannel = this.getOpenerEventChannel();
				 // #endif
				 return eventChannel
			},
			clickFalse() { //点击取消
				console.log(111)
				this.search = ''
				this.searchlist = []
				this.inputfocus = false
			},
			inputChange(e){
				console.log(e)
				if(e===''){
					return
				}
				uni.$u.debounce(()=>{
					let arr = []
					this.list.forEach(res=>{
						if(res.name.indexOf(e)!==-1){
							arr.push(res)
						}
					})
					console.log(arr)
					this.searchlist = arr
				})
			},
			checkboxChange(value,index){
				this.$set(this.list[index],'check',!value.check)
			},
			chooseSearch(value,index){
				const eventChannel = this.createEvent()
				let oldlist = this.oldlist
				if(oldlist.every(val=> val.id!==value.id)){
					oldlist.push(value)
				}
				eventChannel.emit('acceptDataFromOpenedPage', {data: oldlist});
				uni.navigateBack()
			},
			clickButton(){
				const eventChannel = this.createEvent()
				 const checkdata = this.list.filter(res=>{
					 return res.check===true
				 })
				eventChannel.emit('acceptDataFromOpenedPage', {data: checkdata});
				uni.navigateBack()
			},
			getDetail(country){
				getCity({country:country,size:999}).then(res=>{
					console.log(res,'getDetail')
					if(res.code===0){
						res.data.records.forEach(val=>{
							this.oldlist.forEach(val2=>{
								if(val.id===val2.id){
									val.check = true
								}
							})
						})
						this.pinyin(res.data.records)
					}
				})
			},
			pinyin(citys){
				let arr = []
				citys.forEach(element => {
					arr.push({
						name: element.city,
						py: pyjs.getCamelChars(element.city),
						id:element.id,
						check:element.check?true:false
					})
				})
				arr.sort(function(a, b) {
					return a.py.localeCompare(b.py);
				})
				console.log(arr, '3333')
				this.list = arr
			}
		}
	}
</script>

<style scoped lang="scss">
	.addCity {
		width: 100vw;
		height: 100vh;
		background: #FFFFFF;
		padding: 0 16rpx;
		position: relative;
		overflow-y: hidden;
	}
	.addCity_top {
		width: 100%;
		height: 68rpx;
		margin-bottom: 20rpx;
		background: #F5F5F5;
		opacity: 1;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.addCity-img {
			width: 30rpx;
			height: 30rpx;
			margin: 0 20rpx;
		}
		.addCity_input {
			width: 540rpx;
			@include fs(24rpx, 400, #272727, 24rpx);
		}
		.addCity_false {
			width: 100rpx;
			height: 100%;
			@include fs(28rpx, 400, #555, 68rpx);
			background: white;
			text-align: center;
			visibility: hidden
		}
		.addCity_false_focus {
			visibility: visible;
		}
	}
	.list {
		width: 100%;
		overflow: hidden;
		overflow-y: scroll;
	}

	.list_li {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		padding: 0 16rpx;
		border-bottom: 1px solid #DBDBDB;
		.choose_agreement {
			width: 36rpx;
			height: 36rpx;
			margin-right: 24rpx;
		}
	}
	.search {
		width: 100%;
		position: absolute;
		left: 0;
		background: #FFFFFF;
		padding: 0 16rpx;
		overflow: hidden;
		overflow-y: scroll;
		z-index: 100;
	}
	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 140rpx;
		background-color: #FFFFFF;
		box-shadow: 0px -2px 10px rgba(184, 172, 128, 0.3);
		.bottom_button {
			width: 650rpx;
			height: 90rpx;
			background: #FFCC00;
			border-radius: 12rpx;
			margin: 36rpx 0 0 50rpx;
			@include fs(32rpx, 400, #272727, 90rpx);
			border: 1px solid #ffffff;
		}
	}
	.bottom2 {
		width: 100%;
		height: 140rpx;
	}
	button:after{
		border: none
	}
</style>
