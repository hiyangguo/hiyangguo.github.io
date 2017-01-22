---
title: 纯CSS实现涟漪按钮效果
categories: CSS黑魔法
tags:
  - CSS
  - 动效
---

**涟漪按钮**：顾名思义，就是点击按钮的时候，有一个圆圈扩散开来，就像水面的涟漪。效果如下：
![](/uploads/14847466653424.gif)
看上去非常简单的效果，就是点击的时候一个圆圈从小变大，于此同时透明度从半透明变为透明。
常见的方式是使用`javascript`：
1. 监听鼠标的点击事件，当点击按钮的时候，追加一个圆形的`dom`
2. 改变`dom`的大小，直至完全覆盖按钮
3. 移除按钮

<!-- more -->

但是这个方法，有几个缺点：
1. 首先就是你要给按钮添加一个事件
2. 然后添加，移除`dom`会造成页面的重绘
3. 绘制的时候会要进行运算

所以最终参考利用`:active`、`bacground`、`scale`实现了一个纯css的涟漪按钮效果。
```less
.button-ripple() {
    overflow: hidden;
    position: relative;
    transition: background-color .3s linear, border .3s linear;

    &:after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: radial-gradient(circle, #000 10%, rgba(0, 0, 0, 0) 10.01%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(10);
        opacity: 0;
        transition: transform .5s, opacity 1s;
    }

    &:active:after {
        transform: scale(0);
        opacity: .2;
        transition: 0s;
    }
}
```
这是一个`less`的`mixin`，在需要涟漪效果的地方直接使用即可，如:
```less
.ripple{
  .button-ripple();
}
```
此方法的原理是:
首先在按钮的正中间利用`:after`伪元素画了一个遮罩（此遮罩刚好盖住整个按钮），当点击按钮的时候将遮罩缩小到0%，松开鼠标时，还原100%大小，并将透明度缩小到0。
[Demo地址](http://codepen.io/hiyangguo/pen/BpRRrz)