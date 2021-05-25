---
title: 使用docker 快速部署 shadowsocks
date: 2021-05-24 23:22:33
tags:
  - docker
  - shadowsocks
---

## 使用 docker 快速部署 shadowsocks

### 前置工作

安装 docker，如果是的环境是 centos，可以参考[这篇文章](/install-docker-on-centos/)进行安装。本文以 [shadowsocks-libev](https://github.com/shadowsocks/shadowsocks-libev) 为例。

<!-- more -->

### 拉取 shadowsocks-libev

```bash
docker pull appso/shadowsocks-libev
```

### 创建 shadowssocks 配置文件

```
mkdir -p /etc/shadowsocks-libev/
vi /etc/shadowsocks-libev/config.json
```

将下面的内容修改后，粘贴进去。其中 `server_port` 就是可以随便改，`你的密码` 换成你需要的密码即可。

```json
{
  "server": "0.0.0.0",
  "server_port": 1234,
  "password": "你的密码",
  "timeout": 300,
  "method": "aes-256-gcm",
  "fast_open": false,
  "mode": "tcp_and_udp"
}
```

在 `vi` 中，按 <kbd>I</kbd> 键进入插入模式。粘贴完成后，按<kbd>Esc</kbd> 退出。再依次按<kbd>:</kbd><kbd>W</kbd> <kbd>Q</kbd><kbd>!</kbd><kbd>Enter</kbd>进行保存。

保存成功后，验证一下

```bash
cat /etc/shadowsocks-libev/config.json
```

输出的内容和上面你编辑的一样就是成功了。

###启动 docker

```bash
docker run -d -p 1234:1234 -p 1234:1234/udp \
       --name ss-libev \
       -v /etc/shadowsocks-libev:/etc/shadowsocks-libev \
       appso/shadowsocks-libev
```

查看容器启动状态

```bash
docker ps -as

CONTAINER ID   IMAGE                     COMMAND                  CREATED              STATUS              PORTS                                                                                  NAMES      SIZE
7da207676c01   appso/shadowsocks-libev   "ss-server -c /etc/s…"   About a minute ago   Up About a minute   0.0.0.0:1234->1234/tcp, 0.0.0.0:1234->1234/udp, :::1234->1234/tcp, :::1234->1234/udp   ss-libev   0B (virtual 120MB)
```

查看端口监听状态

```
netstat -anp | grep 1234
```

![执行结果](https://tva1.sinaimg.cn/large/008i3skNgy1gqtvg7nyyij312u052q42.jpg)

这样就是 OK 了

### 修改密码

和创建一样，先编辑配置文件，再重启 docker

```bash
vi /etc/shadowsocks-libev/config.json
docker restart ss-libev
```

### 修改端口

修改端口后需要先删除再重新启一个新的容器。

```bash
# 删除旧的容器
docker rm -f ss-libev
# 端口号换成你自己的
docker run -d -p 1333:1333 -p 1333:1333/udp \
       --name ss-libev \
       -v /etc/shadowsocks-libev:/etc/shadowsocks-libev \
       appso/shadowsocks-libev
```

#### 参考文章

> [https://haoyunlaile.github.io/2020/docker/docker-install-shadowsocks-libev/](https://haoyunlaile.github.io/2020/docker/docker-install-shadowsocks-libev/)
