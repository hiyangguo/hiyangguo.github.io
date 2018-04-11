---
title: 深入研究CSS字体度量及CSS 盒子
date: 2018-04-09 15:59:26
tags:
  - css
  - font
---

![头图](/uploads/in-depth-study-font-size-line-height-and-vertical-align/banner.png)

这张图展示的是8种不同的字体，其中第一、第二个分别为 [font-awesome][font-awesome]图标、自定义的字体图标，其余字体依次为`Avenir`、`Trebuchet MS`、`Arial`、`Helvetica`、`Hiragino Sans GB`、`STXihei`。[源代码在这里][banner-code]。这些字符的`font-size:100px`，但是占的高度却不一样。有的是 100px，有的大于 100px。另外可以看出，垂直方向并没有居中对齐。
这篇文章主要研究：
- `font` 的工作原理及度量参数
- `CSS box models` 的类型、定义


<!-- more -->

## 字体度量
要弄明白上面问题的答案，需要先从字体说起：
我们拿出其中`Avenir`、`Helvetica`、`Hiragino Sans GB`三种字体进行分析
![字体占行高](/uploads/in-depth-study-font-size-line-height-and-vertical-align/font-detail.png)
由上图可知，在我们设置 `font-size:100px` 时，文字所占的高度分别为 `137px`、 `115px` 和 `100px`。 
感觉有点懵啊。怎么 `font-size:100px` ，可是高度却由于字体不同，而不一样了呢？
在字体设计中一个字符所在的空间容器称为[EM Square][em-square]（也被称作“EM size”或者“UPM”）。

> 在传统的金属字模中，这个容器就是每个字符的实际金属块。每个字符的高度是统一的，这样每个字模可以整齐地放进行和块中（如下）。

![传统的金属字模](/uploads/in-depth-study-font-size-line-height-and-vertical-align/metal-type-zoom-in.jpg)

