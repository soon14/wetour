<template>
	<view class="selectDay-box">
		<uni-nav-bar backgroundColor="fff" statusBar fixed title="选择日期" color="#272727">
			<navigator open-type="navigateBack" slot="left" hover-class="none">
				<image src="http://youba-static.oss-cn-hangzhou.aliyuncs.com/newwetour/img/left.png" style="height: 48rpx;width: 48rpx;vertical-align: text-bottom;"></image>
			</navigator>
		</uni-nav-bar>
		<view class="showTime flex-between">
			<view class="startTime">
				<view class="time-label">开始时间</view>
				<view class="time-value" :class="selectOne" @click="selectTime">
					{{ selectArr[0] ? showMd(selectArr[0]) : '请选择时间' }}
					<template v-if="selectArr.length == 1">
						{{ time }}
					</template>
				</view>
			</view>
			<view class="andTime">共{{ totalDay }}日</view>
			<view class="endTime">
				<view class="time-label">结束时间</view>
				<view class="time-value " :class="selectTwo">{{ selectArr[1] ? showMd(selectArr[1]) : '请选择时间' }}</view>
			</view>
		</view>
		<view class="calendar">
			<view class="calendar_top">
				<view>日</view>
				<view>一</view>
				<view>二</view>
				<view>三</view>
				<view>四</view>
				<view>五</view>
				<view>六</view>
			</view>
			<view class="calendar_month" v-for="(item, index) in date" :key="index">
				<text>{{ item[0].year }}年{{ item[0].month }}月</text>
				<view class="calendar_con">
					<view class="day" v-if="weeks[index] > 0"></view>
					<view class="day" v-if="weeks[index] > 1"></view>
					<view class="day" v-if="weeks[index] > 2"></view>
					<view class="day" v-if="weeks[index] > 3"></view>
					<view class="day" v-if="weeks[index] > 4"></view>
					<view class="day" v-if="weeks[index] > 5"></view>
					<view
						class="day"
						v-for="(data, idx) in item"
						:key="idx"
						@click="selectday(data)"
						:class="{
							active: data.re == selectArr[0] && selectArr.length == 1,
							startactive: data.re == selectArr[0] && selectArr.length == 2,
							endactive: data.re == selectArr[1] && selectArr.length == 2,
							andTransition: transtions(data)
						}"
					>
						<view class="dayday" :class="{ order_day: data.selected, disabled_day: data.is_show === 0 }">
							<view class="dayItem">
								<!-- v-else -->
								<text v-if="data.day == '今天'" :style="{ color: selectArr[0] == todayDay() ? '#111111 !important' : '#CBA56A !important' }">{{ data.day }}</text> 
								<text v-else>{{ data.day }}</text>

								<!-- <text v-if="data.is_show==1 && !sale" class="col_999">{{data.sale ? '有票' : '无票'}}</text>
		          	  <text v-if="data.is_show==1 && sale" class="col_999">在售</text> -->
								<!-- <text v-if="selectArr[0] && selectArr[0] === data.re" class="textTip">开始</text>
		          	   <text v-if="selectArr[1] && selectArr[1] === data.re" class="textTip">结束</text> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <u-select v-model="show" :list="list" @confirm="confirm"></u-select> -->
		<selectDay v-if="show" :dialogVisible.sync="show" :defaultValue="defaultValue" @confirm="confirm" :timeZone="timeZone"></selectDay>
		<view class="footerView">
			<view class="submitBtn" :class="{ disabeld: totalDay == 0 }" @click="submitBtn">
				确定
				<template v-if="selectArr.length > 0">
					(包车{{ totalDay }}天)
				</template>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import selectDay from '@/components/selectDay.vue';
