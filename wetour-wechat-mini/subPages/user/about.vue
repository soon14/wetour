<template>
	<view class="about-box">
		<uni-nav-bar
		  backgroundColor="fff"
		  statusBar
			fixed
			title="关于我们"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
			  <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="about-container">
			<!-- <view class="">
				微巴士是由浙江优巴科技有限公司打造的全球领先的数字化出行定制平台，提供车辆智能硬件、智能云调度、出行数据库、云安全等服务。平台严选多家星级运力企业，通过人工智能、大数据提供基于校园、 旅游、通勤等多场景的一站式出行解决方案。
			</view> -->
			<view class="">
				Wetour于2022年1月成立，专注全球华人私人定制出境游服务，业务包含接送机服务/当地包车游/体验项目门票/高端酒店代订/签证办理/机票代订。Wetour甄选海量目的地优质运力方，业务覆盖全球多个城市，并根据行程安排最佳出游方案，给用户提供便捷舒适的出境游服务。
			</view>
		</view>
			
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onShow() {
			// console.log(moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf())
			// this.showTime()
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.about-box{
		min-height: 100vh;
		background-color: #F8F8F8;
	}
	.about-container{
		padding: 20rpx 16rpx 32rpx;
		background-color: #fff;
		@include fs(32rpx,400,#666666,48rpx);
	}
</style>
