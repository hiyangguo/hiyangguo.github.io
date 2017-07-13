---
title: git永久删除文件
categories: git
tags:
  -  git操作
---


# git删除文件后恢复和永久删除文件

Git 是一个开源的分布式版本控制系统，可以有效、高速的处理从很小到非常大的项目版本管理。Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。

当我们在日常使用中删除了文件，如果这个文件提交过就可以进行恢复。假设我们新建了一个文件`test.txt`,并录入任意内容。然后进行提交。
```bash
touch test.txt
echo 'test' > test.txt 
git add test.txt
git commit -m "update:添加了一个测试文件"
```