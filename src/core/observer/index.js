// 调用方式
// observer();
import Dep from './dep';

const desc = {
    // 可枚举
    enumerable: true,
    // 不可再定义
    configurable: false
};

const dep = new Dep();

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

export function observer(data) {
    // 检查是否是对象
    if (!data || typeof data !== "object") {
        return false;
    }
    // 取出对象
    Object.keys(data).forEach(key => {
        defineProperty(data, key, data[key]);
    });
}