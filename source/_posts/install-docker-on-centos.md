---
title: 在 centos 安装 docker
date: 2021-05-24 23:13:53
tags:
  - centos
  - docker
---

## centos 安装 docker

本文以 centos7 为例。记录了完整的安装命令。

<!-- more -->

### 切换 root 用户

```bash
sudo -i
```

必须为 centos7 或者 centos8 ，遗产版本不能使用

```bash
uname -r
```

### 更新 yum 包

生产环境慎重执行。如果在生产环境，请谨慎操作。

```bash
yum -y update
```

### 卸载旧的 docker

如果机器上有老版本的 docker 建议卸载

```bash
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```

### 使用仓库安装

安装必要的包

```bash
yum install -y yum-utils
```

设置一个源

```bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

#### 普通安装

```bash
yum install docker-ce docker-ce-cli containerd.io
```

安装成功后结果如下图

![执行结果](https://tva1.sinaimg.cn/large/008i3skNgy1gqtun8xjy5j319a08sgmy.jpg)

#### 安装指定版本

查询可用的包

```bash
yum list docker-ce --showduplicates | sort -r
# 第二列是版本号
docker-ce.x86_64            18.06.2.ce-3.el7                   docker-ce-stable
docker-ce.x86_64            18.06.1.ce-3.el7                   docker-ce-stable
docker-ce.x86_64            18.06.0.ce-3.el7                   docker-ce-stable
docker-ce.x86_64            18.03.1.ce-1.el7.centos            docker-ce-stable
docker-ce.x86_64            18.03.0.ce-1.el7.centos            docker-ce-stable
```
安装
```bash
yum install docker-ce-<版本号> docker-ce-cli-<版本号> containerd.io
```

启动 docker

```bash
systemctl start docker## 设置开机自启systemctl enable docker
```

### 验证

```bash
docker -v
```

可以看到 docker 的版本号就是好了

![执行结果](https://tva1.sinaimg.cn/large/008i3skNgy1gqtupxojh1j30im02caab.jpg)

> 参考
> [https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)