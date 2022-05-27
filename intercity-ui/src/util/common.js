
var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

export function ChinaIdChecker(sId){ 
    var iSum=0 ;
    var info="" ;
    if(!/^\d{17}(\d|x)$/i.test(sId)) return false
    sId=sId.replace(/x$/i,"a"); 
    if(aCity[parseInt(sId.substr(0,2))]==null) return false
    var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2)); 
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false
    for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
    if(iSum%11!=1) return false
    //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
    return true;
  }


  /**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

// 加法： accAdd(0.1, 0.2)  // 得到结果：0.3
export function accAdd(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  var dec1, dec2, times;
  try {
    dec1 = countDecimals(num1) + 1;
  } catch (e) {
    dec1 = 0;
  }
  try {
    dec2 = countDecimals(num2) + 1;
  } catch (e) {
    dec2 = 0;
  }
  times = Math.pow(10, Math.max(dec1, dec2));
  // var result = (num1 * times + num2 * times) / times;
  var result = (accMul(num1, times) + accMul(num2, times)) / times;
  return getCorrectResult("add", num1, num2, result);
  // return result;
}

export function accSub(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  var dec1, dec2, times;
  try {
    dec1 = countDecimals(num1) + 1;
  } catch (e) {
    dec1 = 0;
  }
  try {
    dec2 = countDecimals(num2) + 1;
  } catch (e) {
    dec2 = 0;
  }
  times = Math.pow(10, Math.max(dec1, dec2));
  // var result = Number(((num1 * times - num2 * times) / times);
  var result = Number((accMul(num1, times) - accMul(num2, times)) / times);
  return getCorrectResult("sub", num1, num2, result);
  // return result;
}


// 乘法： accMul(7, 0.8)    // 得到结果：5.6
export function accMul(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  var times = 0;
  var s1 = num1.toString();
  var s2 = num2.toString();
  try {
    times += countDecimals(s1);
  } catch (e) {}

  try {
    times += countDecimals(s2);
  } catch (e) {}
  var result = (convertToInt(s1) * convertToInt(s2)) / Math.pow(10, times);
  return getCorrectResult("mul", num1, num2, result);
  // return result;
}

// getCorrectResult()方法：确认我们的计算结果无误，以防万一
var getCorrectResult = function(type, num1, num2, result) {
  var temp_result = 0;
  switch (type) {
    case "add":
      temp_result = num1 + num2;
      break;
    case "sub":
      temp_result = num1 - num2;
      break;
    case "div":
      temp_result = num1 / num2;
      break;
    case "mul":
      temp_result = num1 * num2;
      break;
  }
  if (Math.abs(result - temp_result) > 1) {
    return temp_result;
  }
  return result;
};



// countDecimals()方法：计算小数位的长度
var countDecimals = function(num) {
  var len = 0;
  try {
    num = Number(num);
    var str = num.toString().toUpperCase();
    if (str.split("E").length === 2) {
      // scientific notation
      var isDecimal = false;
      if (str.split(".").length === 2) {
        str = str.split(".")[1];
        if (parseInt(str.split("E")[0]) !== 0) {
          isDecimal = true;
        }
      }
      const x = str.split("E");
      if (isDecimal) {
        len = x[0].length;
      }
      len -= parseInt(x[1]);
    } else if (str.split(".").length === 2) {
      // decimal
      if (parseInt(str.split(".")[1]) !== 0) {
        len = str.split(".")[1].length;
      }
    }
  } catch (e) {
    throw e;
  } finally {
    if (isNaN(len) || len < 0) {
      len = 0;
    }
    // eslint-disable-next-line no-unsafe-finally
    return len;
  }
};


// convertToInt()方法：将小数转成整数
var convertToInt = function(num) {
  num = Number(num);
  var newNum = num;
  var times = countDecimals(num);
  var temp_num = num.toString().toUpperCase();
  if (temp_num.split("E").length === 2) {
    newNum = Math.round(num * Math.pow(10, times));
  } else {
    newNum = Number(temp_num.replace(".", ""));
  }
  return newNum;
};