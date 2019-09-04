/**
 * @file 函数防抖
 * @author anlei
 * @description 事件在触发n秒之后再执行回调，如果n秒内又被触发，则重新计时，防抖的核心是打断重来
 * 场景：防止多次提交提交，表单验证需要服务端配合，只执行一段时间输入时间的最后一次
 */


/**
 * 
 * @param {*} fn 回调函数
 * @param {*} time 防抖延迟秒数
 */
const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
        clearInterval(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}