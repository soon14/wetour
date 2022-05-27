/**
 * @description: 门票日期列表
 * @author: lcy
 */
export const playDateList = () => {
  const date = new Date()
  const length = 7
  const ary = []
  const size = 24 * 60 * 60 * 1000
  while (ary.length < length) {
    ary.push({
      year: date.getFullYear(),
      date: `${(date.getMonth() + 1).toString().padStart(2, 0)}-${date
        .getDate()
        .toString()
        .padStart(2, 0)}`,
      week: `周${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}`,
    })
    date.setTime(date.getTime() + size)
  }
  return ary
}

/**
 * @description: 门票时间列表
 * @author: lcy
 */
export const playTimeList = date => {
  const selectDate = `${new Date().getFullYear()}/${date}`
  const startTime = new Date(`${selectDate} 09:00:00`)
  const length = 27
  const size = 30 * 60 * 1000
  const ary = []
  while (ary.length < length) {
    ary.push(
      `${startTime.getHours().toString().padStart(2, 0)}:${startTime
        .getMinutes()
        .toString()
        .padStart(2, 0)}`
    )
    startTime.setTime(startTime.getTime() + size)
  }

  return ary
    .filter(time => +new Date(`${selectDate} ${time}:00`) > +new Date())
    .map((time, index) => ({
      label: time,
      value: index + 1,
    }))
}

/**
 * @description: 手机号码校验
 * @author: lcy
 */
export const mobileReg = mobile => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(mobile)

/**
 * @description: 银行卡校验
 * @author: lcy
 */
export const bankCardReg = bankCard => /^[1-9]\d{9,29}$/.test(bankCard)
