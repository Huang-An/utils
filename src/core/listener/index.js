import {observer} from "./observer";
import Watcher from "./watcher";

export default class listener {
    constructor(option) {

        if (typeof option === "object") {

            if (typeof option.data === "function") {
                this._data = option.data();
            } else {
                console.warn("data 必须是 function");
            }

            this.watch = option.watch || {};
        }

        this.init();
    }

    init() {
        proxy(this);
        observer(this._data);
        watcher(this, this.watch);
    }
}

function proxy(me) {
    Object.keys(me._data).forEach((key) => {
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
    for (let i in watch) {
        if (watch.hasOwnProperty(i)) {
            new Watcher(that, i, watch[i]);
        }
    }
}