class myPromise {

    constructor(execute) {
        this.status = myPromise.PENDIN;
        this.value = null; // 成功之后的返回值
        this.reason = null; // 失败之后的返回值
        this.onFulfilledQueue = []; // 完成之后的队列
        this.onRejectedQueue = []; // 失败队列
        this.init(execute)
    }

    init(execute) {
        try {
            // 绑定this执行
            this.resolve = this.resolve.bind(this);
            this.reject = this.reject.bind(this);
            execute(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    resolve(value) {
        // 完成了，将状态改为完成，执行完成队列里的函数
        if (this.status === myPromise.PENDIN) {
            // 放进setTimeout宏任务 满足Promise/A规范,使得Promise是异步的
            setTimeout(() => {
                this.status = myPromise.FULFILLED;
                this.value = value;
                this.onFulfilledQueue.forEach(cb => cb(this.value));
            })
        }
    }

    reject(reason) {
        // 失败了，将状态改为失败，执行失败队列里的函数
        if (this.status === myPromise.PENDIN) {
            // 放进setTimeout宏任务 满足Promise/A规范,使得Promise是异步的
            setTimeout(() => {
                this.status = myPromise.REJECTED;
                this.reason = reason;
                this.onRejectedQueue.forEach(cb => cb(this.reason));
            });
        }
    }

    then(onFulfilled, onRejected) {
        // 处理参数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        };
        // 如果已经完成，那就立马执行onFulfilled
        if (this.status === myPromise.FULFILLED) {
            return new myPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
        }
        // 如果已经失败，那就立马执行onRejected
        if (this.status === myPromise.REJECTED) {
            return new myPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                })
            });
        }
        // 如果是等待状态，就先将要执行的onFulfilled，onRejected放进队列等待完成后执行
        if (this.status === myPromise.PENDIN) {
            return new myPromise((resolve, reject) => {
                // 放进完成队列等待执行
                this.onFulfilledQueue.push((value) => {
                    try {
                        const x = onFulfilled(value);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
                // 放进失败队列等待执行
                this.onRejectedQueue.push((reason) => {
                    try {
                        const x = onRejected(reason);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    }

}

myPromise.PENDIN = 'pending'; // 等待状态
myPromise.FULFILLED = 'fulfilled'; // 完成
myPromise.REJECTED = 'rejected'; // 拒绝

export default myPromise;