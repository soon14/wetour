//订单列表属性参数
import {
		parseTime
	} from "@/utils/common"
export const orderState = {
	data() {
	  return {
	    charteredCarType:{
	    	1:'日租包车',
	    	2:'接机包车',
	    	3:'送机包车',
	    	4:'单程包车'
	    },
		
	  }
	},
  methods: {
   dateChange(date){
   	// var time1 = new Date(date.replace(/-/g,"/")).format("yyyy-MM-dd hh:mm:ss");
   	
   	return parseTime(date.replace(/-/g,"/"),'{m}月{d}日 {h}:{i}')
   },
  },
}