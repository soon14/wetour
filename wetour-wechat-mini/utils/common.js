// 精准加法
export function addition(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

// 精准减法
export function subtraction(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
     //last modify by deeka
     //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}




//乘法函数
export function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}




//获取粘贴板中的数据
export function getClipboardText(){
    try{
		var os = plus.os.name;
		if('iOS' == os){
			var pasteboard = plus.ios.invoke('UIPasteboard', 'generalPasteboard');
			return plus.ios.invoke(pasteboard, 'valueForPasteboardType:', 'public.utf8-plain-text')
		}else{
			var main = plus.android.runtimeMainActivity();
			var clip = main.getSystemService('clipboard');
			return plus.android.invoke(clip, 'getText');
		}
    }catch(e){
        console.error('error @getClipboardText!!');
    }
}

export function toDecimal(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf(".");
	if (rs < 0) {
		rs = s.length;
		s += ".";
	}
	while (s.length <= rs + 2) {
		s += "0";
	}
	return s;
	// console.log(s)
}

export function toDecimal2(x,num=2) { 
	var f = parseFloat(x); 
	if (isNaN(f)) { 
		return false; 
	} 
	var f = Math.floor(x*Math.pow(10, num))/Math.pow(10, num); 
	var s = f.toString(); 
	var rs = s.indexOf('.'); 
	if (rs < 0) { 
		rs = s.length; 
		s += '.'; 
	} 
	while (s.length <= rs + num) { 
		s += '0'; 
	} 
	return s; 
 } 
 
 
 
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') { 
		return ['周日','周一' ,'周二' , '周三','周四','周五','周六'][value] 
	}
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}


export function getLocalTime(i) {
	if (typeof i !== "number") {
		return new Date();
	}
	var d = new Date();
	var len = d.getTime();
	var offset = d.getTimezoneOffset() * 60000;
	var utcTime = len + offset;
	return new Date(utcTime + 3600000 * i);
}
			
			
export function pointReplacementBar(time,string="."){
	
	return time.replace(new RegExp('-','g'),string)
}


export function strReplace (str,t) {
	var reg = /^1(\d{2})\d{6}(\d{2})$/;
	var reg1 = /^(\d{1})\d{16}([\d\w]{1})$/;
	if (t==1) {
		return str.replace(reg, "1$1******$2");
	} else if (t == 2) {
		return hideCode(str,1,1)
	} else {
		var front = []
		for (var i = 1; i <= str.length - 2; i++) {
			front.push('*')
		}
		front = front.join('')
		str = str.length > 2 ? str.substring(0, 1) + front + str.slice(-1) : str
		return str
	}
}


export function Fomat (amount,num=2) {
	if (amount ==0) return '0.00'
	return parseFloat(amount).toFixed(num);
}


var hideCode = function(str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
        xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
}


export  function throttle (fn, limit=1500) {
  let inThrottle; // 开关
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      fn.apply(context, args)
      inThrottle = true
      setTimeout(() => {
        // 定时器用来进行保证在一定时间内开关的状态
        inThrottle = false
      }, limit)
    }
  };
};