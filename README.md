# learnractivejs
在过往开发 Web Project 的过程中，发现数据绑定是如此的重要，之前的项目由于没有使用数据绑定，导致后期维护异常的困难，例如：新增一个输入字段，后台不得不做数据兼容；字段没有做对象属性标记，导致阅读异常的困难。鉴于以上如此不堪的开发维护经验，今后项目势必用上数据绑定。

网上查阅发现 Angular、React、Vue 是最为普及的 MVVM 框架同时提供双向的数据绑定，但若使用这些框架，必须遵循框架自身严格的法则，编程的思维必须彻底地转换，开发也等于从零开始学，时间与脑力成本是巨大的。因此继续寻找，不经意间发现了 RactiveJS。

RactiveJS 是一款轻量级的前端 MVVM（Model-View-ViewModel） 框架，它实现了模板，数据绑定，DOM实时更新，自定义组件，事件处理等功能。当前项目最需要解决的数据绑定及输入控件组件化功能，ractivjs 这两点都能满足。同时查阅官方入门教程，发现难度较低，对于毫无数据绑定框架使用经验的人来说，也可较轻易的上手。于是创建 Repository 开启学习与应用 ractivejs 之路。

### 基础知识
#### Parallel DOM
RactiveJS 使用 Parallel Dom , 可看作是虚拟 DOM.

#### Mustache
RactiveJS 使用 Mustache 语法， Mustache（https://mustache.github.io/#demo） Mustache 是一个使用 template 实现页面数据定位的方法。在 RactiveJS 中标记 {{name}} 实现 name 在页面数据定位，同时 {{name}} 被用作 Parallel Dom 监听变化，从而更新真实的 Dom。

###### Demo Basic
https://yueveron.github.io/learnractivejs/demo/00.demo_helloworld.html

###### Example :: Create Ractive Object
```
createRactive : function(){
	var self = this;
	self.ractiveObj = new Ractive({
        //* el实质上是一个选择器，可以是#id,.class等等，同jQuery其实就是替换了el选择器对应元素的innerHTML
        el : '#module',
        //* template是模板对象，可以是 ajax 回调中的模板对象, 也可以是一段html代码，也可是定义在当前页上某个模板的id
        template : '#template-baisc',
        //* data就是要放到模板中的数据，是一个json对象，value可以是方法
        data : { greeting: 'Hello', name: 'world'},
        //oncomplete : 模板渲染完毕执行的回调函数, 如果要动态给模板中的DOM绑定一些动态jQuery事件, 建议写在这里
        oncomplete:function(){
        }
    });
}
```

###### Example :: 转义标记

```
data: { name: '<b>world</b>' }

//* 使用 {{{keypath}}}!
<p>Hello, {{{name}}}!</p>
```

###### Example :: Get Data ，_注意 clone or pure-data_

```
self.ractiveObj.get()
self.get('list',{virtual : true});  //* .get({virtual:true}) - get pure-data, not shadow-clone
```

###### Demo Nested Properties - 属性嵌套
https://yueveron.github.io/learnractivejs/demo/01.demo_NestedProperties.html

###### Demo Expressions - 表达式
https://yueveron.github.io/learnractivejs/demo/02.demo_Expressions.html

---

### Binding Data 数据绑定

#### 双向数据绑定

