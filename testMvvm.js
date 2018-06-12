function mvvm(option) {
    this.$options = option
    var data = this.data = this.$options.data
    var that = this;
    Object.keys(data).forEach(function (key) {
        that._protoData(key)
    })
    observer(data);
    this.$compile = new testCompile(option.el , this)
}
mvvm.prototype = {
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
