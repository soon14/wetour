<template>
	<view class="audit-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="我的审核" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>

		<view class="audit-content" :style="{  'max-height': `calc(100vh - ${statusBarHeight})`,
		'height': `calc(100vh - ${statusBarHeight})`  }">

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
</style>
