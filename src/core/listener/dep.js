let uid = 0;

export default class Dep {

    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    // 添加订阅
    addSub(sub) {
        this.subs.push(sub);
    }

    // 通知所有订阅者要更新了
    notify() {
        for (let i = 0, l = this.subs.length; i < l; i++) {
            this.subs[i].update();
        }
    }
}

Dep.target = null;

export function pushTarget(watcher) {
    Dep.target = watcher;
}

export function removeTarget() {
    Dep.target = null;
}
