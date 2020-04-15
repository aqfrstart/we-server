/**
 * 涉及业务相关工具类
 */
const axios = require('axios')

/**
 * 检测百度网盘分享链接是否已经失效
 * @param { Array } shareList
 */
const checkShareInvalid = async function (shareList = []) {
  if (shareList.length <= 0) return false
  const checkedShareList = []
  const promiseList = await shareList.map(async item => {
    const response = await axios.get(item)
    return response.data.includes('分享的文件已经被取消了')
  })
  const checkResultList = await Promise.all(promiseList)
  return checkResultList
}

module.exports = {
  checkShareInvalid
}