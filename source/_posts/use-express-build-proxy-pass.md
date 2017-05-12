---
title: 使用express实现反向代理服务器
categories: 开发环境
tags:
  - 反向代理
  - 开发环境
  - express
---

# node express 20行代码实现反向代理服务器

## 遇到的问题
开发的时候经常会遇到一个问题，就是后台API和前端页面分开开发，但是开发的时候并不想在本地搭建后端环境，因为特别麻烦!特别麻烦!特别麻烦!比如说要配置运行环境、装数据库还有服务器。乱七八糟，有时候光是弄环境就要弄一天。可是如果不配置又没办法开发。最主要的是请求后端API的时候会遇到跨域问题。最简单的方法当然是后端帮忙配一个`CORS`。但是如果后端没办法配合的话，可能就比较麻烦了。这时候可以使用反向代理进行开发。

<!-- more -->

## 正向代理与反向代理
首先科普一下代理，代理分为正向代理和反向代理

- 正向代理
> 正向代理，意思是一个位于客户端和原始服务器 (origin server) 之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标 (原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。客户端才能使用正向代理。 
> --摘自百度百科

- 反向代理
> 反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。
> --摘自百度百科

两者的主要区别在于代理的对象不一样： 正向代理代理的对象是客户端，反向代理代理的对象是服务端。
而我们遇到的问题就是需要使用反向代理解决。

## 开始撸代码
说到反向代理第一反应肯定是`Nginx`。确实`Nginx`做反代确实很好，但是说实话，没必要特意为了做个API的代理装个`Nginx`。而且还要去学习`Nginx`的配置。
另外，可能会想到`webpack`，当然如果你使用了`webpack`，直接就可以使用`webpack-dev-server`了。
但如果你手头上接手了一个老项目就比较尴尬了。下面进入正题使用`express`做开发代理服务器。

首先安装`express`和`superagent`:
```bash
npm install --save-dev express superagent
```
>express是基于 Node.js 平台，快速、开放、极简的 web 开发框架。
>superagent是 Nodejs 里一个非常方便的客户端请求代理模块.

之后新建一个`server.js`文件。
```javascript
const express = require('express');
const request = require('superagent');
const app = express();
//这里从环境变量读取配置，方便命令行启动
const { HOST = 'http://10.0.1.10:8080', PORT = '3300' } = process.env;
//设置端口
app.set('port', PORT);
//反向代理（这里把需要进行反代的路径配置到这里即可）
//如需要将/api/test 代理到 ${HOST}/api/test
app.use('/api/test*', function (req, res) {
    var sreq = request.get(HOST + req.originalUrl);
    sreq.pipe(res);
    sreq.on('end', function (error, res) {
        if (error) {
            console.log(error);
            return;
        }
    });
});
//静态页面
//这里一般设置你的静态资源路径
app.use('/route', express.static('src'));
//监听端口
app.listen(app.get('port'), () => {
    console.log(`server running @${app.get('port')}`)
});
```
启动
```
node dev-server.js
```
这时会使用打开`http://localhost:3300/route`即可

动态设置端口和反向代理地址
```
HOST=http://10.0.1.10:8081 PORT=3301 node dev-server.js
```
此时则需要在`http://localhost:3301/route`进行访问。
至此，一个简单可用的开发环境就搞定了。




理论介绍参考:
[反向代理为何叫反向代理？](https://www.zhihu.com/question/24723688)
[正向代理与反向代理的浅解](https://segmentfault.com/a/1190000000762548)
