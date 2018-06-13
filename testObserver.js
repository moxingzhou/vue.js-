function observer(data) {
    //判断是否为object和null
    if (!data || typeof data !== 'object') {
        return;
    }
    //不为null时，循环给数据添加数据劫持监听事件
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key]);
    })
}
function defineReactive(data, key, val) {
    var dep = new Dep();
    observer(val)
    //数据劫持监听（核心）
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function () {
            //添加订阅者
            if (Dep.target) {
                dep.depend();
            }
            return val;
        },
        set: function (newVal) {
            val = newVal;
            //向订阅者发送修改信息
            dep.notify();
            //为新数据添加数据劫持监听事件
            observer(newVal);
        }
    })
}
var uid = 0
function Dep() {
    this.id = uid++;
    this.subs = [];
}
Dep.prototype={
    //添加订阅者到订阅器中
    addSub:function (sub) {
        this.subs.push(sub)
    },
    //发送数据修改信息
    notify : function () {
        this.subs.forEach(function (sub) {
            sub.update();
         })
    },
    //添加订阅者记录
    depend:function () {
        Dep.target.addDep(this)
    }
}
Dep.target = null;