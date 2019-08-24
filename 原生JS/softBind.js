/**
 * @file 软绑定
 * @author anlei
 */

if (typeof Function.prototype.softBind !== 'function') {
    Function.prototype.softBind = function (target) {
        const fn = this;
        const curried = [].slice.call(arguments, 1);
        return function () {
            // 检查调用时的this，如果this是undefined或者window，
            // 那就把传进来的target当做执行时候的this用来阻止默认绑定事件
            return fn.apply(
                !this || this === (global || window) ? target : this,
                curried.concat(arguments)
            );
        }
    }
}
