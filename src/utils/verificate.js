export default function verificate ({ type = 'default', msg = '请输入', required = true, ev = 'blur' }) {
  const result = [{ required: required, message: msg, trigger: ev }];
  let obj = {};
  switch (type) {
    case 'email':
      obj = {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '邮箱不正确',
        trigger: ev,
      }
      break;
    case 'mobile':
      obj = {
        pattern: /^1[3-9]\d{9}$/,
        message: '手机号不正确',
        trigger: ev,
      }
      break;
    case 'account':
      obj = {
        pattern: /^[a-zA-Z0-9]{6,20}$/,
        message: '请输入6到20位的字母或数字',
        trigger: ev,
      }
      break;
    case 'password':
      obj = {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
        message: '包含至少一个大写字母、一个小写字母和一个数字，长度在8到16之间',
        trigger: ev,
      }
      break;
    default:
      break;
  }
  result.push(obj)
  return result;
}