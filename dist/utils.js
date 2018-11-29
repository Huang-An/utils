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

    return listener;

})));
