<template>
	<view class="content">
		<uni-nav-bar
		  backgroundColor="#f0f0f0"
		  statusBar
			title="登录"
			color="#272727"
			>
			<navigator open-type="navigateBack" slot="left"  hover-class="none">
			  <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/lefts.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="box">
		  <!-- <image :src="img1" class="imgs"></image> -->
			<view class="box-logo">
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourage/common/logo.png" class="logoImg"></image> -->
				<view class="box-title">
					微巴士出行
				</view>
			</view>
			<view class="login_protocol " :class="{'animations':animation}">
				<!-- animations -->
				<view class="login_select_no" v-if="!is_sure" @click="is_sure = true"></view>
				<!-- <image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetourage/common/login_select.png" class="login_select" v-else @click="is_sure = false"></image> -->
				<view class="">
					<view class="select-tip" @click="is_sure = !is_sure">
						我已阅读并同意
					</view>
					<view class="flex-start">
						<view class="line_line_bot">
							《微巴士平台服务电子协议》
						</view>
						<view class="line_line_bot">
							《隐私政策》
						</view>
					</view>
				</view>
			</view>
		  <button class="quick" :open-type="is_sure?'getPhoneNumber':''" @getphonenumber="getPhoneNumber" @click="handelClick" v-if="!userInfo.mobile">快速登录</button>
			<button class="quick" v-else @click="login">快速登录</button>
		  <!-- <view class="phone" @tap="phone_logon">手机号登录</view> -->
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { tokenSocial, getUserInfo , userBindPhone } from "@/api/user.js"
	export default {
	  name: 'Login',
	  components: {},
	  props: {},
	  data() {
	    return {
	      phoneNumberAgree: false,
	      userProfileAgree: false,
	      params: {
	        code: '',
	        nickName: '',
	        province: '',
	        city: '',
	        avatarUrl: '',
	        encryptedData: '',
	        iv: '',
	        type: 1,
	      },
	      // 登录跳转
	      id: '',
	      page: '',
	      grouponOrderId: '',
	      campaignRecordId: '',
				is_sure:false,
				animation:false,
				bindMobile:true,
	    }
	  },
	  computed: {
	   ...mapGetters([
			'userInfo',
	   ]),
	  },
	  watch: {
	    // isAgree(val) {
	    //   if (val) this.login()
	    // },
	  },
	  onLoad({ id, page, grouponOrderId, campaignRecordId }) {
	    // const keys = ['id', 'page', 'grouponOrderId', 'campaignRecordId']
	    // ;[id, page, grouponOrderId, campaignRecordId].forEach((item, index) => {
	    //   if (item) this[keys[index]] = item
	    // })
			
			
	  },
	  onShow() {
	    
	  },
	  methods: {
			
			handelClick(){
				if(!this.is_sure && !this.animation) {
					this.animation = true
					let _this = this
					setTimeout(()=>{
						_this.animation = false
					},1000)
				}
			},
	    /**
	     * @description: 获取用户手机号码
	     * @param {Object} detail
	     * @author: ljw
	     */
	    getPhoneNumber({ detail }) {
				if (detail.errMsg === 'getPhoneNumber:ok') {
					console.log(detail)
					userBindPhone(detail.encryptedData).then(res=>{
						console.log(res,'----------------------------')
						if(res.code == 0 ){
							
							this.$store.dispatch('user/setLogin', true)
						}
					})
				} else {
					uni.showToast({
						title: '您取消了授权',
						icon: 'none'
					})
				}
	    },
			
			login(){
				if(!this.is_sure && !this.animation) {
					this.animation = true
					let _this = this
					setTimeout(()=>{
						_this.animation = false
					},1000)
				}
				if(this.is_sure){
					this.$store.dispatch('user/setLogin', true)
				}
			},
	  },
	}
</script>

<style scoped lang="scss">
	.content{
		background-color: #FFFFFF;
		min-height: 100vh;
	}
	.box{
	  width: 100%;
	  // height: 100;
	  // display: flex;
	  // flex-direction: column;
	  // justify-content: center;
	  // align-items: center;
		padding: 0 40rpx;
		.box-logo{
			padding: 139rpx 0 313rpx;
			text-align: center;
			.logoImg{
				width: 160rpx;
				height: 160rpx;
				margin-bottom: 20rpx;
			}
			.box-title{
				@include fs(30rpx,400,#111111,42rpx);
			}
		}
		.login_select{
			width: 36rpx;
			height: 36rpx;
		}
		.login_select_no{
			border-radius: 50%;
			border: 2rpx solid #BDBDBD;
			width: 36rpx;
			height: 36rpx;
		}
		.login_protocol{
			display: flex;
			margin-bottom: 44rpx;
			.select-tip{
				@include fs(28rpx,400,#999999,40rpx);
				margin-bottom: 6rpx;
				margin-left: 8rpx;
			}
			.line_line_bot{
				@include fs(28rpx,400,#666666,40rpx);
			}
		}
		.quick{
			color: #fff;
			font-size: 40rpx;
			width: 650rpx;
			height: 88rpx;
			background: #111111;
			border-radius: 44rpx;
			margin: auto;
			line-height: 88rpx;
			text-align: center;
		}
	}
	
	// .box .imgs{
	//   width:100%;
	//   height: 626rpx;
	//   margin: 15% 0;
	// }
	
	// .box .quick{
	//   width: 580rpx;
	//   height: 100rpx;
	//   line-height: 100rpx;
	//   border-radius: 50rpx;
	//   font-size: 36rpx;
	//   color: #272727;
	//   background: #f4c91d;
	//   text-align: center;
	//   border: none;
	// }
	
	// .box .phone{
	//   width: 580rpx;
	//   height: 100rpx;
	//   line-height: 100rpx;
	//   color: #999999;
	//   font-size: 36rpx;
	//   text-align: center;
	//   border: none;
	//   background: none;
	//   margin-top: 30rpx;
	// }
	.animations{
		animation-name: shake-horizontal;
		animation-duration: 1000ms;
		animation-timing-function: ease-in-out;
		// animation-iteration-count: infinite
	}
	@keyframes shake-horizontal {
	    2% {
	        transform: translate(-5px, 0) rotate(0)
	    }
	
	    
	
	    20% {
	        transform: translate(3px, 0) rotate(0)
	    }
	
	   
	
	    40% {
	        transform: translate(-7px, 0) rotate(0)
	    }
	
	    
	
	    60% {
	        transform: translate(3px, 0) rotate(0)
	    }
	
	
	    80% {
	        transform: translate(-8px, 0) rotate(0)
	    }
	
	
	    0%,100% {
	        transform: translate(0, 0) rotate(0)
	    }
	}
</style>
