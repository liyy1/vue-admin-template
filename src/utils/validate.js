/** 表单校验规则 **/
export const rule_required1 = { required: true, message: '此项内容不能为空！', trigger: 'blur' }
export const rule_required2 = { required: true, message: '此项内容不能为空！', trigger: 'change' }
export const rule_phone = { validator: validatePhone, trigger: 'blur' }

/* 验证手机号码 */
function validatePhone(rule, value, callback) {
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
