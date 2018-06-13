function watcher(vm , key , cb) {
    this.$vm = vm;
    this.cb  = cb;
    var that = this;
    this.updatedep = {};
    //判断是否传进是否为方法
    if (typeof key === "function"){
        this.getter = key
    }else {
        //获取回调方法
        this.getter = that.parentData(key)
    }
    //获取数据
    this.value = this.get();
}

watcher.prototype={
    update:function () {
        this.run();
    },
    //更新视图
    run:function () {
        var value = this.get();
        var olderValue = this.value;
        if (value !== olderValue){
            this.value = value;
            //调用回调事件进行更新视图
            this.cb.call(this.$vm , value , olderValue);
        }
    },
    //获取数据
    get:function () {
        Dep.target = this;
        //会触发observer中的get从而触发Dep.addSub
        var value = this.getter.call(this.$vm , this.$vm);
        return value
    },
    parentData:function (exp) {
        if (/[^\w.$]/.test(exp)) return;
        var exps = exp.split('.');
        //防止出现如：form.name的类型数据获取不到数据的现象出现。
        return function (obj) {
            for (let i = 0 ; i < exps.length ; i++){
                obj = obj[exps[i]];
            }
            return obj;
        }
    },
    addDep:function (dep) {
        //判断订阅器是否存在，如果存在只是数据更新不需要添加新的订阅者，否则添加
        if (!this.updatedep.hasOwnProperty(dep.id)){
            dep.addSub(this);
            this.updatedep[dep.id] = dep
        }
    }
}