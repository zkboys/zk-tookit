/* ========================================================
 * 发布订阅模式,带有消息队列 生产者消费者 性质
 * =======================================================*/

class PubSubMsg {
    topics = {}
    unConsumedMsg = {} // key 对应主题，value对应消息数据

    publish(topic, args) {
        /*
         * 消息统一放入消息队列当中。
         * 注意：为了后订阅的所有订阅者都能接受到消息，这个消息队列不会被清空，如果存在大量的后订阅情况，小心内存溢出。
         * */
        this.unConsumedMsg[topic] = args;

        if (!this.topics[topic]) {
            return false;
        }

        for (let p of Object.keys(this.topics[topic])) {
            let func = this.topics[topic][p].func;
            let once = this.topics[topic][p].once;

            if (func) {
                func(args);
                if (once) {
                    delete (this.topics[topic][p]);
                }
            }
        }

        return this;
    }

    /*
     * 同subscribe,但是相应函数只触发一次
     * */
    subscribeOnce(topic, name, func) {
        if (arguments.length === 2) {
            func = name;
            name = new Date().getTime(); // 未指定name，使用时间戳，指定一个
        }

        return this._subscribe(topic, name, func, true, false);
    }

    /*
     * 同subscribeOnce,但是会消费历史消息
     * */
    subscribeOnceAcceptOldMsg(topic, name, func) {
        if (arguments.length === 2) {
            func = name;
            name = new Date().getTime(); // 未指定name，使用时间戳，指定一个
        }

        return this._subscribe(topic, name, func, true, true);
    }

    /*
     * subscribe,但是会消费历史消息
     * */
    ubscribeAcceptOldMsg(topic, name, func) {
        if (arguments.length === 2) {
            func = name;
            name = new Date().getTime();// 未指定name，使用时间戳，指定一个
        }

        return this._subscribe(topic, name, func, false, true);
    }

    /*
     * 单纯的订阅.
     * */
    subscribe(topic, name, func) {
        if (arguments.length === 2) {
            func = name;
            name = new Date().getTime(); // 未指定name，使用时间戳，指定一个
        }

        return this._subscribe(topic, name, func, false, false);
    }

    /*
     * 通过事件名称、订阅者名称、回调函数订阅事件
     * topic：事件名
     * name: 订阅者名 可选 如果没指定那么，那么不能单独取消订阅，只能统一取消订阅。
     * func: 订阅事件（发布时触发）
     * once: 是否只触发一次func
     * acceptOldMsg:接受历史消息
     * 同一个事件，不同的订阅者可以单独取消自己的订阅
     */
    _subscribe(topic, name, func, once, acceptOldMsg) {
        if (!this.topics[topic]) {
            this.topics[topic] = {};
        }

        this.topics[topic][name] = {};
        this.topics[topic][name].func = func;
        this.topics[topic][name].once = once;

        if (acceptOldMsg) {
            // 对应topic下加入回调函数
            /*
             * 查询是否有未消费的相应消息，如果有，立即执行回调。
             * */
            if (topic in this.unConsumedMsg) {
                let data = this.unConsumedMsg[topic];
                func(data);
            }
        }

        return this;
    }

    unsubscribe(topic, name) {
        /*
         解绑取消订阅事件
         topic：事件名
         name: 订阅者名 可选 如果没指定那么，那么不能单独取消订阅，只能统一取消订阅。
         */
        if (!this.topics[topic]) {
            return false;
        }

        if (!name) {
            // 解绑所有 topic 事件
            delete this.topics[topic];
        } else if (this.topics[topic][name]) {
            // 解绑 topic 事件下的指定 name 订阅者
            delete this.topics[topic][name];
        }
        return this;
    }
}

export default new PubSubMsg();
