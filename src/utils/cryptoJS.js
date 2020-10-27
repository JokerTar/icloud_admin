import CryptoJS from 'crypto-js'

// 加密
export const encrypt = (word,key) => {
  //key 为动态拼装---》用户输入的验证码+验证码返回的token 截取16位 ==》进行全部小写转换
  var key = CryptoJS.enc.Utf8.parse(key);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
/**
* 解密
*/
export const decrypt = (word,key) => {
  var key = CryptoJS.enc.Utf8.parse(key);
  var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}