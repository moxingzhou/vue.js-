function testCompile(el , vm) {
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    this.$vm = vm;
    if (this.$el){
        this.$fragment = this.nodeFragment(this.$el);
        this.compileElement(this.$fragment);
        //将原本的节点改为已修改的节点
        this.$el.appendChild(this.$fragment)
    }
}

testCompile.prototype = {
    //判断是否为节点，1 为节点 ，2 为属性
    isElementNode:function (el) {
        return el.nodeType == 1;
    },
    //将node转化为fragment文档碎片方便进行处理。
    nodeFragment:function (el) {
        //创建一个文档碎片
        var fragment = document.createDocumentFragment() , child;
        //appendChild执行会把已经添加的child移除
        while (child = el.firstChild){
            fragment.appendChild(child);
        }
        return fragment
    },
    compileElement:function (el) {
        var childNode = el.childNodes;
        var that = this;
        //将里面的属性返回成一个列表进行循环处理
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
        //获取里面的所有的属性
        [].slice.call(attributes).forEach(function (attr) {
            //获取属性名
            var name = attr.name;
            //判断是否为v-前缀
            if (that.isVue(name)){
                //获取v-前缀里面绑定的数据名
                var value = attr.value;
                //获取v-前缀后面的内容进行判断
                var attrType = attr.name.substring(2);
                //特殊指令
                if (that.isEvent(attrType)){
                    compileCommand["Event"](node , that.$vm , value , attr.name.substring(5))
                }else {
                    //普通指令
                    compileCommand[attrType](node , that.$vm , value);
                }
                //去除v-前缀的属性因为已经进行数据绑定了
                node.removeAttribute(name);
            }else if(that.isclick(name)){
                var value = attr.value;
                compileCommand["Event"](node , that.$vm , value , attr.name.substring(1));
                node.removeAttribute(name);
            }else {

            }
        })
    },
    //判断前缀
    isVue:function (name) {
        return name.indexOf('m-') == 0;
    },
    //判断是否特殊指令
    isEvent:function (ev) {
        return ev.indexOf('on') == 0;
    },
    isclick:function (ev) {
       return ev.indexOf('@') == 0;
    }
}
//根据指令名来进行获取数据
var compileCommand = {
    text:function (node , vm , key) {
        this.bind(vm , node , key , 'text');
    },
    model:function (node , vm , key) {
        let that = this
        this.bind(vm , node , key , 'model')
        //当数据初始化时还要绑定一个监听事件。
        node.addEventListener('input' , function (e) {
           that._setter_value(vm , key , e.target.value)
         })
    },
    if:function (node , vm , key) {
        console.log(key)
    },
    Event:function (node , vm , key , dir) {
      this.EventBind(vm , node , key , dir)
    },
    //会触发observer劫持数据监听事件中的get
    _getter_value:function (vm , Key) {
        var Vm = vm;
        //防止出现如：form.name的类型数据获取不到数据的现象出现。
        var exp = Key.split('.');
        exp.forEach(function (key) {
            Vm = Vm[key]
        })
        return Vm
    },
    //会触发observer劫持数据监听事件中的set
    _setter_value:function (vm , KeyName , value) {
        var Vmdata = vm;
        var exp = KeyName.split('.');
        //防止找不到form.name类型数据
        exp.forEach(function (k , i) {
            if (i < exp.length - 1){
                Vmdata = Vmdata[k]
            }else {
                Vmdata[k] = value
            }
        })
    },
    bind:function (vm , node , key , dir) {
        //根据指令来给节点赋值
        var updaterFn = updater[dir + 'Attr'];
        //创建订阅者，绑定回调事件,在初始化时会触发observer中的get并会添加订阅者到订阅器中
        new watcher(vm , key , function (value , olderValue) {
            updaterFn(node, value, olderValue);
        })
        updaterFn && updaterFn(node, this._getter_value(vm, key));
    },
    EventBind:function (vm, node, key , dir) {
        var fn = vm.$options.methods[key]
       node.addEventListener(dir , fn.bind(vm));
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