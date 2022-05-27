<template>
	<view class="no-invoice" :class="className" :style="{'padding-top':top+'rpx'}">
		<!-- imgType == 1 ? : img2 -->
	  <image :src="img1"></image>
	  <text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		props:{
			text:{
				type:String,
				default:'啊噢~您还没订单哟~'
			},
			className:{
				type:String,
				default:''
			},
			imgType:{
				type:String,
				default:'1'
			},
			top:{
				type:Number,
				default:160
			}
			
		},
		data(){
			return {
				img1:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/no_order.png',
				//img2:'http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/no_login.png',
				
			}
		},
		
	}
</script>

<style>
</style>
