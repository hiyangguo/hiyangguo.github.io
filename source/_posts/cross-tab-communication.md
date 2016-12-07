---
title: 跨页面(tab/window)通信的几种方法
categories: Javascript
tags:
  - Javascript
  - 页面通讯
---

今天开发一个功能遇到一个需求，在页面 A 点击查看详情后在页面 B 进行审核，审核后页面 B 关闭，然后刷新页面 A 的数据。思路大概就是：

# 使用 `webSocket` 进行通讯
但是这样，工作量是巨大的，而且还需要后端支持。太麻烦了，对于我这种懒人来说，直接就放弃了。
# 写个定时器，不断检查 `Cookies` 的变化
然后在[stackoverflow][1]看到一个[方案][2],大致思路是:
 1. 在页面A设置一个使用 `setInterval` 定时器不断刷新，检查 `Cookies` 的值是否发生变化，如果变化就进行刷新的操作。
 2. 由于 `Cookies` 是在同域可读的，所以在页面 B 审核的时候改变 `Cookies` 的值，页面 A 自然是可以拿到的。
 这样做确实可以实现我想要的功能，但是这样的方法相当浪费资源。虽然在这个性能过盛的时代，浪费不浪费也感觉不出来，但是这种实现方案，确实不够优(zhāng)雅（bī）。
 
 <!-- more -->
 
# `localStorage`的事件
后来发现 `window` 有一个 [StorageEvent][3] ，每当 `localStorage` 改变的时候可以触发这个事件。（这个原理就像你给一个`DOM` 绑定了 `click` 事件，当你点击它的时候，就会自动触发。）也就是说，我给 `window` 绑定这个事件后，每当我改变 `localStorage` 的时候，他都会触发这个事件。
```javascript
window.addEventListener('storage', function (event) {
  console.log(event);
});
```
这个回调中的`event`与普通的[EVNET][4],基本差不多，但是它比其他的`event`多了如下几个属性:

|属性|描述|
|---|---|
|key|受影响的 `localStorage` 的 `key` |
|newValue|新的值|
|oldValue|旧的值|
|url|触发此事件的url|

每当一个页面改变了 `localStorage` 的值，都会触发这个事件。也就是说可以很容易的通过改变 `localStorage` 的值，来实现浏览器中跨页面( tab / window )之间的通讯。记住这个事件只有在 `localStorage` 发生**改变**的时候才会被触发，如果没改变则**不会触发**此事件。
```javascript
localStorage.setItem('update',1); //触发
localStorage.setItem('update',1); //不触发
localStorage.setItem('update',2); //触发
```
在使用的时候务必注意这一点。
最终实现代码:
```javascript
//页面 A
window.addEventListener('storage', function (event) {
    if(event.key === 'update_verify_list'){
        //页面更新操作
    }
});

//页面 B
/**
*  获取一个随机id
 * @return {String} - 返回一个5位的随机字符串
 */
function randomId() {
    return (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
}

//每当需要页面A更新时 执行此方法
if (localStorage) {
    localStorage.setItem('update_verify_list', randomId());//为保证每次页面A都执行，此处我设置里一个随机字符串
}
``` 

> 参考：https://ponyfoo.com/articles/cross-tab-communication

[1]:http://stackoverflow.com/
[2]:http://stackoverflow.com/questions/4079280/javascript-communication-between-browser-tabs-windows/4079423#4079423
[3]:https://developer.mozilla.org/zh-CN/docs/Web/API/StorageEvent
[4]:https://developer.mozilla.org/zh-CN/docs/Web/API/Event#Properties
[5]:https://ponyfoo.com/articles/cross-tab-communication