### 字体的定义规则
- 字母的高度被称为“`em`”，在数字化字体中 `em` 是空间的数字化定义总量。`em`的大小（以下均写为: **EM size**）通常是 **1000** 单位，在 TrueType 字体中，`EM size` 约定是2的幂，通常是1024或2048。
- 根据其实际使用的单位，字体的度量可以根据一些[设置](./#字体的设置)来决定。注意，有些值是em-square之外的值。
- 在浏览器中，相对单位是用于缩放用来适应所需的 `font-size`

### 字体的设置
![字体的设置](/uploads/in-depth-study-font-size-line-height-and-vertical-align/font-metrics.jpg)
这是一张详解字体设置的图例，图中各个属性的意义：
- `baseline` (*基线*): 分隔 `ascent` 和 `descent` ，默认字符底端沿 `baseline` 排列，如图中的P，x，Ё(为俄文字符)
- `ascent` (*上升*): 基线的上部分，字符最高处与 `ascent` 顶端可能有空白，由 `font-family` 决定
- `descent` (*下降*): 基线的下部分，字符最低处与 `descent` 底端可能有空白，由 `font-family` 决定
- `xHeight` (*X 字高*): 小写字符 **x** 的高度，由 `font-family` 决定
- `capHeight` (*顶面高度*): 大些字符 **P** 的高度，由 `font-family` 决定
- `lineSpacing` (*行间距*): 在浏览器中一般 `lineSpacing = ascent + descent`
- `lineHeight` （*行高*）: 默认等于 `lineSpacing`，受 `line-height` 设置影响，如果设置 `line-height`，`lineHeight` 等于 `line-height`。
- `half-leading` (*半行距*): 如果`lineHeight > lineSpacing`，则`lineHeight` 与 `lineSpacing` 之间会产生**上下相等**的空隙 (lineHeight - lineSpacing)/2 称为*半行距*（``half-leading``或 `half lead strips`）。

### 字符所占高度的计算
所以在了解了上面的概念以后，就可以解答为什么在 `font-size:100px` 的时候行高却不一样的问题。
首先，先下载一个专业的字体软件[FontForge][font-forge]，这个软件运行在[xquartz][xquartz-home]上，所以要两个都要装。
> [百度云通道][font-forge-download]

安装后我们以 [Avenir][avenir] 字体为例进行分析。
![Avenir 字体详情截屏](/uploads/in-depth-study-font-size-line-height-and-vertical-align/avenir-detial-screenshots.png)

- `EM size` 为 **1000** 
- `ascent` 为 **1000** ，`descent` 为 **366**
- `capHeight` 为 **708**
- `xHeight` 为 **468**

> 注：浏览器使用HHead Ascent/Descent值（Mac）和Win Ascent/Descent值（Windows），并且这些值可能不同。

这意味着 `Avenir` 字体在 1000 单位的 `EM size` 中使用了 `1000 + 366` 个单位，也就是说 `font-size:100px`，其高度为 `100px * (1000 + 366 ) ≈ 137px`。
这个计算高度定义了 **[元素内容（Content area）](#Content-area)高度** 也就相当于 `background` 属性。

![Avenir 字体解析图](/uploads/in-depth-study-font-size-line-height-and-vertical-align/avenir-analysis.png)

## CSS box models
接下来我们深入的研究一下，`CSS box models`。你可能不知道什么`CSS box models`，不过说出来你可能不信，在实际工作当中恐怕你最常见的就是`CSS box models`。

### Block Box/Containing Box (块盒子/包裹盒子)
比如有一段简单的文字，就有可能会有一些列的 `box` 。那么这个段落被称为 **`Containing Box`** ，之所以这么命名，可能是因为他包含了很多 `box`  吧。（呵...）当然你也可以称之为 **`Block Box`**，因为他就是一个**块**。简单来说`Containing Box`和`Block Box`其实是一个东西。
![Block Box演示](/uploads/in-depth-study-font-size-line-height-and-vertical-align/block-box-demo.png)

### Inline Box (内联盒子)
在段落内部，有很多的 **`Inline Box`**。 这些 `Box` 不会像 `Block Box` 那样形成新的一⾏。
![Inline Box演示](/uploads/in-depth-study-font-size-line-height-and-vertical-align/inline-box-demo.png)
在上面的例子中, `<em/>` 标签包裹的 _斜体元素_ 就是一个典型的 `Inline Box`。

### Anonymous Inline Box (匿名内联盒子)
在段落内部，那些没有标记的`Inline Box` 则成为 **`Anonymous inline Box`**。
![Anonymous Inline Box演示](/uploads/in-depth-study-font-size-line-height-and-vertical-align/anonymous-box-demo.png)

### Line Box (行盒子)
所有`Inline Box`在`Containing Box`紧挨着排列，则会形成 **`Line Box`**。需要注意的是，`Line Box`是没办法直观看到的。
![Line Box演示](/uploads/in-depth-study-font-size-line-height-and-vertical-align/line-box-demo.png)

### Content area
![Content area](/uploads/in-depth-study-font-size-line-height-and-vertical-align/content-area.png)
**`Content area`** 是围绕⽂文本的_隐形框_。 而且在字体度量这一小节我们也证明过了，它的高度由`font-size`决定。

> 更详细的定义及说明可以访问 CSS 规范2.1 中关于 **视觉格式化模型**（_Visual formatting model_）一节进行阅读。
> [中文站][w3c-visuren-cn]|[W3C 官网][w3c-visuren]

## `Inline Box` 与 `Line Box`
### Inline Box 如何影响 Line Box 
`Line box` 的高度由 `Line Box` 中最⾼的 `Inline Box`（或`Replaced Element`）确定。
最⾼的 `Inline Box` 可以是⼀个 `Anonymous Inline Box`。
![line-box-with-anonymous-Inline-box](/uploads/in-depth-study-font-size-line-height-and-vertical-align/line-box-with-anonymous-Inline-box.png)

也可能是一个增加了`line-height`的 `Inline Box`。 由于增加了 `line-height` ，所以这个它会比其它的 `box` 更高。
![line-box-with-increased-Inline-box](/uploads/in-depth-study-font-size-line-height-and-vertical-align/line-box-with-increased-Inline-box.png)

可能是⼀个更⼤的 `font-size` 的 `Inline Box`，这使得这个 `Inline Box` ⽐其他 `Inline Box` 更高。
![line-box-with-increased-font-size](/uploads/in-depth-study-font-size-line-height-and-vertical-align/line-box-with-increased-font-size.png)

由于浏览器器的不同，它也可能受到上标或下标的影响。 因为有些浏览器以影响`Line box`的方式渲染上标元素。
![line-box-with-superscript-inline-box](/uploads/in-depth-study-font-size-line-height-and-vertical-align/line-box-with-superscript-inline-box.png)

我们可以通过设置 `<sup/>`、`<sub/>` 的 `line-height` 为 0 来解决这个问题。
```css
sub, sup { line-height: 0; }
```

`Inline Box` 可能受到 `Replaced Element`（如：`<img/>`、`<input/>`、`<svg/>`） 的影响。

![line-box-with-replaced-element](/uploads/in-depth-study-font-size-line-height-and-vertical-align/line-box-with-replaced-element.png)

### Inline Box 撑破 Line Box
正如我们所看到的, `Line Box` 将增加所有行内 `Inline Box` 的⾼度。
![line-box-addtional-inline-box-height](/uploads/in-depth-study-font-size-line-height-and-vertical-align/line-box-addtional-inline-box-height.png)
但是，有时候 `Inline Box` 的一部分会撑破 `Line Box` 的顶部或底部。例如一个拥有`padding`、`margin`、`border` 的 `Inline Box` 。由于 `Inline Box` 不能设定高度（设了也白设）。因此会在元素的上方和下方显示`padding`、`margin`、`border`，但并不会影响 `Line Box`。
**注意**：对于`Replaced Element`、`inline-block`行内元素`padding`、`margin`、`border`都会增加高度，所以`Line Box` 的高度也会受到影响。
![inline-box-poke-out-line-box](/uploads/in-depth-study-font-size-line-height-and-vertical-align/inline-box-poke-out-line-box.png)
浏览器将按照文档的先后顺序呈现 `Line Box`。 所以, 后续行上的 `border` 可能会覆盖上⼀行的 `border`和文本。
![pants-over-previous-line](/uploads/in-depth-study-font-size-line-height-and-vertical-align/pants-over-prvious-line.png)

> 参考文章
> [行内元素垂直方向的layout](https://yoution.gitbooks.io/webkit/Layout/InlineElement-Vertical/)
> [深入了解CSS字体度量，行高和vertical-align](https://www.w3cplus.com/css/css-font-metrics-line-height-and-vertical-align.html)
> [FontForge 与字体设计 - EM Square](https://designwithfontforge.com/zh-CN/The_EM_Square.html)
> [Deep dive line-height](https://www.w3cplus.com/sites/default/files/blogs/2017/1702/deep-dive-line-height.pdf)

[font-awesome]:https://github.com/FortAwesome/Font-Awesome/tree/v4.7.0
[banner-code]:https://codepen.io/hiyangguo/pen/VXqQMB
[em-square]:https://designwithfontforge.com/zh-CN/The_EM_Square.html
[font-forge]:https://fontforge.github.io/en-US/
[xquartz-home]:https://www.xquartz.org/
[font-forge-download]:https://pan.baidu.com/s/1GqI-n39GkFQWsNZ8vWKMGg
[avenir]:https://github.com/hiyangguo/hiyangguo.github.io/raw/dev/source/uploads/in-depth-study-font-size-line-height-and-vertical-align/Avenir.ttf
[w3c-visuren-cn]:http://www.ayqy.net/doc/css2-1/visuren.html
[w3c-visuren]:https://www.w3.org/TR/CSS2/visuren.html