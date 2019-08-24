/**
 * @file 符合A+规范的promise
 * @author anlei
 * 
 */

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

class Promise {
    constructor(fn) {
        this._state = PENDING;
        this._data = undefined;
        this._onFulfilledCallback = [];
        this._onRejectedCallback = [];

        run(this, fn);
    }

    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = data => data;
        }
        if (typeof onRejected !== 'function') {
            onRejected = reason => { throw reason; }
        }
        let promise2;

        if (this._state === PENDING) {
            promise2 = new Promise((resolve, reject) => {
                this._onFulfilledCallback.push((data) => {
                    try {
                        const x = onFulfilled(data);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
                this._onRejectedCallback.push((reason) => {
                    try {
                        const x = onRejected(reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }

        if (this._state === REJECTED) {
            promise2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onRejected(this._data);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }

        if (this._state === FULFILLED) {
            promise2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this._data);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }

        return promise2;
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
}

Promise.reject = (reason) => {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}
Promise.resolve = (data) => {
    return new Promise((resolve, reject) => {
        resolve(data);
    });
}

Promise.deferred = () => {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });

    return dfd;
}


const resolvePromise = (promise2, x, resolve, reject) => {
    // if (x instanceof Promise) {
    //     x.then(resolve, reject);
    // } else {
    //     resolve(x)
    // }

    if (promise2 === x) {  // 如果从onFulfilled中返回的x 就是promise2 就会导致循环引用报错
        return reject(new TypeError('循环引用'));
    }

    let called = false; // 避免多次调用
    // 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
    if (x instanceof Promise) { // 获得它的终值 继续resolve
        if (x._state === PENDING) { // 如果为等待态需等待直至 x 被执行或拒绝 并解析y值
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject);
            }, reason => {
                reject(reason);
            });
        } else { // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
            x.then(resolve, reject);
        }
        // 如果 x 为对象或者函数
    } else if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try { // 是否是thenable对象（具有then方法的对象/函数）
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, reason => {
                    if (called) return;
                    called = true;
                    reject(reason);
                })
            } else { // 说明是一个普通对象/函数
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

const resolve = (promise, data) => {
    if (data instanceof Promise) {
        return data.then(
            d => resolve(promise, d),
            r => reject(promise, r)
        )
    }



    setTimeout(() => {
        if (promise._state !== PENDING) {
            return;
        }
        promise._state = FULFILLED;
        promise._data = data;

        for (let callback of promise._onFulfilledCallback) {
            callback(data);
        }
    });

}

const reject = (promise, reason) => {


    setTimeout(() => {
        if (promise._state !== PENDING) {
            return;
        }
        promise._state = REJECTED;
        promise._data = reason;

        for (let callback of promise._onRejectedCallback) {
            callback(reason);
        }
    });
}

Promise.race = (promises) => {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            promise.then(resolve, reject);
        });
    });
}

Promise.all = (promises) => {
    return new Promise((resolve, reject) => {
        const length = promises.length;
        const done = gen(length, resolve);
        promises.forEach((promise, index) => {
            promise.then((value) => {
                done(value, index);
            }, reject)
        });
    });
}

const gen = (length, resolve) => {
    let count = 0;
    const result = [];

    return function (value, index) {
        result[index] = value;
        if (++count === length) {
            resolve(result);
        }
    }
}

const run = (promise, fn) => {
    try {
        fn(
            data => resolve(promise, data),
            reason => reject(promise, reason)
        );
    } catch (e) {
        reject(e)
    };
}

module.exports = Promise;