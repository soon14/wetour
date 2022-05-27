<template>
	<view>
		<!-- <u-select v-model="visible" mode="mutil-column-auto" :list="list" @confirm="confirm" :mask-close-able="false" @cancel="cancel" ></u-select> -->

		<u-picker
			mode="multiSelector"
			v-model="visible"
			:default-selector="[x, y, z]"
			range-key="label"
			:range="multiSelector"
			@confirm="confirm"
			@columnchange="columnchange"
			@cancel="cancel"
		></u-picker>
		<!-- <u-select v-model="visible" mode="mutil-column" :list="list" @confirm="confirm"></u-select> -->
	</view>
</template>

<script>
import moment from 'moment';
import { parseTime, throttle, getLocalTime } from '@/utils/common';
export default {
	name: 'selectTime',
	data() {
		return {
			list: [],
			multiSelector: [],
			x: 0,
			y: 0,
			z: 0,
			xList: [],
			yList: [],
			zList: [],
			oneDayYList: [],
			oneDayzList: []
		};
	},
	created() {
		console.log('s4666===>');
		this.x = this.defaultValue[0];
		this.y = this.defaultValue[1];
		this.z = this.defaultValue[2];
		console.log(getLocalTime(Number(this.timeZone)), this.timeZone);
		let myTime = getLocalTime(Number(this.timeZone)).getTime() + 12 * 3600 * 1000;

		for (var i = 0; i < 24; i++) {
			this.yList.push({
				label: i < 10 ? '0' + i : i,
				value: i
			});
		}

		for (var i = 0; i < 6; i++) {
			let newi = i * 10;
			this.zList.push({
				label: i == 0 ? '00' : newi,
				value: newi
			});
		}

		for (var i = 0; i < 90; i++) {
			let time = myTime + i * 24 * 3600 * 1000;

			this.xList.push({
				label: parseTime(time, '{m}月{d}日 {a}'),
				value: parseTime(time, '{y}/{m}/{d}')
			});
		}

		let hm = parseTime(myTime, '{h}:{i}').split(':');
		let m = (Math.ceil(Number(hm[1]) / 10) * 10 + '').split('')[0] - 0;
		let h = hm[0] - 0;
		for (var i = m; i < 6; i++) {
			let newi = i * 10;
			this.oneDayzList.push({
				label: i == 0 ? '00' : newi,
				value: newi
			});
		}

		if (m == 6) {
			h = Number(h) + 1;
			this.oneDayzList = this.zList;
		}
		for (var i = h; i < 24; i++) {
			this.oneDayYList.push({
				label: i < 10 ? '0' + i : i,
				value: i
			});
		}

		if (h == 24) {
			this.oneDayYList = this.yList;
			this.xList.splice(0, 1);
		}

		this.multiSelector = [[...this.xList], [...this.oneDayYList], [...this.oneDayzList]];
		console.log(this.multiSelector);
		return false;

		console.log(myTime, '----------');
		let list = [];
		// for (var i = 0; i < 90; i++) {
		// 	let time = myTime + i * 24 * 3600 * 1000
		// 	let ymd = parseTime(time,'{y}/{m}/{d}')
		// 	let obj = {
		// 		label : parseTime(time,'{m}月{d}日 {a}'),
		// 		value:i,
		// 		children:[]
		// 	}
		// 	let a = 0, b = 0
		// 	let hm = parseTime(time,'{h}:{i}').split(':')
		// 	if(i == 0){
		// 		a = Number(hm[0])
		// 	}
		// 	for (var is = a; is < 24; is++) {
		// 		if(i == 0 && is == a) {
		// 			b = (Math.ceil(Number(hm[1])/10)*10 + '').split('')[0]
		// 		}else{
		// 			b = 0
		// 		}
		// 		let ii = is < 10 ? '0' + is : is
		// 		let objtwo = {
		// 			label:ii,
		// 			value:is,
		// 			children:[]
		// 		}
		// 		for (var k = b; k < 6; k++) {
		// 			let m = k + '0'
		// 			let data = {
		// 				label: m,
		// 				key:k,
		// 				value:moment(ymd + ' ' + ii + ':' + m + ':00','YYYY/MM/DD HH:mm:ss').valueOf()
		// 			}
		// 			// console.log(data,'data')
		// 			objtwo.children.push(data)
		// 		}
		// 		// console.log(objtwo,'objtwo')
		// 		if(objtwo.children.length) obj.children.push(objtwo)

		// 	}
		// 	// console.log(obj,'obj')
		// 	if(obj.children.length)  list.push(obj)

		// }
		// // console.log(list,'----aaa---aaa---aaa')
		// this.list = list
	},
	props: {
		dialogVisible: {
			type: Boolean,
			default: false
		},
		defaultValue: {
			type: Array,
			default: [0, 0, 0]
		},
		timeZone: {
			type: [Number, String],
			default: 8
		}
	},
	computed: {
		visible: {
			get() {
				if (this.dialogVisible) {
					console.log('sss===>');
					uni.hideTabBar();
				} else {
					console.log('s444===>');
					uni.showTabBar();
				}
				console.log('s4666===>');
				return this.dialogVisible;
			},
			set(val) {
				console.log('s4666===>');
				if (val) {
					console.log('sss===>');
					uni.hideTabBar();
				} else {
					console.log('s444===>');
					uni.showTabBar();
				}
				console.log(111111, val, 33333);
				this.$emit('update:dialogVisible', val);
			}
		}
	},

	methods: {
		confirm(e) {
			// time:1650568200000
			let { multiSelector } = this;
			let time = multiSelector[0][this.x].value + ' ' + multiSelector[1][this.y].label + ':' + multiSelector[2][this.z].label;
			console.log(time, 3333, moment(time + ':00', 'YYYY/MM/DD HH:mm:ss').valueOf());
			// console.log(e,3333,s{time:e[2].value,default:[e[0].value,e[1].value,e[2].label/10]})
			this.$emit('confirm', { time: moment(time + ':00', 'YYYY/MM/DD HH:mm:ss').valueOf(), default: [this.x, this.y, this.z] });
		},
		cancel() {
			this.visible = false;
		},
		columnchange(data) {
			if (data.column == 0) {
				this.x = data.index;
			}
			if (data.column == 1) {
				this.y = data.index;
			}
			if (data.column == 2) {
				this.z = data.index;
			}
			let xList = this.xList;
			let yList = this.yList;
			let zList = this.zList;
			if (this.x == 0) {
				yList = this.oneDayYList;
				if (this.y == 0) {
					zList = this.oneDayzList;
				}
			}

			this.multiSelector = [[...xList], [...yList], [...zList]];
			// uni.showToast({
			// 	title: `${data.column},${data.index}`,
			// 	duration: 2000,
			// 	icon: "none"
			// })
			console.log(data);
		}
	}
};
</script>

<style></style>
