<template>
	<view class="audit-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="关于我们" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>


		<view class="audit-content" :style="{  'max-height': `calc(100vh - ${statusBarHeight})`,
		'height': `calc(100vh - ${statusBarHeight})`  }">
			<view class="txt">
				微巴士是由浙江优巴科技有限公司打造的全球领先的数字化出行定制平台，提供车辆智能硬件、智能云调度、出行数据库、云安全等服务。平台严选多家星级运力企业，通过人工智能、大数据提供基于校园、
				旅游、通勤等多场景的一站式出行解决方案。
			</view>
			<view class="txt">作为国家高新技术企业，现已获得软著30余项，商标10余项。</view>
			<view class="txt">企业运营至今，微巴士始终以助力巴士行业产业升级为己任，致力于打造“数据+平台+算法+运营”的一站式巴士服务平台。</view>

		</view>
	</view>

</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
	export default {
		data() {
			return {
				statusBarHeight: statusBarHeight,
			}
		}
	}
</script>

<style scoped lang="scss">
	.audit-box {
		overflow: hidden;
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.title-right {
		@include fs(28rpx, 400, #272727, 40rpx);
	}

	.audit-content {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}

	.txt {
		padding: 28rpx 16rpx 0rpx 16rpx;
		@include fs(28rpx, 400, #555555, 42rpx);
	}
</style>
