/* 验证手机号码 */
export const validatePhone = (rule, value, callback) => {
  if (value != null && value !== '') {
    const regex = /^1[34578]\d{9}$/
    if (!regex.test(value)) {
      callback(new Error('请输入正确的手机号码！'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
