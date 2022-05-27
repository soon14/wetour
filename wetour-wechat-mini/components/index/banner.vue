<template>
	<view class="wrap" >
		<!-- <text>list[0]</text> -->
		<image class="img"  :src="list[0].image" mode="widthFix"></image>
		
		<!-- <u-swiper border-radius="0" class="mySwiper"  :class="bottom?`bottom-${bottom}`:''" :list="list" :interval="3000" :height="height"></u-swiper> -->
	</view>
</template>

<script>
	
	export default {
		options: { styleIsolation: 'shared' },
		data() {
			return {
				// list: [{
				// 		image: require('http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourmo/banner1.png'),
				// 	},
				// 	{
				// 		image: require('http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourmo/banner2.png'),
				// 	},
				// 	// {
				// 	// 	image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
				// 	// }
				// ],
			}
		},
		props:{
			list:{
				type:Array,
				default:[
					
				]
			},
			height:{
				type:Number,
				default:600
			},
			bottom:{
				type:Number,
				default:0
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.img{
		width: 100%;
	}
	.mySwiper {
		
		
		/deep/ .u-swiper-indicator{
			bottom: 110rpx !important;
		}
	}
	// .bottom-80{
	// 	/deep/ .u-swiper-indicator{
	// 		bottom: 80rpx !important;
	// 	}
	// }
	
</style>
