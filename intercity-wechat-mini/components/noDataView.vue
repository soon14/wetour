<template>
	<view class="no-invoice" :class="className">
	  <image src="@/static/img/no_order.png"></image>
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
			}
		},
		
	}
</script>

<style>
</style>
