/**
 * vue是怎么做的数据劫持
 */

class Dep {
    constructor() {
        this.subs = [];
    }

    notify() {
        const subs = this.subs.slice();
        for (let i = 0; i < subs.length; i++) {
            subs[i].update();
        }
    }

    addSub(sub) {
        if (this.subs.indexOf(sub) === -1) {
            this.subs.push(sub);
        }
    }

    addDepend() {
        Dep.targets[Dep.targets.length - 1].addDep(this)
    }
}

Dep.targets = [];

const api = {
    replaceChild(oldElement, element) {
        return oldElement.parentElement.replaceChild(element, oldElement);
    },

    /**
     * 把数据代理到我们的对象上实例上面
     */
    proxy(target, data, key) {
        Object.defineProperty(target, key, {
            get() {
                return data[key];
            },
            set(newVal) {
                data[key] = newVal
            }
        });
    },

    /**
     * 深层代理
     * @param {*} obj 
     * @param {*} key 
     * @param {*} value 初始化的value
     */
    defineReactive(obj, key, value) {
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                if (Dep.targets.length > 0) {
                    dep.addDepend();
                }
                return value;
            },
            set(newVal) {
                // 通知刷新
                value = newVal;
                dep.notify();
            }
        });
    },
    pushTarget(instance) {
        // 接下来发生的所有依赖都算在这个instance头上面
        debugger;
        Dep.targets.push(instance);
    },
    popTarget() {
        Dep.targets.pop();
    }
}


class Watcher {
    constructor(getter, callback) {
        this.callback = callback;
        this.getter = getter;
        this.value = this.get();
    }

    get() {
        api.pushTarget(this);
        let value = this.getter();
        api.popTarget();
        return value;
    }

    addDep(dep) {
        dep.addSub(this);
    }

    update() {
        let newVal = this.get()
        this.value = newVal;
    }

}

class Observer {
    constructor(obj) {
        this.walk(obj)
    }
    walk(obj) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                this.walk(obj[key])
            }
            api.defineReactive(obj, key, obj[key])
        });

        return obj;
    }
}
/**
 * vue类
 */
class Vue {
    constructor(options) {
        const { el, data, render } = options;
        this.$el = document.querySelector(el);
        this._data = data && data();
        new Observer(this._data);
        this.$render = render;
        for (let key in this._data) {
            api.proxy(this, this._data, key);
        }
        new Watcher(() => {
            this._update();
        }), () => {
            console.log('callback');
        };
        // this._update();
    }

    /**
     * 把render里面的节点挂在我们选中的节点上面
     */
    _update() {
        console.log('update!!!!!!!!');
        const $root = this.$render(this._createElement);
        api.replaceChild(this.$el, $root);
        this.$el = $root;
        console.log(321);

    }

    /**
     * 
     * render函数中需要用到的createElement
     * @param {*} targetName 
     * @param {*} data 
     * @param {*} children 
     */
    _createElement(targetName, data, children) {
        const tag = document.createElement(targetName);
        const { attrs = {} } = data;
        for (let attrName in attrs) {
            tag.setAttribute(attrName, attrs[attrName]);
        }

        // 如果children不是array
        if (Object.prototype.toString.call(children) !== '[object Array]') {
            let child = document.createTextNode(children);
            tag.appendChild(child);
        } else {
            /**
             * 如果是array 循环插入
             * 
             */
            children.forEach(child => {
                tag.appendChild(child);
            });
        }

        return tag;
    }
}

let app = new Vue({
    el: '#app',
    data() {
        return {
            price: '27',
            infos: {
                title: '猪肉价格'
            },
            placeholder: '123'
        };
    },
    render(createElement) {
        return createElement('div', {
            attrs: {
                title: this.infos.title
            }
        }, [createElement('span', {}, this.price)]);
    }
});

window.app = app;