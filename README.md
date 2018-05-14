# Learning ractivejs

在过往开发 Web Project 的过程中，发现数据绑定是如此的重要，之前的项目由于没有使用数据绑定，导致后期维护异常的困难，例如：新增一个输入字段，后台不得不做数据兼容；字段没有做对象属性标记，导致阅读异常的困难。鉴于以上如此不堪的开发维护经验，今后项目势必用上数据绑定。

网上查阅发现 Angular、React、Vue 是最为普及的 MVVM 框架同时提供双向的数据绑定，但若使用这些框架，必须遵循框架自身严格的法则，编程的思维必须彻底地转换，开发也等于从零开始学，时间与脑力成本是巨大的。因此继续寻找，不经意间发现了 RactiveJS。

RactiveJS 是一款轻量级的前端 MVVM（Model-View-ViewModel） 框架，它实现了模板，数据绑定，DOM实时更新，自定义组件，事件处理等功能。当前项目最需要解决的数据绑定及输入控件组件化功能，ractivjs 这两点都能满足。同时查阅官方入门教程，发现难度较低，对于毫无数据绑定框架使用经验的人来说，也可较轻易的上手。于是创建 Repository 开启学习与应用 ractivejs 之路。

#### 目录
* [基础知识](#creating-components---创建组件)
* [数据绑定](#binding-data-数据绑定)
* [响应事件](#handling-events-响应事件)
* [自定义组件](#creating-components---创建组件)
* [构建页面](#create-basci-page---构建页面)
* [构建购物车](#create-shopcar-page---构建购物车)


### 基础知识
#### Parallel DOM
RactiveJS 使用 Parallel Dom , 可看作是虚拟 DOM.

#### Mustache
RactiveJS 使用 Mustache 语法， Mustache（https://mustache.github.io/#demo） Mustache 是一个使用 template 实现页面数据定位的方法。在 RactiveJS 中标记 {{name}} 实现 name 在页面数据定位，同时 {{name}} 被用作 Parallel Dom 监听变化，从而更新真实的 Dom。

###### Demo Basic
https://yueveron.github.io/learnractivejs/demo/00.demo_helloworld.html

###### Example :: Create Ractive Object
```javascript
createRactive : function(){
	var self = this;
	self.ractiveObj = new Ractive({
        //* el实质上是一个选择器，可以是#id,.class等等，同jQuery其实就是替换了el选择器对应元素的innerHTML
        el : '#module',
        //* template是模板对象，可以是 ajax 回调中的模板对象, 也可以是一段html代码，也可是定义在当前页上某个模板的id
        template : '#template-baisc',
        //* data就是要放到模板中的数据，是一个json对象，value可以是方法
        data : { greeting: 'Hello', name: 'world'},
        //onrender : 模板渲染完毕执行的回调函数, 如果要动态给模板中的DOM绑定一些动态jQuery事件, 建议写在这里
        onrender:function(){
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

###### Example :: Get Data ，==注意 clone or pure-data==

```
self.ractiveObj.get()
self.get('list',{virtual : true});  //* .get({virtual:true}) - get pure-data, not shadow-clone
```

#### 属性嵌套
Ractive 支持对象属性嵌套，使用 Mustaches Sections 语法实现，即是：{ obj:{sub:{}}, prop,... }

```
{
	"item" : {
		"country": {
	      "name": "中国",
	      "climate": { "temperature": "温暖", "rainfall": "较少" },
	      "population": 63230000,
	      "capital": { "name": "北京", "area": 8, "culture":{"bookstore":"三联书店","university":"北京大学"} }
	    }
	}
}
```
```
<!-- 属性嵌套 
    {{#country}} 
        {{#capital}}
        {{/capital}} 
    {{/country}}
-->
<script id="template-nest-prop" type="text/ractive">
    <h2>Country profile</h2>
    
    {{#country}}
        <p>{{name}} 是一个气候 {{climate.temperature}} 的国家，降雨量 {{climate.rainfall}}，人口 {{population}}.</p>
    
        {{#capital}}
            <p>首都{{name}} , 共有 {{area}} 个区。 </p>
            {{#culture}}
                <p>首都最好的书店:{{bookstore}}。</p>
                <p>首都最好的大学:{{university}}。</p>
            {{/culture}}    
        {{/capital}}
    
    {{/country}}
</script>
```
###### Demo Nested Properties - 属性嵌套
https://yueveron.github.io/learnractivejs/demo/01.demo_NestedProperties.html

#### KeyPath
在 RactiveJS 实例中，使用树状结构存放 KeyPath，如上列：country 是一个整体容器, 其内为 top-level context（相关内容），在 country 内 name 为第一层的 KeyPath。bookstore 的 KeyPath : country.capital.cultrue.bookstore。KeyPath 作为关键路径必须唯一。 

KeyPath 是获取 Ractive 实例中数据属性，以及设置数据属性的关键。


#### 表达式格式化数据
```
<div id='container'></div>
<script id='template' type='text/ractive'>
    <h3>{{city}}</h3>
    <p>{{ format(inCopenhagen) }}</p>
</script>
```

```javascript
var ractive = new Ractive({
  el: '#container',
  template: '#template',
  data: {
    city: 'Copenhagen'
    inCopenhagen: 601448,
    format: function ( num ) {
      if ( num > 1000 ) return ( Math.floor( num / 1000 ) ) + ',' + ( num % 1000 );
      return num;
    }
  }
})
```
###### Demo Expressions - 表达式
https://yueveron.github.io/learnractivejs/demo/02.demo_Expressions.html

#### Partial(局部) 子块
Partial 是可以嵌入 template 中的代码块，除了嵌入 template 还可以嵌入到另外的 Partials。好处是让代码更易于维护阅读，减少重复编码。当需要在 RacitveJS 实例中使用重复的代码时就可以用 Partial。

```javascript
<div id='container'></div>

<script id='template' type='text/ractive'>
<div class='gallery'>
  {{#each items}}
    <!-- ">"符号 标记使用 partials -->
    {{>thumbnail}}
  {{/each}}
</div>
</script>
```

```javascript
//* Define : Partials
var thumbs = "<figure class='thumbnail'><img src='img/{{id}}.png'><figcaption>{{description}}</figcaption></figure>";

var ractive = new Ractive({
  el: '#container',
  template: '#template',
  partials: { thumbnail: thumbs },  // Parsed thumbs to Partials.thumbnail
  data: { 
    items: [
      { id: 'africanviolet', description: 'African Violet' },
      { id: 'cactusflower', description: 'Cactus Flower' },
      { id: 'forestorchid', description: 'Forest Orchid' }
    ]
  }
});
```

###### Demo Partials - 子块
https://yueveron.github.io/learnractivejs/demo/partials/partials.html

---

### Binding Data 数据绑定

#### 双向数据绑定
假设在 template 中如果有两处绑定的是同一个对象属性名，则如果其中一处导致这个对象属性名的值发生了改变，则这两处的值都会一起改变。 

###### Demo Binding Data
https://yueveron.github.io/learnractivejs/demo/binding-data/dropdown.html

#### 所有输入控件的数据绑定 API
https://ractive.js.org/api/#data-binding

#### 延迟更新：lazy="ture"

```
<input type="text" value="{{ bar }}" lazy="true"> {{ bar }}
```

#### Observe(观察) API 方法 - 实现组件回调函数功能
ractivejs .observe() method ：绑定需观察的 keypath ，当 keppath value 变化时，触发回调函数。

###### Example : Observe
```
<div id="container"><div>
<script id="template" type="text/ractive">
  The value of foo has changed to {{foo}}
</script>
```

```javascript
ractive = new Ractive({
  el: "#container",
  template: "#template",
  data: {
    foo: { bar: 9 }
  }
});

//* 回调函数返回（newValue, oldValue, keypath）
observer = ractive.observe( 'foo.bar', function ( newValue, oldValue, keypath ) {
  console.log( keypath + ' changed to ' + newValue );
});

//* 取消监听
observer.cancel()
```

---

### Handling Events 响应事件

Ractive 使用 publish / subscribe 广播/监听 机制处理事件。

#### .on() 与 .off() 
###### Example of simple case
```
<div id='container'></div>

<script id="template" type="text/ractive">
    <p><button on-click="custom" value="{{btnval}}">btnCustom</button></p>
    
    <form on-submit="submit">
      <input value="{{val}}">
    </form>
    <p>Text submitted: {{submitted}}</p>
    
    <p>Character code of key pressed:</p>
    <p><input value="{{keycode}}" on-keydown="@this.set('keycode', @event.keyCode), @event.preventDefault()"></p>
</script>        
```

```javascript
var ractive = new Ractive({
  template: '#template',
  el: '#container',
  data :{
  	btnval : 1
  }
});   

//* handle : on-submit
ractive.on('submit', function(event) {
	this.set('submitted', this.get('val'));
	event.original.preventDefault();
});

//* handle : on-click
ractive.on('custom', function(event) {
	console.log(this.get('btnval'))
})
```

#### Ractive 的事件类型
##### Publishing Directly - 直接广播类型，Ractive 实例直接触发。

```
ractive.fire('welcome', 'Hello, reader!')
```
##### Lifecycling Events - 生命周期事件

监听 Ractive 实例在不同生命周期的事件，属于 Ractive API 提供的内部事件。例如:onrender(),oncomplete()...

##### Proxy Syntax - 代理事件
最常用的事件类型，template 元素中广播，ractive.on()响应。

```
Ractive({
    template: `
    <button on-click="buttonsubmit">Click to submit</button>
    `,
    // as soon as our Ractive instance has been initialized and is ready to be rendered on-screen
    oninit(){
        this.on('buttonsubmit', function(event) {
            console.log('button clicked')
        })
    }
})
```
###### Example of 点击事件传参

```javascript
Ractive({
    el: 'body',
    template: `
        <button on-click="['buttonclicked', 'abc', 'xyz']">Click Me!</button>
    `,
    oninit(){
        this.on('buttonclicked', (event, msg, foo) => {
            console.log(msg + ' button clicked');
            console.log('This is the second value being passed: ' + foo);
        })
    }
})
```
###### Example of 通配符, .on('*.')

```javascript
Ractive({
  el: 'body',
  append: true,
  //* abc.bar : . 点号是命名空间, 在 .on()内用 * 星号替代
  template: 
    '<div id = "container">' +   
      '<button on-click="abc.bar">Click Me!</button>' +
      '<button on-click="abc.baz">Click Me!</button>' +
      '<button on-click="abc.bam">Click Me!</button>' +
      '<button on-click="abc.bar">Press Me!</button>' +
      '<button on-click="event.baz">Click Me!</button>' +
      '<button on-click="event.bam">Click Me!</button>' +
    '</div>',
  oninit(){
    this.on('*.bar', event => {
      window.alert('A bar event was published')
    })
    this.on('event.*', event => {
      console.log('An event button was clicked')
    })
  }
})
```
###### Example of 阻止冒泡, 在需要阻止冒泡的元素 .on()方法内 return false 即可。

```javascript
Ractive({
    el: 'body',
    template: `
        <div on-click="ancestorbuttonclick">
        <button on-click="descendantbuttonclick">Click Me!</button>
        </div>
    `,
    oninit(){
        this.on('ancestorbuttonclick', event => {
            console.log('This will not run');
        });
        this.on('descendantbuttonclick', event => {
            console.log('This will run');
            //* equal to event.stopPropagation() and event.preventDefault()
            return false;
        });
    }
});
```

---

### Creating Components - 创建组件
将代码封装为一个可复用的 Ractive 组件。组件的好处是：复用的时候我只需 copy 一个组件.js 就可以，而不必 copy 三个文件-html, css, js。

#### 初始化组件
##### 一个最基础的组件包括 3 元素
- data : 数据
- styling : 样式
- template : 模版

##### 组件必须继承 Ractive
任何创建的组件都必须继承 Ractive，这意味着组件是一个 Ractive 对象，我们可以调用 Ractive 相关的属性方法，以及在 template 直接放入组件名即可使用。

###### Basic of Ractive Component

==注意：isolated== , default true, 默认下使用 componet 的 Ractive instance data 不能 update 其内的 data

```javascript
//* Create Componet
var MyComponent = Ractive.extend({
  isolated : false,  //* default true, 如果默认ture, componet 的 Ractive instance data(title) 不能 update 其内的 data(title)
  template:
    `
    <div class="my-component">
      <h3>{{ title }}</h3>
      <span class="message">{{ message }}</span>
    </div>`,
  css: `
    .message { color: #c4c4c4 }
  `,
  data: { message: 'Hello World' }
});

//* Use component
var ractive = new Ractive({
  el: '#container',
  components: {
    myComponet: MyComponent
  },  
  data: {
    title: 'Use :: MyComponent'
  },
  template:'<myComponet />'
});
```

##### {{yield}} 方法
Ractive 提供了 {{yield}} method, 使用它我们能将父层的 content 传入组件内标记了相应的 content 的区域。

#### 注册及使用组件
3 种注册组件的方法：

**1.全局注册**

```javascript
Ractive.components.MyComponent = Ractive.extend({ ... });
```

**2.另一个Componet 内注册**

```javascript
const AnotherComponent = Ractive.extend({
    components: { MyComponent }
});
```

**3.Ractive instance 内注册**

```javascript
const ractive = new Ractive({
    components: { MyComponent }
});
```
##### 自定义组件关键点
组件内的代码可以将组件实例自定义的属性值(eg:list)，作为组件代码的 self's ractive.keypath，由此实现对组件实例的读(self.get('list'))，或写(self.set('list', setvalue))。

###### Example Custom Component

```html
<div class="dragula-container"></div>

<!-- 主 ractive-instance 调用的 template -->
<script id="template-use-component" type="text/ractive">
    <div class="section" data-type={{type}}>
        <p>{{title}}</p>

        <div class="row">
            <!-- 标记组件，同时可以定义属性(eg:value, initdata)，给予组件代码内使用，由此实现对组件实例的读(self.get('value'))，或写(self.set('value', setvalue))。 -->
            <customComponent value={{customdata}} initdata="Custom Component Demo">
                <!-- 嵌入组件 {{yield}} 的代码 -->
                <a class="btn btn-color" value="blue">Blue</a>
                <a class="btn btn-color" value="yellow">Yellow</a>
                <a class="btn btn-color" value="red">Red</a>
            </customComponent>
        </div>
    </div>
</script>
```

```javascript
var testcaseComponent = {
	dom : $('.dragula-container'),
	ractiveObj : null,
	observerCustomComponent : null,
	init : function(){
		var self = this;
		self.ractiveObj = new Ractive({
	        el : self.dom[0],
	        template : '#template-use-component',
	        //* 使用组件, 'customComponent'-template标记；'CustomComponent'-自定义组件名
	        components :{ 
	        	customComponent : CustomComponent
	        },
	        data : { 
	        	"title" : "文字模块",
	        	"customdata" : "yellow"
	        },
	        oncomplete:function(){
	        },
	        onteardown: function() {
	            //* 销毁 ractive-instance，执行销毁 observe 监听事件
	        	self.observerCustomComponent.cancel();
	        }
	    });
	    //* 组件回调函数的实现，利用 observe 
	    self.observerCustomComponent = self.ractiveObj.observe('customdata', function($newValue, $oldValue){
    		console.log('callback - observe :: customdata, newValue:' + $newValue + ' oldValue:' + $oldValue);
    	})
	}
}

var CustomComponent = Ractive.extend({
	template : `
		<h4 class="title"></h4>
		<div class="btn-group">
			{{yield}}
		</div>
		<p><span></span> The select button is <span class="color-info"></span></p>
		<div>
			<a class="btn btn-getdata">Get Value</a>
		</div>
	`,
	css : `
		.btn{display:inline-block; cursor:pointer; border:1px solid #000; color:#000; padding:5px 8px; font-size:12px;}
		.btn:hover{background-color:#0057ff;color:#ffffff;}
		.btn.active{background-color:#0057ff; color:#ffffff;}
	`,
	data : {},
	oninit : function(){
		console.log(this.get('value'));
		console.log(this.get('initdata'));
	},
	onrender : function(){
		var self = this;
		var domTitle = $(self.find('.title'));
		domTitle.text(self.get('initdata'));
		//
		var domListBtn = $(self.findAll('.btn-color')); // .findAll() - belong to ractivejs api, $(ractive-dom)-  将 ractive-dom 转化为 jQ-dom
		domListBtn.each(function(index, el) {
			var btn = $(el);
			btn.click(function(event) {
				var value = $(this).attr('value');
				self.set('value', value);
				self.customfuncInfo(value);
				self.customfuncStyleBtn(value);
			});
		});
		//
		var btnGetData = $(self.find('.btn-getdata'));
		btnGetData.click(function(event) {
			console.log(self.get('value'));
		});
		//
		self.customfuncStyleBtn(self.get('value'));
		self.customfuncInfo(self.get('value'))
	},
	//* 自定义方法
	customfuncInfo : function($value){
		var domInfo = $(this.find('.color-info'));
		domInfo.text($value);
	},
	//* 自定义方法
	customfuncStyleBtn : function($value){
		var domListBtn = $(this.findAll('.btn-color'));
		domListBtn.each(function(index, el) {
			if($(el).attr('value') == $value){
				$(el).addClass('active');
			}else{
				$(el).removeClass('active');
			}
		});
	}
})
```
###### Demo Custom Component
https://yueveron.github.io/learnractivejs/demo/component/test-case_component-customdemo.html

#### 组件嵌套及事件传递

```javascript
//子层组件
const Child = Ractive.extend({
  template: '<span></span>',
  oncomplete(){
    this.fire('childevt'); 
  }
});

//父层组件
const Parent = Ractive.extend({
  components: { Child },
  template: '<Child />',
  onrender: function() {
      this.on('Child.childevt', function(){
      //return false;  //* 如果想阻止事件传递给顶层(stopPropagation)，则 return false
    });  
  }
});

//顶层实例
const instance = Ractive({
  target: "body",
  components: { Parent },
  template: '<Parent />'
});

instance.on('Child.childevt', function(){
  console.log('Hello World!');
});
```

#### Ractivejs Component 自带常用方法

##### findAllComponents
Returns all components inside a given Ractive instance with the given name
```
var cu = this.findAllComponents('customComponent');	
cu.forEach(function(c) {
    c.destroy();
})	 
```

##### findComponent
Returns the first component inside a given Ractive instance with the given name

```
var cu = this.findComponent('customComponent');
```

##### oninit
A lifecycle event that is called when an instance is constructed and is ready to be rendered.

##### onrender
A lifecycle event that is called when the instance is rendered but ==before transitions start==.

如果没有调用 ractive-instance transitions ，则 onrender 内即可初始化 jQuery Dom。 

##### oncomplete
A lifecycle event that is called when the instance is rendered and ==all the transitions have completed==.

##### onteardown
A lifecycle event that is called when the instance is being torn down.
父层 ractive-instance.teardown(), 包括父层及组件的 onteardown() 都会被触发，所以组件内的销毁方法不需要单独写 destroy()，只需要写 onteardown() 即可。

```
// call ractive-instance.teardown() will fire onteardown(), include sefl-instance and component-instance.
ractiveObj.teardown();
```

##### observe
Observes the data at a particular keypath.借助 obeserve 实现自定义组件触发回调函数。

```
var observerCustomComponent = ractiveObj.observe('customdata', function($newValue, $oldValue){
	console.log('callback - observe :: customdata, newValue:' + $newValue + ' oldValue:' + $oldValue);
})
```
销毁 ractive-instance 的时候，记住在 onteardown() 中取消 observe

```
onteardown: function() {
    observerCustomComponent.cancel();
}
```

#### 组件自定义方法
ractivejs 支持在组件代码内创建任意自定义的方法，并提供在父层实例中调用。

### 自定义组件范例
##### Demo : Ractivejs jQuery DateTimepicker
https://yueveron.github.io/learnractivejs/demo/component/test-case_component-datetimepicker.html

##### Demo : Ractivejs 自定义组件汇总
https://yueveron.github.io/learnractivejs/demo/component/test-case_component.html

##### Demo : Ractivejs Pure DropDownMenu
https://github.com/alexserver/ractive-dropdown

---

### Create basci page - 构建页面
通过例子学习如何使用 Ractive 完成一个纯展示类型的页面。

#### 原理：
首先页面分离为 model-数据 和 view-视图，然后将数据(data)绑定到视图(template)，Ractive会完成数据绑定及渲染的工作，页面即可呈现。

#### 关键：按组件组织页面
页面按展示区域划分，对于可以复用的区域规划为组件，然后在父层 ractive-instance 内嵌入组件，实现 “区域化 + 组件化” 搭建整体页面。

###### template 划分

```javascript
/* template : main */
var website = `
  <header>    
  </header>
  
  <section id="highlights">    
  </section>

  <section id="categories">
  </section>

  <APPublish />      //component - 固定复用
  <APSubscribe />    //component - 固定复用
  <APFooter />       //component - 固定复用
`;
```

###### Demo : BookStore Web Page
https://yueveron.github.io/learnractivejs/demo/bookstorepage/index.html

---

### Create shopcar page - 构建购物车
**Ractive-instance : ProductList** ，功能：
- 循环及条件语句 : 循环渲染出商品列表，条件定义是否显示商品，商品是否在购物车内
- click event : 点击商品传递参数（商品 keypath'name , 商品 keypath'data）

**Ractive-instance : Cart** ，功能：
- 循环及条件语句
- click event ： 增加、减少商品数量；移除商品。
- 双向数据绑定：计算总价格

###### Demo : BookStore Web Page
https://yueveron.github.io/learnractivejs/demo/shopcar/index.html