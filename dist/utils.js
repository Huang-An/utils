/*!
 * utils.js
 * By huangAn
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.utils = factory());
}(this, (function () { 'use strict';

    var uid = 0;

    var Dep = function Dep() {
        this.id = uid++;
        this.subs = [];
    };

    // 添加订阅
    Dep.prototype.addSub = function addSub (sub) {
        this.subs.push(sub);
    };

    // 通知所有订阅者要更新了
    Dep.prototype.notify = function notify () {
        for (var i = 0, l = this.subs.length; i < l; i++) {
            this.subs[i].update();
        }
    };

    Dep.target = null;

    function pushTarget(watcher) {
        Dep.target = watcher;
    }

    function removeTarget() {
        Dep.target = null;
    }

    // 调用方式

    var desc = {
        // 可枚举
        enumerable: true,
        // 不可再定义
        configurable: false
    };

    var dep = new Dep();

    function defineProperty(data, key, val) {
        // 检测子对象
        observer(val);

        // getter
        desc.get = function () {
            Dep.target && dep.addSub(Dep.target);
            return val;
        };

        // setter
        desc.set = function (newVal) {
            val = newVal;
            dep.notify();
        };

        Object.defineProperty(data, key, desc);
    }

    function observer(data) {
        // 检查是否是对象
        if (!data || typeof data !== "object") {
            return false;
        }
        // 取出对象
        Object.keys(data).forEach(function (key) {
            defineProperty(data, key, data[key]);
        });
    }

    var uid$1 = 0;

    var Watcher = function Watcher(vm, exp, cb) {
        this.id = uid$1++;
        this.vm = vm;
        this.exp = exp;
        this.cb = cb;
        this.value = this.get();
    };

    Watcher.prototype.get = function get () {
        pushTarget(this);
        var value = this.vm[this.exp];
        removeTarget();
        return value;
    };

    Watcher.prototype.run = function run () {
        var value = this.get();
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    };

    Watcher.prototype.update = function update () {
        this.run();
    };

    var listener = function listener(option) {

        if (typeof option === "object") {

            if (typeof option.data === "function") {
                this._data = option.data();
            } else {
                console.warn("data 必须是 function");
            }

            this.watch = option.watch || {};
        }

        this.init();
    };

    listener.prototype.init = function init () {
        proxy(this);
        observer(this._data);
        watcher(this, this.watch);
    };

    function proxy(me) {
        Object.keys(me._data).forEach(function (key) {
            Object.defineProperty(me, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return me._data[key];
                },
                set: function proxySetter(newVal) {
                    me._data[key] = newVal;
                }
            });
        });
    }

    function watcher(that, watch) {
        for (var i in watch) {
            if (watch.hasOwnProperty(i)) {
                new Watcher(that, i, watch[i]);
            }
        }
    }

    var myPromise = function myPromise(execute) {
        this.status = myPromise.PENDIN;
        this.value = null; // 成功之后的返回值
        this.reason = null; // 失败之后的返回值
        this.onFulfilledQueue = []; // 完成之后的队列
        this.onRejectedQueue = []; // 失败队列
        this.init(execute);
    };

    myPromise.prototype.init = function init (execute) {
        try {
            // 绑定this执行
            this.resolve = this.resolve.bind(this);
            this.reject = this.reject.bind(this);
            execute(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    };

    myPromise.prototype.resolve = function resolve (value) {
            var this$1 = this;

        // 完成了，将状态改为完成，执行完成队列里的函数
        if (this.status === myPromise.PENDIN) {
            // 放进setTimeout宏任务 满足Promise/A规范,使得Promise是异步的
            setTimeout(function () {
                this$1.status = myPromise.FULFILLED;
                this$1.value = value;
                this$1.onFulfilledQueue.forEach(function (cb) { return cb(this$1.value); });
            });
        }
    };

    myPromise.prototype.reject = function reject (reason) {
            var this$1 = this;

        // 失败了，将状态改为失败，执行失败队列里的函数
        if (this.status === myPromise.PENDIN) {
            // 放进setTimeout宏任务 满足Promise/A规范,使得Promise是异步的
            setTimeout(function () {
                this$1.status = myPromise.REJECTED;
                this$1.reason = reason;
                this$1.onRejectedQueue.forEach(function (cb) { return cb(this$1.reason); });
            });
        }
    };

    myPromise.prototype.then = function then (onFulfilled, onRejected) {
            var this$1 = this;

        // 处理参数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) { return value; };
        onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {
            throw reason
        };
        // 如果已经完成，那就立马执行onFulfilled
        if (this.status === myPromise.FULFILLED) {
            return new myPromise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        var x = onFulfilled(this$1.value);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
        // 如果已经失败，那就立马执行onRejected
        if (this.status === myPromise.REJECTED) {
            return new myPromise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        var x = onRejected(this$1.reason);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
        // 如果是等待状态，就先将要执行的onFulfilled，onRejected放进队列等待完成后执行
        if (this.status === myPromise.PENDIN) {
            return new myPromise(function (resolve, reject) {
                // 放进完成队列等待执行
                this$1.onFulfilledQueue.push(function (value) {
                    try {
                        var x = onFulfilled(value);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
                // 放进失败队列等待执行
                this$1.onRejectedQueue.push(function (reason) {
                    try {
                        var x = onRejected(reason);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    };

    myPromise.PENDIN = 'pending'; // 等待状态
    myPromise.FULFILLED = 'fulfilled'; // 完成
    myPromise.REJECTED = 'rejected'; // 拒绝

    var index = {
        Listener: listener,
        MyPromise: myPromise
    };

    return index;

})));
