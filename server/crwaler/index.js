const puppeteer = require('puppeteer')
// 引入mongoose Model
const Artical = require('../../model/Artical.js')

const targetUrl = {
  '掘金FE': 'https://juejin.im/welcome/frontend'
}

module.exports = async () => {
  // 打开无头浏览器
  const browser = await puppeteer.launch({
    headless: false
  })
  // 打开新page页
  const page = await browser.newPage()
  Object.keys(targetUrl).forEach(async singleTarget => {
    const singleUrl = targetUrl[singleTarget]
    await page.goto(singleUrl, {
      // 等待不再有网络连接时触发
      waitUntil: 'networkidle0'
    })
    // 引入jQuery FIXME: 无法直接引入, 安全限制
    // await page.addScriptTag({ url: 'https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js' })
    let articalList = await page.evaluate(() => {
      // 两个简单函数，方便后续使用
      window.$ = function (selector) {
        return document.querySelectorAll(selector)
      }
      // 在父级dom下递归查找指定dom
      window.find = function (parent, label, result = []) {
        for (let i = 0; i < parent.children.length; i++) {
          if (([].indexOf.call(parent.children[i].classList, label) !== -1) || parent.children[i].id === label || parent.children[i].tagName === label) {
            result.push(parent.children[i])
          }
          window.find(parent.children[i], label, result)
        }
        return result
      }
      let articalUrlList = []

      $('.entry').forEach((singlEntry, index) => {
        let author = find($('.entry')[index], 'username')[0].innerText
        let title = find($('.entry')[index], 'title')[0].innerText
        let url = find($('.entry')[index], 'entry-link')[0].href
        let tag = find($('.entry')[index], 'tag')[0].innerText
        let like = (find($('.entry .like')[index], 'count')[0] || {}).innerText
        let dislike = (find($('.entry .comment')[index], 'count')[0] || {}).innerText
        articalUrlList.push({
          author,
          title,
          url,
          tag,
          like,
          dislike
        })
      })
      return articalUrlList
    })
    try {
      // 向数据库中插入数据
      Artical.create(...articalList)
      console.log('插入数据成功')
    } catch (error) {
      console.log('插入数据失败', error)
    }
  })
}