/**
 * jq实现, 仅为封装查询方法
 */
module.exports = () => {
  window.$ = function (selector) {
    return document.querySelectorAll(selector)
  }
}