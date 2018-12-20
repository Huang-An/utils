import {pushTarget, removeTarget} from "./dep";

let uid = 0;

export default class Watcher {

    constructor(vm, exp, cb) {
        this.id = uid++;
        this.vm = vm;
        this.exp = exp;
        this.cb = cb;
        this.value = this.get();
    }

    get() {
        pushTarget(this);
        const value = this.vm[this.exp];
        removeTarget();
        return value;
    }

    run() {
        const value = this.get();
        const oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    }

    update() {
        this.run();
    }
}