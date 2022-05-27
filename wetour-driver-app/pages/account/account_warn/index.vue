<template>
	<view class="audit-box">
		<uni-nav-bar backgroundColor="#FFFFFF" statusBar fixed title="开票说明" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="@/static/img/lefts.png" style="height: 40rpx;width: 40rpx;vertical-align: text-bottom;">
				</image>
			</navigator>
		</uni-nav-bar>
		<view class="audit-content" :style="{  'max-height': `calc(100vh - ${statusBarHeight})`,
		'height': `calc(100vh - ${statusBarHeight})`  }">
			<view class="txt"> 1. 根据国家税务局公告2015年第84号的规定，增值税电子普通发票的法律效力、基本用途、基本使用规定等与税务机关监制的增值税普通发票相同。如需纸质报销，可将电子文档进行打印。
			</view>
			<view class="txt">2. 您选择行程开票内容目前仅支持“客运服务费”。</view>
			<view class="txt">3. 行程消费中包含的折扣券金额不支持开具发票。行程中的发生过路过桥费、高速费、停车费等，请您及时向收费站和停车场索取相关票据，不支持开具发票。</view>
			<view class="txt">4. 企业支付的行程由企业统一申请开票不通过本端口申请。</view>
			<view class="txt">5. 电子发票及行程单将在您提交后7个工作日内发送给您的电子邮箱。</view>
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
		padding: 20rpx 16rpx 0rpx 16rpx;
		@include fs(28rpx, 400, #555555, 42rpx);
	}
</style>
