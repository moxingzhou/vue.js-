function watcher(vm , key , cb) {
    this.$vm = vm;
    this.cb  = cb;
    var that = this;
    this.updatedep = {};
    if (typeof key === "function"){
        this.getter = key
    }else {
        this.getter = that.parentData(key)
    }
    this.value = this.get();
}

watcher.prototype={
    update:function () {
        this.run();
    },
    run:function () {
        var value = this.get();
        var olderValue = this.value;
        if (value !== olderValue){
            this.value = value;
            this.cb.call(this.$vm , value , olderValue)
        }
    },
    get:function () {
        Dep.target = this;
        var value = this.getter.call(this.$vm , this.$vm);
        return value
    },
    parentData:function (exp) {
        if (/[^\w.$]/.test(exp)) return;
        var exps = exp.split('.');
        return function (obj) {
            for (let i = 0 ; i < exps.length ; i++){
                obj = obj[exps[i]]
            }

            return obj;
        }
    },
    addDep:function (dep) {
        if (!this.updatedep.hasOwnProperty(dep.id)){
            dep.addSub(this)
            this.updatedep[dep.id] = dep
        }
    }
}