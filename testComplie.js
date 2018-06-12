function testCompile(el , vm) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    this.$vm = vm;
    if (this.$el){
        this.$fragment = this.nodeFragment(this.$el);
        this.compileElement(this.$fragment)
        this.$el.appendChild(this.$fragment)
    }
}

testCompile.prototype = {
    isElementNode:function (el) {
        return el.nodeType == 1;
    },
    nodeFragment:function (el) {
        var fragment = document.createDocumentFragment() , child;
        while (child = el.firstChild){
            fragment.appendChild(child);
        }
        return fragment
    },
    compileElement:function (el) {
        var childNode = el.childNodes;
        var that = this;
        [].slice.call(childNode).forEach(function (node) {
            var Content = node.textContent;
            var Reg = /\{\{(.*)\}\}/;

            if (that.isElementNode(node)){
                that.compile(node)
            }
        })
    },
    compile:function (node) {
        var attributes = node.attributes;
        var that = this;
        [].slice.call(attributes).forEach(function (attr) {
            var name = attr.name;
            if (that.isVue(name)){
                var value = attr.value;
                var attrType = attr.name.substring(2);
                if (that.isEvent(attrType)){

                }else {
                    compileCommand[attrType](node , that.$vm , value);
                }
                node.removeAttribute(name);
            }
        })
    },
    isVue:function (name) {
        return name.indexOf('v-') == 0;
    },
    isEvent:function (ev) {
        return ev.indexOf('on') == 0;
    }
}

var compileCommand = {
    text:function (node , vm , key) {
        this.bind(vm , node , key , 'text');
    },
    model:function (node , vm , key) {
        let that = this
        this.bind(vm , node , key , 'model')
        node.addEventListener('input' , function (e) {
           that._setter_value(vm , key , e.target.value)
         })
    },
    _getter_value:function (vm , Key) {
        var Vm = vm;
        var exp = Key.split('.');
        exp.forEach(function (key) {
            Vm = Vm[key]
        })
        return Vm
    },
    _setter_value:function (vm , KeyName , value) {
        var Vmdata = vm;
        var exp = KeyName.split('.');
        exp.forEach(function (k , i) {
            if (i < exp.length - 1){
                Vmdata = Vmdata[k]
            }else {
                Vmdata[k] = value
            }
        })
    },
    bind:function (vm , node , key , dir) {
        var updaterFn = updater[dir + 'Attr'];
        updaterFn && updaterFn(node, this._getter_value(vm, key));
        new watcher(vm , key , function (value , olderValue) {
            updaterFn(node, value, olderValue);
        })
    }
}

var updater = {
    modelAttr:function (node , value , olderValue ,dir) {
        return node.value  = value != 'undefined'? value : '';
    },
    textAttr:function (node, value) {
        return node.textContent = value != 'undefined' ? value : '';
    }
}