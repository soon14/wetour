<template>
	<view class="">
<!-- 		<uni-nav-bar
		  backgroundColor="#F5F5F5"
		  statusBar
			fixed
			title="新手指南"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
			  <image src="@/static/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar> -->
		<web-view :src="url" bindmessage="getMessage"></web-view>
	</view>
</template>

<script>
	import configs from '@/config.js'
	import {mapGetters} from 'vuex'
	export default {
		data(){
			return {
				url:''
			}
		},
		computed:{
			...mapGetters([
				'userInfo',
				'access_token'
			]),
		},
		
		onLoad (options) {
			let url = ''
			if (options.url) {
				url = configs.h5url + '/' + options.url+'?t='+new Date().getTime()
			} else {
				url = configs.h5url + '/serveAgreement.html'+'?t='+new Date().getTime()
			}
			console.log(url)
			this.url = url
		}
	}
</script>

<style>
</style>
