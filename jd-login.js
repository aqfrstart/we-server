// 中文参考文档: https://zhaoqize.github.io/puppeteer-api-zh_CN/
const puppeteer = require('puppeteer')
// 图片对比 废弃 目前大部分拖动验证码都拿不到源图像
const Rembrandt = require('rembrandt')
// node环境下绘制canvas
const { createCanvas, loadImage } = require('canvas')
// 同步等待
const { sleep } = require('sleep')

// 登录用到的配置信息
const config = {
  url: 'https://passport.jd.com/new/login.aspx',
  username: '18839126237',
  pwd: 'yan5808558'
}

/**
 * 京东自动化登录
 */
async function jdLogin () {
  const browser = await puppeteer.launch({
    // 设置是否开启无头模式 
    headless: false,
    // 浏览器视口大小
    defaultViewport: {
      width: 1440,
      height: 900
    },
    ignoreDefaultArgs: ['--enable-automation']
  })

  // 打开新页面
  const page = await browser.newPage()
  // 跳转到指定url
  await page.goto(config.url, {
    // 等待不再有网络连接时触发
    waitUntil: 'networkidle0'
  })
  // 页面中注入opencv.js 用于处理图片操作滚动条
  // opencv.js 文档: https://docs.opencv.org/3.3.1/df/df7/tutorial_js_table_of_contents_setup.html
  // c++ py 常用, js不太友好 但功能贼强大
  await page.addScriptTag({
    path: './js/opencv.js'
  })
  await page.waitFor(2000)

  // 切换到账号密码登录
  const loginChose = await page.waitForSelector('#content > div.login-wrap > div.w > div > div.login-tab.login-tab-r')
  await loginChose.click()
  // 输入用户名密码
  const usernameInput = await page.waitForSelector('#loginname')
  await usernameInput.click()
  await usernameInput.type(config.username, {
    // 设置输入速度, 这里设置100只是为了防止异常操作被监测
    delay: 100
  })
  const pwdInput = await page.waitForSelector('#nloginpwd')
  await pwdInput.click()
  await pwdInput.type(config.pwd, {
    delay: 100
  })
  // 登录
  const loginBtn = await page.waitForSelector('#loginsubmit')
  await loginBtn.click()

  // 等待两秒, 等待dom加载完成
  await page.waitFor(3000);

  // 获取验证图片
  const maxPoint = await page.evaluate(() => {
    const backgroundImg = document.querySelector('div.JDJRV-bigimg > img')
    const tmplImg = document.querySelector('div.JDJRV-smallimg > img')
    // 载入源图像 即背景图像
    let source = cv.imread(backgroundImg)
    let sourceDst = new cv.Mat()
    // 载入模板图像 即滑块
    let tmpl = cv.imread(tmplImg)
    let tmplDst = new cv.Mat()
    // canny算子对图像进行边缘提取, 转为二值图像, 方便模板匹配
    // 关于图像处理的一些知识
    // 二值图像: 像素值仅有0和1的图像, 或仅有0和255的图像
    // 边缘提取: 大体的思想是遍历图像, 设置阈值比较, 得到边缘
    // 推荐前端的图像处理  http://alloyteam.github.io/AlloyImage/alloyphoto.html 
    // tencent  AlloyTeam出品
    cv.Canny(source, sourceDst, 200, 400, 3, false)
    cv.Canny(tmpl, tmplDst, 200, 400, 3, false)
    // 模板匹配提取边缘信息
    let dst = new cv.Mat()
    let mask = new cv.Mat()
    // 匹配模板
    cv.matchTemplate(sourceDst, tmplDst, dst, cv.TM_CCOEFF, mask)
    let result = cv.minMaxLoc(dst, mask)
    // 得到左上角坐标
    let maxPoint = result.maxLoc
    // return backgroundImg.src
    return maxPoint
  })

  // 通过canvas获取像素点, 自动验证
  // const canvas = createCanvas(360, 140)
  // const ctx = canvas.getContext('2d')

  // 通过canvas绘制图片
  // let sildePosition = 10
  // loadImage(authImgSrc).then((image) => {
  //   ctx.drawImage(image, 0, 0, 360, 140)
  //   const imgData = ctx.getImageData(0, 0, 360, 140);
  //   for (let x = 0; x < imgData.width; x++) {
  //     for (let y = 0; y < imgData.height; y++) {
  //       const idx = (x + y * canvas.width) * 4
  //       // 获取RGB
  //       let r = imgData.data[idx + 0];
  //       let g = imgData.data[idx + 1];
  //       let b = imgData.data[idx + 2];
  //       if (r >= 80 && r <= 90 && g < 20) {
  //         console.log('找到啦')
  //         console.log('坐标是:', x, y)
  //         console.log(r, g, b)
  //         console.log('缩放后', Math.round(x * 278 / 360), Math.round(y * 108 / 140))
  //         sildePosition = Math.round(x * 278 / 360)
  //         return
  //       }
  //     }
  //   }
  // })

  // 滑动滑块到指定位置
  const slide = await page.waitForSelector('.JDJRV-smallimg')
  // 获取滑块的信息
  const slideInfo = await slide.boundingBox()
  await page.mouse.click(slideInfo.x, slideInfo.y)
  await page.mouse.move(slideInfo.x, slideInfo.y)
  await page.mouse.down({ button: 'middle' })
  await page.mouse.move(slideInfo.x + maxPoint.x, slideInfo.y, { steps: 10 })
  // 等待, 目的是为了模拟真人操作, 其实没什么用~
  await page.waitFor(1000);
  await page.mouse.up()
}

jdLogin()