import { parseTime, throttle, getLocalTime } from '@/utils/common';
export default {
	components: {
		selectDay
	},
	data() {
		return {
			weeks: [],
			date: [],
			showday: 0,
			saleDate: [],
			sale: false,
			ptype: 0,
			selectArr: [],
			show: false,
			list: [
				{
					value: '1',
					label: '江'
				},
				{
					value: '2',
					label: '湖'
				}
			],
			time: '',
			city: '',
			timeZone: 0,
			cityCode: 0,
			defaultValue: [0, 0]
		};
	},
	computed: {
		...mapGetters([
			// 'system_days',
			// 'chartered_days',
			// 'nowtime',
		]),
		totalDay() {
			let num = 0;
			if (this.selectArr.length == 1) {
				num = 1;
			} else if (this.selectArr.length == 2) {
				let one = moment(this.selectArr[1], 'YYYY/M/DD').valueOf();
				let two = moment(this.selectArr[0], 'YYYY/M/DD').valueOf();
				num = Math.floor((one - two) / 86400000) + 1;
			}
			return num;
		},
		selectOne() {
			let className = 'noText';
			if (this.selectArr.length >= 1) {
				className = '';
			}
			return className;
		},
		selectTwo() {
			let className = 'noText';
			if (this.selectArr.length == 2) {
				className = '';
			}
			return className;
		}
	},
	onShow() {},
	onLoad(options) {
		this.timeZone = Number(options.timeZone);
		console.log(this.timeZone);
		// console.log(moment("2022/4/06")['_d'].getTime(),'=======')
		// if (options.ptype == 1) {
		// 	var system_days = this.chartered_days
		// } else {
		// 	var system_days = this.system_days
		// };
		// var nowtime = this.nowtime
		// var maxtime = nowtime + system_days * 24 * 3600;
		// let nowtime = new Date().getTime() / 1000 + 12 * 3600  // 需要12个小时以后才可以上车
		// console.log(moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf())
		let nowtime =
			moment(this.getLocalTime(this.timeZone).getTime() + 12 * 3600 * 1000)
				.startOf('day')
				.valueOf() / 1000;
		var maxtime = nowtime + 180 * 24 * 3600;
		console.log(nowtime, maxtime, 'maxtime');
		var ptype = options.ptype;
		if (!options.saleDate) {
			this.saleDate = [];
			this.sale = true;
		} else {
			this.saleDate = JSON.parse(options.saleDate);
		}
		this.ptype = ptype;
		this.city = options.city;
		this.cityCode = options.cityCode;
		//
		this.todayDay();
	
		// moment
		this.dateData(options.s_day, nowtime, maxtime);
		console.log(nowtime + 'nowtime', maxtime + 'maxtime');
		
		
	},
	methods: {
		getLocalTime(i) {
			//时区  后期调整用
			return getLocalTime(i);
			// if (typeof i !== "number") {
			// 	return new Date();
			// }
			// var d = new Date();
			// var len = d.getTime();
			// var offset = d.getTimezoneOffset() * 60000;
			// var utcTime = len + offset;
			// return new Date(utcTime + 3600000 * i);
		},
		todayDay() {
			//var nowDate = new Date();
			let nowDate = this.getLocalTime(this.timeZone); //当前日期
		
			var date = {
				year: nowDate.getFullYear(),
				month: nowDate.getMonth() + 1,
				day: nowDate.getDate()
			};
			return  date.year + '/' + (date.month >= 10 ? date.month : '0' + date.month) + '/' + (date.day >= 10 ? date.day : '0' + date.day);
		},
		selectTime() {
			if (this.selectArr.length != 1) return false;
			console.log(66666);
			this.show = true;
			console.log('show', this.sh);
		},
		confirm(e) {
			console.log('e', e);
			this.time = e.time;
			this.defaultValue = e.default;
		},
		showMd(time) {
			// return parseTime(moment(time)['_d'].getTime(),'{m}月{d}日')
			return parseTime(moment(time, 'YYYY/M/DD').valueOf(), '{m}月{d}日');
		},
		dateData: function(s_day, nowtime, maxtime) {
			console.log(s_day, nowtime, maxtime, 's_day, nowtime, maxtime');
			let dataAll = []; //总日历数据
			let dataAll2 = []; //总日历数据
			let dataMonth = []; //月日历数据
			let date = this.getLocalTime(this.timeZone); //当前日期
			let year = date.getFullYear(); //当前年
			let week = date.getDay(); //当天星期几
			let weeks = [];
			let month = date.getMonth() + 1; //当前月份
			let day = 1; //date.getDate()//当天
			let daysCount = 180; //一共显示多少天
			let dayscNow = 0; //计数器
			let num = 0;
			let monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; //月份列表
			let nowMonthList = []; //本年剩余年份
			for (let i = month; i < 13; i++) {
				nowMonthList.push(i);
			}
			let yearList = [year]; //年份最大可能
			for (let i = 0; i < daysCount / 365 + 2; i++) {
				yearList.push(year + i + 1);
			}
			let leapYear = function(Year) {
				//判断是否闰年
				if ((Year % 4 == 0 && Year % 100 != 0) || Year % 400 == 0) {
					return true;
				} else {
					return false;
				}
			};
			for (let i = 0; i < yearList.length; i++) {
				//遍历年
				let mList;
				if (yearList[i] == year) {
					//判断当前年份
					mList = nowMonthList;
				} else {
					mList = monthList;
				}
				for (let j = 0; j < mList.length; j++) {
					//循环月份
					dataMonth = [];
					let t_days = [31, 28 + leapYear(yearList[i]), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
					let t_days_thisYear = [];
					if (yearList[i] == year) {
						for (let m = 0; m < nowMonthList.length; m++) {
							t_days_thisYear.push(t_days[mList[m] - 1]);
						}
						t_days = t_days_thisYear;
					} else {
						t_days = [31, 28 + leapYear(yearList[i]), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
					}
					for (let k = 0; k < t_days[j]; k++) {
						//循环每天
						if (k + 1 >= date.getDate()) {
							num++;
						}
						dayscNow++;
						let nowData;
						if (dayscNow < daysCount) {
							//如果计数器没满
							let days = k + 1;
							if (days < 10) {
								days = '0' + days;
							}
							var itime = new Date(yearList[i] + '/' + mList[j] + '/' + days).getTime() / 1000;
							if (yearList[i] == year && mList[j] == month) {
								//判断当年当月
								// let itime = new Date(yearList[i] + "/" + mList[j] + "/" + days).getTime() / 1000;
								if (k + 1 >= day) {
									nowData = {
										year: yearList[i],
										month: mList[j],
										day: k + 1 == date.getDate() ? '今天' : k + 1,
										date: yearList[i] + '' + mList[j] + days,
										selected: yearList[i] + '' + mList[j] + days == s_day ? 1 : 0,
										re: yearList[i] + '/' + (Number(mList[j]) >= 10 ? mList[j] : '0' + mList[j]) + '/' + days,
										is_show: itime >= nowtime && maxtime > itime ? 1 : 0,
										itime
									};
									// console.log(itime,nowtime,maxtime,'maxtime---',itime >= nowtime , maxtime > itime)
									this.saleDate.map(item => {
										if (itime - item.date > -86400 && itime - item.date < 86400) {
											nowData.sale = true;
										}
									});
									dataMonth.push(nowData);
									if (k + 1 == day) {
										let date = new Date(yearList[i] + '/' + mList[j] + '/' + (k + 1));
										let weekss = date.getDay(); //获取每个月第一天是周几
										weeks.push(weekss);
									}
								}
							} else {
								//其他情况
								// let itime = new Date(yearList[i] + "/" + mList[j] + "/" + days).getTime() / 1000;
								nowData = {
									//组装自己需要的数据
									year: yearList[i],
									month: mList[j],
									day: k + 1,
									date: yearList[i] + '' + mList[j] + days,
									selected: yearList[i] + '' + mList[j] + days == s_day ? 1 : 0,
									re: yearList[i] + '/' + (Number(mList[j]) >= 10 ? mList[j] : '0' + mList[j]) + '/' + days,
									is_show: itime >= nowtime && maxtime > itime ? 1 : 0
								};
								// console.log(this.saleDate)
								this.saleDate.map(item => {
									if (itime - item.date > -86400 && itime - item.date < 86400) {
										nowData.sale = true;
									}
								});
								dataMonth.push(nowData);
								if (k == 0) {
									let date = new Date(yearList[i] + '/' + mList[j] + '/' + k + 1);
									let weekss = date.getDay(); //获取每个月第一天是周几
									weeks.push(weekss);
								}
							}
						} else {
							break;
						}
					}
					dataAll.push(dataMonth);
				}
			}
			for (let i = 0; i < dataAll.length; i++) {
				if (dataAll[i].length != 0) {
					dataAll2.push(dataAll[i]);
				}
			}
			this.date = dataAll2;
			console.log(this.date);
			this.weeks = weeks;
		},
		/**
		 * 日期选中操作
		 */
		selectday(data) {
			if (data.is_show != 1) return false;
			let { selectArr } = this;
			console.log(data, 3333, selectArr);
			this.$nextTick(() => {
				if (selectArr.length == 0) {
					this.selectArr.push(data.re);

					// if()
				} else if (selectArr.length == 1) {
					let re = selectArr[0].split('/').join('');
					if (re - data.re.split('/').join('') > 0) this.selectArr = [data.re];
					if (re - data.re.split('/').join('') < 0) this.selectArr.push(data.re);
				} else {
					this.selectArr = [data.re];
				}

				if (this.selectArr.length == 1) {
					let date = this.getLocalTime(this.timeZone).getTime() - 0 + 12 * 3600 * 1000;
					console.log(date);
					date = new Date(date);
					// let re = parseTime(date,)
					let year = date.getFullYear(); //当前年
					let month = date.getMonth() + 1; //当前月份
					let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
					let re = year + '/' + (month >= 10 ? month : '0' + month) + '/' + day;

					if (data.re === re) {
						let h = date.getHours();
						let m = date.getMinutes();
						m = Math.ceil(m / 10) * 10;
						// this.time
						if (m == 60) {
							h = h + 1;
							m = '00';
						}
						this.time = (Number(h) < 10 ? '0' + h : h) + ':' + (m == 0 ? '00' : m);
					} else {
						this.time = '09:00';
					}
					console.log(this.time, 'this.time');
					this.setList(data.re === re);
				} else {
				}
				console.log(
					data.date,
					data.re,
					this.selectArr,
					this.selectArr[0] ? this.selectArr[0].split('/').join('') : 0,
					this.selectArr[1] ? this.selectArr[1].split('/').join('') : 0
				);
			});
		},

		setList(bol) {
			let arr = this.time.split(':');
			let a = Number(arr[0]),
				b = Number(arr[1].split('')[0]);
			let list = [];
			if (!bol) {
				a = 0;
				b = 0;
			}
			for (var i = a; i < 24; i++) {
				if (i == a) {
					b = b;
				} else {
					b = 0;
				}
				for (var k = b; k < 6; k++) {
					let h = i < 10 ? '0' + i : i;
					let m = k + '0';
					let label = h + ':' + m;
					list.push({
						label,
						value: label
					});
				}
			}
			this.list = list;
			// console.log(list)
		},

		submitBtn() {
			if (this.selectArr.length == 0) {
				return false;
			}
			let inttime = '';
			if (this.selectArr.length == 1) {
				inttime = this.selectArr[0] + ' ' + this.time + ':00';
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2];
				// #ifdef MP-WEIXIN
				prevPage.$vm.ChoseTimeSelect(inttime);
				// #endif
				// #ifdef H5
				prevPage.ChoseTimeSelect(inttime);
				// #endif
				uni.navigateBack({});
			} else {
				// console.log(this.selectArr,3333,this.city,3333)
				// console.log(`/subPages/multiCharter/multiCharter?city=${this.city}$dateArr=${JSON.stringify(this.selectArr)}`)

				let data = {
					departureStartTime: moment(this.selectArr[0] + ' ' + '00:00:00', 'YYYY/MM/DD HH:mm:ss').valueOf(), //出发时间（用车时间）
					city: this.city, //出发城市
					cityCode: this.cityCode, //出发城市代码对应城市表里的ID
					timeZone: this.timeZone,
					departureEndTime: moment(this.selectArr[1] + ' ' + '23:59:59', 'YYYY/MM/DD HH:mm:ss').valueOf() //出发时间（用车时间）
				};
				this.$store.dispatch('user/setOrderInfo', data);

				uni.navigateTo({
					url: `/subPages/multiCharter/multiCharter`
				});
			}
		},
		transtions(data) {
			let bol =
				this.selectArr.length == 2 &&
				data.re.split('/').join('') - (this.selectArr[0] ? this.selectArr[0].split('/').join('') : 0) > 0 &&
				data.re.split('/').join('') - (this.selectArr[1] ? this.selectArr[1].split('/').join('') : 0) < 0;
			return bol;
		}
	}
};
</script>

<style lang="scss" scoped>
.calendar {
	background: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 140rpx;
	padding-bottom: calc(140rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}
.calendar_top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	color: #555555;
	font-size: 28rpx;
	height: 40rpx;
	line-height: 40rpx;

	// padding: 30rpx 0;
	// border-bottom: 1px solid #f4f4f4;
}
.calendar_top view {
	
	width: calc(98% / 7);
	text-align: center;
}
// .calendar_top view:first-child,.calendar_top view:last-child{
//   color: #999;
// }
.calendar_month > text {
	width: 100%;
	height: 70rpx;
	line-height: 70rpx;
	color: #111111;
	font-weight: 600;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	// border-bottom: 1px solid #f4f4f4;
}
.calendar_con {
	// width: 100%;
	// height: 120rpx;
	// line-height: 120rpx;
	display: flex;
	flex-wrap: wrap;
	// margin-left:8rpx;
	// margin: 0rpx 1%;
	//background-color: red;
	//justify-content: center;
}
.calendar_con .day {
	
	// float: left;
	height: 80rpx;
	text-align: center;
	width: calc(100% / 7 );
	font-size: 32rpx;
	align-items: center;
	 // background-color: green;
	// border-bottom: 1px solid #f4f4f4;
	color: #999;
	margin-bottom: 10rpx;
}
.dayItem {
	// width: 92rpx;
	margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 14rpx 0 11rpx;
	height: 80rpx;
	box-sizing: border-box;
	width: 100%;
	//background-color: greenyellow;
}

.calendar_con .day.startactive {
	.dayItem {
		width: 100%;
		background: #cba56a;
		border-radius: 40rpx 0rpx 0rpx 40rpx;
	}
}
.calendar_con .day.endactive {
	.dayItem {
		width: 100%;
		background: #cba56a;
		border-radius: 0rpx 40rpx 40rpx 0rpx;
	}
}

.calendar_con .day.active {
	.dayItem {
		width: 80rpx;
		background: #cba56a;
		border-radius: 40rpx;
		//background-color: indianred;
	}
	.dayday {
		text {
			margin: 1rpx;
		}
		.textTip {
			font-size: 24rpx;
			color: #fff;
			line-height: 24rpx;
			font-weight: 400;
		}
	}
}
.calendar_con .day.andTransition {
	background-color: #cba56a;
}
// .calendar_con .day:nth-child(7n) {
// 	padding-right: 1%;
// }
// .calendar_con .day:nth-child(7n + 1) {
// 	padding-left: 1%;
// }
.calendar_con .day .dayday {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	// padding: 14rpx 0 11rpx;
}
.calendar_con .day .dayday text {
	// height: 30rpx;
	line-height: 30rpx;
	font-size: 18rpx;
}
.calendar_con .col_27 {
	color: #111111;
}
.calendar_con .day .dayday text:first-child {
	// padding-top: 35rpx;
	// padding: 20rpx 0;
	font-size: 28rpx;
	color: #111111;
}
.col_999 {
	/* color:#999; */
	color: orange;
}

.col_ff8 {
	color: #ff8a00;
}
.disabled_day {
	text {
		color: #999999 !important;
	}
}
.order_day {
	// width: 80rpx;
	// height: 80rpx;
	// text-align: center;
	// background-color: #CBA56A;
	// border-radius: 50%;
	text {
		// color: #CBA56A !important;
		font-size: 32rpx !important;
	}
}

// .order_day  text{
//   line-height:12px;
//   font-size: 18rpx;
//   color: #fff;
//   width: 80rpx;
//   text-align: center;
// }
// .order_day  text:first-child{
//   /* padding-top: 10rpx; */
//   font-size: 28rpx;
// }
.showTime {
	background-color: #ffffff;
	border-bottom: 16rpx solid #f5f5f5;
	padding: 34rpx 32rpx 29rpx;

	.andTime {
		padding: 4rpx 18rpx;
		border: 1rpx solid #dbdbdb;
		@include fs(24rpx, 400, #555555, 32rpx);
		text-align: center;
		border-radius: 22rpx;
	}
	.endTime {
		text-align: right;
	}
	.time-label {
		@include fs(28rpx, 400, #666666, 40rpx);
		margin-bottom: 12rpx;
	}
	.time-value {
		@include fs(36rpx, 600, #111111, 50rpx);
	}
	.noText {
		color: #999999;
	}
}
.footerView {
	position: fixed;
	left: 0;
	right: 0;
	width: 100%;
	bottom: 0;
	// height: 140px;
	padding: 32rpx 65rpx;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 25rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 25rpx);
	background: #ffffff;
	box-shadow: 0px -2rpx 10rpx rgba(183, 181, 173, 0.2);
	.submitBtn {
		background: #111111;
		border-radius: 45rpx;
		width: 100%;
		text-align: center;
		@include fs(28rpx, 600, #ffffff, 88rpx);
	}
	.disabeld {
		background: #eeeeee;
		color: #999999;
	}
}
</style>
