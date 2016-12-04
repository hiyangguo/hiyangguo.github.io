---
title: 【译】javascript中的undefined可以被重写
categories: 翻译
tags:
  - JavaScript
  - 翻译
---

众所周知,当声明一个变量，并且没有给赋值的情况下，它的初始值是`undefined`。
但是在javascript中，怎么检查一个值是否为`undefined`呢？
# 简单的回答
在现代浏览器中，你可以安全的比较变量是否为`undefined`
```
if (name === undefined) {...}
```
一些人反对直接使用`undefined`变量进行比较，因为在旧的浏览器中允许它的值被重新赋值，比如下面这样:
```javascript
undefined = "test"
```
在被重新赋值后,使用`undefined`指令将不能正确的检测一个变量是否被赋值。
不过，这个行为在2009年的[ECMAScript 5][1]被修复了。

<!-- more -->

>15.1.1.3 undefined
> The value of undefined is undefined (see 8.1). This property has the attributes { **[[Writable]]: false**, [[Enumerable]]: false, [[Configurable]]: false }.

在现代浏览器中，`undefined`的值将不能被重写

#我们需要支持ie8或者更古老的浏览器怎么办
通常`undefined`指令是安全的。在应用中并没有什么理由需要修改`undefined`的值。
[Thomas的回答](http://stackoverflow.com/questions/3390396/how-to-check-for-undefined-in-javascript/3390635#3390635)使用具有说服力的推理，论证了这一点。

> I don't hear people telling me that I shouldn't use setTimeout because someone can
> 我不听别人告诉我，我不应该使用`setTimeout`，因为有的人像这样用:
```
window.setTimeout = function () {
    alert("Got you now!");
};
```
>下面一行，“它可以被重新赋值”，raw === undefined返回false
如果你仍然很在意,有两个方法可以检查一个值是否为`undefined`，即使全局`window.undefined`已经被重写
```
if (name === void(0)) {...}
```
在这个例子中0没有任何实际意义,你想要使用 `1` or `function(){}`也无所谓。 `void(anything)`都会计算得到`undefiend`

另外一种选择，你可以使用`typeof`操作符安全地检查是否已经被赋值。你可以检查一个值的类型是否为"undefined"代替与全局的`undefined`比较.
```
if (typeof name === "undefined") {...}
```
注意第二个选择与前一个方案稍微有点差异.尽管`name`没有被声明,`typeof`会返回他是`undefined`。如果你直接使用name与`undefined`or `void(0)`你会得到`ReferenceError`异常的错误.

#但是不要使用void(0)指令
在代码中避免使用`void(0)`或者` typeof x === "undefined"`，你可以使用`isUndefined function`方法把他们包起来，这样你使用的时候就不用再特意说明了.
```javascript
function isUndefined(value){
    //获得undefined，保证它没有被重新赋值
    var undefined = void(0);
    return value === undefined;
}
```
一些工具库已经部署了这个方法,例如:` _.isUndefined`，[underscore中的isUndefined方法][2]
#
>[原文地址](how-to-check-for-undefined-in-javascript)
>原文标题：在javascript中怎样检查undefiend
>初次翻译，如有错误，欢迎指正

  [1]: https://es5.github.io/#x15.1.1.3
  [2]: http://underscorejs.org/#isUndefined