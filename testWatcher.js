function watcher(vm , key , cb) {
    this.$vm = vm;
    this.cb  = cb;
    var that = this;
    this.updatedep = {};
    if (typeof key === "function"){
<<<<<<< HEAD
        this.getter = key
    }else {
        this.getter = that.parentData(key)
    }
    this.value = this.get();
}

=======
        this.getter = key;
    }else {
        this.getter = that.parentData(key);
    }
    this.value = this.get();
}
>>>>>>> 测试
watcher.prototype={
    update:function () {
        this.run();
    },
    run:function () {
        var value = this.get();
        var olderValue = this.value;
        if (value !== olderValue){
            this.value = value;
<<<<<<< HEAD
            this.cb.call(this.$vm , value , olderValue);
=======
<<<<<<< HEAD
            this.cb.call(this.$vm , value , olderValue)
=======
            this.cb.call(this.$vm , value , olderValue);
>>>>>>> 测试
>>>>>>> 4b5cbf10af0e06bfeffc0396b93c06cd31b26c52
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
<<<<<<< HEAD
                obj = obj[exps[i]];
=======
<<<<<<< HEAD
                obj = obj[exps[i]]
=======
                obj = obj[exps[i]];
>>>>>>> 测试
>>>>>>> 4b5cbf10af0e06bfeffc0396b93c06cd31b26c52
            }

            return obj;
        }
    },
    addDep:function (dep) {
        if (!this.updatedep.hasOwnProperty(dep.id)){
<<<<<<< HEAD
            dep.addSub(this);
            this.updatedep[dep.id] = dep;
=======
            dep.addSub(this)
<<<<<<< HEAD
            this.updatedep[dep.id] = dep
=======
            this.updatedep[dep.id] = dep;
>>>>>>> 测试
>>>>>>> 4b5cbf10af0e06bfeffc0396b93c06cd31b26c52
        }
    }
}