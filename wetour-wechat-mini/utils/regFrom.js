/**
 * @description: 数组循环调用对象判断
 * @param {*} arr
 * @param {*} from
 * @param {*} el key
 * @return {*}
 */
function arrMap(arr, from, el) {
  let returnInfo = [null, true]
  for (let i = 0, lenght = arr.length; i < lenght; i++) {
    let [error, status] = rzObject(arr[i], from, el)
    if (!status) {
      returnInfo = [error, status]
      break
    }
  }
  return returnInfo
}

/**
 * @description: 对象判断验证是否成功
 * @param {*} rzObj
 * @param {*} from
 * @param {*} el
 * @return {*}
 */

function rzObject(rzObj, from, el) {
  let value = from[el]
  if (rzObj.require && value.length <= 0) {
    return [rzObj.errorMsg, false]
  }
  if (rzObj.reg && !rzObj.reg.test(value) && value.length > 0) {
    return [rzObj.errorMsg, false]
  }
  return [null, true]
}

/**
 * @description: 表单规则验证
 * @param {*} from
 * @param {*} rule
 * @return {*}
 */

export default function regFrom(from, rule) {
  const formArr = Object.keys(from)
  let info = [null, true]
	console.log(formArr,333)
  for (let i = 0, lenght = formArr.length; i < lenght; i++) {
    const item = rule[formArr[i]]
		console.log(item,formArr[i])
    if (item === undefined || item === null) {
      continue
    }
    if (Array.isArray(item)) {
      var [error, status] = arrMap(item, from, formArr[i])
    } else if (item.constructor === Object) {
      var [error, status] = rzObject(item, from, formArr[i])
    }
    if (!status) {
      info = [error, status]
      break
    }
  }
  return info
}