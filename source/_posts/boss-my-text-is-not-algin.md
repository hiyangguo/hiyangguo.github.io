---
title: 老板，我的文字对不齐
date: 2018-04-09 15:59:26
tags:
---

![头图](/uploads/boss-my-text-is-not-algin/banner2.png)

这张图展示的是8种不同的字体，其中第一、第二个分别为 [font-awesome][font-awesome]图标、自定义的字体图标，其余字体依次为`Avenir`、`Trebuchet MS`、`Arial`、`Helvetica`、`Hiragino Sans GB`、`STXihei`。[源代码在这里][banner-code]。这些字符的`font-size:100px`，但是占的高度却不一样。有的是 100px，有的大于 100px。另外可以看出，垂直方向并没有居中对齐。这篇文章主要研究：
- font（或者说 inline-box） 在垂直方向，到底是怎么对齐的。
- line-height 到底是怎么工作的。浏览器怎么计算 line-height。以及 font-size 与 line-height 之间鲜为人知的“小秘密”。
- Box 有几种类型，分别都是什么鬼。

<!-- more -->





[font-awesome]:https://github.com/FortAwesome/Font-Awesome/tree/v4.7.0
[banner-code]:https://codepen.io/hiyangguo/pen/VXqQMB