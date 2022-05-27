/**
 * @description: async await 拦截错误
 * @param {*} callback
 * @return {*} [null, data]
 */
export default function to(callback) {
  return callback.then((data) => [null, data]).catch((err) => [err, null])
}
