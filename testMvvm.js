function mvvm(option) {
    //获取id
    this.$options = option
    //获取数据
    var data = this.data = this.$options.data
    var that = this;
    //将vm.data.data转化为vm.data
    Object.keys(data).forEach(function (key) {
        that._protoData(key)
    })
    //添加劫持监听事件
    observer(data);
    //初始化视图
    this.$compile = new testCompile(option.el , this)
}
mvvm.prototype = {
    //将vm.data.data进行数据劫持一但数据改变就更新vm.data.data的数据
    _protoData:function (key) {
        var that = this;
        Object.defineProperty(that , key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return this.data[key];
            },
            set: function proxySetter(newVal) {
                this.data[key] = newVal;
            }
        });
    }
}
