function observer(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key]);
    })
}

function defineReactive(data, key, val) {
    var dep = new Dep();
    observer(val)
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function () {
            if (Dep.target) {
                dep.depend();
            }
            return val;
        },
        set: function (newVal) {
            console.log(`值已经变化为: ${newVal}`)
            val = newVal;
            dep.notify();
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
    addSub:function (sub) {
        this.subs.push(sub)
    },
    notify : function () {
        this.subs.forEach(function (sub) {
            sub.update();
         })
    },
    depend:function () {
        Dep.target.addDep(this)
    }
}
Dep.target = null;