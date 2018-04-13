---
title: less换肤功能实践
date: 2017-03-21 06:23:00
categories: less
tags:
  - less
  - grunt
  - 多主题
---

在我司的后台管理组件库[pagurain][pagurain]、[rsuite][rsuite]中要求实现换肤功能，以下是我们对这一功能实践的记录及过程。
## 前提

为了统一各产品的视觉和操作体验，我们建立了[UI规范体系][pagurain-ui]，方便创建项目也方便统一管理。
以扁平化和简洁为主旨的设计风格，使用块面来进行布局，用线条来表达各个控件，使功能庞杂的系统 既直观又条理清晰，让使用者一目了然。

### 主色及色阶
 
系统共用的组件颜色和变化形式是统一的，在此基础上，各系统又有自己的主色调。

每套系统都会有一个主色，并在主色的基础上，在同一色调中扩充成一组完整的可复用的色彩体系，丰富系统配色。

如下图所示，每组色彩是按一定的规律在明度和饱和度上选取得出的。

![](/uploads/14900858020010.jpg)

<!--more-->

## 初步实现
按照上面的实现，我们的多套皮肤就是先定义一个主色 `@H500`，然后使用 `@H500` 这个颜色计算出其他的颜色，就搞定了。每次在不同的主题就换一套颜色。当然最终还是要生成多套颜色的`css`。
下面就按照这个思路开始吧。首先，我们按照设计师的要求定义一组颜色，如下：
```less
@H050:#e8f4ee;
@H100:#bbdfcb;
@H200:#8dcaa8;
@H300:#67b88b;
@H400:#41a66e;
@H500:#1b9451;
@H600:#188247;
@H700:#146f3d;
@H800:#115d33;
@H900:#0e4a29;
```
这组颜色的计算规则如下:
```less
@H050:darken(@H500,90%);
@H100:darken(@H500,70%);
@H200:darken(@H500,50%);
@H300:darken(@H500,33.3%);
@H400:darken(@H500,16.6%);
@H500:#1b9451;
@H600:lighten(@H500,12.5%);
@H700:lighten(@H500,25%);
@H800:lighten(@H500,37.5%);
@H900:lighten(@H500,50%);
```
这猛一看挺简单啊，颜色的计算规则也有了，`less`也有相应的函数，这不很简单么。直接一算就出来了。
结果呢：

先用个绿色(`#1b9451`)试试

![](/uploads/14900876640259.jpg)

换个蓝色(`#b3d1ff`)呢
![](/uploads/14900876785104.jpg)

结果发现，如果颜色太深，那么`darken`后的颜色就是一堆黑色，如果颜色偏浅，那`lighten`后的颜色就是一堆白色。所以显然，使用`less`自带的颜色函数式不行的。那怎么办呢？
最简单的方法就是，现在外面算好了再复制进来，每次都复制10个颜色。计算颜色的方法，如下:
```javascript
/*
 * Color utility functions
 * Source: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 * Github: https://github.com/mbitson/mcg
 */
function shadeColor(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}
```
为此我们还特意做了一个页面来方便使用,[页面链接](http://pagurian.com/demo/dist/templates/theme-color.html)
这样一来最起码的颜色就有了，我们只需先用这些变量生成一套基础的主题`base.less`，然后分别创建多个主题文件的`green.less`、`blue.less`，再分别覆盖这10个颜色变量，然后
```less
@import "base"; //按照less 语法import less 可以省略文件ext
```
最终就可以得到多套`css`了。
## 改进
### 一次只传一个颜色
仅仅是那样，用肯定是没问题了，但是每次使用都要去生成配色的页面生成颜色，用着着实不爽。于是乎就想着能不能够有什么方法，自己去定义一个方法在less里直接调用。最终发现`grunt-contrib-less`这个插件有一个`customFunctions`方法,可以实现自定义方法，所以改进了一下。而且可以覆盖原有的变量，所以改进了一下，得到了如下代码
```javascript
//生成主题
grunt.registerTask('theme', 'Generate theme', function () {
    Object.keys(themes).forEach((name) => {
        const color = themes[name];
        const taskName = `theme-${name}`;
        const outputName = `src/resources/css/themes-${name}.css`;
        grunt.config.merge({
            less: {
                [taskName]: {
                    options: {
                        customFunctions: {
                            pallet
                        },
                        modifyVars: {
                            'base-color': color
                        }
                    },
                    files: {
                        [outputName]: 'src/resources/less/theme/base.less'
                    }
                }
            }
        });
        grunt.task.run(`less:${taskName}`);
    });
});
```
[源代码地址](https://github.com/hypers/pagurian/blob/dev/Gruntfile.js);

### 扔掉`grunt`
但是这个时候问题又来了，因为这样做的话，就只能用`grunt`进行构建了，`gulp`构建或者`webpack`打包肯定不行啊（没有pallet方法）,那怎么办呢。一个[偶然发现][ant-color-pallet]使用less中的转义语法 **~``** 居然可以执行js。简直了。然后经过测试使用这种hack方法可以成功的定义function，就解决了一切问题.
```less
.colorPaletteMixin {
    @functions: ~`(function () {
    /*
     * Color utility functions
     * Source: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
     * Github: https://github.com/mbitson/mcg
     */
    var shadeColor = function (color, percent) {
        var f = parseInt(color.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = f >> 8 & 0x00FF,
            B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    /**
     * 计算系统颜色
     * @param color
     * @param percent (正值表示lighter,负值表示darken)
     */
    this.pallet = function (color, percent) {
        var colorConfig = {
            '50': 0.9,
            '100': 0.7,
            '200': 0.5,
            '300': 0.333,
            '400': 0.166,
            '500': 0,
            '600': -0.125,
            '700': -0.25,
            '800': -0.375,
            '900': -0.5
        };
        percent = colorConfig[percent] === undefined ? percent : colorConfig[percent] ;
        color = color.toLowerCase();
        return shadeColor(color, percent);
    }
})()`;
}
// It is hacky way to make this function will be compiled preferentially by less
.colorPaletteMixin();
```

## 小结
最后我只想说，写好文档太重要了，这里各种的坑，简直是踩也踩不完。说多了都是泪。安利一下我司的`react`组件库[rsuite](http://rsuite.github.io/)。l

[pagurain]:http://pagurain.com
[pagurain-ui]:http://pagurian.com/design/index.html
[rsuite]:http://rsuite.github.io
[ant-color-pallet]:https://github.com/ant-design/ant-design/blob/734beb84ffc3f0469fbae1566aa8450f966cb261/components/style/color/colorPalette.less
