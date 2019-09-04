/**
 * @file 函数节流
 * @author anlei
 * @description 规定一段时间内只能触发一次这个函数，如果单位时间触发多次  那么只能执行一次，节流的核心是无效
 * 
 * 场景：
 * 1. 拖拽：固定时间只能触发一次，防止高频触发位置变动
 * 2. 缩放，监控浏览器resize
 * 3. 动画，避免短时间内多次触发动画引起性能问题
 */


const throttle = (fn, delay = 500) => {
    let flag = true
    return (...args) => {
        if (flag) {
            flag = false;
            setTimeout(() => {
                fn.apply(this, args);
                flag = true;
            }, delay);
        }
    }
}